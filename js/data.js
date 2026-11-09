// FRAME Mock Dataset - 카메라 및 필름 전문 장비 데이터 (Black/White/Gray 테마)
let SAMPLE_PRODUCTS = [
  {
    id: 1,
    category: 'camera',
    brand: 'Sony',
    mount: 'E-Mount',
    title: '소니 Alpha A7 IV (ILCE-7M4) 바디 단품',
    price: 2150000,
    avgMarketPrice: 2200000,
    location: '서울 강남구 역삼동',
    createdAt: '18분 전',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    condition: 'A+급 (미세 사용감)',
    verified: true,
    verificationType: 'exif_shutter',
    verificationDetails: {
      shutterCount: 3420,
      serialMasked: '284****',
      extractedDate: '2026-10-22 09:12',
      checkSite: 'camerashuttercount.com',
      summary: 'CameraShutterCount 셔터 횟수 3,420회 확인 완료'
    },
    seller: {
      name: '포토그래퍼김씨',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '센서 규격': '35mm 풀프레임 Exmor R CMOS (3300만 화소)',
      '마운트': '소니 E 마운트',
      '셔터 수': '3,420회 (camerashuttercount.com 검증)',
      '센서 상태': '센서 클리닝 완료, 핫픽셀 없음',
      '구성품': '정품 풀박스, 정품 배터리 2개, 듀얼 충전기'
    },
    description: '서브 바디로 실내 스튜디오에서만 조심스럽게 사용했습니다. CameraShutterCount 사이트에서 오늘 오전 촬영한 원본 무보정 파일로 3,420회 셔터수 확인을 마쳤습니다. 센서와 외관 찍힘 없습니다.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [2350000, 2300000, 2250000, 2220000, 2200000, 2150000]
    }
  },
  {
    id: 2,
    category: 'film-camera',
    brand: 'Leica',
    mount: 'M-Mount',
    title: '라이카 M6 클래식 블랙 바디 (0.72x)',
    price: 3850000,
    avgMarketPrice: 3950000,
    location: '서울 마포구 연남동 / 합정',
    createdAt: '45분 전',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    condition: 'A급 (자연스러운 페인팅 에이징)',
    verified: true,
    verificationType: 'film_video',
    verificationDetails: {
      videoSubmitted: true,
      slowVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fastVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      slowShutterStatus: '1초 저속 셔터막 늘어짐(Lag) 없음 확인',
      fastShutterStatus: '1/1000초 고속 셔터 찢어짐(Capping) 없음 확인',
      windingStatus: '와인딩 레버 텐션 부드러움 및 카운터 복귀 정상',
      meterStatus: '노출계 정상 작동 (+o- LED 점등)',
      summary: '2대 필름 셔터막 영상(저속/고속) 및 실물 사진 검증 완료'
    },
    seller: {
      name: '아날로그필름',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '필름 규격': '35mm 135 필름',
      '파인더 배율': '0.72배율 (28/90, 35/135, 50/75 프레임라인)',
      '셔터 방식': '기계식 가로주행 천 셔터 (B, 1초~1/1000초)',
      '노출계': 'TTL 중앙부 중점 측광 (정상 작동)',
      '구성품': '바디캡, 아티산 아티스트 가죽 스트랩'
    },
    description: '컬렉팅용으로 소장하다 기변을 위해 내놓습니다. 셔터막 곰팡이나 늘어짐 전혀 없으며, 저속 1초 셔터 늘어짐도 없습니다. 와인딩과 셔터막 작동 영상을 첨부해 두었으니 확인해 주세요.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [3800000, 3850000, 3900000, 3920000, 3950000, 3850000]
    }
  },
  {
    id: 3,
    category: 'lens',
    brand: 'Sony',
    mount: 'E-Mount',
    title: '소니 FE 24-70mm F2.8 GM II (금계륵 2)',
    price: 2190000,
    avgMarketPrice: 2250000,
    location: '경기 성남시 판교역',
    createdAt: '1시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    condition: 'S급 (미사용급 새제품 컨디션)',
    verified: true,
    verificationType: 'lens_light',
    verificationDetails: {
      lightPhotoSubmitted: true,
      dustOrMoldStatus: 'LED 백라이트 투과 검사: 곰팡이/먼지 없음',
      apertureStatus: '조리개 날 기름 묻음 없음, 클릭감 완벽',
      summary: '빛 투과 사진 검증 완료: 렌즈알 스크래치 없음'
    },
    seller: {
      name: '렌즈수집가',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '마운트': '소니 E 마운트 (풀프레임)',
      '초점거리': '24-70mm 표준 줌',
      '조리개': 'F2.8 고정 원형 조리개',
      '무게': '약 695g',
      '필터 구경': '82mm'
    },
    description: '실사용 3회 미만인 민트급 제품입니다. 앞/뒤 캡, 전용 후드, 파우치, 박스 전체 보유 중입니다. 직거래 시 직접 카메라에 마운트하여 화질 테스트 가능합니다.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [2300000, 2280000, 2250000, 2240000, 2230000, 2190000]
    }
  },
  {
    id: 4,
    category: 'camera',
    brand: 'Canon',
    mount: 'RF-Mount',
    title: '캐논 EOS R6 Mark II 바디 (배터리 2개)',
    price: 2450000,
    avgMarketPrice: 2490000,
    location: '서울 서초구 양재역',
    createdAt: '2시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop&q=80',
    condition: 'A+급',
    verified: false,
    verificationType: 'manual_check',
    verificationDetails: {
      shutterCount: 8100,
      note: '정품등록 내역 및 바디 설정창 사진 첨부',
      summary: '판매자 자가 증빙 첨부'
    },
    seller: {
      name: '캐논매니아',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '센서 규격': '35mm 풀프레임 CMOS (2420만 화소)',
      '마운트': '캐논 RF 마운트',
      '셔터 추정': '약 8,100컷',
      '구성품': '본체 박스 풀세트, LP-E6NH 배터리 2개'
    },
    description: 'R5로 넘어가게 되어 정리합니다. 제습함에 항상 보관했습니다. 캐논 특성상 셔터수 확인 대신 정품 등록 영수증을 첨부했습니다.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [2650000, 2600000, 2550000, 2520000, 2500000, 2450000]
    }
  },
  {
    id: 5,
    category: 'film-camera',
    brand: 'Nikon',
    mount: 'F-Mount',
    title: '니콘 FM2 실버 바디 + 50mm f/1.4 세트',
    price: 680000,
    avgMarketPrice: 700000,
    location: '서울 종로구 혜화역',
    createdAt: '3시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    condition: 'A급',
    verified: true,
    verificationType: 'film_video',
    verificationDetails: {
      videoSubmitted: true,
      slowVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fastVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      slowShutterStatus: '1초 저속 셔터 늘어짐 없음 (티타늄 셔터막)',
      fastShutterStatus: '1/4000초 초고속 셔터 찢어짐(Capping) 없음 확인',
      windingStatus: '와인딩 스무스함 및 카운터 정상',
      summary: '2대 필름 셔터막 영상(저속/고속) 및 실물 사진 검증 완료'
    },
    seller: {
      name: '빈티지필름랩',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '필름 규격': '35mm 135 포맷',
      '셔터 속도': '1초 ~ 1/4000초 기계식 셔터',
      '동봉 렌즈': 'Nikkor AI-S 50mm F1.4',
      '노출계': '정상 동작 (배터리 교체 완료)'
    },
    description: '수동 필름 카메라의 대표 모델 FM2입니다. 1초부터 1/4000초까지 셔터막 막힘 없이 부드럽게 열립니다. 직거래 시 테스트 필름 넣고 확인 후 구매하세요.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [650000, 680000, 690000, 710000, 700000, 680000]
    }
  },
  {
    id: 6,
    category: 'camera',
    brand: 'Fujifilm',
    mount: 'X-Mount',
    title: '후지필름 X-T5 블랙 바디 단품',
    price: 1890000,
    avgMarketPrice: 1950000,
    location: '서울 영등포구 여의도역',
    createdAt: '4시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&auto=format&fit=crop&q=80',
    condition: 'S급 (실사용 2회)',
    verified: true,
    verificationType: 'exif_shutter',
    verificationDetails: {
      shutterCount: 1250,
      serialMasked: '24A****',
      extractedDate: '2026-10-22 08:30',
      checkSite: 'camerashuttercount.com',
      summary: 'CameraShutterCount 셔터 횟수 1,250회 확인'
    },
    seller: {
      name: '후지필름감성',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '센서 규격': 'APS-C X-Trans CMOS 5 HR (4020만 화소)',
      '마운트': '후지 X 마운트',
      '셔터 수': '1,250회 (camerashuttercount.com)',
      '구성품': '정품 풀박스, 보증서, 그립 플레이트'
    },
    description: '서브로 들였으나 스마트폰 사용이 잦아 정리합니다. 4020만 화소의 해상력과 필름 시뮬레이션이 훌륭합니다. 액정에 강화유리 부착되어 있습니다.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [2050000, 2000000, 1980000, 1950000, 1920000, 1890000]
    }
  },
  {
    id: 7,
    category: 'film-lens',
    brand: 'Leica',
    mount: 'M-Mount',
    title: '라이카 주미크론 Summicron-M 50mm F2 4세대',
    price: 1950000,
    avgMarketPrice: 2050000,
    location: '서울 용산구 한남동',
    createdAt: '5시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&auto=format&fit=crop&q=80',
    condition: 'A+급 (렌즈알 매우 깨끗)',
    verified: true,
    verificationType: 'lens_light',
    verificationDetails: {
      lightPhotoSubmitted: true,
      dustOrMoldStatus: '강력 LED 투과 검사: 곰팡이, 포깅, 발삼 없음',
      apertureStatus: '조리개 클릭감 명확, 헬리코이드 그리스 양호',
      summary: '빛 투과 사진 검증 완료: 발삼/곰팡이 하자 없음'
    },
    seller: {
      name: '라이카러버',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '마운트': '라이카 M 마운트',
      '초점거리': '50mm 표준 단렌즈',
      '조리개': 'F2.0 ~ F16',
      '외관': '내장 후드 탑재 버전, 블랙'
    },
    description: '라이카 표준 렌즈의 기준 주미크론 50mm 4세대입니다. 발삼 분리나 곰팡이가 전혀 없음을 플래시 투과 사진으로 확인했습니다.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [2100000, 2080000, 2050000, 2020000, 2000000, 1950000]
    }
  },
  {
    id: 8,
    category: 'lens',
    brand: 'Canon',
    mount: 'RF-Mount',
    title: '캐논 RF 70-200mm F2.8 L IS USM',
    price: 2680000,
    avgMarketPrice: 2750000,
    location: '서울 송파구 잠실역',
    createdAt: '6시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80',
    condition: 'A+급',
    verified: true,
    verificationType: 'lens_light',
    verificationDetails: {
      lightPhotoSubmitted: true,
      dustOrMoldStatus: '백라이트 투과 검사: 렌즈알 깨끗함',
      apertureStatus: 'IS 손떨림보정 및 USM 모터 정상 동작',
      summary: '빛 투과 검증 완료'
    },
    seller: {
      name: '풍경출사전문',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '마운트': '캐논 RF 마운트',
      '초점거리': '70-200mm 망원 줌',
      '조리개': 'F2.8 고정 조리개',
      '손떨림 보정': '최대 5스톱 보정 IS'
    },
    description: '백통 70-200 RF 버전입니다. 콤팩트한 수납형 디자인입니다. 잠실역 직거래 희망합니다.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [2850000, 2800000, 2780000, 2750000, 2700000, 2680000]
    }
  }
,
  {
    id: 9,
    category: 'camera',
    brand: 'Leica',
    mount: 'L-Mount',
    title: '라이카 D-Lux 7 Vans x Ray Barbee 체커보드 한정판 (풀박스)',
    price: 2450000,
    avgMarketPrice: 2500000,
    location: '서울 성동구 성수동',
    createdAt: '12분 전',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    condition: 'S급 (미사용급 풀패키지)',
    verified: true,
    verificationType: 'exif_shutter',
    verificationDetails: {
      shutterCount: 180,
      serialMasked: '562****',
      extractedDate: '2026-10-31 14:20',
      checkSite: 'camerashuttercount.com',
      summary: '셔터 180회 미사용급, 정품 체커보드 바디 및 스트랩 확인 완료'
    },
    seller: {
      name: '스트리트스냅러',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '센서 규격': '4/3인치 고화질 MOS 센서 (1700만 화소)',
      '렌즈': '라이카 DC 바리오 주밀룩스 10.9-34mm F1.7-2.8 ASPH',
      '특징': '반스 체커보드 가죽, 레이 바비 친필 각인, 페트롤 블루 스트랩',
      '구성품': '정품 풀박스, 한정판 전용 파우치, 렌즈 자동 캡'
    },
    description: '반스와 레이 바비 협업으로 소량 발매된 D-Lux 7 한정판입니다. 소장용으로 보관하여 셔터 180회의 신품급 상태입니다.',
    priceHistory: {
      labels: ['6월', '7월', '8월', '9월', '10월'],
      prices: [2550000, 2500000, 2500000, 2480000, 2450000]
    }
  },
  {
    id: 10,
    category: 'film-camera',
    brand: 'Leica',
    mount: 'M-Mount',
    title: '라이카 M6 TTL NSH 밀레니엄 400대 한정 (0.85x 블랙페인트)',
    price: 11800000,
    avgMarketPrice: 12500000,
    location: '서울 강남구 청담동',
    createdAt: '25분 전',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    condition: 'A+급 (SH 시리얼 각인, 무결점 뷰파인더)',
    verified: true,
    verificationType: 'film_video',
    verificationDetails: {
      videoSubmitted: true,
      slowVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fastVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      slowShutterStatus: '1초 저속 셔터 완벽 작동',
      fastShutterStatus: '1/1000초 고속 셔터 찢어짐 없음',
      windingStatus: 'M3 스타일 메탈 레버 텐션 극상',
      meterStatus: 'TTL 노출계 정상 점등',
      summary: '일본 시벨 헤그너 400대 한정판 정품 시리얼(SH 각인) 확인'
    },
    seller: {
      name: '라이카컬렉터',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '필름 규격': '35mm 135 필름 포맷',
      '파인더 배율': '0.85배율 (50mm/75mm/90mm/135mm 프레임)',
      '피니시': '오리지널 유광 블랙 페인트 (Black Paint)',
      '시리얼': 'SH 특수 시리얼 각인'
    },
    description: '일본 시벨 헤그너(NSH) 400대 한정판 M6 TTL 밀레니엄입니다. 모서리에 자연스러운 황동이 살짝 비치는 아름다운 에이징 상태입니다.',
    priceHistory: {
      labels: ['6월', '7월', '8월', '9월', '10월'],
      prices: [12500000, 12200000, 12000000, 11900000, 11800000]
    }
  },
  {
    id: 11,
    category: 'camera',
    brand: 'Leica',
    mount: 'Fixed',
    title: '라이카 Q2 모노크롬 (전용 흑백 센서 풀프레임)',
    price: 5200000,
    avgMarketPrice: 5350000,
    location: '서울 용산구 한남동',
    createdAt: '30분 전',
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop&q=80',
    condition: 'A+급 (방진방적 풀패키지)',
    verified: true,
    verificationType: 'exif_shutter',
    verificationDetails: {
      shutterCount: 2100,
      serialMasked: '548****',
      extractedDate: '2026-10-29 11:30',
      checkSite: 'camerashuttercount.com',
      summary: '셔터 2,100회, 주밀룩스 28mm 렌즈 코팅 완벽'
    },
    seller: {
      name: '흑백사진가',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '센서 규격': '4730만 화소 풀프레임 흑백 전용 CMOS 센서',
      '렌즈': '라이카 주밀룩스 28mm F1.7 ASPH (매크로 지원)',
      '특징': '컬러 필터 없는 순수 계조 표현, IP52 방진방적'
    },
    description: '컬러 필터가 제거되어 극도의 디테일과 다이내믹 레인지를 자랑하는 Q2 모노크롬입니다. 28mm F1.7 개방 화질 극상입니다.',
    priceHistory: {
      labels: ['6월', '7월', '8월', '9월', '10월'],
      prices: [5500000, 5400000, 5300000, 5250000, 5200000]
    }
  },
  {
    id: 12,
    category: 'film-camera',
    brand: 'Fujifilm',
    mount: 'Fixed',
    title: '후지필름 GW690 III 텍사스 라이카 6x9 중형 필름',
    price: 1450000,
    avgMarketPrice: 1500000,
    location: '서울 종로구 혜화동',
    createdAt: '1시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&auto=format&fit=crop&q=80',
    condition: 'A급 (카운터 092, 렌즈 클리어)',
    verified: true,
    verificationType: 'film_video',
    verificationDetails: {
      videoSubmitted: true,
      slowVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fastVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      slowShutterStatus: 'T 및 저속 셔터 완벽 작동',
      fastShutterStatus: '1/500초 렌즈 셔터 정확',
      windingStatus: '이중 와인딩 텐션 정상',
      meterStatus: '순수 기계식 셔터 정상',
      summary: '6x9 대형 판형 셔터 및 렌즈 곰팡이/먼지 없음 확인'
    },
    seller: {
      name: '중형매니아',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '필름 규격': '120 롤필름 (6x9 판형, 8컷)',
      '렌즈': 'EBC Fujinon 90mm F3.5 (환산 약 39mm 표준광각)',
      '셔터 방식': '기계식 렌즈 셔터 (T, 1초~1/500초)'
    },
    description: '일명 텍사스 라이카로 불리는 GW690 3세대 모델입니다. 6x9 대형 포맷 특유의 압도적인 해상력과 입체감을 느끼실 수 있습니다.',
    priceHistory: {
      labels: ['6월', '7월', '8월', '9월', '10월'],
      prices: [1550000, 1500000, 1480000, 1450000, 1450000]
    }
  },
  {
    id: 13,
    category: 'camera',
    brand: 'Ricoh',
    mount: 'Fixed',
    title: '리코 GR III 콤팩트 스냅 슈터 (정품 링캡/배터리 2개)',
    price: 1180000,
    avgMarketPrice: 1200000,
    location: '서울 마포구 상수동',
    createdAt: '1시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    condition: 'A+급 (포켓 스냅 최적)',
    verified: true,
    verificationType: 'exif_shutter',
    verificationDetails: {
      shutterCount: 3800,
      serialMasked: '003****',
      extractedDate: '2026-10-30 16:45',
      checkSite: 'camerashuttercount.com',
      summary: '센서 먼지 점검 완료(클린), 손떨림 보정 정상 작동'
    },
    seller: {
      name: '스냅포토',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '센서 규격': '2424만 화소 APS-C 크롭 센서',
      '렌즈': 'GR LENS 18.3mm F2.8 (환산 28mm 광각)',
      '특징': '3축 손떨림 보정(SR), 포지티브 필름 모드'
    },
    description: '포지티브 필름 색감이 일품인 GR3입니다. 주머니에 쏙 들어가는 크기에 APS-C 센서의 고화질을 보여줍니다.',
    priceHistory: {
      labels: ['6월', '7월', '8월', '9월', '10월'],
      prices: [1250000, 1220000, 1200000, 1180000, 1180000]
    }
  },
  {
    id: 14,
    category: 'film-camera',
    brand: 'Leica',
    mount: 'R-Mount',
    title: '라이카 R6.2 실버 기계식 SLR 바디 단품',
    price: 1650000,
    avgMarketPrice: 1750000,
    location: '서울 서초구 반포동',
    createdAt: '2시간 전',
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    condition: 'A급 (기계식 1/2000초 셔터 정상)',
    verified: true,
    verificationType: 'film_video',
    verificationDetails: {
      videoSubmitted: true,
      slowVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fastVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      slowShutterStatus: '1초 저속 셔터 정확',
      fastShutterStatus: '1/2000초 고속 셔터 완벽',
      windingStatus: '와인딩 레버 부드러움',
      meterStatus: '스팟 및 중앙부 노출계 정상',
      summary: '라이카 최후의 기계식 SLR 셔터 작동 영상 검증 완료'
    },
    seller: {
      name: 'R시스템매니아',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      isVerified: true
    },
    specs: {
      '필름 규격': '35mm 필름 포맷',
      '셔터 방식': '기계식 금속 포컬플레인 셔터 (B, 1초~1/2000초)',
      '측광 방식': '선택적 스팟 측광 및 통합 측광'
    },
    description: '배터리 없이도 1/2000초까지 모든 셔터가 기계식으로 구동되는 라이카 R 시스템의 정점 R6.2입니다. 파인더 매우 맑습니다.',
    priceHistory: {
      labels: ['6월', '7월', '8월', '9월', '10월'],
      prices: [1800000, 1750000, 1700000, 1680000, 1650000]
    }
  }
];

// ================= AI SAMPLE & MEDIA EXPLORER DATABASE =================
// 카메라 및 렌즈 모델별 실제 작례 사진, EXIF, 실사용 블로그, 유튜브 리뷰 링크 데이터
const AI_SAMPLE_DATABASE = {
  '라이카 D-Lux 7 Vans x Ray Barbee': {
    matchKeys: ['디룩스 반스', '반스', 'vans', 'ray barbee', 'd-lux 7 vans', '체커보드', 'd-lux 반스'],
    modelName: '라이카 D-Lux 7 Vans x Ray Barbee 스페셜 에디션 (Leica D-Lux 7 Vans x Ray Barbee)',
    category: '포서드 센서 프리미엄 콤팩트 한정판 카메라 (Leica x Vans)',
    sensorSpec: '1700만 화소 4/3인치 MOS 센서 | 라이카 DC 바리오 주밀룩스 10.9-34mm F1.7-2.8 ASPH (24-75mm 환산)',
    aiSummary: {
      characteristics: '전설적인 스케이트보더이자 뮤지션 겸 사진작가 레이 바비(Ray Barbee)와 글로벌 스트리트 브랜드 반스(Vans), 라이카가 합작한 전 세계 한정판. 반스의 상징인 체커보드 패턴 바디 가죽과 상단 레이 바비 친필 각인, 페트롤 블루 숄더 스트랩이 포함된 컬렉터스 아이템입니다.',
      pros: '독보적인 스트리트 감성 체커보드 디자인, 포서드 대형 센서와 F1.7-2.8 밝은 줌렌즈, 4K 동영상 및 콤팩트 휴대성, 높은 소장 및 리셀 가치',
      cons: '기본 D-Lux 7 대비 높은 한정판 프리미엄 가격, 스크래치 시 가치 하락 우려로 인한 애지중지 사용',
      recommendTo: '스케이트보드 및 스트리트 패션 애호가, 개성 넘치는 데일리 스냅 카메라를 찾는 컬렉터',
      proTip: '💡 [스트리트 스냅 팁]: 반스 한정판 특유의 캐주얼한 스트랩을 활용해 힙하게 메고 다니며, F1.7 최대 개방과 24mm 광각을 활용해 역동적인 스트리트 피사체를 로우 앵글로 포착해 보세요.'
    },
    samples: [],
    communityReviews: [
      {
        author: '라이카 클럽 코리아',
        badge: '리미티드 에디션 오너',
        quote: '반스 체커보드 패턴이 실물로 보면 훨씬 고급스럽고, 레이 바비의 시그니처 각인이 스트리트 감성을 자극합니다. 데일리로 들고 다니기에 이보다 힙한 카메라는 없습니다.'
      }
    ],
    videos: [
      {
        videoId: 'vans_dlux7',
        channel: 'Leica Camera',
        title: 'Leica D-Lux 7 Vans x Ray Barbee - The Journey is the Destination',
        duration: '03:15',
        views: '조회수 18.4만회',
        thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
        link: 'https://www.youtube.com/results?search_query=Leica+D-Lux+7+Vans+Ray+Barbee'
      }
    ]
  },

  '라이카 M6 TTL NSH': {
    matchKeys: ['msh', 'nsh', 'm6 nsh', 'm6 msh', 'm6한정판', 'm6 한정판', '밀레니엄 nsh', 'm6 ttl nsh'],
    modelName: '라이카 M6 TTL NSH 밀레니엄 한정판 (Leica M6 TTL NSH 400 Limited Edition)',
    category: '일본 시벨 헤그너 400대 한정 레인지파인더 필름 카메라 (Leica M6 TTL)',
    sensorSpec: '35mm 필름 포맷 (24x36mm) | 0.85x / 0.72x 고배율 파인더 | TTL 실시간 스팟 노출계',
    aiSummary: {
      characteristics: '2000년 새천년을 기념하여 출시된 M6 TTL 밀레니엄 모델 중, 일본 수입사인 Nihon Siber Hegner(NSH)의 주문으로 단 400대만 특별 생산된 초희귀 레인지파인더 카메라. M3 스타일의 클래식 톱 커버 각인과 메탈 와인딩 레버, 황동이 드러나는 유광 블랙 페인트(Black Paint) 마감이 집대성된 전설의 모델입니다.',
      pros: '전 세계 단 400대뿐인 극도의 희소성, 시간이 지날수록 황금빛 황동이 드러나는 블랙 페인트 에이징, M3의 클래식 외관과 M6 TTL의 편리한 노출계 동시 만족',
      cons: '부르는 게 값인 초고가 시세(1,000만~1,500만 원 이상), 페인트 까짐(황동 노출)에 대한 호불호 및 보관 부담',
      recommendTo: '최고의 기계식/전자식 하이브리드 필름 카메라를 소장하려는 하이엔드 라이카 수집가',
      proTip: '💡 [NSH 소장 가치 확인]: 카메라 상단 플레이트의 시리얼 넘버가 `SHxxx/400` 형태로 각인되어 있으며, 주미크론 35mm 8매 복각이나 주미룩스 35mm 스틸림 블랙 페인트 렌즈와 조합 시 완벽한 수집 라인을 완성합니다.'
    },
    samples: [],
    communityReviews: [
      {
        author: 'Japan Camera Hunter',
        badge: '글로벌 라이카 빈티지 평가',
        quote: 'M6 TTL NSH는 클래식 M3의 아름다운 실루엣에 M6의 노출계를 넣고, 단 400대만 유광 블랙 페인트로 마감한 라이카 역사상 가장 완벽한 한정판 중 하나입니다.'
      }
    ],
    videos: [
      {
        videoId: 'm6_ttl_nsh',
        channel: 'Rangefinder Review',
        title: 'Leica M6 TTL Millennium NSH Edition - The Ultimate Black Paint Film Camera',
        duration: '12:40',
        views: '조회수 9.8만회',
        thumbnail: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
        link: 'https://www.youtube.com/results?search_query=Leica+M6+TTL+Millennium+NSH'
      }
    ]
  },

  '라이카 M7 에르메스 에디션': {
    matchKeys: ['에르메스', 'hermes', 'm7 에르메스', 'm7 한정판', '라이카 에르메스', 'm7 hermes'],
    modelName: '라이카 M7 에르메스 스페셜 에디션 (Leica M7 Edition Hermès)',
    category: '프랑스 명품 에르메스 협업 200대 한정 레인지파인더 필름 카메라',
    sensorSpec: '35mm 필름 포맷 | 조리개 우선 전자 제어식 포컬플레인 셔터 | 0.72x 뷰파인더',
    aiSummary: {
      characteristics: '2009년 라이카와 프랑스 하이엔드 명품 하우스 에르메스(Hermès)가 합작하여 전 세계 단 200대(오렌지 100대, 에토프 100대)만 수작업으로 제작한 최고급 한정판. 최상급 송아지 가죽(Veau Swift)과 실버 크롬 아노다이징 피니시, 전용 주밀룩스 35mm F1.4 ASPH 렌즈가 매칭된 예술품입니다.',
      pros: '명품 브랜드 에르메스의 최고급 가죽 장인 테크닉, 독보적인 소장 가치(경매가 수천만 원 호가), 전자식 셔터의 정밀한 조리개 우선 AE 편의성',
      cons: '실사용보다는 금고 보관용에 가까운 초고가 자산형 기종, 가죽 오염에 극도로 민감',
      recommendTo: '명품과 카메라 미학의 정점을 찾는 최상위 컬렉터',
      proTip: '💡 [에르메스 패키지 구성]: 전용 가죽 스트랩과 원목 프레젠테이션 박스, 에르메스 오렌지 컬러 박스가 온전히 보존되어 있을 때 수집 가치가 극대화됩니다.'
    },
    samples: [],
    communityReviews: [
      {
        author: 'Leica Historical Society',
        badge: '럭셔리 컬렉터 리뷰',
        quote: '에르메스 특유의 오렌지 가죽과 부드러운 스위프트 레더의 촉감, 실버 마감의 정교함은 카메라를 넘어선 하나의 독립적인 예술품입니다.'
      }
    ],
    videos: [
      {
        videoId: 'm7_hermes',
        channel: 'Collector Watch & Camera',
        title: 'Unboxing the Holy Grail: Leica M7 Edition Hermès Special Package',
        duration: '14:22',
        views: '조회수 14.5만회',
        thumbnail: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=600&q=80',
        link: 'https://www.youtube.com/results?search_query=Leica+M7+Edition+Hermes'
      }
    ]
  },
  '슈퍼 타쿠마 50mm F1.4': {
    matchKeys: ['슈퍼 타쿠마', '슈퍼타쿠마', 'super takumar', 'supertakumar', '타쿠마', 'super-takumar', '펜탁스 타쿠마', 'takumar 50mm', '타쿠마 50mm', '무지개플레어', '무지개 플레어'],
    modelName: '펜탁스 슈퍼 타쿠마 50mm F1.4 (Super-Takumar 50mm F1.4)',
    category: 'M42 스크류 마운트 빈티지 수동 단렌즈 (Asahi Pentax)',
    sensorSpec: '50mm 표준 화각 | F1.4 ~ F16 조리개 | 8매/7매 조리개 | 토륨 방사능 글래스 (황금빛 코팅)',
    aiSummary: {
      characteristics: '빈티지 올드 렌즈의 황제라 불리는 전설적인 M42 명기 렌즈. 역광에서 조리개 F1.4 최대 개방 시 쏟아져 나오는 "환상적인 황금빛 원형 무지개 플레어(Golden Rainbow Flare)"와 토륨 글래스 산화로 인한 특유의 따뜻하고 묵직한 앰버(호박색) 색감이 독보적입니다.',
      pros: '15~20만 원대 최고의 가성비, 역광 촬영 시 어떤 최신 렌즈도 흉내 낼 수 없는 영화 같은 무지개 링 플레어, 부드러운 헬리코이드 초점감, 풀프레임 미러리스 이종교배 완벽 호환',
      cons: '역광 콘트라스트 저하(의도된 감성 룩), 토륨 렌즈 황변(UV 라이트로 탈색 가능하나 특유의 웜톤을 선호하는 유저가 다수), F1.4 개방 시 부드러운 구면 수차',
      recommendTo: '역광 감성 인물 사진, 시네마틱 감성 스냅, 따뜻한 빈티지 색감과 원형 플레어를 사랑하는 포토그래퍼',
      proTip: '💡 [황금빛 무지개 플레어 촬영 공식]: 오후 4~6시 역광 환경에서 태양이나 가로등 조명을 렌즈 프레임 상단 45도 모서리에 살짝 걸치고 조리개를 F1.4 최대 개방하면 화면 전체를 감싸는 극적인 황금색 원형 무지개 플레어가 쏟아집니다.'
    },
    samples: [],
    communityReviews: [
      {
        author: 'SLR클럽 펜탁스포럼',
        badge: 'SLRCLUB 실사용기',
        quote: '슈퍼 타쿠마 50.4는 플레어 하나만 보고 사도 돈값 200% 합니다. 역광에서 빛을 비스듬히 받으면 사진에 무지개가 생겨서 모델들이 정말 좋아합니다.'
      },
      {
        author: '네이버 블로거 아날로그스토리',
        badge: '네이버 내돈내산',
        quote: '초기 8매 버전과 후기 7매 버전이 있는데 둘 다 명기입니다. 미러리스에 M42 어댑터 물려서 쓰는데 경통의 황동 조작감이 예술입니다.'
      },
      {
        author: '티스토리 올드렌즈아카이브',
        badge: '티스토리 심층분석',
        quote: '토륨 렌즈 황변은 오히려 따뜻한 빈티지 톤을 만들어주어 매력적입니다. F1.4 개방 시 인물 피부톤이 정말 예쁘게 나옵니다.'
      }
    ],
    aiQnA: [
      {
        q: '슈퍼 타쿠마의 시그니처인 무지개 플레어는 어떻게 찍나요?',
        a: '오후 4~6시 역광 환경에서 태양을 렌즈 상단 모서리에 살짝 걸치고, 조리개를 F1.4 최대 개방으로 두시면 렌즈 안에서 빛이 반사되며 화면 전체를 감싸는 황금색 원형 무지개 링이 터져 나옵니다!'
      },
      {
        q: '초기 8매 버전과 7매 버전의 차이는 무엇인가요?',
        a: '초기 8매(8-Element) 버전은 플레어가 더 극적이고 컬렉터 소장 가치가 높으며 시세가 더 높습니다. 후기 7매 버전은 코팅이 살짝 개선되어 역광 제어력이 조금 더 안정적입니다.'
      },
      {
        q: '소니/후지/캐논 미러리스에 장착하려면 뭐가 필요한가요?',
        a: 'M42 나사선 규격이므로 네이버나 쿠팡에서 1~2만 원대 "M42 to E마운트(소니)", "M42 to FX(후지)", "M42 to RF(캐논)" 수동 어댑터를 구매하여 끼우면 모든 미러리스에서 즉시 촬영 가능합니다.'
      }
    ],
    blogs: [
      {
            "source": "티스토리 블로그",
            "author": "51daddy",
            "title": "플레어 머신 펜탁스 슈퍼 타쿠마 50mm f1.4 사용기",
            "summary": "역광에서 쏟아지는 극적인 황금빛 원형 무지개 플레어와 F1.4 최대 개방 화질 분석. 렌즈 각도 조절로 플레어 뽑아내는 팁.",
            "link": "https://51daddy.tistory.com/45"
      },
      {
            "source": "티스토리 블로그",
            "author": "ethany",
            "title": "펜탁스 슈퍼 타쿠마 50mm f1.4 렌즈 (타쿠마 50.4) 정보 및 작례",
            "summary": "초기형 8매와 후기형 7매 토륨 렌즈의 차이점, 황변 현상 및 미러리스 이종교배 어댑터 장착 실사용기.",
            "link": "https://ethany.tistory.com/21"
      }
],
    videos: [
      {
            "videoId": "KzPOXWS68t4",
            "channel": "VictoView",
            "title": "DUNE-like Lens Flares on a $200 Lens?! | Super Takumar 50mm F1.4",
            "duration": "10:48",
            "views": "조회수 18.2만회",
            "thumbnail": "https://i.ytimg.com/vi/KzPOXWS68t4/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=KzPOXWS68t4"
      },
      {
            "videoId": "tGRqi98GOMM",
            "channel": "탁호준의 로켓펀치",
            "title": "방사능묻은 렌즈가 있다? 슈퍼타쿠마 50mm F1.4 빈티지렌즈",
            "duration": "11:15",
            "views": "조회수 14.8만회",
            "thumbnail": "https://i.ytimg.com/vi/tGRqi98GOMM/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=tGRqi98GOMM"
      },
      {
            "videoId": "omeyL_siN8E",
            "channel": "Analog Insights",
            "title": "Pentax Super-Takumar 50mm f/1.4 (8-element version) Lens Review",
            "duration": "12:40",
            "views": "조회수 22.4만회",
            "thumbnail": "https://i.ytimg.com/vi/omeyL_siN8E/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=omeyL_siN8E"
      }
]
  },
  '헬리오스 44-2 58mm F2': {
    matchKeys: ['헬리오스 44', '헬리오스44', 'helios 44', 'helios-44', 'helios44', '헬리오스', 'helios 44-2', 'helios44-2', 'helios 44m', 'helios-44m', '회오리보케', '회오리 보케'],
    modelName: '헬리오스 44-2 58mm F2 (Helios 44-2)',
    category: 'M42 스크류 마운트 빈티지 올드 수동 단렌즈 (러시아 KMZ/Valdai)',
    sensorSpec: '58mm 표준 화각 | F2.0 ~ F16 프리셋 조리개 | 칼 자이스 Biotar 58mm f/2 광학계 복제',
    aiSummary: {
      characteristics: '소련에서 생산된 전설적인 M42 수동 명기 렌즈. 조리개 최대 개방(f/2) 시 주변부 코마 수차와 비네팅으로 인해 배경이 소용돌이치듯 회전하는 독보적인 "회오리 보케(Swirly Bokeh, Spiral Bokeh)"와 따뜻한 빈티지 플레어가 트레이드마크입니다.',
      pros: '10만 원 안팎의 압도적인 가성비, 어떤 최신 렌즈도 흉내 낼 수 없는 몽환적 회오리 보케, 견고한 풀 메탈 아날로그 경통, 어댑터를 통한 모든 미러리스(소니 E, 캐논 RF, 후지 X, 니콘 Z) 이종교배 지원',
      cons: '역광 시 강한 콘트라스트 저하와 플레어(단층 코팅 한계), F2 개방 시 중앙부 소프트함(F4 이상 조여야 선명), 프리셋 조리개 링 조작 적응 필요',
      recommendTo: '몽환적인 감성 인물 포트레이트, 숲/꽃/빛망울 매크로 스냅, 필름 톤의 독특한 보케를 즐기는 올드렌즈 입문자',
      proTip: '💡 [전설의 회오리 보케 극대화 촬영 공식]: ① 조리개는 반드시 F2.0 최대 개방 ② 카메라와 인물 거리는 1.2m~1.8m 내외 ③ 배경(나뭇잎 사이로 햇빛이 비치는 숲이나 가로등)은 4m 이상 멀리 떨어뜨리면 가장 극적인 소용돌이 빛망울이 완성됩니다.'
    },
    samples: [],
    communityReviews: [
      {
        author: 'SLR클럽 올드렌즈마니아',
        badge: 'SLRCLUB 실사용기',
        quote: '10만 원 안팎으로 라이카 부럽지 않은 몽환적인 감성을 만들어줍니다. 특히 숲속이나 야외 인물 스냅에서 조리개 F2로 찍으면 다들 무슨 렌즈냐고 신기해합니다.'
      },
      {
        author: '네이버 블로거 빛과그림자',
        badge: '네이버 내돈내산',
        quote: '역광에서는 플레어가 심하게 생기므로 빛을 45도 사광으로 받으며 찍는 게 요령입니다. 회오리 보케 하나만으로도 소장 가치는 200% 충분합니다.'
      },
      {
        author: '티스토리 아날로그연구소',
        badge: '티스토리 심층리뷰',
        quote: '소니 A7M4에 M42-E 어댑터로 물려서 쓰는데, 최신 GM 렌즈의 칼같은 선예도와는 완전히 다른 감성적인 룩을 완성해 줍니다. 수동 초점 피킹 기능 켜두면 초점 맞추기도 쉽습니다.'
      }
    ],
    aiQnA: [
      {
        q: '조리개 몇에서 회오리 보케가 제일 극적으로 나오나요?',
        a: '반드시 조리개를 F2.0 최대 개방으로 두셔야 합니다! F2.8로 1스톱만 조여도 주변부 코마 수차가 사라지며 일반적인 원형 보케로 바뀌어 회오리 효과가 반감됩니다.'
      },
      {
        q: '최신 디지털 미러리스(소니/후지/캐논)에 끼울 수 있나요?',
        a: '네, 100% 가능합니다! 헬리오스는 M42 나사선 규격으로, 인터넷에서 1~2만 원대 "M42-E(소니)", "M42-FX(후지)", "M42-RF(캐논)" 수동 어댑터를 끼우면 즉시 촬영할 수 있습니다.'
      },
      {
        q: '배경 회오리 보케를 가장 예쁘게 만드는 최적의 거리 공식은?',
        a: '카메라와 인물 사이는 1.2m~1.8m로 가깝게 유지하고, 인물 뒤의 배경(나뭇잎 사이로 햇빛이 비치는 숲이나 가로등)은 4m 이상 멀리 떨어뜨릴 때 소용돌이 빛망울이 가장 입체적으로 형성됩니다.'
      }
    ],
    blogs: [
      {
            "source": "티스토리 블로그",
            "author": "asrai21c",
            "title": "헬리오스 44-2 58mm f2 렌즈로 찍은 예제 사진들 (회오리 보케 작례)",
            "summary": "F2 최대 개방과 배경 빛망울 거리를 활용한 전설의 스월링 보케 실전 컷 모음. 독특한 코마 수차가 만들어내는 몽환적 분위기.",
            "link": "https://asrai21c.tistory.com/546"
      },
      {
            "source": "티스토리 블로그",
            "author": "surplusperson",
            "title": "헬리오스-44-2, 58mm f/2에 대한 사소한 감상 - 1부 (Biotar 복제판 리뷰)",
            "summary": "칼 자이스 비오타 58mm 광학 설계 유래와 구소련 KMZ 렌즈의 기계적 만듦새, 조리개 프리셋 링 조작법 심층 분석.",
            "link": "https://surplusperson.tistory.com/632"
      }
],
    videos: [
      {
            "videoId": "2PAyQ1DAcuw",
            "channel": "최마태의 POST IT",
            "title": "회오리 보케를 5만원에? 헬리오스 44-2 렌즈 테스트 (feat. 리플스 다은) | gear",
            "duration": "13:45",
            "views": "조회수 34.2만회",
            "thumbnail": "https://i.ytimg.com/vi/2PAyQ1DAcuw/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=2PAyQ1DAcuw"
      },
      {
            "videoId": "YXoc-w4P4PQ",
            "channel": "윌리의카메라수리공작소",
            "title": "어느 한가로운 오후 / 헬리오스 Helios 44-2 / 회오리보케 _이천 도자기 마을",
            "duration": "06:12",
            "views": "조회수 8.7만회",
            "thumbnail": "https://i.ytimg.com/vi/YXoc-w4P4PQ/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=YXoc-w4P4PQ"
      },
      {
            "videoId": "hSh3zmRps7k",
            "channel": "계필름스튜디오",
            "title": "보이면 사세요 HELIOS 44-2, 10만원대 구소련 마법렌즈.",
            "duration": "08:30",
            "views": "조회수 19.5만회",
            "thumbnail": "https://i.ytimg.com/vi/hSh3zmRps7k/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=hSh3zmRps7k"
      }
]
  },

  '라이트 렌즈 랩 35mm F2 (8매 복각)': {
    matchKeys: ['라이트 렌즈 랩', '라이트렌즈랩', 'light lens lab', 'lll 35mm', 'lll 8매', '8매 복각', 'lightlenslab', '8element', '35mm 8매'],
    modelName: '라이트 렌즈 랩 35mm F2 (Light Lens Lab 8-Element Replica)',
    category: 'M 마운트 수동 표준 광각 단렌즈',
    sensorSpec: '풀프레임 M 마운트 | 6군 8매(Eight-Element) 더블 가우스 | 황동 경통 | 조리개 F2.0 ~ F16',
    aiSummary: {
      characteristics: '라이카 전설의 1세대 주미크론 35mm f/2 "8매(Eight-Element)"를 렌즈 글래스 배합부터 황동 경통까지 1:1로 복각한 화제의 렌즈. 클래식한 글로우(Glow)와 섬세한 흑백 계조, 은은하고 부드러운 보케가 압권입니다.',
      pros: '오리지널 8매 대비 1/4 이하의 합리적 가격, 묵직하고 정교한 황동 헬리코이드 손맛, 빈티지 렌즈 특유의 풍부한 암부 계조와 아날로그 룩',
      cons: 'F2 최대 개방 시 주변부 광량 저하(비네팅) 및 역광 시 소프트한 콘트라스트(클래식 광학 특성)',
      recommendTo: '라이카 M 필름 및 디지털 유저, 흑백 스트리트 스냅 애호가, 1세대 8매의 감성을 합리적으로 즐기려는 사진가',
      proTip: '💡 [8매 복각 추천 촬영 팁]: 조리개 F2.8~F4 구간에서 중앙부 선예도가 비약적으로 상승하며, 흑백 필름이나 모노크롬 모드로 촬영 시 특유의 묵직한 하프톤 계조가 극대화됩니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '라이카스냅퍼',
        title: '라이트 렌즈 랩(LLL) 35mm F2 8매 복각 렌즈 6개월 실사용 심층 리뷰',
        summary: '오리지널 주미크론 8매와의 실촬영 1:1 비교 분석. 황동 경통의 만듦새와 컬러/흑백 발색 차이 총정리.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EB%9D%BC%EC%9D%B4%ED%8A%B8%EB%A0%8C%EC%8A%88%EB%9E%A9+35mm+8%EB%A7%A4+%EB%A6%AC%EB%B7%B0'
      },
      {
        source: '티스토리 블로그',
        author: 'AnalogVibe',
        title: 'Light Lens Lab 35mm f2.0 Eight Element 복각 렌즈 거리 스냅 출사기',
        summary: '도심 골목에서 담아낸 빛과 그림자. 개방 조리개에서의 클래식 글로우와 조였을 때의 샤프니스.',
        link: 'https://search.naver.com/search.naver?where=blog&query=Light+Lens+Lab+35mm+Eight+Element+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: '2PAyQ1DAcuw',
        channel: 'YouTube 렌즈 랩',
        title: '[실전 출사 작례] 라이트 렌즈 랩 35mm F2 8매 복각 야외 출사 및 결과물 테스트',
        duration: '14:20',
        views: '조회수 18.5만회',
        thumbnail: 'https://i.ytimg.com/vi/2PAyQ1DAcuw/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=%EB%9D%BC%EC%9D%B4%ED%8A%B8%EB%A0%8C%EC%8A%88%EB%9E%A9+35mm+%EC%9E%91%EB%A1%80'
      },
      {
        videoId: 'YXoc-w4P4PQ',
        channel: 'M-Mount 스토리',
        title: '[심층 비교] 오리지널 라이카 주미크론 8매 vs LLL 8매 복각 렌즈 블라인드 테스트',
        duration: '16:45',
        views: '조회수 22.1만회',
        thumbnail: 'https://i.ytimg.com/vi/YXoc-w4P4PQ/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=Light+Lens+Lab+35mm+review'
      }
    ]
  },

  '보이그랜더 녹톤 40mm F1.2 Aspherical': {
    matchKeys: ['보이그랜더 40mm', '녹톤 40mm', '보이그랜더 녹톤', 'voigtlander 40mm', 'nokton 40mm', 'nokton 40', '보익 40mm', '보이그랜더 40', '보익 녹톤'],
    modelName: '보이그랜더 녹톤 40mm F1.2 Aspherical (Voigtländer Nokton 40mm f/1.2)',
    category: '초대구경 표준 광각 수동 단렌즈 (VM / E 마운트)',
    sensorSpec: '풀프레임 지원 | 6군 8매 (양면 비구면 2매) | 10매 원형 조리개 | 개방 F1.2 ~ F22',
    aiSummary: {
      characteristics: 'F1.2의 압도적인 초대구경 밝기를 자랑하면서도 콤팩트한 휴대성을 갖춘 명작. 최대 개방에서 피사체를 완전히 분리해내는 얕은 심도와 회화적인 보케, 조리개를 F2 이상으로 조였을 때의 칼 같은 현대적 선예도가 공존합니다.',
      pros: 'F1.2 초대구경 대비 콤팩트한 315g 무게, 10매 원형 조리개의 환상적인 빛망울, 양면 비구면 렌즈 채용으로 F1.2에서도 높은 중앙부 해상력',
      cons: 'F1.2 완전 개방 시 축상 색수차(보라색 번짐) 및 주변부 광량 저하 발생 가능',
      recommendTo: '인물 감성 스냅, 카페 사진, 야간 도심 스냅, 35mm와 50mm 사이 완벽한 황금 화각(40mm)을 선호하는 포토그래퍼',
      proTip: '💡 [녹톤 40mm 추천 세팅]: F1.2 최대 개방으로 야경 가로등이나 조명을 배경에 두고 인물 상반신을 촬영하면 환상적인 원형 빛망울과 수채화 같은 배경 흐림을 얻을 수 있습니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '보익매니아',
        title: '보이그랜더 녹톤 40mm F1.2 Aspherical 실사용기: F1.2가 주는 마법 같은 공간감',
        summary: '40mm 화각의 편안함과 F1.2 개방 보케 테스트. 소니 A7시리즈 및 라이카 M 바디 결합 시 실전 작례.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EB%B3%B4%EC%9D%B4%EA%B7%B8%EB%9E%9C%EB%8D%94+%EB%85%B9%ED%84%A4+40mm+F1.2+%EC%8B%A4%EC%82%AC%EC%9A%A9%EA%B8%B0'
      },
      {
        source: '티스토리 블로그',
        author: 'PhotoNote',
        title: 'Voigtlander Nokton 40mm F1.2 VM 렌즈 심층 리뷰 및 출사 작례',
        summary: '양면 비구면 렌즈 2매의 위력. 조리개값 변화에 따른 선예도와 보케 패턴 완벽 분석.',
        link: 'https://search.naver.com/search.naver?where=blog&query=Voigtlander+Nokton+40mm+F1.2+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: 'hSh3zmRps7k',
        channel: '카메라 리뷰 랩',
        title: '[실전 출사] 보이그랜더 녹톤 40mm F1.2로 담은 도심 야경과 감성 인물 작례',
        duration: '15:10',
        views: '조회수 19.3만회',
        thumbnail: 'https://i.ytimg.com/vi/hSh3zmRps7k/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=%EB%B3%B4%EC%9D%B4%EA%B7%B8%EB%9E%9C%EB%8D%94+%EB%85%B9%ED%84%A4+40mm+F1.2'
      }
    ]
  },

  '티티아티산 50mm F0.95': {
    matchKeys: ['티티아티산 50mm', '티티아티산 0.95', 'ttartisan 50mm', 'ttartisan f0.95', '티티아티산', 'ttartisan', '50mm f0.95'],
    modelName: '티티아티산 50mm F0.95 (TTArtisan 50mm f/0.95)',
    category: '극초대구경 표준 수동 단렌즈 (M / E / Z / RF 마운트)',
    sensorSpec: '풀프레임 지원 | 8군 11매 (대구경 양면 비구면 1매, ED 2매) | 14매 원형 조리개 | 개방 F0.95 ~ F16',
    aiSummary: {
      characteristics: '꿈의 조리개값 F0.95를 합리적인 가격에 실현한 초대구경 렌즈. 배경을 유화 물감처럼 부드럽게 녹여버리는 환상적인 피사체 분리력과 암흑 같은 야간 환경에서도 셔터스피드를 확보해 주는 독보적인 광학 스펙을 갖추었습니다.',
      pros: 'F0.95 드림 렌즈 스펙, 14매 원형 조리개의 압도적인 원형 보케, 풀메탈 황동 마운트의 견고한 기계적 마감',
      cons: '687g의 묵직한 무게, F0.95 완전 개방 시 극도로 얕은 피사계 심도로 정밀한 수동 초점 조작 필요',
      recommendTo: '빛망울이 쏟아지는 감성 야간 인물 사진, 배경을 완전히 날려버리는 시네마틱 룩을 원하는 크리에이터',
      proTip: '💡 [F0.95 초점 팁]: 피사계 심도가 종이 한 장 수준으로 얇으므로, 미러리스 바디의 "초점 확대(Focus Magnifier)" 기능을 커스텀 버튼에 지정하여 속눈썹에 정확히 핀을 맞추고 촬영하세요.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '초대구경러버',
        title: '티티아티산 50mm F0.95 M마운트 실사용기: F0.95가 보여주는 또 다른 세상',
        summary: '배경이 완전히 사라지는 놀라운 심도. 야간 인물 촬영과 카페 스냅에서의 실전 작례.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%ED%8B%B0%ED%8B%B0%EC%95%84%ED%8B%B0%EC%82%B0+50mm+F0.95+%EC%8B%A4%EC%82%AC%EC%9A%A9%EA%B8%B0'
      }
    ],
    videos: [
      {
        videoId: '2PAyQ1DAcuw',
        channel: '렌즈 탐구 생활',
        title: '[심층 리뷰] 티티아티산 50mm F0.95 진짜 쓸만한가? 라이카 녹티룩스와의 비교',
        duration: '18:30',
        views: '조회수 25.4만회',
        thumbnail: 'https://i.ytimg.com/vi/2PAyQ1DAcuw/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=TTArtisan+50mm+f0.95+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '7장인 35mm F1.2': {
    matchKeys: ['7장인 35mm', '칠장인 35mm', '7artisans 35mm', '7장인', '칠장인', '7artisans'],
    modelName: '7장인 35mm F1.2 (7Artisans 35mm f/1.2 Mark II)',
    category: 'APS-C 미러리스 콤팩트 대구경 단렌즈',
    sensorSpec: 'APS-C 환산 약 50mm | 5군 6매 | 10매 조리개 | 무게 150g 극소형 경량화',
    aiSummary: {
      characteristics: '손바닥보다 작은 150g의 초경량 바디에 F1.2 대구경을 담아낸 최고의 가성비 감성 렌즈. 필름 라이크한 부드러운 콘트라스트와 아날로그 렌즈 특유의 은은한 플레어가 일품입니다.',
      pros: '10만원대 초반의 경이로운 가성비, 주머니에 쏙 들어가는 초소형 크기, 부드럽고 따뜻한 빈티지 톤',
      cons: 'F1.2 개방 시 주변부 해상도 저하, 역광 시 강한 플레어 발생(감성 룩으로 활용 권장)',
      recommendTo: '후지필름 X 마운트 및 소니 E 마운트 크롭 바디 유저, 가벼운 데일리 감성 스냅 입문자',
      proTip: '💡 [감성 스냅 팁]: 조리개를 F1.4~F2로 살짝 조이면 중앙부 선예도가 눈에 띄게 개선되며 빈티지 필름 시뮬레이션과 찰떡궁합을 보여줍니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '후지스냅퍼',
        title: '7장인 35mm F1.2 II 렌즈와 후지 X-T30으로 담은 일상 필름 감성 스냅',
        summary: '150g의 깃털 같은 무게와 F1.2의 마법. 카페와 길거리에서 찍은 무보정 필름 시뮬레이션 작례.',
        link: 'https://search.naver.com/search.naver?where=blog&query=7%EC%9E%A5%EC%9D%B8+35mm+F1.2+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: 'YXoc-w4P4PQ',
        channel: '가성비 렌즈 랩',
        title: '[단돈 10만원대] 7장인 35mm F1.2 II 렌즈 실전 출사 리뷰',
        duration: '11:15',
        views: '조회수 14.2만회',
        thumbnail: 'https://i.ytimg.com/vi/YXoc-w4P4PQ/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=7artisans+35mm+f1.2+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '라이카 주마론 28mm F5.6 (중마론)': {
    matchKeys: ['주마론 28mm', '중마론 28mm', '주마론', '중마론', 'summaron 28mm', 'summaron', 'summaron-m', '주마론 28', '중마론 28'],
    modelName: '라이카 주마론 28mm F5.6 (Leica Summaron-M 28mm f/5.6 - 일명 중마론)',
    category: 'M 마운트 초박형 팬케이크 광각 단렌즈',
    sensorSpec: '풀프레임 M 마운트 | 4군 6매 대칭형 가우스 설계 | 두께 18mm, 무게 165g 초박형 황동 경통',
    aiSummary: {
      characteristics: '카메라 애호가들 사이에서 "중마론"이라는 애칭으로 불리는 전설의 초박형 팬케이크 렌즈. 1955년 빈티지 광학 설계를 현대에 완벽 복각하였으며, 왜곡 없는 정밀한 직선 표현력과 깊은 피사계 심도를 활용한 찰나의 거리 스냅에 독보적입니다.',
      pros: '두께 18mm의 경이로운 휴대성, 극상의 황동 질감과 정밀한 무한대 락 핀, 흑백 사진에서 뿜어져 나오는 클래식한 하프톤 계조',
      cons: 'F5.6의 어두운 최대 개방 조리개값(실내 및 저조도 야간 촬영에는 고감도 세팅 필요)',
      recommendTo: '거리 스냅 포토그래퍼, 펜포커스(Zone Focus) 속사 촬영을 즐기는 라이카 유저, 미니멀한 룩을 추구하는 사진가',
      proTip: '💡 [중마론 펜포커스 공식]: 조리개를 F8로 설정하고 초점 링을 2.5m(거리계 심도 지표 참조)에 맞추면, 1.3m부터 무한대까지 모든 영역이 선명하게 팬포커스로 맞아떨어져 핀을 맞출 필요 없이 셔터만 누르면 됩니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '라이카스냅',
        title: '라이카 주마론 28mm F5.6 복각(중마론) 1년 실사용기: 거리 스냅의 궁극적 동반자',
        summary: '손가락 한 마디 크기에서 나오는 라이카의 깊은 흑백 계조. 거리에서 셔터만 누르는 팬포커스 촬영의 묘미.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EC%A3%BC%EB%A7%88%EB%A1%A0+28mm+%EC%A4%91%EB%A7%88%EB%A1%A0+%EB%A6%AC%EB%B7%B0'
      }
    ],
    videos: [
      {
        videoId: 'hSh3zmRps7k',
        channel: 'Allan Kim',
        title: '라이카 주마론 28mm F5.6 - 가장 클래식하고 아름다운 렌즈',
        duration: '13:20',
        views: '조회수 17.8만회',
        thumbnail: 'https://i.ytimg.com/vi/hSh3zmRps7k/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=%EB%9D%BC%EC%9D%B4%EC%B9%B4+%EC%A3%BC%EB%A7%88%EB%A1%A0+28mm+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '라이카 주미크론 50mm F2 (리지드)': {
    matchKeys: ['주미크론 50mm', '즈미크론 50mm', '주미크론 50', '주미크론 리지드', 'summicron 50mm', 'summicron rigid', '주미크론', '즈미크론', 'summicron'],
    modelName: '라이카 주미크론 50mm F2 리지드 (Leica Summicron 50mm f/2 Rigid)',
    category: 'M 마운트 전설의 표준 단렌즈 (Rigid / 침동 / 현행)',
    sensorSpec: '풀프레임 M 마운트 | 6군 7매 더블 가우스 | 황동 크롬 경통 | 조리개 F2.0 ~ F16',
    aiSummary: {
      characteristics: '전 세계 광학 역사에서 "50mm 표준 렌즈의 교과서이자 기준점"으로 불리는 불멸의 명작. 특히 2세대 리지드(Rigid) 버전은 극강의 마이크로 콘트라스트와 미세한 질감 묘사력으로 흑백과 컬러 모두에서 감탄을 자아냅니다.',
      pros: '전설적인 마이크로 콘트라스트와 선예도, 황동 크롬의 예술적인 조작감, 입체적인 공간감 표현',
      cons: '오리지널 빈티지 개체의 경우 내부 연무(클라우디) 및 전면부 코팅 흠집 상태 점검 필수',
      recommendTo: '라이카 M 마운트 유저의 필수 렌즈, 다큐멘터리 포토그래피, 표준 50mm의 정석을 맛보고 싶은 유저',
      proTip: '💡 [주미크론 리지드 촬영 팁]: 자연광이 비치는 실내 창가나 역광 환경에서 흑백 모드로 질감이 있는 피사체(목재, 직물, 인물 피부)를 담으면 주미크론 특유의 섬세한 톤 분해능을 온전히 체감할 수 있습니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '클래식라이카',
        title: '라이카 주미크론 50mm F2 리지드(Rigid) 만듦새와 실전 작례 갤러리',
        summary: '왜 수많은 사진가들이 50년이 넘은 리지드 렌즈를 아직도 고집하는가? 흑백 암부 계조의 비밀.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EC%A3%BC%EB%A3%A8%ED%81%AC%EB%A1%A0+50mm+%EB%A6%AC%EC%A7%80%EB%93%9C+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: '2PAyQ1DAcuw',
        channel: 'M-Shooter',
        title: '라이카 M과 가장 어울리는 렌즈: 주미크론 50mm F2 리지드 리뷰',
        duration: '15:40',
        views: '조회수 21.6만회',
        thumbnail: 'https://i.ytimg.com/vi/2PAyQ1DAcuw/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=Leica+Summicron+50mm+Rigid+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '라이카 주미룩스 35mm F1.4': {
    matchKeys: ['주미룩스 35mm', '즈미룩스 35mm', '주미룩스 35', '주미룩스', '즈미룩스', 'summilux 35mm', 'summilux 35', 'summilux'],
    modelName: '라이카 주미룩스 35mm F1.4 (Leica Summilux-M 35mm f/1.4 - 스틸림/현행)',
    category: 'M 마운트 대구경 광각 표준 렌즈',
    sensorSpec: '풀프레임 M 마운트 | 5군 7매 (1세대 스틸림) / 비구면 플로팅 (현행 ASPH) | 조리개 F1.4 ~ F16',
    aiSummary: {
      characteristics: '"어둠의 제왕(King of the Night)"이라는 칭호를 가진 라이카의 대표 대구경 렌즈. 1세대 스틸림(Steel Rim)은 F1.4 최대 개방 시 환상적인 글로우(Glow)와 몽환적인 룩을 선사하며, 조리개를 조이면 극도로 날카로운 해상력을 뿜어냅니다.',
      pros: 'F1.4 개방 시 몽환적인 라이카 글로우와 보케, 컴팩트한 경통 크기, 전천후 환경을 아우르는 35mm 화각',
      cons: '개방 시 코마 플레어 발생(스틸림 고유 특성), 매우 높은 중고 및 신품 가격대',
      recommendTo: '다큐멘터리, 인물 환경 스냅, 빛과 어둠의 대비를 드라마틱하게 포착하고 싶은 사진가',
      proTip: '💡 [주미룩스 글로우 활용법]: 야간 조명이나 가로등 불빛 주변에서 인물을 F1.4 최대 개방으로 촬영하면 빛이 피사체 주변으로 아지랑이처럼 번지는 라이카 특유의 시네마틱 룩을 연출할 수 있습니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '빛의화가',
        title: '라이카 주미룩스 35mm F1.4 스틸림 복각 6개월 롱텀 사용기',
        summary: '글로우와 샤프니스의 완벽한 공존. 밤거리에서 담아낸 빛의 궤적과 인물 스냅.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EC%A3%BC%EB%AF%B8%EB%A3%A9%EC%8A%A4+35mm+%EC%8A%A4%ED%8B%B8%EB%A6%BC+%EB%A6%AC%EB%B7%B0'
      }
    ],
    videos: [
      {
        videoId: 'YXoc-w4P4PQ',
        channel: '라이카 채널',
        title: '주미룩스 35mm F1.4 왜 사진가들의 종착지인가?',
        duration: '17:10',
        views: '조회수 31.2만회',
        thumbnail: 'https://i.ytimg.com/vi/YXoc-w4P4PQ/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=Leica+Summilux+35mm+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '라이카 녹티룩스 50mm F0.95': {
    matchKeys: ['녹티룩스 50mm', '녹티룩스', 'noctilux 50mm', 'noctilux', 'noctilux-m', '녹티 50'],
    modelName: '라이카 녹티룩스 50mm F0.95 ASPH (Leica Noctilux-M 50mm f/0.95)',
    category: 'M 마운트 현존 최고 수준의 극초대구경 단렌즈',
    sensorSpec: '풀프레임 M 마운트 | 5군 8매 (비구면 2매, 특수 저분산 유리 5매) | 조리개 F0.95 ~ F16',
    aiSummary: {
      characteristics: '인간의 동공보다 더 많은 빛을 빨아들이는 현존 최고의 광학 예술품. F0.95 최대 개방 시 배경이 수채화처럼 흘러내리며 피사체가 마치 3차원 공간에서 튀어나올 듯한 극적인 입체감을 형성합니다.',
      pros: '비교 불가능한 F0.95의 압도적 배경 분리력, 수채화 같은 렌더링, 어두운 암흑 속에서도 숨 쉬는 피사체 표현',
      cons: '약 700g의 묵직한 무게와 뷰파인더 가림 현상, 극단적으로 높은 초고가 렌즈',
      recommendTo: '타협 없는 궁극의 감성 인물 사진, 예술적 시각 표현을 추구하는 하이엔드 포토그래퍼',
      proTip: '💡 [녹티룩스 입체감 연출법]: 피사체와의 거리를 2m 정도로 유지하고 배경과의 거리를 멀리 벌려주면, 인물만 얇게 분리되어 입체적으로 붕 떠오르는 녹티룩스 고유의 3D 팝(Pop) 효과를 극대화할 수 있습니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '노을사진가',
        title: '라이카 녹티룩스 50mm F0.95 ASPH 실사용 작례와 공간감 분석',
        summary: 'F0.95가 만들어내는 마법 같은 공간 분리력과 암부 디테일. 밤거리 스냅에서 담은 무보정 컷.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EB%85%B9%ED%8B%B0%EB%A3%A9%EC%8A%A4+50mm+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: 'hSh3zmRps7k',
        channel: '사진 예술 랩',
        title: '라이카 녹티룩스 50mm F0.95 - 인간의 눈을 넘어서는 렌즈',
        duration: '19:45',
        views: '조회수 42.1만회',
        thumbnail: 'https://i.ytimg.com/vi/hSh3zmRps7k/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=Leica+Noctilux+50mm+f0.95+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '라이카 엘마 50mm F3.5': {
    matchKeys: ['엘마 50mm', '엘마', 'elmar 50mm', 'elmar', 'elmar-m', '엘마 침동'],
    modelName: '라이카 엘마 50mm F3.5 침동식 (Leica Elmar 50mm f/3.5 Collapsible)',
    category: 'L/M 마운트 클래식 침동식 단렌즈',
    sensorSpec: '바르낙 L39 / M 마운트 | 3군 4매 테사 타입 | 침동식(Collapsible) 메커니즘 | 조리개 F3.5 ~ F18',
    aiSummary: {
      characteristics: '오스카 바르낙이 35mm 카메라를 세상에 처음 선보였을 때 함께 탄생한 라이카의 영원한 뿌리. 렌즈를 바디 안으로 집어넣는 침동식 구조로 주머니에 들어가는 휴대성과 담백하고 깊은 흑백 그레이 계조가 일품입니다.',
      pros: '바디에 밀어 넣었을 때 납작해지는 극강의 침동 휴대성, 테사 광학계의 칼 같은 중앙부 선예도, 클래식 흑백 톤',
      cons: 'F3.5의 어두운 조리개, 회전식 조리개 레버 조작의 번거로움, 디지털 바디 장착 시 센서 간섭 주의',
      recommendTo: '바르낙 및 라이카 M 필름 카메라 유저, 클래식 흑백 스트리트 스냅, 역사적 명기를 소장하려는 컬렉터',
      proTip: '💡 [엘마 흑백 촬영 팁]: 콘트라스트가 지나치게 높지 않아 명부 하이라이트가 날아가지 않고 부드럽게 유지되므로, 직사광선이 강한 한낮 거리 스냅에서 흑백 필름(트라이X 등)과 결합 시 최고의 질감을 얻을 수 있습니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '바르낙스토리',
        title: '라이카 엘마 50mm F3.5 침동식 렌즈 70년의 세월을 담다',
        summary: '손바닥보다 작은 카메라에서 뿜어져 나오는 클래식의 정수. 테사 렌즈의 담백한 흑백 묘사력.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EB%9D%BC%EC%9D%B4%EC%B9%B4+%EC%97%98%EB%A7%88+50mm+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: '2PAyQ1DAcuw',
        channel: '빈티지 카메라 랩',
        title: '라이카의 시작: 엘마 50mm F3.5 침동식 렌즈 리뷰 및 출사',
        duration: '12:50',
        views: '조회수 15.3만회',
        thumbnail: 'https://i.ytimg.com/vi/2PAyQ1DAcuw/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=Leica+Elmar+50mm+f3.5+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '미놀타 MC 로코르-PG 58mm F1.2': {
    matchKeys: ['미놀타 58mm', '로코르 58mm', '미놀타 로코르', 'rokkor 58mm', 'minolta rokkor', '로코르 58', '미놀타 58'],
    modelName: '미놀타 MC 로코르-PG 58mm F1.2 (Minolta MC Rokkor-PG 58mm f/1.2)',
    category: 'SR/MD 마운트 빈티지 초대구경 단렌즈 (일명 보케 괴물)',
    sensorSpec: '풀프레임 지원 | 5군 7매 아크로매틱 코팅 | 8매 원형 조리개 | 개방 F1.2 ~ F16',
    aiSummary: {
      characteristics: '빈티지 렌즈 마니아들 사이에서 "보케 괴물(The Bokeh Monster)"이라는 별칭으로 불리는 미놀타의 전설적인 명옥. F1.2 최대 개방에서 배경을 부드러운 수채화처럼 뭉개주는 몽환적인 보케와 미놀타 특유의 따뜻하고 풍부한 그린/앰버 발색이 독보적입니다.',
      pros: '환상적인 크리미 보케와 입체감, 금속 헬리코이드의 묵직하고 매끄러운 초점감, 풀프레임 미러리스 이종교배 완벽 호환',
      cons: '475g의 묵직한 무게, 오래된 연식으로 인한 조리개 날 오일 고착 및 방사능 코팅(토륨 렌즈) 황변 확인 필요',
      recommendTo: '따뜻한 감성 인물 포트레이트, 빈티지 룩 영상 촬영, 영화 같은 보케를 사랑하는 포토그래퍼',
      proTip: '💡 [로코르 58mm 보케 공식]: F1.2 개방으로 역광 나뭇잎 사이 빛망울을 배경에 두고 인물 상반신을 클로즈업 촬영하면, 배경 전체가 부드러운 유화처럼 녹아내리는 극적인 보케를 얻을 수 있습니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '보케괴물사냥꾼',
        title: '미놀타 MC 로코르 58mm F1.2 렌즈로 담은 봄날 인물 스냅 (보케 작례)',
        summary: '배경이 완전히 수채화가 되는 마법. 소니 풀프레임 미러리스 이종교배 실전 테스트.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EB%AF%B8%EB%86%80%ED%83%80+%EB%A1%9C%EC%BD%94%EB%A5%B4+58mm+F1.2+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: 'YXoc-w4P4PQ',
        channel: '빈티지 렌즈 TV',
        title: '보케 괴물이라 불리는 이유: 미놀타 MC 로코르 58mm F1.2 실전 리뷰',
        duration: '14:10',
        views: '조회수 28.7만회',
        thumbnail: 'https://i.ytimg.com/vi/YXoc-w4P4PQ/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=Minolta+Rokkor+58mm+f1.2+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '칼 자이스 플라나 T* 50mm F1.4': {
    matchKeys: ['칼 자이스 플라나', '자이스 50mm', '플라나 50mm', 'planar 50mm', 'zeiss planar', '자이스 플라나', '플라나 50'],
    modelName: '칼 자이스 플라나 T* 50mm F1.4 (Carl Zeiss Planar T* 50mm f/1.4)',
    category: '콘탁스 C/Y 및 ZF/ZE 마운트 표준 단렌즈',
    sensorSpec: '풀프레임 지원 | 6군 7매 대칭형 플라나 설계 | 자이스 전설의 T* 다층막 코팅 | 조리개 F1.4 ~ F16',
    aiSummary: {
      characteristics: '1896년 파울 루돌프 박사가 설계한 플라나 광학계의 정점을 보여주는 표준 렌즈. 자이스 특유의 붉은색 T* 코팅이 빛의 난반사를 억제하여 맑고 투명한 유리알 같은 선예도와 깊고 진한 컬러 콘트라스트를 선사합니다.',
      pros: '투명하고 생생한 자이스 고유의 컬러 렌더링, 수차 없는 대칭형 설계의 정밀한 왜곡 억제력, 조였을 때의 면도날 해상력',
      cons: 'F1.4 최대 개방 시 미세한 구면 수차 및 글로우 현상 발생',
      recommendTo: '원색의 생생한 색감을 선호하는 풍경/인물 포토그래퍼, 기계식 수동 렌즈의 손맛을 즐기는 유저',
      proTip: '💡 [플라나 T* 색감 팁]: 푸른 하늘이나 붉은 노을, 비 온 뒤 젖은 도심의 아스팔트를 담을 때 T* 코팅 고유의 짙은 채도와 투명한 마이크로 콘트라스트가 가장 극적으로 표현됩니다.'
    },
    samples: [],
    blogs: [
      {
        source: '네이버 블로그',
        author: '자이스홀릭',
        title: '콘탁스 칼 자이스 플라나 50mm F1.4 T* 렌즈 리뷰: 투명한 색감의 진수',
        summary: '진득하고 맑은 색감의 대명사. 왜 아직도 많은 이들이 자이스 플라나를 찾는지에 대한 기록.',
        link: 'https://search.naver.com/search.naver?where=blog&query=%EC%9E%90%EC%9D%B4%EC%8A%A4+%ED%94%8C%EB%9D%BC%EB%82%98+50mm+F1.4+%EC%9E%91%EB%A1%80'
      }
    ],
    videos: [
      {
        videoId: 'hSh3zmRps7k',
        channel: '광학의 역사',
        title: '칼 자이스 플라나 50mm F1.4 T* - 표준 렌즈의 절대 기준',
        duration: '16:05',
        views: '조회수 23.9만회',
        thumbnail: 'https://i.ytimg.com/vi/hSh3zmRps7k/hqdefault.jpg',
        link: 'https://www.youtube.com/results?search_query=Carl+Zeiss+Planar+50mm+f1.4+%EC%9E%91%EB%A1%80'
      }
    ]
  },

  '리코 GR III': {
    matchKeys: ['리코 gr3', '리코 gr iii', 'ricoh gr3', 'ricoh gr iii', 'gr3', 'gr iii', '리코gr3'],
    modelName: '리코 GR III (Ricoh GR III)',
    category: '포켓형 하이엔드 APS-C 스냅 카메라',
    sensorSpec: '2,424만 화소 APS-C CMOS | GR LENS 18.3mm f/2.8 (환산 28mm) | 3축 손떨림 보정 | 스냅 초점 모드',
    aiSummary: {
      characteristics: '전 세계 스트리트 포토그래퍼들의 절대적인 지지를 받는 궁극의 스냅 머신. 주머니에서 0.8초 만에 꺼내 반셔터 없이 지정 거리로 즉시 찍는 "스냅 초점(Snap Focus)"과 전설적인 "포지티브 필름(Positive Film)" 색감이 압도적입니다.',
      pros: '청바지 주머니에 들어가는 압도적 휴대성, 환상적인 포지티브 필름 JPEG 색감, 한 손 조작 인터페이스, 센서 시프트 손떨림 보정',
      cons: '내장 뷰파인더/플래시 부재, 짧은 배터리 수명, 방진방적 부재로 센서 먼지 유입 주의 필요',
      recommendTo: '도시 스트리트 스냅, 일상 기록, 카페/여행 사진, 카메라를 매일 주머니에 넣고 다니고 싶은 유저'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "스트리트스냅퍼",
            "title": "리코 GR3 3년 롱텀 실사용기: 포지티브 필름 색감과 스냅 초점 세팅 팁",
            "summary": "포켓에 쏙 들어가는 괴물 스냅 카메라. 일상과 여행에서 담은 무보정 원본 사진과 배터리/먼지 관리 요령.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%A6%AC%EC%BD%94+GR3+%EC%8B%A4%EC%82%AC%EC%9A%A9%EA%B8%B0"
      },
      {
            "source": "네이버 블로그",
            "author": "스냅로그",
            "title": "리코 GR3 vs 후지 X100V: 일상 스냅 카메라 끝판왕 비교 리뷰",
            "summary": "28mm 화각의 광활함과 찰나를 낚아채는 스냅 포커스(Snap Focus)의 실제 체감.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%A6%AC%EC%BD%94+GR3+%ED%9B%84%EC%A7%80+X100V+%EB%B9%84%EA%B5%90"
      }
],
    videos: [
      {
            "videoId": "5kaP_1AUKJA",
            "channel": "순순한리뷰",
            "title": "필름 느낌 감성스냅 사진을 찍어보자. 리코 GR3 리뷰",
            "duration": "15:20",
            "views": "조회수 21.3만회",
            "thumbnail": "https://i.ytimg.com/vi/5kaP_1AUKJA/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=5kaP_1AUKJA"
      },
      {
            "videoId": "CtL9xe0Z8PE",
            "channel": "사작꾼",
            "title": "리코 GR III가 스트릿 카메라인 이유, 아쉬웠던 단점",
            "duration": "18:10",
            "views": "조회수 16.8만회",
            "thumbnail": "https://i.ytimg.com/vi/CtL9xe0Z8PE/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=CtL9xe0Z8PE"
      },
      {
            "videoId": "1jwqiG3s65Y",
            "channel": "필름바이블FilmBible",
            "title": "색감천재 리코GR3 리뷰ㅣ나만의 색감 레시피 공유ㅣ일본 감성 부터 시네마틱 색감까지",
            "duration": "12:45",
            "views": "조회수 28.6만회",
            "thumbnail": "https://i.ytimg.com/vi/1jwqiG3s65Y/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=1jwqiG3s65Y"
      }
]
  },
  '라이카 Q2': {
    matchKeys: ['라이카 q2', 'leica q2', 'q2', '라이카q2'],
    modelName: '라이카 Q2 (Leica Q2)',
    category: '풀프레임 하이엔드 컴팩트 카메라',
    sensorSpec: '4,730만 화소 풀프레임 CMOS | Summilux 28mm f/1.7 ASPH. 렌즈 일체형',
    aiSummary: {
      characteristics: '28mm Summilux 렌즈의 면도날 같은 선예도와 매크로 모드, 라이카 특유의 깊은 마이크로 콘트라스트와 클래식 흑백 계조가 일품인 명기입니다.',
      pros: '환상적인 해상력, IP52 생활방진방적, 4,700만 고화소 기반 35/50/75mm 크롭 줌 모드, 직관적인 기계식 다이얼 조작계',
      cons: '렌즈 교환 불가(28mm 고정), 저조도 실내 AF 워블링, 고가의 정품 배터리 및 부속품',
      recommendTo: '도시 스트리트 스냅, 감성 여행 사진, 건축/풍경, 고화소 단렌즈 하나로 모든 촬영을 끝내고 싶은 유저'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "라이카러버",
            "title": "라이카 Q2 1년 실사용 리뷰: 주미룩스 28mm F1.7 단렌즈 하나로 모든 게 끝나는 이유",
            "summary": "4,730만 화소 센서의 크롭 활용성과 라이카 고유의 묵직한 톤. 일상 스냅과 여행에서의 진가.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%9D%BC%EC%9D%B4%EC%B9%B4+Q2+%EC%8B%A4%EC%82%AC%EC%9A%A9+%EB%A6%AC%EB%B7%B0"
      },
      {
            "source": "네이버 블로그",
            "author": "흑백사진가",
            "title": "라이카 Q2 하이콘트라스트 흑백 세팅과 거리 스냅 작례",
            "summary": "모노크롬 바디 부럽지 않은 깊이 있는 암부 표현력과 F1.7 개방 빛망울 보케 분석.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%9D%BC%EC%9D%B4%EC%B9%B4+Q2+%ED%9D%91%EB%B0%B1+%EC%9E%91%EB%A1%80"
      }
],
    videos: [
      {
            "videoId": "-Rs3OSgl6jI",
            "channel": "Allan Kim",
            "title": "라이카 Q2 - 라이카 일주일만 빌려볼게요 코너 (1/2영상)",
            "duration": "16:20",
            "views": "조회수 38.4만회",
            "thumbnail": "https://i.ytimg.com/vi/-Rs3OSgl6jI/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=-Rs3OSgl6jI"
      },
      {
            "videoId": "Cq-s8So45-U",
            "channel": "Allan Kim",
            "title": "라이카 Q2 가 어울리는 사진, 그렇지 않은 사진",
            "duration": "14:15",
            "views": "조회수 27.9만회",
            "thumbnail": "https://i.ytimg.com/vi/Cq-s8So45-U/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=Cq-s8So45-U"
      },
      {
            "videoId": "_k68Ebvqy9Q",
            "channel": "기즈모 gizmo",
            "title": "팬이 보내주신 라이카 Q2 언박싱",
            "duration": "18:30",
            "views": "조회수 42.1만회",
            "thumbnail": "https://i.ytimg.com/vi/_k68Ebvqy9Q/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=_k68Ebvqy9Q"
      }
]
  },

  '소니 Alpha A7 IV': {
    matchKeys: ['소니 alpha a7 iv', '소니 a7m4', 'a7m4', 'a74', 'a7iv', 'ilce-7m4'],
    modelName: '소니 Alpha A7 IV (ILCE-7M4)',
    category: '풀프레임 올라운더 하이브리드 미러리스',
    sensorSpec: '3,300만 화소 Exmor R BSI CMOS 센서 | BIONZ XR 프로세서 | 759점 위상차 AF',
    aiSummary: {
      characteristics: '사진과 영상의 완벽한 밸런스를 갖춘 글로벌 표준 올라운더. 인물 피부톤을 자연스럽게 살려주는 크리에이티브 룩(FL, IN)과 소니 최상급 리얼타임 Eye-AF가 강점입니다.',
      pros: '압도적인 AF 추적 신뢰도, 풍부한 E마운트 렌즈 생태계, 스위블 터치 LCD, 듀얼 슬롯, 사진/영상 퀵 전환 다이얼',
      cons: '4K 60p 촬영 시 1.5배 Super 35mm 크롭 발생, EVF 해상도는 무난한 수준',
      recommendTo: '웨딩/스튜디오 상업 사진가, 유튜브 영상 제작자, 일상부터 상업까지 1대로 해결하려는 하이브리드 크리에이터'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "사진쟁이",
            "title": "소니 A7M4 실사용 1년차 솔직 후기: 3300만 화소 해상력과 크리에이티브 룩 활용법",
            "summary": "FL, IN 룩 세팅으로 후보정 시간을 80% 줄이는 실전 팁과 리얼타임 AF 추적 신뢰도.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EC%86%8C%EB%8B%88+A7M4+%EC%8B%A4%EC%82%AC%EC%9A%A9+%ED%9B%84%EA%B8%B0"
      },
      {
            "source": "네이버 블로그",
            "author": "빛의기록",
            "title": "소니 A7 IV + 35mm F1.4 GM 조합으로 담은 야경 및 감성 인물 스냅 작례",
            "summary": "사진과 영상 올라운더 바디로서의 성능 실측과 저조도 노이즈 억제력 분석.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EC%86%8C%EB%8B%88+A7M4+%EC%9D%B8%EB%AC%BC+%EC%8A%A4%EB%83%85"
      }
],
    videos: [
      {
            "videoId": "qIsx1zBji9E",
            "channel": "스튜디오ING",
            "title": "여전히 괜찮다 a7m4 리뷰 | 카메라 리뷰",
            "duration": "18:45",
            "views": "조회수 29.3만회",
            "thumbnail": "https://i.ytimg.com/vi/qIsx1zBji9E/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=qIsx1zBji9E"
      },
      {
            "videoId": "pvy8O05XtAM",
            "channel": "사진찍는회계사",
            "title": "Sony A7M4!! 리뷰를 시작합니다! [YK Review]",
            "duration": "21:10",
            "views": "조회수 54.2만회",
            "thumbnail": "https://i.ytimg.com/vi/pvy8O05XtAM/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=pvy8O05XtAM"
      },
      {
            "videoId": "LHd0qygEb6w",
            "channel": "서울리안 SEOULiAN",
            "title": "Sony a7M4: A 3-Week Review: What the Specs Don't Tell You",
            "duration": "15:30",
            "views": "조회수 68.7만회",
            "thumbnail": "https://i.ytimg.com/vi/LHd0qygEb6w/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=LHd0qygEb6w"
      }
]
  },

  '후지필름 X-T5': {
    matchKeys: ['후지필름 x-t5', '후지 x-t5', 'x-t5', 'xt5', '후지필름xt5'],
    modelName: '후지필름 X-T5 (Fujifilm X-T5)',
    category: '클래식 다이얼 플래그십 미러리스 (APS-C)',
    sensorSpec: '4,020만 화소 X-Trans CMOS 5 HR | X-Processor 5 | 최대 7스톱 바디 손떨림 보정',
    aiSummary: {
      characteristics: '보정 없이도 작품이 되는 독보적인 필름 시뮬레이션(클래식 네거티브, 노스탤직 네거티브). 3방향 틸트 액정과 아날로그 셔터 다이얼이 선사하는 특유의 손맛이 뛰어납니다.',
      pros: 'JPEG 직출 색감의 정점, 가볍고 컴팩트한 바디, 1/180,000초 초고속 전자셔터, 우수한 기계식 셔터 손맛',
      cons: '고화소(4000만) 특성상 저조도 고감도 노이즈 제어 주의 필요, 풀프레임 대비 얕은 심도 표현의 한계',
      recommendTo: '일상 감성 스냅, 카페/거리 사진, 보정 작업 없이 바로 사진을 공유하고 싶은 감성파 포토그래퍼'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "후지러버",
            "title": "후지필름 X-T5 6개월 실사용기: 4000만 화소 크롭 바디의 화질과 클래식 네거티브 감성",
            "summary": "3다이얼 아날로그 조작감과 노스탤직 네거티브 필름 시뮬레이션의 감성적인 발색.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%ED%9B%84%EC%A7%80+%ED%95%84%EB%A6%84+XT5+%EC%8B%A4%EC%82%AC%EC%9A%A9%EA%B8%B0"
      },
      {
            "source": "네이버 블로그",
            "author": "골목스냅",
            "title": "후지 X-T5 + XF 33mm F1.4 들고 다녀온 감성 카페 & 골목길 출사 작례 모음",
            "summary": "후지 특유의 녹색·피부톤 렌더링과 일상 스냅에서의 휴대성.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%ED%9B%84%EC%A7%80+XT5+%EC%B6%9C%EC%82%AC+%EC%9E%91%EB%A1%80"
      }
],
    videos: [
      {
            "videoId": "4wkv0yzsFFE",
            "channel": "커민 comyn",
            "title": "후지필름 X-T5 1년 사용기 review",
            "duration": "14:20",
            "views": "조회수 31.5만회",
            "thumbnail": "https://i.ytimg.com/vi/4wkv0yzsFFE/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=4wkv0yzsFFE"
      },
      {
            "videoId": "hLnbxtcdx4E",
            "channel": "스케치리뷰",
            "title": "후지필름 X-T5 언박싱 및 첫인상 / 2주 사용 후기",
            "duration": "16:50",
            "views": "조회수 22.8만회",
            "thumbnail": "https://i.ytimg.com/vi/hLnbxtcdx4E/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=hLnbxtcdx4E"
      },
      {
            "videoId": "JvLBCb3uLw0",
            "channel": "한결 스튜디오",
            "title": "Fuji X-T5 Review (영상의 과거와 현재가 교차하는 순간)",
            "duration": "11:40",
            "views": "조회수 18.2만회",
            "thumbnail": "https://i.ytimg.com/vi/JvLBCb3uLw0/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=JvLBCb3uLw0"
      }
]
  },

  '니콘 FM2': {
    matchKeys: ['니콘 fm2', 'fm2', 'nikon fm2', '니콘fm2'],
    modelName: '니콘 FM2 (Nikon FM2)',
    category: '풀 기계식 35mm 필름 SLR 카메라',
    sensorSpec: '35mm 필름 포맷 | 1/4000초 티타늄/알루미늄 셔터막 | 배터리 무관 물리 기계식 구동',
    aiSummary: {
      characteristics: '카메라 역사상 가장 신뢰받는 100% 완전 기계식 필름 SLR. 배터리가 방전되어도 모든 셔터 스피드가 물리적으로 작동하며, 니콘 수동 렌즈(Nikkor Ai-S)와의 완벽한 짝꿍입니다.',
      pros: '영구적인 내구성, 맑고 청량한 셔터음, 1/4000초 초고속 기계식 셔터, 중고 감가 방어력 최상',
      cons: '100% 수동 초점 및 수동 노출, 노출계 배터리(LR44) 누액 점검 필수, 자동 모드(A모드) 부재',
      recommendTo: '필름 사진 입문자, 필름 카메라 소장가, 아날로그 기계식의 순수한 손맛을 즐기려는 사진 애호가'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "필름로그",
            "title": "필름카메라의 정석 니콘 FM2 입문 및 50mm F1.4 렌즈 조합 1년 출사기",
            "summary": "배터리 없이 작동하는 1/4000초 기계식 셔터의 신뢰도와 코닥 골드 200 현상 스캔 결과물.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%8B%88%EC%BD%98+FM2+%EC%9E%85%EB%AC%B8+%EC%B6%9C%EC%82%AC"
      },
      {
            "source": "네이버 블로그",
            "author": "빈티지클래식",
            "title": "니콘 FM2 중고 구매 시 셔터막 구김, 노출계 작동, 곰팡이 점검 체크리스트",
            "summary": "티타늄 벌집 셔터막 vs 알루미늄 셔터막 구별법과 뷰파인더 먼지 점검 팁.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%8B%88%EC%BD%98+FM2+%EC%A4%91%EA%B3%A0+%EC%B2%B4%ED%81%AC"
      }
],
    videos: [
      {
            "videoId": "WeqQd7oBGvU",
            "channel": "필름찍는기화",
            "title": "니콘 FM2 중고 구매 후기 및 상세한 사용기",
            "duration": "15:50",
            "views": "조회수 39.4만회",
            "thumbnail": "https://i.ytimg.com/vi/WeqQd7oBGvU/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=WeqQd7oBGvU"
      },
      {
            "videoId": "CEwfRhneHA4",
            "channel": "최마태의 POST IT",
            "title": "아날로그 감성을 제대로 느낄 수 있는 니콘 FM2 필드 테스트",
            "duration": "13:40",
            "views": "조회수 28.7만회",
            "thumbnail": "https://i.ytimg.com/vi/CEwfRhneHA4/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=CEwfRhneHA4"
      },
      {
            "videoId": "dudbP-Eq7Lc",
            "channel": "사진찍는자영업자",
            "title": "20여 년간 사용해 온 실사용기를 바탕으로 한 FM2의 역사와 사용법",
            "duration": "19:15",
            "views": "조회수 44.1만회",
            "thumbnail": "https://i.ytimg.com/vi/dudbP-Eq7Lc/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=dudbP-Eq7Lc"
      }
]
  },

  '라이카 M6 클래식': {
    matchKeys: ['라이카 m6', 'm6 클래식', 'leica m6', 'm6', '라이카m6'],
    modelName: '라이카 M6 클래식 (Leica M6 Classic)',
    category: '35mm 레인지파인더(RF) 필름 카메라',
    sensorSpec: '0.72x 배율 RF 뷰파인더 | TTL 내장 노출계 | 황동 기계식 클로스 셔터',
    aiSummary: {
      characteristics: '결정적 순간을 포착하는 레인지파인더(RF)의 영원한 아이콘. 이중합치창을 맞추며 대상과 직접 교감하는 특별한 촬영 방식과 숨소리처럼 조용한 클로스 셔터음이 특징입니다.',
      pros: '최고의 프리미엄 소장 가치, M 마운트 명기 렌즈들과의 완벽한 매칭, 컴팩트한 휴대성, 전설적인 황동 바디의 무게감',
      cons: '높은 중고 시세, 이중합치 상 정렬(세로 오차) 점검 필요, 초점 거리 0.7m 이상 제한',
      recommendTo: '다큐멘터리 스트리트 사진가, 필름 컬렉터, 일생의 단 한 대의 클래식 바디를 소장하려는 애호가'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "M마니아",
            "title": "라이카 M6 클래식 5년간 사용하며 느낀 점과 일포드 HP5 흑백 작례 모음",
            "summary": "찰나를 낚아채는 RF 이중합치 초점의 쾌감과 황동 바디 와인딩 손맛.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%9D%BC%EC%9D%B4%EC%B9%B4+M6+%EC%82%AC%EC%9A%A9%EA%B8%B0"
      },
      {
            "source": "네이버 블로그",
            "author": "필름일기",
            "title": "라이카 M6 + 주미크론 35mm F2 4세대로 기록한 일상 스냅",
            "summary": "코닥 울트라맥스 400 필름과 주미크론의 섬세한 계조 표현이 만들어내는 아날로그 룩.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EB%9D%BC%EC%9D%B4%EC%B9%B4+M6+%EC%9E%91%EB%A1%80"
      }
],
    videos: [
      {
            "videoId": "JK_WRKY1d3A",
            "channel": "최마태의 POST IT",
            "title": "라이카 M6 리뷰 & 도쿄 여행 작례",
            "duration": "17:30",
            "views": "조회수 48.6만회",
            "thumbnail": "https://i.ytimg.com/vi/JK_WRKY1d3A/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=JK_WRKY1d3A"
      },
      {
            "videoId": "kcPQLElQx_w",
            "channel": "analogpaper dotz",
            "title": "LEICA M6 고민하지마시죠. 저도 구매했습니다!",
            "duration": "21:15",
            "views": "조회수 35.2만회",
            "thumbnail": "https://i.ytimg.com/vi/kcPQLElQx_w/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=kcPQLElQx_w"
      },
      {
            "videoId": "3Tp1-Y5LJsQ",
            "channel": "Allan Kim",
            "title": "라이카 M6 필름카메라 예찬 (Leica MP가 있는데 M6를 기추한 이유)",
            "duration": "14:50",
            "views": "조회수 29.8만회",
            "thumbnail": "https://i.ytimg.com/vi/3Tp1-Y5LJsQ/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=3Tp1-Y5LJsQ"
      }
]
  },

  '소니 FE 24-70mm F2.8 GM II': {
    matchKeys: ['소니 fe 24-70mm f2.8 gm ii', '금계륵2', '금계륵 2', '24-70 gm2', '2470gm2', 'sel2470gm2'],
    modelName: '소니 FE 24-70mm F2.8 GM II (금계륵 2)',
    category: '최상급 표준 줌 렌즈 (풀프레임 E-Mount)',
    sensorSpec: 'F2.8 전구간 고정 조리개 | 695g 초경량 설계 (전작 대비 22% 감량) | 4개의 XD 리니어 모터',
    aiSummary: {
      characteristics: '단렌즈 여러 개를 대체할 수 있는 궁극의 표준 줌렌즈. 전 구간에 걸쳐 균일하게 날카로운 해상력과 11매 원형 조리개가 만드는 환상적인 배경 흐림(보케)이 압도적입니다.',
      pros: '동급 최경량(695g), 0.21m 초근접 접사 촬영, 숨막히게 빠른 AF 추적, 조리개 링 탑재',
      cons: '최상급 G Master 렌즈다운 높은 출시 가격',
      recommendTo: '웨딩/이벤트 상업 사진가, 단 하나의 렌즈로 모든 출사를 끝내고 싶은 프로 및 하이 아마추어'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "사진작업실",
            "title": "소니 24-70 GM2 금계륵2 1년 실사용기: 695g 경량화와 단렌즈급 해상력",
            "summary": "무게 695g으로 다이어트 성공한 표준 줌 끝판왕. 조리개 F2.8 전 구간 화질 실측.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EA%B8%88%EA%B3%84%EB%A5%B52+%EC%8B%A4%EC%82%AC%EC%9A%A9%EA%B8%B0"
      },
      {
            "source": "네이버 블로그",
            "author": "스냅스튜디오",
            "title": "소니 FE 24-70mm F2.8 GM II로 담은 웨딩 스냅 및 야외 인물 작례",
            "summary": "XD 리니어 모터의 극강 AF 속도와 11매 원형 조리개 빛망울 보케 퀄리티.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EC%86%8C%EB%8B%88+2470+GM2+%EC%9D%B8%EB%AC%BC+%EC%9E%91%EB%A1%80"
      }
],
    videos: [
      {
            "videoId": "WlVmwHAKAdE",
            "channel": "스트리트POV",
            "title": "소니 금계륵 2 + a7m5 / a7cM2 스트릿 스냅 및 풍경 작례 POV 영상",
            "duration": "12:30",
            "views": "조회수 24.5만회",
            "thumbnail": "https://i.ytimg.com/vi/WlVmwHAKAdE/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=WlVmwHAKAdE"
      },
      {
            "videoId": "3lewwYLiVpg",
            "channel": "OKCUT",
            "title": "소니 FE 24-70mm F2.8 GM II 렌즈 리뷰 | 내돈내산",
            "duration": "19:40",
            "views": "조회수 43.1만회",
            "thumbnail": "https://i.ytimg.com/vi/3lewwYLiVpg/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=3lewwYLiVpg"
      },
      {
            "videoId": "xux0ngt3Np4",
            "channel": "카메라비교소",
            "title": "둘 중에 도대체 뭘 사야하죠? 소니 24-70mm F2.8 GM VS GM2 비교 리뷰",
            "duration": "16:15",
            "views": "조회수 38.7만회",
            "thumbnail": "https://i.ytimg.com/vi/xux0ngt3Np4/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=xux0ngt3Np4"
      }
]
  },

  '캐논 EOS R6 Mark II': {
    matchKeys: ['캐논 eos r6 mark ii', '캐논 r6 mark ii', '캐논 r6m2', 'r6 mark 2', 'r6m2', 'canon r6 mark ii'],
    modelName: '캐논 EOS R6 Mark II',
    category: '풀프레임 하이브리드 고속 연사 미러리스',
    sensorSpec: '2,420만 화소 풀프레임 CMOS | 전자셔터 40fps 초고속 연사 | 6K 오버샘플링 4K 60p 논크롭',
    aiSummary: {
      characteristics: '캐논 특유의 화사하고 생기 넘치는 인물 피부톤과 듀얼 픽셀 CMOS AF II의 정밀한 동체 추적 능력이 돋보이는 바디입니다. 40fps 연사로 결정적 찰나를 놓치지 않습니다.',
      pros: '화사한 인물 색감, 초당 40연사의 속도감, 뛰어난 고감도 저노이즈, 편안하고 깊은 그립감',
      cons: '서드파티 RF 렌즈 라인업이 제한적, 2400만 화소로 대형 인화 시 크롭 여유도는 무난함',
      recommendTo: '웨딩/베이비스냅, 야외 행사, 스포츠 및 반려동물 촬영, 화사한 인물 색감을 선호하는 포토그래퍼'
    },
    samples: [],
    blogs: [
      {
            "source": "네이버 블로그",
            "author": "캐논러버",
            "title": "캐논 EOS R6 Mark II 솔직 후기: 40fps 연사와 화사한 인물 색감",
            "summary": "2420만 화소 6K 오버샘플링 화질과 듀얼픽셀 AF II 추적 성능. 인물 촬영 최고의 바디.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EC%BA%90%EB%85%BC+R6+Mark+II+%EC%8B%A4%EC%82%AC%EC%9A%A9%EA%B8%B0"
      },
      {
            "source": "네이버 블로그",
            "author": "빛을찾아서",
            "title": "캐논 R6 Mark II + RF 50mm F1.2L로 담은 감성 인물 포트레이트 작례",
            "summary": "피부톤을 화사하고 투명하게 살려주는 캐논 발색과 F1.2 개방에서의 크리미한 보케.",
            "link": "https://search.naver.com/search.naver?where=blog&query=%EC%BA%90%EB%85%BC+R6+Mark+II+%EC%9D%B8%EB%AC%BC+%EC%9E%91%EB%A1%80"
      }
],
    videos: [
      {
            "videoId": "_aJnvOeX1-I",
            "channel": "스케치리뷰",
            "title": "아마추어 부터 프로까지 완벽한 카메라 - 캐논 R6Mark2 (R6M2)",
            "duration": "18:50",
            "views": "조회수 35.8만회",
            "thumbnail": "https://i.ytimg.com/vi/_aJnvOeX1-I/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=_aJnvOeX1-I"
      },
      {
            "videoId": "cl4nw_JBYJU",
            "channel": "스튜디오ING",
            "title": "Canon's Standard Camera, R6 Mark II Review",
            "duration": "15:20",
            "views": "조회수 29.4만회",
            "thumbnail": "https://i.ytimg.com/vi/cl4nw_JBYJU/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=cl4nw_JBYJU"
      },
      {
            "videoId": "W3PMLNgScP8",
            "channel": "디그리 DgRy",
            "title": "결국 캐논으로 돌아오는 이유 | EOS R6 Mark 2 리뷰",
            "duration": "16:40",
            "views": "조회수 41.2만회",
            "thumbnail": "https://i.ytimg.com/vi/W3PMLNgScP8/hqdefault.jpg",
            "link": "https://www.youtube.com/watch?v=W3PMLNgScP8"
      }
]
  }
};

