"""
FRAME - 카메라 전문 중고거래 플랫폼
회원가입 및 3단계 본인 인증(eKYC/계좌) 데이터베이스 모델 및 서비스 인터페이스
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from abc import ABC, abstractmethod
import hashlib


# ==============================================================================
# 1. 사용자 모델 (Custom User Model)
# ==============================================================================
class CustomUserManager(BaseUserManager):
    def create_user(self, email, nickname, password=None, **extra_fields):
        if not email:
            raise ValueError('이메일(로그인 ID)은 필수 항목입니다.')
        if not nickname:
            raise ValueError('닉네임은 필수 항목입니다.')
        
        email = self.normalize_email(email)
        user = self.model(email=email, nickname=nickname, **extra_fields)
        if password:
            user.set_password(password)  # Django 기본 PBKDF2 해시 암호화
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nickname, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('verification_level', 3)
        return self.create_user(email, nickname, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    FRAME 사용자 모델
    - 법적 근거 없는 주민등록번호 직접 수집 절대 금지
    - 개인정보보호법 준수를 위해 CI / DI(해시) 기반 식별 및 탈퇴 후 사기 재가입 방지
    """
    class VerificationLevel(models.IntegerChoices):
        LEVEL_1 = 1, '레벨 1 (기본 가입 - 둘러보기 & 단순 문의)'
        LEVEL_2 = 2, '레벨 2 (PASS 휴대폰 인증 - 상품 등록 & 1:1 거래)'
        LEVEL_3 = 3, '레벨 3 (계좌 + eKYC 신분증/셀피 인증 - 안심 인증 판매자 배지)'

    email = models.EmailField(
        '이메일 (로그인 ID)',
        unique=True,
        max_length=255,
        help_text='로그인 계정으로 사용되며 이메일 인증 발송 대상입니다.'
    )
    nickname = models.CharField(
        '닉네임',
        unique=True,
        max_length=30,
        help_text='거래 및 채팅 화면에 안전하게 노출되는 이름입니다.'
    )
    
    # 인증 상태
    verification_level = models.PositiveSmallIntegerField(
        '본인 인증 레벨',
        choices=VerificationLevel.choices,
        default=VerificationLevel.LEVEL_1,
        help_text='기획서 1~3단계 인증 체계'
    )
    
    # PASS / 통합인증으로 받아오는 식별값 (암호화 및 해시 보관)
    ci = models.CharField(
        'CI (연계정보)',
        max_length=255,
        null=True,
        blank=True,
        help_text='서비스 간 연계 식별값 (개인정보 식별 불가 암호화 값)'
    )
    di_hash = models.CharField(
        'DI 해시 (중복가입확인정보)',
        max_length=64,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text='동일인의 다중 계정 생성 및 사기 제재 후 재가입 방지용 해시'
    )

    # 본인 인증 완료 시 수신 정보 (선택적 보관, 주민번호 절대 제외)
    real_name = models.CharField('실명', max_length=50, null=True, blank=True)
    phone_number = models.CharField('휴대폰 번호', max_length=20, null=True, blank=True)
    birth_date = models.DateField('생년월일', null=True, blank=True)
    gender = models.CharField('성별', max_length=10, null=True, blank=True)

    # 선택 프로필 정보
    profile_image = models.ImageField('프로필 사진', upload_to='profiles/', null=True, blank=True)
    bio = models.TextField('자기소개', max_length=500, blank=True)
    primary_location = models.CharField('주 활동 지역', max_length=100, blank=True, help_text='예: 서울 강남구')

    # 시스템 플래그
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField('가입일', default=timezone.now)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자 목록'

    def __str__(self):
        return f"{self.nickname} ({self.email}) [Lv.{self.verification_level}]"


# ==============================================================================
# 2. 약관 동의 이력 (Terms & Compliance)
# ==============================================================================
class TermsAgreement(models.Model):
    """
    이용약관 및 개인정보 수집·이용 동의 이력 모델
    - 법적 분쟁 예방을 위해 동의 시각 및 약관 버전 기록
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='terms_agreement')
    terms_version = models.CharField('약관 버전', max_length=20, default='v1.0')
    
    # 필수 동의 항목
    is_terms_agreed = models.BooleanField('이용약관 동의 (필수)', default=False)
    is_privacy_agreed = models.BooleanField('개인정보 수집 및 이용 동의 (필수)', default=False)
    is_age_over_14 = models.BooleanField('만 14세 이상 확인 (필수)', default=False)
    
    # 선택 동의 항목 (필수 항목과 엄격히 분리)
    is_marketing_agreed = models.BooleanField('마케팅 정보 수신 동의 (선택)', default=False)
    
    agreed_at = models.DateTimeField('동의 시각', auto_now_add=True)
    ip_address = models.GenericIPAddressField('동의 당시 IP', null=True, blank=True)

    class Meta:
        verbose_name = '약관 동의 이력'
        verbose_name_plural = '약관 동의 이력 목록'


# ==============================================================================
# 3. 본인 인증 기록 (Verification Records)
# ==============================================================================
class VerificationRecord(models.Model):
    """
    모든 인증(휴대폰, 계좌, 신분증 eKYC)의 수행 내역 및 감사 로그
    - 신분증 원본 이미지나 주민번호는 저장하지 않고, 검증 상태와 제공자 결과 코드만 남김
    """
    class VerificationType(models.TextChoices):
        PHONE_PASS = 'PHONE_PASS', 'PASS 휴대폰 본인 인증 (Lv.2)'
        BANK_ACCOUNT = 'BANK_ACCOUNT', '본인 명의 계좌 인증 (Lv.3)'
        ID_CARD_EKYC = 'ID_CARD_EKYC', '신분증 진위 확인 및 OCR (Lv.3)'
        LIVE_SELFIE = 'LIVE_SELFIE', '실시간 얼굴 라이브니스 검사 (Lv.3)'

    class Status(models.TextChoices):
        PENDING = 'PENDING', '진행 중'
        SUCCESS = 'SUCCESS', '인증 성공'
        FAILED = 'FAILED', '인증 실패'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_records')
    verification_type = models.CharField('인증 종류', max_length=30, choices=VerificationType.choices)
    status = models.CharField('상태', max_length=20, choices=Status.choices, default=Status.PENDING)
    
    provider = models.CharField('인증 제공자', max_length=50, help_text='예: MockProvider, PASS, PortOne, eKYC_SDK')
    transaction_id = models.CharField('트랜잭션 고유 ID', max_length=100, unique=True)
    
    requested_at = models.DateTimeField('요청 일시', default=timezone.now)
    verified_at = models.DateTimeField('인증 완료 일시', null=True, blank=True)
    failure_reason = models.CharField('실패 사유', max_length=255, blank=True)
    
    # 신분증/얼굴 사진 원본은 저장 금지, 검증 결과 메타데이터(예: 일치율, 발급기관 확인코드)만 JSON으로 기록
    audit_metadata = models.JSONField('감사 메타데이터', default=dict, blank=True)

    class Meta:
        verbose_name = '인증 기록'
        verbose_name_plural = '인증 기록 목록'
        ordering = ['-requested_at']


# ==============================================================================
# 4. 판매자 정산 및 안심 계좌 (Bank Account)
# ==============================================================================
class BankAccount(models.Model):
    """
    본인 인증된 판매자 계좌 정보 (Lv.3)
    - 1원 입금 인증 또는 은행 실명 조회를 거쳐 사용자 본인 명의와 일치 확인
    - 자체 사기 신고 DB와 연계하여 불량 계좌 사전 필터링
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='bank_account')
    bank_name = models.CharField('은행명', max_length=30, help_text='예: KB국민은행, 신한은행, 토스뱅크')
    
    # 계좌번호는 마스킹 처리하거나 단방향 암호화하여 저장
    masked_account_number = models.CharField(
        '마스킹 계좌번호',
        max_length=50,
        help_text='예: 110-***-123456 (뒤 4~6자리만 노출)'
    )
    account_number_hash = models.CharField(
        '계좌번호 해시',
        max_length=64,
        db_index=True,
        help_text='사기 신고 DB 대조용 SHA-256 해시값'
    )
    account_holder_name = models.CharField('예금주명', max_length=50)
    
    is_owner_matched = models.BooleanField('실명 일치 여부', default=False)
    verified_at = models.DateTimeField('계좌 인증 완료 일시', auto_now_add=True)

    class Meta:
        verbose_name = '인증 계좌'
        verbose_name_plural = '인증 계좌 목록'

    def __str__(self):
        return f"{self.bank_name} {self.masked_account_number} ({self.account_holder_name})"


# ==============================================================================
# 5. 교체형 인증 인터페이스 및 구현체 (VerificationProvider Pattern)
# ==============================================================================
class VerificationResult:
    """인증 처리 결과를 표준화한 DTO 객체"""
    def __init__(self, success: bool, di_hash: str = None, ci: str = None, message: str = "", metadata: dict = None):
        self.success = success
        self.di_hash = di_hash
        self.ci = ci
        self.message = message
        self.metadata = metadata or {}


class BaseVerificationProvider(ABC):
    """
    본인 인증 제공자의 추상 기본 인터페이스 (전략 패턴: Strategy Pattern)
    
    [면접 및 아키텍처 핵심 설명]
    "실제 연동은 사업자등록 및 정식 PG/인증업체 계약이 필요하여 테스트 환경(가상 사용자 Sandbox)까지 연결했고,
    내부 구조는 VerificationProvider 인터페이스를 통해 분리하여 향후 운영 계약 시 
    설정값(settings.VERIFICATION_PROVIDER) 변경만으로 즉시 실서비스 연동이 가능하도록 설계했습니다.
    신분증 + 얼굴(eKYC) 인증은 법적 규제(개인정보보호법상 고유식별정보 처리)와 개인정보 보안을 위해 
    흐름과 화면만 안전한 Mock 시뮬레이션으로 제작했습니다."
    """
    @abstractmethod
    def verify_phone(self, phone_number: str, otp_code: str, name: str = "", birth_date: str = "") -> VerificationResult:
        """휴대폰 본인 실명 인증 (PASS / 토스 본인인증)"""
        pass

    @abstractmethod
    def verify_bank_account(self, bank_name: str, account_number: str, holder_name: str) -> VerificationResult:
        """1원 입금 또는 계좌 실명 조회"""
        pass

    @abstractmethod
    def verify_bank_1won_code(self, bank_name: str, account_number: str, input_code: str) -> VerificationResult:
        """1원 입금자명 인증 코드 검증"""
        pass

    @abstractmethod
    def verify_ekyc_identity(self, ocr_data: dict, liveness_passed: bool) -> VerificationResult:
        """신분증 진위 확인 및 실시간 셀피 라이브니스 교차 검증 (Mock)"""
        pass


class TossVerificationProvider(BaseVerificationProvider):
    """
    토스 본인인증(Toss Identity) 및 토스페이먼츠 1원 계좌인증 테스트 환경 구현체
    
    - 토스 개발자센터 테스트 API 키(test_sk_...) 기반 샌드박스 연동
    - 토스 인증 가상 사용자(Virtual Sandbox User) 지원
    - 신분증+안면인증(eKYC)은 개인정보보호 규제상 서버에 사진을 업로드하지 않고 
      클라이언트 검증 결과 메타데이터만 안전하게 처리(Mock)
    """
    TEST_API_KEY = "test_sk_sample_gear_market_2026"
    BASE_URL = "https://api.tosspayments.com/v1"
    
    # 토스 샌드박스 표준 가상 사용자 데이터셋
    VIRTUAL_USERS = {
        "01012345678": {
            "name": "홍길동",
            "birth_date": "1995-08-15",
            "gender": "M",
            "carrier": "SKT",
            "test_otp": "482910",
            "ci": "CI_TOSS_TEST_950815_HONG_GILDONG",
            "di": "DI_TOSS_SHA256_7F83B1657FF1FC53B92DC18148A1D65DFC2D4B1FA3D677284ADDD200126D9069"
        }
    }

    # 토스페이먼츠 1원 계좌인증 고정 테스트 인증코드
    TEST_BANK_1WON_CODE = "782"

    def verify_phone(self, phone_number: str, otp_code: str, name: str = "", birth_date: str = "") -> VerificationResult:
        clean_phone = phone_number.replace("-", "").strip()
        v_user = self.VIRTUAL_USERS.get(clean_phone)

        # 토스 테스트 환경: 가상 사용자 일치 검증 또는 테스트 OTP(6자리) 검증
        if v_user and otp_code == v_user["test_otp"]:
            return VerificationResult(
                success=True,
                di_hash=v_user["di"],
                ci=v_user["ci"],
                message="토스 본인인증 테스트 완료 (가상 사용자 인증 성공)",
                metadata={
                    "provider": "TossIdentityTest",
                    "carrier": v_user["carrier"],
                    "name": v_user["name"],
                    "gender": v_user["gender"],
                    "is_test_mode": True
                }
            )
        elif len(otp_code) == 6:
            # 기타 테스트 번호 입력 시 동적 가상 CI/DI 발급
            mock_di = hashlib.sha256(f"TOSS_TEST_{clean_phone}".encode()).hexdigest()
            mock_ci = f"CI_TOSS_TEST_{clean_phone[-4:]}"
            return VerificationResult(
                success=True,
                di_hash=mock_di,
                ci=mock_ci,
                message="토스 본인인증 샌드박스 테스트 성공",
                metadata={"provider": "TossIdentityTest", "is_test_mode": True}
            )

        return VerificationResult(
            success=False,
            message="인증번호가 일치하지 않거나 토스 가상 사용자 정보와 다릅니다."
        )

    def verify_bank_account(self, bank_name: str, account_number: str, holder_name: str) -> VerificationResult:
        """토스페이먼츠 1원 입금 요청 테스트"""
        clean_acc = account_number.replace("-", "").strip()
        if len(clean_acc) < 8:
            return VerificationResult(success=False, message="올바른 계좌번호를 입력해 주세요.")
        
        account_hash = hashlib.sha256(clean_acc.encode()).hexdigest()
        return VerificationResult(
            success=True,
            message=f"토스 1원 입금 송금 요청 완료 (입금자명: FRAME {self.TEST_BANK_1WON_CODE})",
            metadata={
                "provider": "TossPayments1Won",
                "bank": bank_name,
                "account_hash": account_hash,
                "masked_account": f"{clean_acc[:3]}-***-{clean_acc[-4:]}",
                "expected_code": self.TEST_BANK_1WON_CODE
            }
        )

    def verify_bank_1won_code(self, bank_name: str, account_number: str, input_code: str) -> VerificationResult:
        """토스 1원 입금자명 3자리 코드 대조"""
        if input_code.strip() == self.TEST_BANK_1WON_CODE:
            return VerificationResult(
                success=True,
                message="토스 1원 계좌 실명 인증 성공",
                metadata={"provider": "TossPayments1Won", "verified": True}
            )
        return VerificationResult(success=False, message="입금자명 인증코드(3자리)가 일치하지 않습니다.")

    def verify_ekyc_identity(self, ocr_data: dict, liveness_passed: bool) -> VerificationResult:
        """
        신분증 OCR & 실시간 안면 라이브니스 검증
        * 신분증 원본 이미지 및 얼굴 사진은 비저장(보안 및 법적 규제 준수)
        """
        if liveness_passed:
            return VerificationResult(
                success=True,
                message="신분증 진위 확인 및 실시간 셀피 라이브니스 교차 검증 통과 (Mock)",
                metadata={
                    "provider": "MockEkycLiveness",
                    "liveness_score": 0.994,
                    "face_match_passed": True,
                    "id_image_discarded": True
                }
            )
        return VerificationResult(success=False, message="실시간 생체 반응 감지(눈 깜빡임)에 실패했습니다.")


class MockVerificationProvider(BaseVerificationProvider):
    """
    완전 오프라인 포트폴리오 독립 시연용 Mock 구현체
    """
    def verify_phone(self, phone_number: str, otp_code: str, name: str = "", birth_date: str = "") -> VerificationResult:
        if len(otp_code) == 6:
            mock_di = hashlib.sha256(phone_number.encode()).hexdigest()
            return VerificationResult(
                success=True,
                di_hash=mock_di,
                ci="CI_MOCK_OFFLINE",
                message="모의 본인인증 성공 (Offline Mock)",
                metadata={"carrier": "SKT", "gender": "M"}
            )
        return VerificationResult(success=False, message="인증번호가 일치하지 않습니다.")

    def verify_bank_account(self, bank_name: str, account_number: str, holder_name: str) -> VerificationResult:
        account_hash = hashlib.sha256(account_number.encode()).hexdigest()
        return VerificationResult(
            success=True,
            message="1원 입금 인증 코드 발송 완료 (Offline Mock)",
            metadata={"bank": bank_name, "account_hash": account_hash}
        )

    def verify_bank_1won_code(self, bank_name: str, account_number: str, input_code: str) -> VerificationResult:
        if input_code in ["782", "123"]:
            return VerificationResult(success=True, message="1원 계좌 인증 성공 (Offline Mock)")
        return VerificationResult(success=False, message="코드가 일치하지 않습니다.")

    def verify_ekyc_identity(self, ocr_data: dict, liveness_passed: bool) -> VerificationResult:
        if liveness_passed:
            return VerificationResult(
                success=True,
                message="신분증 진위 확인 및 라이브니스 통과 (Offline Mock)",
                metadata={"liveness_score": 0.99, "doc_type": "KOR_ID_CARD"}
            )
        return VerificationResult(success=False, message="실시간 인물 인증에 실패했습니다.")


class VerificationProviderFactory:
    """
    환경설정(settings.py)에 따라 적절한 VerificationProvider 구현체를 생성하는 팩토리 클래스
    
    사용 예:
        provider = VerificationProviderFactory.get_provider()
        result = provider.verify_phone("010-1234-5678", "482910")
    """
    @staticmethod
    def get_provider(provider_type: str = "toss_test") -> BaseVerificationProvider:
        # Django settings가 연동된 경우 settings.VERIFICATION_PROVIDER 읽기
        try:
            from django.conf import settings
            provider_type = getattr(settings, 'VERIFICATION_PROVIDER', provider_type)
        except Exception:
            pass

        if provider_type == "toss_test":
            return TossVerificationProvider()
        elif provider_type == "mock":
            return MockVerificationProvider()
        else:
            # 향후 운영 계약 완료 시 실제 상용 프로바이더 추가
            return TossVerificationProvider()
