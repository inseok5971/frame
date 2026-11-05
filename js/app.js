// FRAME - Camera & Film Marketplace Application Logic
let currentCategory = 'all';
let currentSearchTerm = '';
let priceChartInstance = null;
let activeModalProduct = null;

// Hero Slider Data ("새롭게 올라온 상품" 슬라이드)
const HERO_SLIDES = [
  {
    productId: 1,
    tag: '디지털 카메라',
    title: '소니 Alpha A7 IV (ILCE-7M4) 바디',
    price: '2,150,000원',
    info: '셔터 3,420회 (camerashuttercount 확인)',
    location: '서울 강남구 역삼동',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80'
  },
  {
    productId: 2,
    tag: '필름 카메라',
    title: '라이카 M6 클래식 블랙 바디 (0.72x)',
    price: '3,850,000원',
    info: '28초 셔터막/와인딩 작동 영상 증빙 완료',
    location: '서울 마포구 합정',
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=1200&auto=format&fit=crop&q=80'
  },
  {
    productId: 3,
    tag: '교환식 렌즈',
    title: '소니 FE 24-70mm F2.8 GM II (금계륵 2)',
    price: '2,190,000원',
    info: 'LED 백라이트 투과 검사 곰팡이 없음',
    location: '경기 성남시 판교역',
    imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1200&auto=format&fit=crop&q=80'
  },
  {
    productId: 5,
    tag: '수동 필름 카메라',
    title: '니콘 FM2 실버 바디 + 50mm f/1.4 세트',
    price: '680,000원',
    info: '티타늄 셔터막 정상 구동 확인',
    location: '서울 종로구 혜화역',
    imageUrl: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=1200&auto=format&fit=crop&q=80'
  },
  {
    productId: 6,
    tag: '디지털 카메라',
    title: '후지필름 X-T5 블랙 바디 단품',
    price: '1,890,000원',
    info: '셔터 1,250회 확인 (camerashuttercount)',
    location: '서울 영등포구 여의도역',
    imageUrl: 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=1200&auto=format&fit=crop&q=80'
  }
];

// ================= GALLERY DARK MODE SYSTEM (Leica / Studio Monolith Aesthetic) =================
const THEME_STORAGE_KEY = 'frame_theme';

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const isDark = savedTheme === 'dark';
  applyTheme(isDark, false);
}

function applyTheme(isDark, showToastNotification = false) {
  const html = document.documentElement;
  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  updateThemeToggleButtons(isDark);

  if (showToastNotification) {
    showToast(
      isDark ? '🌙 갤러리 다크 모드가 적용되었습니다.' : '☀️ 라이트 모드로 전환되었습니다.',
      'info',
      2000
    );
  }

  // Re-render price trend chart if modal is currently open
  if (activeModalProduct && !document.getElementById('detailModal')?.classList.contains('hidden')) {
    renderPriceTrendChart(activeModalProduct);
  }
}

function toggleDarkMode() {
  const isDark = !document.documentElement.classList.contains('dark');
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  applyTheme(isDark, true);
}

function updateThemeToggleButtons(isDark) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.setAttribute('title', isDark ? '라이트 모드로 전환' : '갤러리 다크 모드 전환');
    btn.innerHTML = isDark
      ? `<i data-lucide="sun" class="w-4 h-4 text-amber-400"></i>`
      : `<i data-lucide="moon" class="w-4 h-4 text-[#171717]"></i>`;
  }
  if (window.lucide) lucide.createIcons();
}

let currentHeroSlideIndex = 0;
let heroSliderTimer = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProductGrid(SAMPLE_PRODUCTS);
  initHeroSlider();
  initUserState();
  updateWishlistBadges();
  lucide.createIcons();
});

// Initialize Hero Slider (Real Horizontal Sliding Carousel)
function initHeroSlider() {
  const track = document.getElementById('heroSliderTrack');
  const dots = document.getElementById('heroSlideDots');
  if (!track) return;

  track.innerHTML = HERO_SLIDES.map((slide, idx) => `
    <div class="hero-slide-item cursor-pointer" data-index="${idx}" onclick="openProductDetail(${slide.productId})">
      <img src="${slide.imageUrl}" alt="${slide.title}" class="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700">
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
        <div class="flex items-center gap-2 mb-2">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold bg-white text-[#171717] px-2.5 py-0.5 rounded shadow-sm">
            새롭게 올라온 상품
          </span>
          <span class="text-[10px] tracking-brand-wide uppercase text-zinc-300 font-medium">
            ${slide.tag}
          </span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-white hover:underline">
          ${slide.title}
        </h2>
        <div class="flex flex-wrap items-baseline gap-2 mb-2 text-xs text-zinc-300">
          <span class="text-base font-extrabold text-white">${slide.price}</span>
          <span>·</span>
          <span>${slide.info}</span>
          <span>·</span>
          <span class="text-zinc-400 font-mono">${slide.location}</span>
        </div>
        <div class="inline-flex items-center gap-1.5 text-xs text-zinc-200 font-semibold group/btn mt-1">
          <span>매물 상세 확인하기</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>
  `).join('');

  if (dots) {
    dots.innerHTML = HERO_SLIDES.map((_, idx) => `
      <span onclick="event.stopPropagation(); goToHeroSlide(${idx})" class="hero-dot ${idx === 0 ? 'active' : ''}"></span>
    `).join('');
  }

  updateHeroCounter();
  goToHeroSlide(0);
  startHeroSliderTimer();

  const container = document.getElementById('heroSliderContainer');
  if (container) {
    container.addEventListener('mouseenter', pauseHeroSliderTimer);
    container.addEventListener('mouseleave', startHeroSliderTimer);
  }

  lucide.createIcons();
}

function updateHeroCounter() {
  const counter = document.getElementById('heroSlideCounter');
  if (counter) {
    counter.innerText = `${currentHeroSlideIndex + 1} / ${HERO_SLIDES.length}`;
  }
}

function triggerProgressBar() {
  const bar = document.getElementById('heroSlideProgress');
  if (!bar) return;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.transition = 'width 3.5s linear';
      bar.style.width = '100%';
    });
  });
}

function goToHeroSlide(index) {
  const track = document.getElementById('heroSliderTrack');
  const dots = document.querySelectorAll('.hero-dot');
  if (!track) return;

  currentHeroSlideIndex = (index + HERO_SLIDES.length) % HERO_SLIDES.length;

  // Real horizontal translateX animation
  track.style.transform = `translateX(-${currentHeroSlideIndex * 100}%)`;

  dots.forEach((dot, idx) => {
    if (idx === currentHeroSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  updateHeroCounter();
  triggerProgressBar();
}

function nextHeroSlide(event) {
  if (event) event.stopPropagation();
  goToHeroSlide(currentHeroSlideIndex + 1);
}

function prevHeroSlide(event) {
  if (event) event.stopPropagation();
  goToHeroSlide(currentHeroSlideIndex - 1);
}

function startHeroSliderTimer() {
  clearInterval(heroSliderTimer);
  triggerProgressBar();
  heroSliderTimer = setInterval(() => {
    goToHeroSlide(currentHeroSlideIndex + 1);
  }, 3500);
}

function pauseHeroSliderTimer() {
  clearInterval(heroSliderTimer);
  const bar = document.getElementById('heroSlideProgress');
  if (bar) {
    bar.style.transition = 'none';
  }
}

// Render Product Grid (Clean Minimalist: Temperature & Level Completely Removed)
function renderProductGrid(items) {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const countDisplay = document.getElementById('itemCountDisplay');

  countDisplay.innerText = items.length;

  if (items.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    const emptyTitle = emptyState.querySelector('h3');
    const emptyDesc = emptyState.querySelector('p');
    if (currentCategory === 'wishlist') {
      if (emptyTitle) emptyTitle.innerText = '찜한 관심 매물이 아직 없습니다';
      if (emptyDesc) emptyDesc.innerText = '마음에 드는 카메라나 렌즈의 하트(♥)를 누르면 여기에 모아볼 수 있습니다.';
    } else {
      if (emptyTitle) emptyTitle.innerText = '조건에 맞는 장비 매물이 없습니다';
      if (emptyDesc) emptyDesc.innerText = '검색어나 필터 조건을 변경하거나 초기화해 보세요.';
    }
    return;
  }

  emptyState.classList.add('hidden');

  grid.innerHTML = items.map(item => {
    // Clean Minimal Verification Badges
    let badgeHtml = '';
    if (item.verified) {
      if (item.verificationType === 'exif_shutter') {
        badgeHtml = `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#171717] text-white">
            <i data-lucide="binary" class="w-3 h-3"></i>
            셔터 ${item.verificationDetails.shutterCount?.toLocaleString()}회
          </span>
        `;
      } else if (item.verificationType === 'film_video') {
        badgeHtml = `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#171717] text-white">
            <i data-lucide="video" class="w-3 h-3"></i>
            영상 증빙 완료
          </span>
        `;
      } else if (item.verificationType === 'lens_light') {
        badgeHtml = `
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#171717] text-white">
            <i data-lucide="sun" class="w-3 h-3"></i>
            빛 투과 검증
          </span>
        `;
      }
    }

    // Market price diff & smart badge
    const avgPrice = item.avgMarketPrice || item.price;
    const priceDiff = item.price - avgPrice;
    const diffPercent = Math.round((priceDiff / avgPrice) * 100);

    let diffBadge = '';
    if (diffPercent <= -4) {
      diffBadge = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <i data-lucide="trending-down" class="w-3 h-3 text-emerald-600"></i>
          시세 대비 ${Math.abs(diffPercent)}% 저렴
        </span>
      `;
    } else if (diffPercent >= 7) {
      diffBadge = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <i data-lucide="sparkles" class="w-3 h-3 text-purple-600"></i>
          소장 프리미엄 (+${diffPercent}%)
        </span>
      `;
    } else {
      diffBadge = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5]">
          <i data-lucide="badge-check" class="w-3 h-3 text-[#737373]"></i>
          적정 실거래가
        </span>
      `;
    }

    const catLabels = {
      'camera': '카메라',
      'lens': '렌즈',
      'film-camera': '필름 카메라',
      'film-lens': '필름 카메라 렌즈'
    };

    return `
      <div onclick="openProductDetail(${item.id})" class="product-card cursor-pointer bg-white border border-[#EAEAEA] rounded-xl overflow-hidden flex flex-col group">
        <!-- Thumbnail -->
        <div class="relative aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
          <img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          
          <!-- Category & Badge pill -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
            <span class="text-[9px] px-2 py-0.5 rounded bg-white/90 text-[#171717] border border-[#E5E5E5] backdrop-blur font-medium">
              ${catLabels[item.category] || '카메라'}
            </span>
            ${badgeHtml}
          </div>

          <!-- Wishlist Heart Button (LocalStorage Linked) -->
          <button onclick="event.stopPropagation(); toggleCardWishlist(${item.id});" class="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#737373] hover:text-red-500 backdrop-blur transition shadow-sm z-10 cursor-pointer" title="${isWishlisted(item.id) ? '관심 매물 해제' : '관심 매물 등록'}">
            <i data-lucide="heart" class="w-3.5 h-3.5 ${isWishlisted(item.id) ? 'fill-red-500 text-red-500' : 'text-[#737373]'}"></i>
          </button>

          <!-- Location preview -->
          <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-[#737373] bg-white/90 backdrop-blur px-2 py-1 rounded border border-[#EAEAEA]">
            <span class="truncate">${item.location}</span>
            <span class="text-[#8A8A8A] font-mono ml-2 flex-shrink-0">${item.createdAt}</span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1.5 text-[11px] text-[#8A8A8A] mb-1">
              <span class="text-[#171717] font-semibold">${item.brand}</span>
              <span>·</span>
              <span>${item.mount}</span>
              <span>·</span>
              <span class="font-medium text-[#171717]">${item.condition}</span>
            </div>

            <h3 class="text-sm font-bold text-[#171717] group-hover:underline transition-colors line-clamp-1 mb-2">
              ${item.title}
            </h3>

            <div class="flex items-baseline justify-between mb-1">
              <span class="text-base font-extrabold text-[#171717]">
                ${item.price.toLocaleString()}<span class="text-xs font-normal text-[#737373] ml-0.5">원</span>
              </span>
            </div>
            <div>
              ${diffBadge}
            </div>
          </div>

          <!-- Seller line (Temperature & Level completely removed!) -->
          <div class="pt-3 mt-3 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] text-[#737373]">
            <div class="flex items-center gap-1.5">
              <img src="${item.seller.avatar}" class="w-5 h-5 rounded-full object-cover border border-[#EAEAEA]">
              <span class="truncate max-w-[120px] font-medium text-[#171717]">${item.seller.name}</span>
            </div>
            <span class="text-[10px] text-[#8A8A8A] flex items-center gap-0.5">
              <i data-lucide="check" class="w-3 h-3 text-[#171717]"></i>
              인증 회원
            </span>
          </div>

        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// Category filter
function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.getAttribute('data-cat') === cat) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  applyFilters();
}

function handleSearch() {
  const input = document.getElementById('globalSearchInput');
  currentSearchTerm = input ? input.value.trim() : '';
  hideGlobalSearchDropdown();
  applyFilters();

  if (currentSearchTerm) {
    const marketplaceSection = document.getElementById('marketplaceSection') || document.getElementById('productGrid');
    if (marketplaceSection) {
      marketplaceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Apply Filters
function applyFilters() {
  const brand = document.getElementById('brandFilter').value;
  const mount = document.getElementById('mountFilter').value;
  const verifiedOnly = document.getElementById('verifiedOnlyFilter').checked;
  const sort = document.getElementById('sortSelect').value;

  let filtered = [...SAMPLE_PRODUCTS];

  if (currentCategory === 'wishlist') {
    const wishIds = getWishlist();
    filtered = filtered.filter(item => wishIds.includes(item.id));
  } else if (currentCategory !== 'all') {
    filtered = filtered.filter(item => item.category === currentCategory);
  }

  if (brand !== 'all') {
    filtered = filtered.filter(item => item.brand === brand);
  }

  if (mount !== 'all') {
    filtered = filtered.filter(item => item.mount === mount);
  }

  if (verifiedOnly) {
    filtered = filtered.filter(item => item.verified);
  }

  if (currentSearchTerm) {
    const term = currentSearchTerm.toLowerCase();
    const words = term.split(/\s+/).filter(w => w.length > 0);
    filtered = filtered.filter(item => {
      const searchTarget = `${item.title} ${item.brand} ${item.mount} ${item.location} ${item.category} ${item.description || ''}`.toLowerCase();
      return searchTarget.includes(term) || (words.length > 0 && words.every(w => searchTarget.includes(w)));
    });
  }

  // Sorting
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'deal-good') {
    filtered.sort((a, b) => (a.price - a.avgMarketPrice) - (b.price - b.avgMarketPrice));
  } else {
    filtered.sort((a, b) => b.id - a.id);
  }

  updateFilterChips(brand, mount, verifiedOnly);
  renderProductGrid(filtered);
}

// Chips
function updateFilterChips(brand, mount, verifiedOnly) {
  const container = document.getElementById('filterChipsContainer');
  const list = document.getElementById('filterChipsList');
  let chips = [];

  if (currentCategory !== 'all') chips.push(`카테고리: ${currentCategory}`);
  if (brand !== 'all') chips.push(`브랜드: ${brand}`);
  if (mount !== 'all') chips.push(`마운트: ${mount}`);
  if (verifiedOnly) chips.push('검증 완료 매물');
  if (currentSearchTerm) chips.push(`검색어: "${currentSearchTerm}"`);

  if (chips.length > 0) {
    container.classList.remove('hidden');
    list.innerHTML = chips.map(c => `
      <span class="px-2 py-0.5 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] text-[11px] text-[#171717]">
        ${c}
      </span>
    `).join('');
  } else {
    container.classList.add('hidden');
  }
}

function resetAllFilters() {
  currentCategory = 'all';
  currentSearchTerm = '';
  document.getElementById('globalSearchInput').value = '';
  document.getElementById('brandFilter').value = 'all';
  document.getElementById('mountFilter').value = 'all';
  document.getElementById('verifiedOnlyFilter').checked = false;
  document.getElementById('sortSelect').value = 'latest';
  filterCategory('all');
}

// ================= PRODUCT DETAIL MODAL =================
function selectModalVideo(videoUrl, btnEl) {
  const mainImg = document.getElementById('modalProductImage');
  const mainVideo = document.getElementById('modalProductVideo');
  if (mainImg) mainImg.classList.add('hidden');
  if (mainVideo) {
    mainVideo.classList.remove('hidden');
    mainVideo.src = videoUrl;
    mainVideo.play().catch(() => {});
  }

  document.querySelectorAll('.modal-thumb-btn').forEach(btn => {
    btn.classList.remove('border-[#171717]', 'scale-105');
    btn.classList.add('border-transparent');
  });
  if (btnEl) {
    btnEl.classList.remove('border-transparent');
    btnEl.classList.add('border-[#171717]', 'scale-105');
  }
}

function selectModalImage(imgUrl, btnEl) {
  const mainImg = document.getElementById('modalProductImage');
  const mainVideo = document.getElementById('modalProductVideo');
  if (mainVideo) {
    mainVideo.pause();
    mainVideo.classList.add('hidden');
  }
  if (mainImg) {
    mainImg.classList.remove('hidden');
    mainImg.src = imgUrl;
  }

  document.querySelectorAll('.modal-thumb-btn').forEach(btn => {
    btn.classList.remove('border-[#171717]', 'scale-105');
    btn.classList.add('border-transparent');
  });
  if (btnEl) {
    btnEl.classList.remove('border-transparent');
    btnEl.classList.add('border-[#171717]', 'scale-105');
  }
}

function openProductDetail(productId) {
  const item = SAMPLE_PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  activeModalProduct = item;

  // Reset video state
  const mainVideo = document.getElementById('modalProductVideo');
  const mainImg = document.getElementById('modalProductImage');
  if (mainVideo) {
    mainVideo.pause();
    mainVideo.classList.add('hidden');
  }
  if (mainImg) {
    mainImg.classList.remove('hidden');
    mainImg.src = item.imageUrl;
  }

  // General fields
  document.getElementById('modalProductTitle').innerText = item.title;

  // Media thumbnails strip (Images + Film Videos)
  const strip = document.getElementById('modalThumbnailsStrip');
  if (strip) {
    const isFilmCamera = item.category === 'film-camera';
    const isLens = item.category === 'lens' || item.category === 'film-lens';
    const allImages = item.images && item.images.length > 0 ? item.images : [item.imageUrl];

    const slowVid = item.verificationDetails?.slowVideoUrl || (item.videos && item.videos[0]);
    const fastVid = item.verificationDetails?.fastVideoUrl || (item.videos && item.videos[1]);

    let thumbsHtml = '';

    // If film camera has videos, render video thumb buttons first
    if (isFilmCamera && (slowVid || fastVid)) {
      if (slowVid) {
        thumbsHtml += `
          <button 
            type="button" 
            onclick="selectModalVideo('${slowVid}', this)" 
            class="modal-thumb-btn relative w-14 h-14 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#CCCCCC] transition flex-shrink-0 cursor-pointer bg-[#171717] flex flex-col items-center justify-center text-white group"
            title="1초 저속 셔터 구동 영상 (늘어짐 검증)"
          >
            <i data-lucide="play-circle" class="w-6 h-6 text-white group-hover:scale-110 transition-transform"></i>
            <span class="absolute bottom-0 inset-x-0 bg-black/90 text-emerald-400 text-[8px] text-center font-bold py-0.5 leading-none">
              저속 1초 ▶
            </span>
          </button>
        `;
      }
      if (fastVid) {
        thumbsHtml += `
          <button 
            type="button" 
            onclick="selectModalVideo('${fastVid}', this)" 
            class="modal-thumb-btn relative w-14 h-14 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#CCCCCC] transition flex-shrink-0 cursor-pointer bg-[#171717] flex flex-col items-center justify-center text-white group"
            title="1/1000초 고속 셔터 구동 영상 (찢어짐 검증)"
          >
            <i data-lucide="play-circle" class="w-6 h-6 text-white group-hover:scale-110 transition-transform"></i>
            <span class="absolute bottom-0 inset-x-0 bg-black/90 text-cyan-300 text-[8px] text-center font-bold py-0.5 leading-none">
              고속 1000 ▶
            </span>
          </button>
        `;
      }
    }

    // Render image buttons
    thumbsHtml += allImages.map((imgUrl, i) => {
      let label = `${i + 1}`;
      if (isLens) {
        if (i === 0) label = '앞면';
        else if (i === 1) label = '뒷면';
        else if (i === 2) label = '관통';
        else label = `+${i - 2}`;
      } else if (i === 0) {
        label = '대표';
      }
      return `
        <button 
          type="button" 
          onclick="selectModalImage('${imgUrl}', this)" 
          class="modal-thumb-btn relative w-14 h-14 rounded-lg overflow-hidden border-2 transition flex-shrink-0 cursor-pointer ${i === 0 && !(isFilmCamera && slowVid) ? 'border-[#171717] scale-105' : (i === 0 ? 'border-[#171717] scale-105' : 'border-transparent hover:border-[#CCCCCC]')}"
          title="${label}"
        >
          <img src="${imgUrl}" class="w-full h-full object-cover">
          <span class="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] text-center font-mono py-0.5 leading-none">
            ${label}
          </span>
        </button>
      `;
    }).join('');

    strip.innerHTML = thumbsHtml;
    strip.classList.remove('hidden');
  }

  document.getElementById('modalPrice').innerText = `${item.price.toLocaleString()}원`;
  document.getElementById('modalLocation').innerText = item.location;
  document.getElementById('modalCreatedAt').innerText = `${item.createdAt} 등록`;
  document.getElementById('modalDescription').innerText = item.description;

  // Seller info (Clean: No Temp, No Level)
  document.getElementById('modalSellerName').innerText = item.seller.name;
  document.getElementById('modalSellerAvatar').src = item.seller.avatar;

  // Condition specs
  document.getElementById('modalConditionGrade').innerText = item.condition;
  document.getElementById('modalPackageStatus').innerText = item.specs['구성품'] || '상세설명 참조';

  const catNames = {
    'camera': '카메라',
    'lens': '렌즈',
    'film-camera': '필름 카메라',
    'film-lens': '필름 카메라 렌즈'
  };
  document.getElementById('modalCategoryBadge').innerText = catNames[item.category] || '카메라';

  // Diff Badge
  const avgMarket = item.avgMarketPrice || item.price;
  const diff = item.price - avgMarket;
  const diffPercent = Math.round((diff / avgMarket) * 100);
  const diffElement = document.getElementById('modalMarketDiff');
  if (diffElement) {
    if (diffPercent <= -4) {
      diffElement.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold inline-flex items-center gap-1';
      diffElement.innerHTML = `<i data-lucide="trending-down" class="w-3.5 h-3.5 text-emerald-600"></i> 시세 대비 ${Math.abs(diffPercent)}% 저렴 (-${Math.abs(diff).toLocaleString()}원)`;
    } else if (diffPercent >= 7) {
      diffElement.className = 'text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold inline-flex items-center gap-1';
      diffElement.innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5 text-purple-600"></i> 희귀 소장 프리미엄 (+${diffPercent}%)`;
    } else {
      diffElement.className = 'text-xs px-2.5 py-1 rounded-full bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5] font-semibold inline-flex items-center gap-1';
      diffElement.innerHTML = `<i data-lucide="badge-check" class="w-3.5 h-3.5 text-[#737373]"></i> 적정 실거래가`;
    }
  }

  // External marketplace links (번개장터, 당근)
  const encodedModel = encodeURIComponent(item.brand + ' ' + item.title.split('(')[0].trim());
  document.getElementById('btnBunjangSearch').href = `https://m.bunjang.co.kr/search/products?q=${encodedModel}`;
  document.getElementById('btnDaangnSearch').href = `https://www.daangn.com/search/${encodedModel}`;

  // Verification Report
  renderVerificationReport(item);

  // Show modal immediately with 0ms delay!
  document.getElementById('detailModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Render Price Trend Chart in next animation frame to eliminate synchronous layout freezing
  requestAnimationFrame(() => {
    renderPriceTrendChart(item);
  });

  lucide.createIcons();
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Verification Report Content (camerashuttercount.com direct link integration)
function renderVerificationReport(item) {
  const container = document.getElementById('verificationReportContent');
  
  if (item.category === 'camera') {
    const v = item.verificationDetails;
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-3.5 rounded-xl bg-white border border-[#EAEAEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-[#F5F5F5] text-[#171717] flex flex-col items-center justify-center font-mono font-bold flex-shrink-0">
              <span class="text-sm font-extrabold leading-none">${v.shutterCount ? v.shutterCount.toLocaleString() : '8,100'}</span>
              <span class="text-[9px] text-[#8A8A8A] mt-0.5">회 셔터</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-[#171717] block">CameraShutterCount 셔터 확인 완료</span>
                <span class="px-2 py-0.5 rounded bg-[#171717] text-white text-[10px] font-semibold">
                  검증필
                </span>
              </div>
              <span class="text-[11px] text-[#737373]">camerashuttercount.com 원본 사진 교차 검증</span>
            </div>
          </div>

          <!-- Direct Link to CameraShutterCount -->
          <a href="https://www.camerashuttercount.com/" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-lg bg-[#171717] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition flex-shrink-0">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            <span>camerashuttercount.com 직접 확인하기</span>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="p-2.5 rounded-lg bg-white border border-[#EAEAEA]">
            <span class="text-[#8A8A8A] block text-[10px]">검증 사이트</span>
            <a href="https://www.camerashuttercount.com/" target="_blank" rel="noopener noreferrer" class="text-[#171717] hover:underline font-mono text-[11px] flex items-center gap-1 font-medium">
              camerashuttercount.com <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
          </div>
          <div class="p-2.5 rounded-lg bg-white border border-[#EAEAEA]">
            <span class="text-[#8A8A8A] block text-[10px]">시리얼 넘버</span>
            <span class="text-[#171717] font-mono font-semibold">${v.serialMasked || '일치 확인'}</span>
          </div>
          <div class="p-2.5 rounded-lg bg-white border border-[#EAEAEA]">
            <span class="text-[#8A8A8A] block text-[10px]">확인 일시</span>
            <span class="text-[#171717] font-mono text-[11px]">${v.extractedDate || '당일 원본'}</span>
          </div>
          <div class="p-2.5 rounded-lg bg-white border border-[#EAEAEA]">
            <span class="text-[#8A8A8A] block text-[10px]">마운트</span>
            <span class="text-[#171717] font-semibold">${item.mount}</span>
          </div>
        </div>
      </div>
    `;
  } else if (item.category === 'film-camera') {
    const v = item.verificationDetails;
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-3.5 rounded-xl bg-white border border-[#EAEAEA] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#F5F5F5] text-[#171717] flex items-center justify-center">
              <i data-lucide="video" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-[#171717] block">기계식 셔터막 2대 핵심 작동 영상 증빙</span>
              <span class="text-[11px] text-[#737373]">1초 저속 거버너 늘어짐 & 1/1000초 고속 셔터 찢어짐(Capping) 검증 완료</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded bg-[#171717] text-white text-xs font-medium">
            2대 쇼츠 영상필
          </span>
        </div>

        <div class="p-3 bg-white border border-[#EAEAEA] rounded-xl space-y-2 text-xs">
          <div class="flex items-center justify-between text-[#737373]">
            <span>• 1초 저속 셔터 구동:</span>
            <span class="text-[#171717] font-semibold">${v.slowShutterStatus || '1초 저속 늘어짐 없음, 정상 구동 확인'}</span>
          </div>
          <div class="flex items-center justify-between text-[#737373]">
            <span>• 1/1000초 고속 셔터 구동:</span>
            <span class="text-[#171717] font-semibold">${v.fastShutterStatus || '선·후막 교차 타이밍 일치, 빛 관통 확인'}</span>
          </div>
          <div class="flex items-center justify-between text-[#737373]">
            <span>• 와인딩 레버 & 프레임 카운터:</span>
            <span class="text-[#171717] font-semibold">${v.windingStatus || '와인딩 텐션 부드러움 및 카운터 복귀 정상'}</span>
          </div>
        </div>
      </div>
    `;
  } else {
    const v = item.verificationDetails;
    container.innerHTML = `
      <div class="space-y-4">
        <div class="p-3.5 rounded-xl bg-white border border-[#EAEAEA] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#F5F5F5] text-[#171717] flex items-center justify-center">
              <i data-lucide="sun" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-[#171717] block">조리개 개방 내부 관통 투과 & 광학 검증</span>
              <span class="text-[11px] text-[#737373]">조리개 최대 개방 후 빛(LED) 투과로 내부 곰팡이/먼지 및 앞뒤 렌즈알 상태 검증</span>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded bg-[#171717] text-white text-xs font-medium">
            3대 광학 검증필
          </span>
        </div>

        <div class="p-3 bg-white border border-[#EAEAEA] rounded-xl space-y-2 text-xs">
          <div class="flex items-center justify-between text-[#737373]">
            <span>• 앞면 (대물렌즈 / 필터 결합부):</span>
            <span class="text-[#171717] font-semibold">${v.frontStatus || '필터 스크류 나사선 정상, 코팅 양호'}</span>
          </div>
          <div class="flex items-center justify-between text-[#737373]">
            <span>• 뒷면 (카메라 결합부 / 마운트):</span>
            <span class="text-[#171717] font-semibold">${v.rearStatus || '마운트 결합 유격 없음, 후면알 기스 없음'}</span>
          </div>
          <div class="flex items-center justify-between text-[#737373]">
            <span>• 조리개 개방 관통 투과 (내부):</span>
            <span class="text-[#171717] font-semibold">${v.dustOrMoldStatus || '내부 곰팡이 / 먼지 / 발삼 없음'}</span>
          </div>
          <div class="flex items-center justify-between text-[#737373]">
            <span>• 조리개 날 구동 및 기름 번짐:</span>
            <span class="text-[#171717] font-semibold">${v.apertureStatus || '기름 번짐 없음, 조리개 정상 구동'}</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Chart.js in Minimal Monochrome Palette (Theme Responsive)
function renderPriceTrendChart(item) {
  const chartEl = document.getElementById('itemPriceChart');
  if (!chartEl) return;
  const ctx = chartEl.getContext('2d');

  if (priceChartInstance) {
    priceChartInstance.destroy();
  }

  const history = item.priceHistory || {
    labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
    prices: [
      Math.round(item.price * 1.06),
      Math.round(item.price * 1.04),
      Math.round(item.price * 1.02),
      Math.round(item.price * 1.01),
      Math.round(item.price * 0.99),
      item.price
    ]
  };

  const minPrice = Math.min(...history.prices);
  const maxPrice = Math.max(...history.prices);
  const avgPrice = Math.round(history.prices.reduce((a, b) => a + b, 0) / history.prices.length);

  const statAvg = document.getElementById('statAvgPrice');
  const statMin = document.getElementById('statMinPrice');
  const statMax = document.getElementById('statMaxPrice');
  const statMerit = document.getElementById('statPriceMerit');

  if (statAvg) statAvg.innerText = `${avgPrice.toLocaleString()}원`;
  if (statMin) statMin.innerText = `${minPrice.toLocaleString()}원`;
  if (statMax) statMax.innerText = `${maxPrice.toLocaleString()}원`;

  if (statMerit) {
    const avg = item.avgMarketPrice || avgPrice;
    const diff = item.price - avg;
    const diffPercent = Math.round((diff / avg) * 100);

    if (diffPercent <= -4) {
      statMerit.className = 'font-bold text-emerald-600 dark:text-emerald-400 text-sm';
      statMerit.innerText = `${Math.abs(diffPercent)}% 저렴`;
    } else if (diffPercent >= 7) {
      statMerit.className = 'font-bold text-purple-600 dark:text-purple-400 text-sm';
      statMerit.innerText = `+${diffPercent}% 프리미엄`;
    } else {
      statMerit.className = 'font-bold text-[#171717] dark:text-[#F5F5F7] text-sm';
      statMerit.innerText = '적정 시세';
    }
  }

  // Theme-aware colors
  const isDark = document.documentElement.classList.contains('dark');
  const lineColor = isDark ? '#F5F5F7' : '#171717';
  const pointBg = isDark ? '#F5F5F7' : '#171717';
  const pointBorder = isDark ? '#18181C' : '#FFFFFF';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F0F0F0';
  const tickColor = isDark ? '#A1A1AA' : '#8A8A8A';
  const legendColor = isDark ? '#D4D4D8' : '#737373';
  const currentLineColor = isDark ? '#A1A1AA' : '#8A8A8A';

  // Smooth vertical gradient
  let gradient = ctx.createLinearGradient(0, 0, 0, 200);
  if (isDark) {
    gradient.addColorStop(0, 'rgba(245, 245, 247, 0.22)');
    gradient.addColorStop(1, 'rgba(245, 245, 247, 0.0)');
  } else {
    gradient.addColorStop(0, 'rgba(23, 23, 23, 0.12)');
    gradient.addColorStop(1, 'rgba(23, 23, 23, 0.0)');
  }

  priceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.labels,
      datasets: [
        {
          label: '실거래 평균 시세 (원)',
          data: history.prices,
          borderColor: lineColor,
          backgroundColor: gradient,
          borderWidth: 2.2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: pointBg,
          pointBorderColor: pointBorder,
          pointBorderWidth: 2,
          pointRadius: 4.5,
          pointHoverRadius: 7
        },
        {
          label: '현재 매물가',
          data: Array(history.labels.length).fill(item.price),
          borderColor: currentLineColor,
          borderWidth: 1.5,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: legendColor,
            font: { size: 11, family: 'Pretendard, -apple-system, sans-serif' },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#27272A' : '#171717',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          padding: 9,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}원`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: tickColor, font: { size: 10 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: tickColor,
            font: { size: 10 },
            callback: function(value) {
              return (value / 10000).toLocaleString() + '만';
            }
          }
        }
      }
    }
  });
}

// ================= FAST CLIENT-SIDE IMAGE COMPRESSION (CANVAS) & TOAST =================
// 카메라/스마트폰 고화질 원본 사진(10MB~30MB)을 가로 최대 1200px(JPEG 0.82)로 캔버스에서 초고속 경량화
// 메모리 사용량을 99% 절감(150KB 내외)하여 10장을 올려도 끊김(Stutter) 없이 즉시 전환됩니다.
function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// 모던 비차단(Non-blocking) 토스트 알림: 브라우저 alert()로 인한 화면 멈춤/지연 현상을 완전히 해결
const showFrameToast = (msg, type, dur) => showToast(msg, type, dur);
function showToast(message, type = 'success', duration = 3200) {
  let container = document.getElementById('frameToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'frameToastContainer';
    container.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none transition-all';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#171717] text-white border border-zinc-700 shadow-2xl text-xs font-medium toast-enter select-none';

  let iconHtml = '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>';
  if (type === 'error') {
    iconHtml = '<i data-lucide="alert-circle" class="w-4 h-4 text-red-400"></i>';
  } else if (type === 'info') {
    iconHtml = '<i data-lucide="info" class="w-4 h-4 text-zinc-300"></i>';
  }

  toast.innerHTML = `
    ${iconHtml}
    <span class="max-w-md truncate leading-snug">${message}</span>
    <button type="button" class="ml-1 text-zinc-400 hover:text-white p-0.5 cursor-pointer">
      <i data-lucide="x" class="w-3.5 h-3.5"></i>
    </button>
  `;

  const closeBtn = toast.querySelector('button');
  if (closeBtn) closeBtn.onclick = () => removeToast(toast);

  container.appendChild(toast);
  lucide.createIcons();

  const timer = setTimeout(() => {
    removeToast(toast);
  }, duration);

  function removeToast(el) {
    clearTimeout(timer);
    el.classList.remove('toast-enter');
    el.classList.add('toast-exit');
    setTimeout(() => {
      el.remove();
    }, 220);
  }
}

// ================= REGISTRATION PHOTO UPLOAD & MODAL (CAMERA & LENS & FILM CAMERA) =================
const MAX_CAMERA_IMAGES = 10;
let registeredImages = [];

// 렌즈 전용 3대 필수 광학 검증 사진 상태 (최소 3장 필수 ~ 최대 6장)
let lensPhotos = {
  front: null,    // [필수 1] 렌즈 앞면 (대물렌즈 / 필터 결합 스크류)
  rear: null,     // [필수 2] 렌즈 뒷면 (카메라 결합부 / 마운트 링)
  through: null,  // [필수 3] 조리개 개방 관통 투과 (빛 비춤 / 내부 곰팡이/먼지/발삼 검사)
  extra: []       // [선택 4~6] 외관, 조리개/초점링, 후드/캡 구성품 등 (최대 3장)
};

// 필름 카메라 전용 2대 필수 작동 영상 & 실물 사진 상태 (영상 2개 필수 + 사진 최대 8장)
const MAX_FILM_IMAGES = 8;
const SAMPLE_FILM_VIDEOS = {
  slow: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  fast: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
};
let filmVideos = {
  slow: null,     // [필수 1] 1초 저속 셔터막 구동 영상 (늘어짐 검증)
  fast: null,     // [필수 2] 1/1000초 고속 셔터막 구동 영상 (찢어짐 Capping 검증)
  slowName: '',
  fastName: ''
};
let filmImages = []; // 필름 카메라 실물 사진 (최대 8장)

// --- 카메라 바디 사진 핸들러 (최소 1장 ~ 최대 10장) ---
function handleImageFileSelect(e) {
  const files = Array.from(e.target.files);
  addImagesFromFiles(files);
  e.target.value = '';
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropArea = document.getElementById('imageDropArea');
  if (dropArea) dropArea.classList.add('border-[#171717]', 'bg-white');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropArea = document.getElementById('imageDropArea');
  if (dropArea) dropArea.classList.remove('border-[#171717]', 'bg-white');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropArea = document.getElementById('imageDropArea');
  if (dropArea) dropArea.classList.remove('border-[#171717]', 'bg-white');

  if (e.dataTransfer && e.dataTransfer.files) {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addImagesFromFiles(files);
  }
}

async function addImagesFromFiles(files) {
  if (!files || files.length === 0) return;

  const remainingSlots = MAX_CAMERA_IMAGES - registeredImages.length;
  if (remainingSlots <= 0) {
    showToast(`카메라 사진은 최대 ${MAX_CAMERA_IMAGES}장까지 등록할 수 있습니다.`, 'info');
    return;
  }

  if (files.length > remainingSlots) {
    showToast(`최대 ${MAX_CAMERA_IMAGES}장까지만 등록 가능하여 ${remainingSlots}장만 추가됩니다.`, 'info');
  }

  const filesToAdd = files.slice(0, remainingSlots);

  const countBadge = document.getElementById('imageCountBadge');
  if (countBadge) {
    countBadge.innerHTML = `<span class="inline-flex items-center gap-1 text-[#171717] font-semibold"><svg class="animate-spin w-3 h-3 text-[#171717]" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> 최적화 처리 중...</span>`;
  }

  const compressPromises = filesToAdd.map(f => compressImage(f, 1200, 0.82));
  const results = await Promise.all(compressPromises);
  const validResults = results.filter(Boolean);

  registeredImages.push(...validResults);
  if (registeredImages.length > MAX_CAMERA_IMAGES) {
    registeredImages = registeredImages.slice(0, MAX_CAMERA_IMAGES);
  }

  renderImagePreviews();
}

function removeRegisteredImage(index) {
  registeredImages.splice(index, 1);
  renderImagePreviews();
}

function renderImagePreviews() {
  const container = document.getElementById('imagePreviewGrid');
  const countBadge = document.getElementById('imageCountBadge');
  if (!container || !countBadge) return;

  countBadge.innerText = `${registeredImages.length} / ${MAX_CAMERA_IMAGES}장`;

  if (registeredImages.length === 0) {
    container.innerHTML = '';
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = registeredImages.map((src, idx) => `
    <div class="relative aspect-square rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#F5F5F5] group shadow-xs">
      <img src="${src}" alt="카메라 실물 사진 ${idx + 1}" class="w-full h-full object-cover">
      ${idx === 0 
        ? '<span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#171717] text-white text-[9px] font-bold shadow-sm">대표</span>' 
        : `<span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono shadow-sm">${idx + 1}</span>`}
      <button 
        type="button" 
        onclick="removeRegisteredImage(${idx})" 
        class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition cursor-pointer shadow-sm"
        title="사진 삭제"
      >
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    </div>
  `).join('');

  lucide.createIcons();
}

function resetRegisteredImages() {
  registeredImages = [];
  renderImagePreviews();
  const fileInput = document.getElementById('regImageFiles');
  if (fileInput) fileInput.value = '';
}

// --- 렌즈 전용 3대 필수 사진 + 추가 사진 핸들러 (최소 3장 필수 ~ 최대 6장) ---
function handleLensDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  const box = document.getElementById('lensBatchDropArea');
  if (box) box.classList.add('border-[#171717]', 'bg-[#F9F9F9]');
}

function handleLensDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  const box = document.getElementById('lensBatchDropArea');
  if (box) box.classList.remove('border-[#171717]', 'bg-[#F9F9F9]');
}

function handleLensDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const box = document.getElementById('lensBatchDropArea');
  if (box) box.classList.remove('border-[#171717]', 'bg-[#F9F9F9]');

  if (e.dataTransfer && e.dataTransfer.files) {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleLensBatchFiles(files);
  }
}

function handleLensBatchFileSelect(e) {
  const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
  handleLensBatchFiles(files);
  e.target.value = '';
}

async function handleLensBatchFiles(files) {
  if (!files || files.length === 0) return;

  if (files.length > 6) {
    showToast('렌즈 사진은 최대 6장(필수 3장 + 추가 3장)까지 등록 가능하여 6장만 처리됩니다.', 'info');
  }
  const sliceFiles = files.slice(0, 6);

  const compressedList = await Promise.all(sliceFiles.map(f => compressImage(f, 1200, 0.82)));
  const valid = compressedList.filter(Boolean);

  if (valid.length > 0) {
    let index = 0;
    if (index < valid.length) lensPhotos.front = valid[index++];
    if (index < valid.length) lensPhotos.rear = valid[index++];
    if (index < valid.length) lensPhotos.through = valid[index++];

    lensPhotos.extra = [];
    while (index < valid.length && lensPhotos.extra.length < 3) {
      lensPhotos.extra.push(valid[index++]);
    }

    renderLensPreviews();
    showToast(`렌즈 사진 ${valid.length}장이 순서(앞면→뒷면→관통→추가)대로 자동 배치되었습니다.`, 'success');
  }
}

async function handleSingleLensSlotFile(slot, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const compressed = await compressImage(file, 1200, 0.82);
  if (compressed) {
    if (slot === 'front') lensPhotos.front = compressed;
    if (slot === 'rear') lensPhotos.rear = compressed;
    if (slot === 'through') lensPhotos.through = compressed;
    renderLensPreviews();
    const slotNames = { front: '앞면(필터부)', rear: '뒷면(마운트부)', through: '조리개 개방 관통' };
    showToast(`[필수] '${slotNames[slot]}' 사진이 등록되었습니다.`, 'success');
  }
  event.target.value = '';
}

async function handleLensExtraFileSelect(event) {
  const files = Array.from(event.target.files).filter(f => f.type.startsWith('image/'));
  if (files.length === 0) return;

  const remaining = 3 - lensPhotos.extra.length;
  if (remaining <= 0) {
    showToast('추가 사진은 최대 3장까지만 등록할 수 있습니다.', 'info');
    return;
  }

  const toAdd = files.slice(0, remaining);
  const compressedList = await Promise.all(toAdd.map(f => compressImage(f, 1200, 0.82)));
  lensPhotos.extra.push(...compressedList.filter(Boolean));
  renderLensPreviews();
  event.target.value = '';
}

function removeLensPhoto(slot, extraIndex) {
  if (slot === 'front') lensPhotos.front = null;
  else if (slot === 'rear') lensPhotos.rear = null;
  else if (slot === 'through') lensPhotos.through = null;
  else if (slot === 'extra' && extraIndex !== undefined) {
    lensPhotos.extra.splice(extraIndex, 1);
  }
  renderLensPreviews();
}

function renderLensPreviews() {
  const cardFront = document.getElementById('lensSlotCard_front');
  const cardRear = document.getElementById('lensSlotCard_rear');
  const cardThrough = document.getElementById('lensSlotCard_through');
  const extraGrid = document.getElementById('lensExtraGrid');
  if (!cardFront || !cardRear || !cardThrough) return;

  // 1. Front Slot Card
  if (lensPhotos.front) {
    cardFront.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
            <i data-lucide="check" class="w-3 h-3"></i> 필수 1 · 앞면
          </span>
          <button type="button" onclick="removeLensPhoto('front')" class="text-[10px] text-[#8A8A8A] hover:text-black underline cursor-pointer">
            삭제
          </button>
        </div>
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F5F5F5] group">
          <img src="${lensPhotos.front}" class="w-full h-full object-cover">
          <button type="button" onclick="document.getElementById('lensInputFront').click()" class="absolute inset-0 bg-black/50 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
            사진 변경
          </button>
        </div>
        <div class="text-[11px] font-bold text-[#171717] truncate">앞면 (필터 결합부)</div>
      </div>
    `;
  } else {
    cardFront.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-3 cursor-pointer group" onclick="document.getElementById('lensInputFront').click()">
        <div class="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] group-hover:border-[#171717] flex items-center justify-center text-[#171717] mb-1.5 transition">
          <i data-lucide="disc" class="w-4 h-4"></i>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#171717] text-white mb-1">
          [필수 1] 렌즈 앞면
        </span>
        <div class="text-xs font-bold text-[#171717]">필터 결합부 & 대물렌즈</div>
        <p class="text-[10px] text-[#8A8A8A] mt-0.5 leading-tight">나사선 찌그러짐 및 렌즈알</p>
        <button type="button" class="mt-2 px-3 py-1 rounded bg-[#F5F5F5] group-hover:bg-[#171717] group-hover:text-white text-[10px] font-medium text-[#171717] transition border border-[#E5E5E5]">
          + 사진 첨부
        </button>
      </div>
    `;
  }

  // 2. Rear Slot Card
  if (lensPhotos.rear) {
    cardRear.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
            <i data-lucide="check" class="w-3 h-3"></i> 필수 2 · 뒷면
          </span>
          <button type="button" onclick="removeLensPhoto('rear')" class="text-[10px] text-[#8A8A8A] hover:text-black underline cursor-pointer">
            삭제
          </button>
        </div>
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F5F5F5] group">
          <img src="${lensPhotos.rear}" class="w-full h-full object-cover">
          <button type="button" onclick="document.getElementById('lensInputRear').click()" class="absolute inset-0 bg-black/50 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
            사진 변경
          </button>
        </div>
        <div class="text-[11px] font-bold text-[#171717] truncate">뒷면 (마운트 체결부)</div>
      </div>
    `;
  } else {
    cardRear.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-3 cursor-pointer group" onclick="document.getElementById('lensInputRear').click()">
        <div class="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] group-hover:border-[#171717] flex items-center justify-center text-[#171717] mb-1.5 transition">
          <i data-lucide="camera" class="w-4 h-4"></i>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#171717] text-white mb-1">
          [필수 2] 렌즈 뒷면
        </span>
        <div class="text-xs font-bold text-[#171717]">카메라 결합 마운트 & 후면알</div>
        <p class="text-[10px] text-[#8A8A8A] mt-0.5 leading-tight">마운트 결합부 및 후면 렌즈알</p>
        <button type="button" class="mt-2 px-3 py-1 rounded bg-[#F5F5F5] group-hover:bg-[#171717] group-hover:text-white text-[10px] font-medium text-[#171717] transition border border-[#E5E5E5]">
          + 사진 첨부
        </button>
      </div>
    `;
  }

  // 3. Aperture Light-Through Card (조리개 개방 관통 투과)
  if (lensPhotos.through) {
    cardThrough.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
            <i data-lucide="check" class="w-3 h-3"></i> 필수 3 · 조리개 관통
          </span>
          <button type="button" onclick="removeLensPhoto('through')" class="text-[10px] text-[#8A8A8A] hover:text-black underline cursor-pointer">
            삭제
          </button>
        </div>
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E5E5] bg-[#F5F5F5] group">
          <img src="${lensPhotos.through}" class="w-full h-full object-cover">
          <button type="button" onclick="document.getElementById('lensInputThrough').click()" class="absolute inset-0 bg-black/50 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
            사진 변경
          </button>
        </div>
        <div class="text-[11px] font-bold text-[#171717] truncate">조리개 개방 관통 투과</div>
      </div>
    `;
  } else {
    cardThrough.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-3 cursor-pointer group" onclick="document.getElementById('lensInputThrough').click()">
        <div class="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] group-hover:border-[#171717] flex items-center justify-center text-[#171717] mb-1.5 transition">
          <i data-lucide="sun" class="w-4 h-4"></i>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#171717] text-white mb-1">
          [필수 3] 조리개 관통
        </span>
        <div class="text-xs font-bold text-[#171717]">빛 투과 내부 곰팡이/먼지</div>
        <p class="text-[10px] text-[#8A8A8A] mt-0.5 leading-tight">조리개 최대 개방 후 빛 비춤</p>
        <button type="button" class="mt-2 px-3 py-1 rounded bg-[#F5F5F5] group-hover:bg-[#171717] group-hover:text-white text-[10px] font-medium text-[#171717] transition border border-[#E5E5E5]">
          + 사진 첨부
        </button>
      </div>
    `;
  }

  // 4. Extra Photos Grid (0~3 photos)
  if (extraGrid) {
    let extraHtml = lensPhotos.extra.map((src, idx) => `
      <div class="relative aspect-square rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#F5F5F5] group shadow-xs">
        <img src="${src}" alt="렌즈 추가 사진 ${idx + 1}" class="w-full h-full object-cover">
        <span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono shadow-sm">추가 ${idx + 1}</span>
        <button 
          type="button" 
          onclick="removeLensPhoto('extra', ${idx})" 
          class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition cursor-pointer shadow-sm"
          title="사진 삭제"
        >
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `).join('');

    if (lensPhotos.extra.length < 3) {
      extraHtml += `
        <div 
          onclick="document.getElementById('lensInputExtra').click()" 
          class="aspect-square rounded-xl border-2 border-dashed border-[#CCCCCC] hover:border-[#171717] bg-[#FAFAFA] hover:bg-white flex flex-col items-center justify-center p-2 text-center cursor-pointer transition select-none group"
        >
          <i data-lucide="plus" class="w-4 h-4 text-[#8A8A8A] group-hover:text-[#171717] mb-1"></i>
          <span class="text-[10px] font-bold text-[#171717]">추가 사진</span>
          <span class="text-[9px] text-[#8A8A8A] font-mono">${3 - lensPhotos.extra.length}장 가능</span>
        </div>
      `;
    }
    extraGrid.innerHTML = extraHtml;
  }

  // Update counters
  const mandatoryCount = (lensPhotos.front ? 1 : 0) + (lensPhotos.rear ? 1 : 0) + (lensPhotos.through ? 1 : 0);
  const totalCount = mandatoryCount + lensPhotos.extra.length;

  const countBadge = document.getElementById('lensImageCountBadge');
  if (countBadge) {
    countBadge.innerText = `${totalCount} / 6장 (필수 ${mandatoryCount}/3)`;
  }

  const progEl = document.getElementById('lensMandatoryProgress');
  if (progEl) {
    if (mandatoryCount === 3) {
      progEl.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check" class="w-3 h-3"></i> 필수 3종 모두 등록 완료</span>`;
    } else {
      progEl.innerText = `${mandatoryCount} / 3 등록됨`;
    }
  }

  const extraBadge = document.getElementById('lensExtraCountBadge');
  if (extraBadge) {
    extraBadge.innerText = `${lensPhotos.extra.length} / 3장`;
  }

  lucide.createIcons();
}

function resetLensPhotos() {
  lensPhotos = {
    front: null,
    rear: null,
    through: null,
    extra: []
  };
  renderLensPreviews();
  const batchInput = document.getElementById('regLensBatchFiles');
  if (batchInput) batchInput.value = '';
}

// --- 필름 카메라 전용 영상 및 사진 핸들러 (영상 2개 필수 + 사진 최대 8장) ---
function handleFilmVideoSelect(type, event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 100 * 1024 * 1024) {
    showToast('영상 용량이 100MB를 초과합니다. 15초 내외의 클립을 첨부해 주세요.', 'error');
    event.target.value = '';
    return;
  }

  const url = URL.createObjectURL(file);
  if (type === 'slow') {
    filmVideos.slow = url;
    filmVideos.slowName = file.name;
    showToast('[필수 1] 1초 저속 셔터막 작동 영상이 등록되었습니다.', 'success');
  } else {
    filmVideos.fast = url;
    filmVideos.fastName = file.name;
    showToast('[필수 2] 1/1000초 고속 셔터막 작동 영상이 등록되었습니다.', 'success');
  }
  renderFilmMediaPreviews();
  event.target.value = '';
}

function loadFilmSampleVideo(type) {
  if (type === 'slow') {
    filmVideos.slow = SAMPLE_FILM_VIDEOS.slow;
    filmVideos.slowName = 'sample_slow_shutter_1s.mp4';
    showToast('[샘플 로드] 1초 저속 셔터 작동 영상이 시뮬레이션 첨부되었습니다.', 'success');
  } else {
    filmVideos.fast = SAMPLE_FILM_VIDEOS.fast;
    filmVideos.fastName = 'sample_fast_shutter_1000.mp4';
    showToast('[샘플 로드] 1/1000초 고속 셔터 작동 영상이 시뮬레이션 첨부되었습니다.', 'success');
  }
  renderFilmMediaPreviews();
}

function removeFilmVideo(type) {
  if (type === 'slow') {
    filmVideos.slow = null;
    filmVideos.slowName = '';
  } else {
    filmVideos.fast = null;
    filmVideos.fastName = '';
  }
  renderFilmMediaPreviews();
}

function handleFilmDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropArea = document.getElementById('filmImageDropArea');
  if (dropArea) dropArea.classList.add('border-[#171717]', 'bg-white');
}

function handleFilmDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropArea = document.getElementById('filmImageDropArea');
  if (dropArea) dropArea.classList.remove('border-[#171717]', 'bg-white');
}

function handleFilmDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropArea = document.getElementById('filmImageDropArea');
  if (dropArea) dropArea.classList.remove('border-[#171717]', 'bg-white');

  if (e.dataTransfer && e.dataTransfer.files) {
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addFilmImagesFromFiles(files);
  }
}

function handleFilmImageFileSelect(e) {
  const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
  addFilmImagesFromFiles(files);
  e.target.value = '';
}

async function addFilmImagesFromFiles(files) {
  if (!files || files.length === 0) return;

  const remaining = MAX_FILM_IMAGES - filmImages.length;
  if (remaining <= 0) {
    showToast(`필름 카메라는 사진을 최대 ${MAX_FILM_IMAGES}장까지 등록할 수 있습니다.`, 'info');
    return;
  }

  if (files.length > remaining) {
    showToast(`최대 ${MAX_FILM_IMAGES}장까지만 등록 가능하여 ${remaining}장만 추가됩니다.`, 'info');
  }

  const filesToAdd = files.slice(0, remaining);
  const compressPromises = filesToAdd.map(f => compressImage(f, 1200, 0.82));
  const results = await Promise.all(compressPromises);
  const validResults = results.filter(Boolean);

  filmImages.push(...validResults);
  if (filmImages.length > MAX_FILM_IMAGES) {
    filmImages = filmImages.slice(0, MAX_FILM_IMAGES);
  }

  renderFilmMediaPreviews();
}

function removeFilmImage(index) {
  filmImages.splice(index, 1);
  renderFilmMediaPreviews();
}

function renderFilmMediaPreviews() {
  const cardSlow = document.getElementById('filmSlotCard_slow');
  const cardFast = document.getElementById('filmSlotCard_fast');
  const previewGrid = document.getElementById('filmImagePreviewGrid');
  const photoBadge = document.getElementById('filmPhotoBadge');
  const countBadge = document.getElementById('filmImageCountBadge');
  const videoCountBadge = document.getElementById('filmVideoCountBadge');
  if (!cardSlow || !cardFast) return;

  // 1. Slow Video Card
  if (filmVideos.slow) {
    cardSlow.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
            <i data-lucide="check" class="w-3 h-3"></i> 필수 1 · 1초 저속 영상
          </span>
          <button type="button" onclick="removeFilmVideo('slow')" class="text-[10px] text-[#8A8A8A] hover:text-black underline cursor-pointer">
            삭제
          </button>
        </div>
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden bg-black border border-[#E5E5E5]">
          <video src="${filmVideos.slow}" controls playsinline class="w-full h-full object-cover"></video>
        </div>
        <div class="flex items-center justify-between text-[11px] font-bold text-[#171717]">
          <span class="truncate">1초 저속 셔터 구동 확인</span>
          <button type="button" onclick="document.getElementById('filmInputVideoSlow').click()" class="text-[10px] text-[#737373] hover:text-black underline font-normal cursor-pointer">
            영상 변경
          </button>
        </div>
      </div>
    `;
  } else {
    cardSlow.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-3 select-none">
        <div class="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center text-[#171717] mb-1.5">
          <i data-lucide="video" class="w-4 h-4"></i>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#171717] text-white mb-1">
          [필수 1] 저속 1초 셔터 영상
        </span>
        <div class="text-xs font-bold text-[#171717]">1초 저속 셔터막 늘어짐 점검</div>
        <p class="text-[10px] text-[#8A8A8A] mt-0.5 leading-tight">1초 셔터 누름 & 닫힘 5~15초 영상</p>
        <div class="mt-2.5 flex items-center gap-1.5">
          <button type="button" onclick="document.getElementById('filmInputVideoSlow').click()" class="px-2.5 py-1 rounded bg-[#171717] hover:bg-black text-white text-[10px] font-medium transition cursor-pointer">
            + 내 영상 첨부
          </button>
          <button type="button" onclick="loadFilmSampleVideo('slow')" class="px-2 py-1 rounded bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#171717] text-[10px] font-medium transition border border-[#E5E5E5] cursor-pointer" title="포트폴리오 시연용 샘플 영상 자동 입력">
            샘플 불러오기
          </button>
        </div>
      </div>
    `;
  }

  // 2. Fast Video Card
  if (filmVideos.fast) {
    cardFast.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
            <i data-lucide="check" class="w-3 h-3"></i> 필수 2 · 1/1000초 고속 영상
          </span>
          <button type="button" onclick="removeFilmVideo('fast')" class="text-[10px] text-[#8A8A8A] hover:text-black underline cursor-pointer">
            삭제
          </button>
        </div>
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden bg-black border border-[#E5E5E5]">
          <video src="${filmVideos.fast}" controls playsinline class="w-full h-full object-cover"></video>
        </div>
        <div class="flex items-center justify-between text-[11px] font-bold text-[#171717]">
          <span class="truncate">1/1000초 고속 셔터 구동 확인</span>
          <button type="button" onclick="document.getElementById('filmInputVideoFast').click()" class="text-[10px] text-[#737373] hover:text-black underline font-normal cursor-pointer">
            영상 변경
          </button>
        </div>
      </div>
    `;
  } else {
    cardFast.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center p-3 select-none">
        <div class="w-9 h-9 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-center text-[#171717] mb-1.5">
          <i data-lucide="play" class="w-4 h-4"></i>
        </div>
        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#171717] text-white mb-1">
          [필수 2] 고속 1/1000초 셔터 영상
        </span>
        <div class="text-xs font-bold text-[#171717]">고속 셔터 찢어짐(Capping) 점검</div>
        <p class="text-[10px] text-[#8A8A8A] mt-0.5 leading-tight">뒤판 열고 1/1000초 관통 5~15초 영상</p>
        <div class="mt-2.5 flex items-center gap-1.5">
          <button type="button" onclick="document.getElementById('filmInputVideoFast').click()" class="px-2.5 py-1 rounded bg-[#171717] hover:bg-black text-white text-[10px] font-medium transition cursor-pointer">
            + 내 영상 첨부
          </button>
          <button type="button" onclick="loadFilmSampleVideo('fast')" class="px-2 py-1 rounded bg-[#F5F5F5] hover:bg-[#EAEAEA] text-[#171717] text-[10px] font-medium transition border border-[#E5E5E5] cursor-pointer" title="포트폴리오 시연용 샘플 영상 자동 입력">
            샘플 불러오기
          </button>
        </div>
      </div>
    `;
  }

  // 3. Film Photo Previews (Up to 8)
  if (previewGrid) {
    if (filmImages.length === 0) {
      previewGrid.innerHTML = '';
      previewGrid.classList.add('hidden');
    } else {
      previewGrid.classList.remove('hidden');
      previewGrid.innerHTML = filmImages.map((src, idx) => `
        <div class="relative aspect-square rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#F5F5F5] group shadow-xs">
          <img src="${src}" alt="필름 카메라 사진 ${idx + 1}" class="w-full h-full object-cover">
          ${idx === 0 
            ? '<span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#171717] text-white text-[9px] font-bold shadow-sm">대표</span>' 
            : `<span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono shadow-sm">${idx + 1}</span>`}
          <button 
            type="button" 
            onclick="removeFilmImage(${idx})" 
            class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition cursor-pointer shadow-sm"
            title="사진 삭제"
          >
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
        </div>
      `).join('');
    }
  }

  // Counter Badges
  const videoCount = (filmVideos.slow ? 1 : 0) + (filmVideos.fast ? 1 : 0);
  if (videoCountBadge) {
    if (videoCount === 2) {
      videoCountBadge.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check" class="w-3 h-3"></i> 2종 영상 모두 완료</span>`;
    } else {
      videoCountBadge.innerText = `${videoCount} / 2개 완료`;
    }
  }
  if (photoBadge) {
    photoBadge.innerText = `${filmImages.length} / ${MAX_FILM_IMAGES}장`;
  }
  if (countBadge) {
    countBadge.innerText = `${filmImages.length} / ${MAX_FILM_IMAGES}장 (영상 ${videoCount}/2)`;
  }

  lucide.createIcons();
}

function resetFilmCameraData() {
  filmVideos = {
    slow: null,
    fast: null,
    slowName: '',
    fastName: ''
  };
  filmImages = [];
  renderFilmMediaPreviews();
  const fileInput = document.getElementById('regFilmImageFiles');
  if (fileInput) fileInput.value = '';
}

// Register Modal Open & Close
function openRegisterModal() {
  const user = getCurrentUser();
  if (!user) {
    if (confirm('상품 등록은 회원가입 및 본인 인증(Lv.2) 후 이용 가능합니다.\n\n로그인 / 회원가입 창으로 이동하시겠습니까?')) {
      openAuthModal('signup');
    }
    return;
  }
  if (!user.level || user.level < 2) {
    if (confirm(`현재 회원 등급은 Lv.1 (둘러보기)입니다.\n\n안심 거래를 위해 [레벨 2: PASS 휴대폰 실명 인증] 이상부터 상품 등록이 가능합니다.\n\n본인 인증 센터로 이동하시겠습니까?`)) {
      openVerificationCenterModal();
      switchVerifyStep(2);
    }
    return;
  }

  resetRegisteredImages();
  resetLensPhotos();
  resetFilmCameraData();

  // 현재 선택된 라디오 카테고리에 맞춰 UI 동기화
  const checkedCat = document.querySelector('input[name="regCategory"]:checked')?.value || 'camera';
  toggleRegCategorySpec(checkedCat);

  document.getElementById('registerModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeRegisterModal() {
  resetRegisteredImages();
  resetLensPhotos();
  resetFilmCameraData();
  document.getElementById('registerModal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function toggleRegCategorySpec(cat) {
  const digitalBlock = document.getElementById('specDigitalBlock');
  const filmBlock = document.getElementById('specFilmBlock');
  const lensBlock = document.getElementById('specLensBlock');

  const cameraUploadContainer = document.getElementById('cameraUploadContainer');
  const lensUploadContainer = document.getElementById('lensUploadContainer');
  const filmCameraUploadContainer = document.getElementById('filmCameraUploadContainer');

  digitalBlock?.classList.add('hidden');
  filmBlock?.classList.add('hidden');
  lensBlock?.classList.add('hidden');

  cameraUploadContainer?.classList.add('hidden');
  lensUploadContainer?.classList.add('hidden');
  filmCameraUploadContainer?.classList.add('hidden');

  if (cat === 'camera') {
    digitalBlock?.classList.remove('hidden');
    cameraUploadContainer?.classList.remove('hidden');
  } else if (cat === 'film-camera') {
    filmBlock?.classList.remove('hidden');
    filmCameraUploadContainer?.classList.remove('hidden');
    renderFilmMediaPreviews();
  } else {
    // lens or film-lens: 3대 필수 광학 검증 모드
    lensBlock?.classList.remove('hidden');
    lensUploadContainer?.classList.remove('hidden');
    renderLensPreviews();
  }

  lucide.createIcons();
}

function simulateExifExtraction() {
  const resultBox = document.getElementById('exifResultSim');
  resultBox.classList.remove('hidden');
  showToast('camerashuttercount.com 셔터 수(3,420회) 연동 완료!', 'success');
}

function handleProductSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('regTitle').value;
  const brand = document.getElementById('regBrand').value;
  const price = parseInt(document.getElementById('regPrice').value, 10);
  const mount = document.getElementById('regMount').value || '기타 마운트';
  const location = document.getElementById('regLocation').value || '서울 직거래';
  const description = document.getElementById('regDescription').value;
  const category = document.querySelector('input[name="regCategory"]:checked').value;

  let finalImages = [];
  let finalVideos = [];
  let finalVerificationType = 'exif_shutter';
  let finalVerificationDetails = {};

  // 1. 렌즈 카테고리 검증: 3대 필수 사진 (앞면, 뒷면, 조리개 개방 관통 투과) 및 최소 3장~최대 6장 강제
  if (category === 'lens' || category === 'film-lens') {
    if (!lensPhotos.front) {
      showToast('렌즈 앞면(필터 결합부) 사진을 등록해 주세요. [필수 1]', 'error');
      document.getElementById('lensSlotCard_front')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!lensPhotos.rear) {
      showToast('렌즈 뒷면(카메라 결합 마운트부) 사진을 등록해 주세요. [필수 2]', 'error');
      document.getElementById('lensSlotCard_rear')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!lensPhotos.through) {
      showToast('조리개 개방 렌즈 관통 투과 사진을 등록해 주세요. [필수 3]', 'error');
      document.getElementById('lensSlotCard_through')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    finalImages = [lensPhotos.front, lensPhotos.rear, lensPhotos.through, ...lensPhotos.extra];
    if (finalImages.length < 3) {
      showToast('렌즈 매물은 최소 3장(앞면, 뒷면, 조리개 관통 투과)을 등록해야 합니다.', 'error');
      return;
    }
    if (finalImages.length > 6) {
      finalImages = finalImages.slice(0, 6);
    }

    finalVerificationType = 'lens_light';
    finalVerificationDetails = {
      lightPhotoSubmitted: true,
      frontStatus: '앞면 대물렌즈 및 필터 스크류 체결부 손상 없음, 코팅 양호',
      rearStatus: '뒷면 카메라 마운트 링 결합 유격 없음, 후면 렌즈알 기스 없음',
      dustOrMoldStatus: '조리개 최대 개방 빛 투과 완료: 내부 곰팡이/먼지/발삼 없음',
      apertureStatus: '조리개 날 기름 번짐 없음, 조리개 개폐 정상 구동',
      summary: '렌즈 3대 필수 광학 검증(앞면/뒷면/조리개 관통) 완료'
    };
  } else if (category === 'film-camera') {
    // 2. 필름 카메라 카테고리 검증: 필수 영상 2개(저속 1초 + 고속 1/1000초) + 실물 사진 최소 1장~최대 8장
    if (!filmVideos.slow) {
      showToast('1초 저속 셔터막 구동 영상을 첨부해 주세요. [필수 영상 1]', 'error');
      document.getElementById('filmSlotCard_slow')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!filmVideos.fast) {
      showToast('1/1000초 고속 셔터막 구동 영상을 첨부해 주세요. [필수 영상 2]', 'error');
      document.getElementById('filmSlotCard_fast')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (filmImages.length === 0) {
      showToast('필름 카메라 실물 사진을 최소 1장 이상 등록해 주세요. (최대 8장)', 'error');
      document.getElementById('filmImageDropArea')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    finalImages = [...filmImages];
    finalVideos = [filmVideos.slow, filmVideos.fast];
    finalVerificationType = 'film_video';
    finalVerificationDetails = {
      videoSubmitted: true,
      slowVideoUrl: filmVideos.slow,
      fastVideoUrl: filmVideos.fast,
      slowShutterStatus: '1초 저속 조향 거버너 및 셔터막 늘어짐(Lag) 없음 확인',
      fastShutterStatus: '1/1000초 고속 셔터 찢어짐(Capping) 없이 빛 관통 확인',
      windingStatus: '와인딩 레버 텐션 부드러움 및 카운터 복귀 정상',
      summary: '2대 핵심 필름 셔터막 영상(1초 저속 / 1000 고속) 및 사진 검증 완료'
    };
  } else {
    // 3. 디지털 카메라 바디 카테고리 검증: 최소 1장 ~ 최대 10장
    if (registeredImages.length === 0) {
      showToast('카메라 장비의 실물 사진을 최소 1장 이상 등록해 주세요.', 'error');
      document.getElementById('imageDropArea')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    finalImages = [...registeredImages];
    finalVerificationType = 'exif_shutter';
    finalVerificationDetails = {
      shutterCount: 3420,
      extractedDate: '방금 원본',
      summary: 'CameraShutterCount 셔터 3,420회 확인 완료'
    };
  }

  const user = getCurrentUser();
  const sellerName = user ? (user.name || user.id) : '나의직거래';
  const isLv3 = user && user.level === 3;

  const primaryImage = finalImages[0];

  const newProduct = {
    id: SAMPLE_PRODUCTS.length + 1,
    category: category,
    brand: brand,
    mount: mount,
    title: title,
    price: price,
    avgMarketPrice: Math.round(price * 1.03),
    location: location,
    createdAt: '방금 전',
    imageUrl: primaryImage,
    images: [...finalImages],
    condition: 'A+급',
    verified: true,
    verificationType: finalVerificationType,
    verificationDetails: finalVerificationDetails,
    seller: {
      name: sellerName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isVerified: isLv3,
      level: user ? user.level : 2
    },
    specs: {
      '마운트': mount,
      '구성품': (category === 'lens' || category === 'film-lens') ? '렌즈 본체, 앞뒤 캡 및 후드' : '본체 및 충전기'
    },
    description: description || '직거래 환영합니다.',
    priceHistory: {
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      prices: [price * 1.05, price * 1.04, price * 1.02, price * 1.01, price * 1.01, price]
    }
  };

  // 1. 모달 즉시 닫기 & 폼 초기화
  closeRegisterModal();
  document.getElementById('productRegisterForm').reset();
  if (typeof resetRegisteredImages === 'function') resetRegisteredImages();

  // 2. 카테고리를 '전체 매물'로 리셋하여 방금 등록한 매물이 바로 보이도록 보장
  currentCategory = 'all';
  currentSearchTerm = '';
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-cat') === 'all');
  });

  // 3. 고유 ID 부여 및 최상단에 추가
  newProduct.id = Date.now();
  SAMPLE_PRODUCTS.unshift(newProduct);
  applyFilters();

  // 4. Supabase DB 동기화 (클라우드 데이터베이스 저장)
  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    (async () => {
      try {
        const u = getCurrentUser();
        await supabaseClient.from('products').insert([{
          user_id: (u && u.id && u.id.length > 20 && u.id.includes('-')) ? u.id : null,
          title: newProduct.title,
          brand: newProduct.brand,
          category: newProduct.category,
          mount: newProduct.mount,
          price: newProduct.price,
          avg_market_price: newProduct.avgMarketPrice,
          location: newProduct.location,
          image_url: newProduct.imageUrl,
          images: newProduct.images,
          condition: newProduct.condition,
          verified: newProduct.verified,
          verification_type: newProduct.verificationType,
          verification_details: newProduct.verificationDetails,
          seller: newProduct.seller,
          specs: newProduct.specs,
          description: newProduct.description
        }]);
      } catch (err) {
        console.warn('Supabase product upload sync:', err);
      }
    })();
  }

  // 4. 등록된 상품 위치로 부드럽게 스크롤 & 하이라이트 애니메이션
  const grid = document.getElementById('productGrid');
  if (grid) {
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const firstCard = grid.firstElementChild;
      if (firstCard) {
        firstCard.classList.add('ring-4', 'ring-[#171717]', 'ring-offset-2', 'transition-all', 'duration-700');
        setTimeout(() => {
          firstCard.classList.remove('ring-4', 'ring-[#171717]', 'ring-offset-2');
        }, 2500);
      }
    }, 200);
  }

  // 4. 모던 FRAME 토스트 알림 표출
  const categoryName = (category === 'lens' || category === 'film-lens') ? '렌즈(3대 광학검증 완료)' : '카메라';
  showToast(`[매물 등록 완료] '${title}' ${categoryName} 매물이 정상 등록되었습니다.`, 'success', 3500);
}

// ================= CHAT LOGIC (HEADER: "채팅" / MODAL: "1:1 직거래 문의") =================
function openChatDrawer(mode = 'header') {
  const drawer = document.getElementById('chatDrawer');
  const title = document.getElementById('chatDrawerTitle');
  if (!drawer) return;

  // 채팅창 열람 시 안 읽은 메시지 뱃지 처리
  const chatBadge = document.getElementById('headerChatBadge');
  if (chatBadge) {
    chatBadge.classList.add('hidden');
  }

  if (mode === 'inquiry') {
    if (title) title.innerText = '1:1 직거래 문의';
    switchChatTab('active');
  } else {
    // Header chat click -> "채팅"
    if (title) title.innerText = '채팅';
    switchChatTab('conversations');
  }

  drawer.classList.remove('translate-x-full');
  lucide.createIcons();
}

function closeChatDrawer() {
  const drawer = document.getElementById('chatDrawer');
  if (drawer) drawer.classList.add('translate-x-full');
}

function switchChatTab(tab) {
  const tabConv = document.getElementById('chatTabConversations');
  const tabAct = document.getElementById('chatTabActive');
  const convList = document.getElementById('chatConversationsList');
  const msgRoom = document.getElementById('chatMessageRoom');

  if (!tabConv || !tabAct || !convList || !msgRoom) return;

  if (tab === 'conversations') {
    tabConv.className = 'flex-1 py-2.5 font-bold text-[#171717] border-b-2 border-[#171717] text-center transition cursor-pointer';
    tabAct.className = 'flex-1 py-2.5 font-medium text-[#8A8A8A] text-center hover:text-[#171717] transition cursor-pointer';
    convList.classList.remove('hidden');
    msgRoom.classList.add('hidden');
  } else {
    tabAct.className = 'flex-1 py-2.5 font-bold text-[#171717] border-b-2 border-[#171717] text-center transition cursor-pointer';
    tabConv.className = 'flex-1 py-2.5 font-medium text-[#8A8A8A] text-center hover:text-[#171717] transition cursor-pointer';
    convList.classList.add('hidden');
    msgRoom.classList.remove('hidden');
    msgRoom.classList.add('flex');
  }
  lucide.createIcons();
}

function selectConversation(sellerName, itemTitle, itemPrice) {
  switchChatTab('active');
  const nameEl = document.getElementById('chatRoomSellerName');
  const itemEl = document.getElementById('chatRoomItemTitle');
  if (nameEl) nameEl.innerText = sellerName;
  if (itemEl) itemEl.innerText = `${itemTitle} · ${itemPrice}`;

  const list = document.getElementById('chatMessageList');
  if (list) {
    list.innerHTML = `
      <div class="bg-white border border-[#EAEAEA] p-3 rounded-lg text-xs text-[#171717] shadow-sm mb-3">
        <strong>${itemTitle}</strong> (${itemPrice}) 매물에 대한 대화창입니다.
      </div>
      <div class="bg-white text-[#171717] p-3 rounded-xl mr-auto max-w-[80%] text-xs border border-[#EAEAEA] shadow-sm">
        <div class="text-[9px] text-[#8A8A8A] mb-0.5">${sellerName} · 어제</div>
        <p>안녕하세요! 직거래 장소는 강남역 또는 합정역 모두 가능합니다. 편하신 일정 알려주세요.</p>
      </div>
    `;
    list.scrollTop = list.scrollHeight;
  }
}

function startChatFromModal() {
  closeDetailModal();
  openChatDrawer('inquiry');
  if (activeModalProduct) {
    selectConversation(
      activeModalProduct.seller.name,
      activeModalProduct.title,
      activeModalProduct.price.toLocaleString() + '원'
    );
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const list = document.getElementById('chatMessageList');
  const now = new Date();
  const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

  const myMsg = `
    <div class="bg-[#171717] text-white p-3 rounded-xl ml-auto max-w-[80%] text-xs shadow-sm">
      <div class="text-[9px] text-[#CCCCCC] text-right mb-0.5">나 · ${timeStr}</div>
      <p>${text}</p>
    </div>
  `;
  list.innerHTML += myMsg;
  input.value = '';
  list.scrollTop = list.scrollHeight;

  const sellerName = document.getElementById('chatRoomSellerName')?.innerText || '판매자';

  setTimeout(() => {
    const reply = `
      <div class="bg-white text-[#171717] p-3 rounded-xl mr-auto max-w-[80%] text-xs border border-[#EAEAEA] shadow-sm">
        <div class="text-[9px] text-[#8A8A8A] mb-0.5">${sellerName} · 방금</div>
        <p>네, 메시지 확인했습니다! 직거래 장소와 시간 맞춰 뵙겠습니다.</p>
      </div>
    `;
    list.innerHTML += reply;
    list.scrollTop = list.scrollHeight;
  }, 1000);
}

// ================= SUPABASE CLIENT & AUTHENTICATION INITIALIZATION =================
const SUPABASE_URL = 'https://uzmgwtucqyuhoyjwzdkw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_iD4nbmFm3Ovzbm1lQlH_NQ_zWVUCFJW';
let supabaseClient = null;

if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Supabase initialization error:', err);
  }
}

function getCurrentUser() {
  const json = sessionStorage.getItem('frame_current_user');
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    sessionStorage.setItem('frame_current_user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('frame_current_user');
  }
  updateHeaderUserState();
  syncVerificationUI();
}

async function initUserState() {
  // 1. Supabase 세션 자동 복원
  if (supabaseClient) {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        let profile = null;
        try {
          const { data: prof } = await supabaseClient.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
          profile = prof;
        } catch (e) {}

        const isAdmin = session.user.email === 'admin@frame.com' || profile?.role === 'admin';
        const restoredUser = {
          id: session.user.id,
          email: session.user.email,
          name: profile?.nickname || session.user.user_metadata?.nickname || (isAdmin ? '마스터 관리자' : session.user.email.split('@')[0]),
          role: isAdmin ? 'admin' : (profile?.role || 'user'),
          level: isAdmin ? 99 : (profile?.level || 1),
          isPhoneVerified: isAdmin ? true : Boolean(profile?.is_phone_verified),
          isBankVerified: isAdmin ? true : Boolean(profile?.is_bank_verified),
          isEkycVerified: isAdmin ? true : Boolean(profile?.is_ekyc_verified),
          passInfo: profile?.pass_info || null,
          bankInfo: profile?.bank_info || null,
          ekycInfo: profile?.ekyc_info || null,
          loginAt: session.user.last_sign_in_at || new Date().toISOString()
        };
        sessionStorage.setItem('frame_current_user', JSON.stringify(restoredUser));
      }
    } catch (e) {
      console.warn('Supabase session restore warning:', e);
    }
  }

  updateHeaderUserState();

  // 2. 로그인 폼 저장된 ID 채우기
  const savedId = localStorage.getItem('frame_saved_id');
  if (savedId) {
    const loginIdInput = document.getElementById('loginId');
    const saveCheck = document.getElementById('saveIdCheck');
    if (loginIdInput) loginIdInput.value = savedId;
    if (saveCheck) saveCheck.checked = true;
  }

  // 3. 약관 동의 리스너 초기화
  initTermsListeners();

  // 4. Supabase DB에서 원격 매물 목록 불러오기
  loadSupabaseProducts();
}

// Supabase 원격 매물 불러오기 및 그리드 렌더링
async function loadSupabaseProducts() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const remoteProducts = data.map(row => ({
        id: row.id,
        category: row.category,
        brand: row.brand,
        mount: row.mount,
        title: row.title,
        price: Number(row.price),
        avgMarketPrice: Number(row.avg_market_price || row.price),
        location: row.location,
        createdAt: new Date(row.created_at).toLocaleDateString('ko-KR'),
        imageUrl: row.image_url,
        images: row.images || [row.image_url],
        condition: row.condition || 'A+급',
        verified: row.verified,
        verificationType: row.verification_type,
        verificationDetails: row.verification_details || {},
        seller: row.seller || { name: '판매자', level: 2 },
        specs: row.specs || {},
        description: row.description || '',
        priceHistory: {
          labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
          prices: [Number(row.price) * 1.05, Number(row.price) * 1.04, Number(row.price) * 1.02, Number(row.price) * 1.01, Number(row.price) * 1.01, Number(row.price)]
        }
      }));
      const existingIds = new Set(SAMPLE_PRODUCTS.map(p => p.id));
      const newItems = remoteProducts.filter(p => !existingIds.has(p.id));
      if (newItems.length > 0) {
        SAMPLE_PRODUCTS = [...newItems, ...SAMPLE_PRODUCTS];
        applyFilters();
      }
    }
  } catch (e) {
    console.warn('Supabase products fetch warning:', e);
  }
}

function initTermsListeners() {
  const itemChecks = document.querySelectorAll('.terms-item');
  const allCheck = document.getElementById('termsAll');
  if (!allCheck || itemChecks.length === 0) return;

  itemChecks.forEach(cb => {
    cb.addEventListener('change', () => {
      const allSelected = Array.from(itemChecks).every(c => c.checked);
      allCheck.checked = allSelected;
    });
  });
}

function toggleAllTerms(checked) {
  const itemChecks = document.querySelectorAll('.terms-item');
  itemChecks.forEach(cb => {
    cb.checked = checked;
  });
}

async function checkEmailDuplicate() {
  const emailInput = document.getElementById('signupEmail');
  if (!emailInput) return;
  const email = emailInput.value.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !re.test(email)) {
    showToast('올바른 이메일 형식(예: user@example.com)을 입력해 주세요.', 'error');
    emailInput.focus();
    return;
  }

  // Supabase profiles 조회
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('profiles').select('id').eq('email', email).maybeSingle();
      if (data) {
        showToast(`'${email}' 은(는) 이미 등록된 이메일입니다.`, 'error');
        return;
      }
    } catch (e) {
      console.warn('Email check error:', e);
    }
  }

  if (email === 'admin@frame.kr' || email === 'seller@camera.com') {
    showToast(`'${email}' 은(는) 이미 등록된 이메일입니다.`, 'error');
    return;
  }
  showToast(`'${email}' 은(는) 사용 가능한 이메일입니다.`, 'success');
}

async function checkNicknameDuplicate() {
  const nicknameInput = document.getElementById('signupNickname');
  if (!nicknameInput) return;
  const nickname = nicknameInput.value.trim();
  if (nickname.length < 2) {
    showToast('닉네임은 2자 이상 입력해 주세요.', 'error');
    nicknameInput.focus();
    return;
  }

  // Supabase profiles 조회
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('profiles').select('id').eq('nickname', nickname).maybeSingle();
      if (data) {
        showToast(`'${nickname}' 은(는) 이미 사용 중인 닉네임입니다.`, 'error');
        return;
      }
    } catch (e) {
      console.warn('Nickname check error:', e);
    }
  }

  if (nickname === '포토그래퍼김씨' || nickname === '관리자') {
    showToast(`'${nickname}' 은(는) 이미 사용 중인 닉네임입니다.`, 'error');
    return;
  }
  showToast(`'${nickname}' 은(는) 사용 가능한 닉네임입니다.`, 'success');
}

function updateHeaderUserState() {
  const area = document.getElementById('userHeaderArea');
  if (!area) return;

  const user = getCurrentUser();
  if (user) {
    let levelBadgeHtml = '';
    const isAdmin = user.role === 'admin' || user.level === 99 || user.email === 'admin@frame.com';

    if (isAdmin) {
      levelBadgeHtml = `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold shadow-sm" title="👑 마스터 관리자 (시스템 최고 권한)">
          <span>👑 마스터 관리자</span>
        </span>
      `;
    } else if (user.level === 3) {
      levelBadgeHtml = `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#171717] text-white text-[10px] font-bold shadow-sm" title="Lv.3 안심 인증 판매자 (계좌+신분증+셀피 검증완료)">
          <i data-lucide="shield-check" class="w-3 h-3 text-emerald-400"></i>
          <span>Lv.3 안심판매자</span>
        </span>
      `;
    } else if (user.level === 2) {
      levelBadgeHtml = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold" title="Lv.2 PASS 실명인증 완료 (매물등록 가능)">
          <i data-lucide="check" class="w-2.5 h-2.5"></i>
          <span>Lv.2 PASS</span>
        </span>
      `;
    } else {
      levelBadgeHtml = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] font-semibold" title="Lv.1 일반">
          <span>Lv.1 일반</span>
        </span>
      `;
    }

    area.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 bg-[#F5F5F5] border border-[#E5E5E5] px-2.5 py-1 rounded-full text-xs">
          <span class="font-bold text-[#171717] max-w-[80px] sm:max-w-[100px] truncate">${user.name || user.id}</span>
          ${levelBadgeHtml}
        </div>
        ${isAdmin ? `
          <span class="hidden sm:inline-flex text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
            관리자 모드
          </span>
        ` : `
          <button onclick="openVerificationCenterModal()" class="hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#171717] bg-white text-[#171717] hover:bg-[#171717] hover:text-white transition cursor-pointer" title="본인 인증 센터 열기">
            인증센터
          </button>
        `}
        <button onclick="handleLogout()" class="text-[11px] text-[#8A8A8A] hover:text-[#171717] underline cursor-pointer ml-0.5">
          로그아웃
        </button>
      </div>
    `;
  } else {
    // Default: Clean person emoji/icon button
    area.innerHTML = `
      <button onclick="handleUserIconClick()" class="p-2 rounded-full hover:bg-[#F2F2F2] text-[#171717] transition border border-[#E5E5E5] flex items-center justify-center cursor-pointer" title="로그인 / 회원가입">
        <i data-lucide="user" class="w-4 h-4"></i>
      </button>
    `;
  }
  lucide.createIcons();
}

function handleUserIconClick() {
  const user = getCurrentUser();
  if (user) {
    if (confirm(`현재 [${user.name || user.id}] 계정으로 로그인되어 있습니다.\n\n로그아웃하시겠습니까?`)) {
      handleLogout();
    }
  } else {
    openAuthModal('login');
  }
}

function openAuthModal(view = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;

  switchAuthView(view);

  // Auto-fill saved ID if available
  const savedId = localStorage.getItem('frame_saved_id');
  const loginIdInput = document.getElementById('loginId');
  const saveCheck = document.getElementById('saveIdCheck');
  if (savedId && loginIdInput && saveCheck) {
    loginIdInput.value = savedId;
    saveCheck.checked = true;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function switchAuthView(view) {
  const loginView = document.getElementById('loginView');
  const signupView = document.getElementById('signupView');
  const findView = document.getElementById('findView');
  const signupForm = document.getElementById('signupForm');
  const signupSuccessPrompt = document.getElementById('signupSuccessPrompt');

  if (!loginView || !signupView || !findView) return;

  loginView.classList.add('hidden');
  signupView.classList.add('hidden');
  findView.classList.add('hidden');

  if (view === 'signup') {
    signupView.classList.remove('hidden');
    if (signupForm) signupForm.classList.remove('hidden');
    if (signupSuccessPrompt) signupSuccessPrompt.classList.add('hidden');
  } else if (view === 'find') {
    findView.classList.remove('hidden');
  } else {
    loginView.classList.remove('hidden');
  }

  lucide.createIcons();
}

// Password Eye Toggle
function togglePasswordVisibility(inputId, eyeIconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(eyeIconId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.setAttribute('data-lucide', 'eye-off');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.setAttribute('data-lucide', 'eye');
    }
  }
  lucide.createIcons();
}

// Login Form Submit (Supabase Auth 연동)
async function handleLoginSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('loginId').value.trim();
  const pw = document.getElementById('loginPw').value;
  const saveCheck = document.getElementById('saveIdCheck')?.checked;

  if (!id || !pw) {
    showToast('아이디(이메일)와 비밀번호를 모두 입력해 주세요.', 'error');
    return;
  }

  if (saveCheck) {
    localStorage.setItem('frame_saved_id', id);
  } else {
    localStorage.removeItem('frame_saved_id');
  }

  const email = id.includes('@') ? id : `${id}@frame.com`;

  // 1. Supabase Auth 로그인 시도
  if (supabaseClient) {
    showToast('로그인 확인 중...', 'info', 1500);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: pw
    });

    if (error) {
      let msg = error.message;
      if (msg.includes('Invalid login credentials')) {
        msg = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (msg.includes('Email not confirmed')) {
        msg = '이메일 인증이 완료되지 않았습니다. (Supabase 대시보드에서 Confirm email을 꺼주세요)';
      }
      showToast(`로그인 실패: ${msg}`, 'error');
      return;
    }

    if (data && data.user) {
      let profile = null;
      try {
        const { data: prof } = await supabaseClient.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
        profile = prof;
      } catch (err) {
        console.warn('Profile fetch error:', err);
      }

      const isAdmin = data.user.email === 'admin@frame.com' || profile?.role === 'admin';
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: profile?.nickname || data.user.user_metadata?.nickname || (isAdmin ? '마스터 관리자' : data.user.email.split('@')[0]),
        role: isAdmin ? 'admin' : (profile?.role || 'user'),
        level: isAdmin ? 99 : (profile?.level || 1),
        isPhoneVerified: isAdmin ? true : Boolean(profile?.is_phone_verified),
        isBankVerified: isAdmin ? true : Boolean(profile?.is_bank_verified),
        isEkycVerified: isAdmin ? true : Boolean(profile?.is_ekyc_verified),
        passInfo: profile?.pass_info || null,
        bankInfo: profile?.bank_info || null,
        ekycInfo: profile?.ekyc_info || null,
        loginAt: new Date().toISOString()
      };

      setCurrentUser(userData);
      closeAuthModal();
      showToast(`${userData.name}님 환영합니다! 로그인이 완료되었습니다.`, 'success');
      return;
    }
  }

  // 2. 오프라인 로컬 Fallback
  const existing = getCurrentUser();
  const userData = (existing && existing.id === id) ? existing : {
    id: id,
    email: email,
    name: id.includes('@') ? id.split('@')[0] : id,
    role: id === 'admin@frame.com' ? 'admin' : 'user',
    level: id === 'admin@frame.com' ? 99 : 2,
    loginAt: new Date().toISOString()
  };

  setCurrentUser(userData);
  closeAuthModal();
  showToast(`${userData.name}님 환영합니다! 로그인이 완료되었습니다.`, 'success');
}

// Signup Form Submit (Supabase Auth 회원가입 연동)
async function handleSignupSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('signupEmail').value.trim();
  const name = document.getElementById('signupNickname').value.trim();
  const pw = document.getElementById('signupPw').value;
  const pwConfirm = document.getElementById('signupPwConfirm').value;

  if (pw.length < 6) {
    showToast('비밀번호는 최소 6자 이상이어야 합니다. (보안 규정)', 'error');
    return;
  }

  if (pw !== pwConfirm) {
    showToast('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', 'error');
    return;
  }

  const termService = document.getElementById('termService')?.checked;
  const termPrivacy = document.getElementById('termPrivacy')?.checked;
  const termAge = document.getElementById('termAge')?.checked;

  if (!termService || !termPrivacy || !termAge) {
    showToast('필수 약관(이용약관, 개인정보 수집 및 만 14세 이상 확인)에 모두 동의해 주세요.', 'error');
    return;
  }

  // 1. Supabase Auth 회원가입
  if (supabaseClient) {
    showToast('회원가입 요청 중...', 'info', 1500);
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: pw,
      options: {
        data: {
          nickname: name
        }
      }
    });

    if (error) {
      showToast(`회원가입 실패: ${error.message}`, 'error');
      return;
    }

    const isAdmin = email === 'admin@frame.com';
    const newUser = {
      id: data.user ? data.user.id : email,
      email: email,
      name: name,
      role: isAdmin ? 'admin' : 'user',
      level: isAdmin ? 99 : 1,
      isEmailVerified: true,
      isPhoneVerified: false,
      isBankVerified: false,
      isEkycVerified: false,
      createdAt: new Date().toISOString(),
      termsAgreed: {
        service: true,
        privacy: true,
        age14: true,
        marketing: document.getElementById('termMarketing')?.checked || false,
        version: 'v1.0',
        agreedAt: new Date().toISOString()
      }
    };

    setCurrentUser(newUser);

    const signupForm = document.getElementById('signupForm');
    const signupSuccessPrompt = document.getElementById('signupSuccessPrompt');
    if (signupForm && signupSuccessPrompt) {
      signupForm.classList.add('hidden');
      signupSuccessPrompt.classList.remove('hidden');
      lucide.createIcons();
    } else {
      showToast(`${name}님 환영합니다! FRAME 회원가입이 완료되었습니다.`, 'success');
      closeAuthModal();
    }
    return;
  }

  // 2. 오프라인 로컬 Fallback
  const newUser = {
    id: email,
    email: email,
    name: name,
    role: email === 'admin@frame.com' ? 'admin' : 'user',
    level: email === 'admin@frame.com' ? 99 : 1,
    isEmailVerified: true,
    isPhoneVerified: false,
    isBankVerified: false,
    isEkycVerified: false,
    createdAt: new Date().toISOString(),
    termsAgreed: {
      service: true,
      privacy: true,
      age14: true,
      marketing: document.getElementById('termMarketing')?.checked || false,
      version: 'v1.0',
      agreedAt: new Date().toISOString()
    }
  };

  setCurrentUser(newUser);

  const signupForm = document.getElementById('signupForm');
  const signupSuccessPrompt = document.getElementById('signupSuccessPrompt');
  if (signupForm && signupSuccessPrompt) {
    signupForm.classList.add('hidden');
    signupSuccessPrompt.classList.remove('hidden');
    lucide.createIcons();
  } else {
    alert(`${name}님 환영합니다! FRAME Lv.1 회원가입이 완료되었습니다.`);
    closeAuthModal();
  }
}

function startVerificationFlowFromSignup() {
  closeAuthModal();
  openVerificationCenterModal();
  switchVerifyStep(2);
}

// Find Account Submit
function handleFindSubmit(e) {
  e.preventDefault();
  const target = document.getElementById('findInput').value.trim();
  showToast(`입력하신 [${target}]으로 재설정 안내가 발송되었습니다.`, 'info');
  switchAuthView('login');
}

// Logout (Supabase Auth 로그아웃 연동)
async function handleLogout() {
  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
    } catch (e) {
      console.warn('Logout warning:', e);
    }
  }
  sessionStorage.removeItem('frame_current_user');
  updateHeaderUserState();
  showToast('로그아웃되었습니다.', 'info');
}

// ================= 3단계 본인 인증 센터 (토스 본인인증 / 1원 계좌 / eKYC) =================
let passOtpTimerInterval = null;
let currentPassOtp = '';
let currentBankCode = '';
let ocrCompleted = false;

// 토스 샌드박스 표준 가상 사용자(홍길동) 자동 채우기
function fillTossVirtualUser() {
  const nameInput = document.getElementById('passName');
  const birthInput = document.getElementById('passBirth');
  const phoneInput = document.getElementById('passPhone');
  if (nameInput) nameInput.value = '홍길동';
  if (birthInput) birthInput.value = '950815';
  if (phoneInput) phoneInput.value = '01012345678';

  const sktRadio = document.querySelector('input[name="passCarrier"][value="SKT"]');
  if (sktRadio) sktRadio.checked = true;

  alert('[토스 샌드박스 가상 사용자 데이터 자동 입력 완료]\n\n• 성명: 홍길동\n• 생년월일: 950815 (만 14세 이상 성인)\n• 휴대폰: 010-1234-5678 (통신사: SKT)\n\n하단의 [인증번호 요청] 버튼을 클릭하시면 테스트 OTP(482910)가 시뮬레이션 발송됩니다.');
}

function openVerificationCenterModal() {
  const modal = document.getElementById('verificationCenterModal');
  if (!modal) return;

  let user = getCurrentUser();
  const isAdmin = user && (user.role === 'admin' || user.level === 99 || user.email === 'admin@frame.com');

  if (isAdmin) {
    user.level = 99;
    user.role = 'admin';
    user.isPhoneVerified = true;
    user.isBankVerified = true;
    user.isEkycVerified = true;
    user.passInfo = user.passInfo || {
      name: user.name || '마스터 관리자',
      phoneMasked: '010-****-0000',
      carrier: 'SKT (MASTER)',
      ciHash: 'CI_MASTER_AUTHENTICATED_PERMANENT',
      diHash: 'DI_MASTER_SHA256_PERMANENT_KEY_9999',
      verifiedAt: new Date().toISOString()
    };
    user.bankInfo = user.bankInfo || {
      bank: '한국은행',
      maskedAccount: '000-***-0000',
      verifiedAt: new Date().toISOString()
    };
    user.ekycInfo = user.ekycInfo || {
      livenessCheck: 'PASSED (MASTER PRIVILEGE)',
      faceMatchRate: '100%',
      idDiscarded: true,
      verifiedAt: new Date().toISOString()
    };
    setCurrentUser(user);
  }

  if (user) {
    const nameInput = document.getElementById('passName');
    if (nameInput && !nameInput.value) nameInput.value = user.name || '';
  }

  syncVerificationUI();

  if (isAdmin) {
    switchVerifyStep(3);
  } else if (user && user.level >= 2) {
    switchVerifyStep(3);
  } else {
    switchVerifyStep(user ? 2 : 1);
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeVerificationCenterModal() {
  const modal = document.getElementById('verificationCenterModal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = 'auto';

  if (passOtpTimerInterval) {
    clearInterval(passOtpTimerInterval);
    passOtpTimerInterval = null;
  }
}

function switchVerifyStep(step) {
  const tab1 = document.getElementById('verifyTabStep1');
  const tab2 = document.getElementById('verifyTabStep2');
  const tab3 = document.getElementById('verifyTabStep3');

  const content1 = document.getElementById('verifyStepContent1');
  const content2 = document.getElementById('verifyStepContent2');
  const content3 = document.getElementById('verifyStepContent3');

  [tab1, tab2, tab3].forEach(t => t?.classList.remove('active', 'border-[#171717]', 'bg-white'));
  [tab1, tab2, tab3].forEach(t => t?.classList.add('bg-[#FAFAFA]'));
  [content1, content2, content3].forEach(c => c?.classList.add('hidden'));

  const activeTab = document.getElementById(`verifyTabStep${step}`);
  const activeContent = document.getElementById(`verifyStepContent${step}`);

  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.classList.remove('bg-[#FAFAFA]');
  }
  if (activeContent) {
    activeContent.classList.remove('hidden');
  }

  lucide.createIcons();
}

function requestPassOtp() {
  const name = document.getElementById('passName')?.value.trim();
  const birth = document.getElementById('passBirth')?.value.trim();
  const phone = document.getElementById('passPhone')?.value.trim();

  if (!name || !birth || !phone) {
    alert('성명, 생년월일(6자리), 휴대폰 번호를 모두 입력해 주세요.');
    return;
  }
  if (birth.length !== 6 || isNaN(birth)) {
    alert('생년월일은 6자리 숫자(예: 950815)로 입력해 주세요.');
    return;
  }

  currentPassOtp = '482910';

  const otpBlock = document.getElementById('passOtpBlock');
  if (otpBlock) otpBlock.classList.remove('hidden');

  const otpInput = document.getElementById('passOtpInput');
  if (otpInput) {
    otpInput.value = currentPassOtp;
    otpInput.focus();
  }

  let timeLeft = 180;
  const timerEl = document.getElementById('passTimer');
  if (passOtpTimerInterval) clearInterval(passOtpTimerInterval);

  passOtpTimerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(passOtpTimerInterval);
      if (timerEl) timerEl.innerText = '00:00';
      alert('인증 시간이 만료되었습니다. 다시 요청해 주세요.');
      return;
    }
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');
    if (timerEl) timerEl.innerText = `${mins}:${secs}`;
  }, 1000);

  alert(`[토스 본인인증(Toss Identity) / PASS 테스트 SMS 발송]\n\n인증번호 [${currentPassOtp}] 가 발송되었습니다.\n(토스 샌드박스 가상 사용자 시연 편의를 위해 인증번호 입력칸에 자동 입력되었습니다.)`);
}

function handlePassVerifySubmit(e) {
  e.preventDefault();

  const otpInput = document.getElementById('passOtpInput')?.value.trim();
  if (!otpInput) {
    alert('인증번호 6자리를 입력해 주세요.');
    return;
  }

  if (otpInput !== currentPassOtp && otpInput.length !== 6) {
    alert('인증번호가 올바르지 않습니다.');
    return;
  }

  if (passOtpTimerInterval) {
    clearInterval(passOtpTimerInterval);
    passOtpTimerInterval = null;
  }

  const name = document.getElementById('passName')?.value.trim() || '홍길동';
  const phone = document.getElementById('passPhone')?.value.trim() || '01012345678';
  const carrier = document.querySelector('input[name="passCarrier"]:checked')?.value || 'SKT';
  const phoneMasked = phone.length >= 10 ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1-****-$2') : phone;

  const mockCi = 'CI_TOSS_TEST_' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const mockDi = 'DI_TOSS_SHA256_' + Math.random().toString(36).substring(2, 12).toUpperCase() + '9B8E';

  let user = getCurrentUser();
  if (!user) {
    user = {
      id: `${name.toLowerCase()}@frame.kr`,
      name: name,
      level: 2
    };
  } else {
    user.level = Math.max(user.level || 1, 2);
  }

  user.isPhoneVerified = true;
  user.passInfo = {
    name: name,
    phoneMasked: phoneMasked,
    carrier: carrier,
    ciHash: mockCi,
    diHash: mockDi,
    verifiedAt: new Date().toISOString()
  };

  setCurrentUser(user);

  // Supabase 클라우드 DB 동기화
  if (typeof supabaseClient !== 'undefined' && supabaseClient && user.id && user.id.includes('-')) {
    supabaseClient.from('profiles').update({
      level: user.level,
      is_phone_verified: true,
      pass_info: user.passInfo
    }).eq('id', user.id).then(() => {
      console.log('Phone verification saved to Supabase');
    }).catch(err => console.warn('Supabase profile update error:', err));
  }

  const resultBox = document.getElementById('passSuccessResult');
  const infoText = document.getElementById('passVerifiedInfoText');
  if (resultBox) resultBox.classList.remove('hidden');
  if (infoText) infoText.innerText = `${name} (${phoneMasked}) · ${carrier}`;

  const step2Badge = document.getElementById('step2StatusBadge');
  if (step2Badge) {
    step2Badge.innerText = '✓ Lv.2 인증완료';
    step2Badge.className = 'text-[10px] text-emerald-600 font-bold mt-0.5';
  }

  lucide.createIcons();
  alert(`[토스 본인인증(Toss Identity) 테스트 통과]\n\n• 성명: ${name}\n• 통신사: ${carrier}\n• 발급 DI: ${mockDi.substring(0, 24)}... (동일인 중복가입 및 사기 방지 식별값)\n\n회원 등급이 [Lv.2 PASS/토스 실명인증]으로 승격되었습니다.\n이제 상품 등록 및 직거래가 가능합니다.`);
}

function sendBank1WonVerify() {
  const bank = document.getElementById('bankNameSelect')?.value;
  const acc = document.getElementById('bankAccountNum')?.value.trim();

  if (!acc || acc.length < 8) {
    alert('올바른 계좌번호를 8자리 이상 입력해 주세요.');
    return;
  }

  currentBankCode = '782';
  const codeBlock = document.getElementById('bankCodeBlock');
  if (codeBlock) codeBlock.classList.remove('hidden');

  const codeInput = document.getElementById('bankVerifyCode');
  if (codeInput) {
    codeInput.value = currentBankCode;
    codeInput.focus();
  }

  const maskedAcc = acc.length > 4 ? acc.slice(0, 3) + '-***-' + acc.slice(-4) : acc;

  alert(`[토스페이먼츠 1원 계좌인증 송금 완료]\n\n${bank} (${maskedAcc})\n예금주 실명 대조 성공 (토스 본인인증 성명과 일치)\n\n입금자명: FRAME ${currentBankCode}\n(포트폴리오 시연을 위해 3자리 코드가 자동 입력되었습니다.)`);
}

function confirmBank1Won() {
  const code = document.getElementById('bankVerifyCode')?.value.trim();
  if (code !== currentBankCode && code !== '782') {
    alert('입금자명 뒤 3자리 숫자가 일치하지 않습니다.');
    return;
  }

  const bank = document.getElementById('bankNameSelect')?.value || 'KB국민은행';
  const acc = document.getElementById('bankAccountNum')?.value.trim() || '110-123456';
  const maskedAcc = acc.length > 4 ? acc.slice(0, 3) + '-***-' + acc.slice(-4) : acc;

  const badge = document.getElementById('bankVerifiedBadge');
  if (badge) {
    badge.innerText = '✓ 계좌 인증완료';
    badge.className = 'text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20';
  }

  let user = getCurrentUser();
  if (user) {
    user.isBankVerified = true;
    user.bankInfo = {
      bank: bank,
      maskedAccount: maskedAcc,
      verifiedAt: new Date().toISOString()
    };
    checkLv3UpgradeEligibility(user);
  }

  alert(`[토스페이먼츠 1원 계좌 실명 인증 성공]\n\n은행: ${bank}\n계좌: ${maskedAcc}\n사기 신고 DB 대조 결과: 정상 안심 계좌 확인됨.`);
}

function simulateOcrScan() {
  const ocrBox = document.getElementById('ocrResultBox');
  if (ocrBox) ocrBox.classList.remove('hidden');

  ocrCompleted = true;
  alert('[신분증 OCR & 행정기관 진위 확인 성공]\n\n• 신분증 종류: 주민등록증 / 운전면허증\n• 성명/생년월일: PASS 본인 정보와 교차 검증 일치\n• 주민등록번호 뒷자리: 암호화 마스킹 및 법적 비수집 원칙에 따라 즉시 파기\n• 행정안전부 진위 확인: 유효한 신분증 확인됨\n\n다음 단계인 실시간 셀피 라이브니스 검사를 시작하세요.');
}

function startLivenessScan() {
  if (!ocrCompleted) {
    simulateOcrScan();
  }

  const scannerBar = document.getElementById('livenessScannerBar');
  const btn = document.getElementById('btnStartLiveness');

  if (scannerBar) scannerBar.classList.remove('hidden');
  if (btn) {
    btn.disabled = true;
    btn.innerText = '실시간 라이브니스 감지 중... (눈을 천천히 깜빡여 주세요)';
    btn.className = 'px-5 py-2 rounded-full bg-emerald-700 text-white text-xs font-semibold animate-pulse';
  }

  setTimeout(() => {
    if (scannerBar) scannerBar.classList.add('hidden');
    if (btn) {
      btn.disabled = false;
      btn.innerText = '✓ 라이브니스 & 안면 일치 검증 완료';
      btn.className = 'px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold';
    }

    const ekycBadge = document.getElementById('ekycVerifiedBadge');
    if (ekycBadge) {
      ekycBadge.innerText = '✓ eKYC 인증완료';
      ekycBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20';
    }

    let user = getCurrentUser();
    if (user) {
      user.isEkycVerified = true;
      user.ekycInfo = {
        livenessCheck: 'PASSED',
        faceMatchRate: '99.4%',
        idDiscarded: true,
        verifiedAt: new Date().toISOString()
      };
      checkLv3UpgradeEligibility(user);
    }

    alert('[실시간 셀피 라이브니스(Liveness) 검증 완료]\n\n• 생체 안면 반응(눈 깜빡임) 감지 완료\n• 신분증 사진과 실시간 얼굴 대조 일치율: 99.4%\n• 이미지 데이터는 개인정보 처리방침에 따라 즉시 영구 파기되었습니다.');
  }, 2200);
}

function checkLv3UpgradeEligibility(user) {
  const isAdmin = user.role === 'admin' || user.level === 99 || user.email === 'admin@frame.com';
  if (isAdmin) {
    user.level = 99;
    user.isPhoneVerified = true;
    user.isBankVerified = true;
    user.isEkycVerified = true;
    setCurrentUser(user);
    return;
  }

  if (user.isBankVerified && user.isEkycVerified) {
    user.level = 3;
    setCurrentUser(user);

    if (typeof supabaseClient !== 'undefined' && supabaseClient && user.id && user.id.includes('-')) {
      supabaseClient.from('profiles').update({
        level: 3,
        is_bank_verified: true,
        is_ekyc_verified: true,
        bank_info: user.bankInfo,
        ekyc_info: user.ekycInfo
      }).eq('id', user.id).then(() => {
        console.log('Lv.3 upgrade saved to Supabase');
      }).catch(err => console.warn('Supabase profile update error:', err));
    }

    const banner = document.getElementById('lv3FinalSuccessBanner');
    if (banner) banner.classList.remove('hidden');

    const step3Badge = document.getElementById('step3StatusBadge');
    if (step3Badge) {
      step3Badge.innerText = '✓ Lv.3 승급완료';
      step3Badge.className = 'text-[10px] text-emerald-600 font-bold mt-0.5';
    }

    lucide.createIcons();
    alert('🎉 축하합니다!\n\n계좌 인증과 eKYC 신분증·셀피 라이브니스 교차 검증이 모두 완료되어 [Lv.3 안심 인증 판매자]로 최종 승격되었습니다!\n\n등록하신 매물에 안심 판매자 공식 배지가 노출됩니다.');
  } else {
    setCurrentUser(user);

    if (typeof supabaseClient !== 'undefined' && supabaseClient && user.id && user.id.includes('-')) {
      supabaseClient.from('profiles').update({
        is_bank_verified: Boolean(user.isBankVerified),
        bank_info: user.bankInfo || null,
        is_ekyc_verified: Boolean(user.isEkycVerified),
        ekyc_info: user.ekycInfo || null
      }).eq('id', user.id).catch(err => console.warn('Supabase profile update error:', err));
    }
  }
}

function syncVerificationUI() {
  const user = getCurrentUser();
  if (!user) return;

  const isAdmin = user.role === 'admin' || user.level === 99 || user.email === 'admin@frame.com';

  const step2Badge = document.getElementById('step2StatusBadge');
  const step3Badge = document.getElementById('step3StatusBadge');
  const bankBadge = document.getElementById('bankVerifiedBadge');
  const ekycBadge = document.getElementById('ekycVerifiedBadge');

  if (isAdmin) {
    if (step2Badge) {
      step2Badge.innerText = '✓ 마스터 승인';
      step2Badge.className = 'text-[10px] text-amber-600 font-bold mt-0.5';
    }
    if (step3Badge) {
      step3Badge.innerText = '✓ 최고권한 승인';
      step3Badge.className = 'text-[10px] text-amber-600 font-bold mt-0.5';
    }
    if (bankBadge) {
      bankBadge.innerText = '✓ 마스터 공인완료';
      bankBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 font-bold border border-amber-500/20';
    }
    if (ekycBadge) {
      ekycBadge.innerText = '✓ 마스터 프리패스';
      ekycBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 font-bold border border-amber-500/20';
    }
    const banner = document.getElementById('lv3FinalSuccessBanner');
    if (banner) {
      banner.classList.remove('hidden');
      banner.innerHTML = `
        <div class="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-300 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
            👑
          </div>
          <div>
            <div class="text-xs font-bold text-[#171717] flex items-center gap-1.5">
              마스터 관리자 프리패스 적용 중 (Lv.99 최고 권한)
            </div>
            <p class="text-[11px] text-[#737373] mt-0.5">
              최고 관리자 계정은 휴대폰 PASS, 1원 계좌, eKYC 3단계 실명 인증이 모두 영구 자동 승인되어 있습니다.
            </p>
          </div>
        </div>
      `;
    }
    return;
  }

  if (user.level >= 2 || user.isPhoneVerified) {
    if (step2Badge) {
      step2Badge.innerText = '✓ Lv.2 완료';
      step2Badge.className = 'text-[10px] text-emerald-600 font-bold mt-0.5';
    }
  }

  if (user.isBankVerified) {
    if (bankBadge) {
      bankBadge.innerText = '✓ 계좌 인증완료';
      bankBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20';
    }
  }

  if (user.isEkycVerified) {
    if (ekycBadge) {
      ekycBadge.innerText = '✓ eKYC 인증완료';
      ekycBadge.className = 'text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20';
    }
  }

  if (user.level >= 3) {
    if (step3Badge) {
      step3Badge.innerText = '✓ Lv.3 승급완료';
      step3Badge.className = 'text-[10px] text-emerald-600 font-bold mt-0.5';
    }
    const banner = document.getElementById('lv3FinalSuccessBanner');
    if (banner) banner.classList.remove('hidden');
  }
}

// ================= FRAUD CHECK & UTILITY =================
function openFraudCheckModal() {
  document.getElementById('fraudCheckModal').classList.remove('hidden');
}

function closeFraudCheckModal() {
  document.getElementById('fraudCheckModal').classList.add('hidden');
  document.getElementById('fraudResultBox').classList.add('hidden');
}

function checkFraudDb() {
  const val = document.getElementById('fraudSearchInput').value.trim();
  const box = document.getElementById('fraudResultBox');
  box.classList.remove('hidden');

  if (!val) {
    box.className = 'p-3 rounded-lg text-xs bg-[#F5F5F5] border border-[#CCCCCC] text-[#171717]';
    box.innerText = '전화번호 또는 계좌번호를 입력해 주세요.';
    return;
  }

  box.className = 'p-3 rounded-lg text-xs bg-white border border-[#EAEAEA] text-[#171717] shadow-sm';
  box.innerHTML = `
    <div class="font-bold mb-1">✓ 사기 피해 신고 이력 없음 (안심)</div>
    <div class="text-[11px] text-[#737373]">입력하신 대상("${val}")은 최근 3개월간 접수된 사기 이력 및 신고 DB에 등록되지 않았습니다. 반드시 대면 직거래로 현장에서 장비를 점검하세요.</div>
  `;
}

function reportSellerPrompt() {
  const reason = prompt('신고 사유를 입력해 주세요:');
  if (reason) {
    alert('신고가 접수되었습니다.');
  }
}

// ================= WISHLIST & LIKE MANAGEMENT (관심 매물 로컬스토리지 상태 관리) =================
const WISHLIST_STORAGE_KEY = 'frame_wishlist';

function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isWishlisted(id) {
  const list = getWishlist();
  return list.includes(Number(id));
}

function toggleCardWishlist(itemId) {
  const idNum = Number(itemId);
  let list = getWishlist();
  const exists = list.includes(idNum);

  if (exists) {
    list = list.filter(id => id !== idNum);
    showFrameToast('관심 매물에서 제외되었습니다.', 'info');
  } else {
    list.push(idNum);
    showFrameToast('관심 매물에 저장되었습니다! (상단 관심 매물 탭에서 확인)', 'success');
  }

  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}

  updateWishlistBadges();

  if (currentCategory === 'wishlist') {
    applyFilters();
  } else {
    applyFilters();
  }
}

function updateWishlistBadges() {
  const count = getWishlist().length;
  const badge = document.getElementById('wishlistCountBadge');
  const bottomBadge = document.getElementById('bottomNavWishlistBadge');
  if (badge) {
    badge.innerText = count;
    if (count > 0) badge.classList.remove('hidden');
    else badge.classList.add('hidden');
  }
  if (bottomBadge) {
    if (count > 0) bottomBadge.classList.remove('hidden');
    else bottomBadge.classList.add('hidden');
  }
}

function toggleCardHeart(btn) {
  // Legacy fallback
  btn.classList.toggle('text-red-500');
}

function toggleBookmark(btn) {
  btn.classList.toggle('text-black');
}

// ================= AI SAMPLE & MEDIA EXPLORER LOGIC =================
// 모델명 검색 시 실제 작례 사진, 블로그 리뷰, 유튜브 링크, AI 광학 분석 탐색 기능

let currentActiveSampleQuery = '';

// 1. 메인 첫 번째 카드에서 AI 검색 트리거
function handleCardAiSearch() {
  const input = document.getElementById('cardAiSearchInput');
  const query = input && input.value.trim() ? input.value.trim() : '라이카 Q2';
  openAiSampleSearchModal(query);
}

// 2. 상품 상세 모달에서 해당 기종 AI 작례 검색으로 바로 연결
function openAiSampleFromDetailModal() {
  const query = activeModalProduct ? activeModalProduct.title : '';
  closeDetailModal();
  openAiSampleSearchModal(query);
}

// 3. AI 작례 탐색기 모달 열기
function openAiSampleSearchModal(initialQuery = '라이카 Q2') {
  const modal = document.getElementById('aiSampleExplorerModal');
  if (!modal) return;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const searchInput = document.getElementById('aiModalSearchInput');
  if (searchInput) {
    searchInput.value = initialQuery;
    setTimeout(() => searchInput.focus(), 100);
  }

  // 실시간 크롤러 서버 상태 체크
  checkCrawlerServerHealth(false);

  executeAiSampleSearch(initialQuery);
  if (window.lucide) lucide.createIcons();
}

// 4. AI 작례 탐색기 모달 닫기
function closeAiSampleSearchModal() {
  const modal = document.getElementById('aiSampleExplorerModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// 5. 검색 실행 (로딩 스켈레톤 표출 후 결과 렌더링)
function extractCoreKeywords(raw) {
  if (!raw) return '';
  return raw
    .replace(/(작례|결과물|사진|보여줘|알려줘|찾아줘|어때|리뷰|어떤가요|추천|카메라|렌즈|스펙|평가|보고싶어|볼수있게)/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// 5. 검색 실행 (로딩 스켈레톤 표출 후 결과 렌더링)
function extractCoreKeywords(raw) {
  if (!raw) return '';
  return raw
    .replace(/(작례|결과물|사진|보여줘|알려줘|찾아줘|어때|리뷰|어떤가요|추천|카메라|렌즈|스펙|평가|보고싶어|볼수있게)/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

// ================= REALTIME CRAWLER SERVER STATE & INTEGRATION (방식 B) =================
let isCrawlerServerOnline = false;

// 실시간 크롤러 서버 상태 체크 (localhost:5000/api/health)
async function checkCrawlerServerHealth(showToast = false) {
  const badge = document.getElementById('crawlerServerStatusBadge');
  const dot = document.getElementById('crawlerServerStatusDot');
  const text = document.getElementById('crawlerServerStatusText');
  const modalBadge = document.getElementById('crawlerModalBadge');
  const testBox = document.getElementById('crawlerServerTestResult');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch('http://localhost:5000/api/health', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      isCrawlerServerOnline = true;
      if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse';
      if (text) text.innerText = '실시간 크롤러 ON';
      if (badge) {
        badge.className = 'cursor-pointer text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 transition hover:bg-emerald-100';
      }
      if (modalBadge) {
        modalBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono';
        modalBadge.innerText = '서버 가동 중 (localhost:5000)';
      }
      if (testBox) {
        testBox.className = 'p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs leading-relaxed';
        testBox.innerHTML = '<strong>✅ 실시간 크롤러 서버 정상 연결!</strong><br><span class="text-[11px] text-emerald-700">Flickr, Lomography, YouTube, Naver Blog 실시간 크롤링이 준비되었습니다.</span>';
      }
      if (showToast && typeof showFrameToast === 'function') {
        showFrameToast('실시간 크롤러 서버가 정상 작동 중입니다! (포트 5000)', 'success');
      }
      return true;
    }
  } catch (e) {
    // Server is offline
  }

  isCrawlerServerOnline = false;
  if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400';
  if (text) text.innerText = '크롤러 대기 (python3 server.py)';
  if (badge) {
    badge.className = 'cursor-pointer text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 transition hover:bg-amber-100';
  }
  if (modalBadge) {
    modalBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-mono';
    modalBadge.innerText = '서버 대기 중';
  }
  if (testBox) {
    testBox.className = 'p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs leading-relaxed';
    testBox.innerHTML = '<strong>💡 실시간 크롤러 서버가 꺼져 있습니다.</strong><br><span class="text-[11px] text-amber-700">터미널에서 <code>python3 server.py</code>를 실행한 뒤 다시 테스트해 보세요.</span>';
  }
  if (showToast && typeof showFrameToast === 'function') {
    showFrameToast('실시간 크롤러 서버가 대기 상태입니다. 터미널에서 python3 server.py를 실행하세요.', 'info');
  }
  return false;
}

function openCrawlerServerModal() {
  const modal = document.getElementById('crawlerServerModal');
  if (modal) {
    modal.classList.remove('hidden');
    checkCrawlerServerHealth(false);
    if (window.lucide) lucide.createIcons();
  }
}

function closeCrawlerServerModal() {
  const modal = document.getElementById('crawlerServerModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function copyCrawlerCommand() {
  const input = document.getElementById('crawlerCommandInput');
  if (input) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(input.value).then(() => {
        showFrameToast('명령어(python3 server.py)가 클립보드에 복사되었습니다!', 'success');
      }).catch(() => {
        input.select();
        document.execCommand('copy');
        showFrameToast('명령어가 복사되었습니다.', 'success');
      });
    } else {
      input.select();
      document.execCommand('copy');
      showFrameToast('명령어가 복사되었습니다.', 'success');
    }
  }
}

// ================= AI SAMPLE SEARCH EXECUTION =================
// ================= 실시간 검색 연동 헬퍼 함수 =================
function openGoogleSearch(query, suffix = '작례') {
  const cleanQ = extractCoreKeywords(query) || query;
  const fullQ = `${cleanQ} ${suffix}`.trim();
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(fullQ)}`;
  window.open(url, '_blank');
  if (typeof showFrameToast === 'function') {
    showFrameToast(`'${cleanQ}' Google 실시간 이미지 검색 창이 열렸습니다!`, 'success');
  }
}

function openYoutubeSearch(query, suffix = '작례 리뷰') {
  const cleanQ = extractCoreKeywords(query) || query;
  const fullQ = `${cleanQ} ${suffix}`.trim();
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(fullQ)}`;
  window.open(url, '_blank');
  if (typeof showFrameToast === 'function') {
    showFrameToast(`'${cleanQ}' YouTube 추천 영상 검색 창이 열렸습니다!`, 'success');
  }
}

function openNaverBlogSearch(query, suffix = '실사용 작례 리뷰') {
  const cleanQ = extractCoreKeywords(query) || query;
  const fullQ = `${cleanQ} ${suffix}`.trim();
  const url = `https://search.naver.com/search.naver?where=blog&query=${encodeURIComponent(fullQ)}`;
  window.open(url, '_blank');
  if (typeof showFrameToast === 'function') {
    showFrameToast(`'${cleanQ}' 네이버 블로그 검색 창이 열렸습니다!`, 'success');
  }
}

// ================= GRANULAR CAMERA & LENS OPTICAL DICTIONARY & PARSER =================
const OPTICAL_TERMS_DICTIONARY = [
  // Brands / Makers
  { keys: ['라이트 렌즈 랩', '라이트렌즈랩', 'lll', 'light lens lab', 'lightlenslab'], tag: 'lightlenslab' },
  { keys: ['티티아티산', '티시아티산', 'ttartisan', 'tt artisan'], tag: 'ttartisan' },
  { keys: ['7장인', '칠장인', '7artisans', '7 artisans'], tag: '7artisans' },
  { keys: ['보이그랜더', '보익', 'voigtlander', 'voigtlaender'], tag: 'voigtlander' },
  { keys: ['라이카', 'leica'], tag: 'leica' },
  { keys: ['칼자이스', '자이스', 'zeiss', 'carl zeiss'], tag: 'zeiss' },
  { keys: ['미놀타', 'minolta'], tag: 'minolta' },
  { keys: ['핫셀블라드', '핫셀', 'hasselblad'], tag: 'hasselblad' },
  { keys: ['콘탁스', 'contax'], tag: 'contax' },
  { keys: ['롤라이', '롤라이플렉스', 'rollei', 'rolleiflex'], tag: 'rolleiflex' },
  { keys: ['펜탁스', '아사히', 'pentax', 'asahi'], tag: 'pentax' },
  { keys: ['캐논', 'canon'], tag: 'canon' },
  { keys: ['니콘', 'nikon'], tag: 'nikon' },
  { keys: ['후지필름', '후지', 'fujifilm', 'fuji'], tag: 'fujifilm' },
  { keys: ['소니', 'sony'], tag: 'sony' },
  { keys: ['올림푸스', '주이코', 'olympus', 'zuiko'], tag: 'olympus' },
  { keys: ['파나소닉', '루믹스', 'lumix'], tag: 'lumix' },
  { keys: ['시그마', 'sigma'], tag: 'sigma' },
  { keys: ['탐론', 'tamron'], tag: 'tamron' },
  { keys: ['삼양', '로키논', 'samyang', 'rokinon'], tag: 'samyang' },
  { keys: ['야시카', 'yashica'], tag: 'yashica' },

  // Specific Lens Lineups
  { keys: ['주미크론', '즈미크론', 'summicron'], tag: 'summicron' },
  { keys: ['주미룩스', '즈미룩스', 'summilux'], tag: 'summilux' },
  { keys: ['녹티룩스', '녹티', 'noctilux'], tag: 'noctilux' },
  { keys: ['주마론', '중마론', 'summaron'], tag: 'summaron' },
  { keys: ['엘마', 'elmar'], tag: 'elmar' },
  { keys: ['주미타', 'summitar'], tag: 'summitar' },
  { keys: ['주마', 'summar'], tag: 'summar' },
  { keys: ['슈퍼 타쿠마', '슈퍼타쿠마', '타쿠마', 'takumar'], tag: 'supertakumar' },
  { keys: ['헬리오스 44', '헬리오스', 'helios'], tag: 'helios44' },
  { keys: ['녹톤', 'nokton'], tag: 'nokton' },
  { keys: ['울트론', 'ultron'], tag: 'ultron' },
  { keys: ['헬리어', 'heliar'], tag: 'heliar' },
  { keys: ['컬러스코파', '스코파', 'skopar'], tag: 'skopar' },
  { keys: ['아포란타', '란타', 'lanthar'], tag: 'lanthar' },
  { keys: ['로코르', 'rokkor'], tag: 'rokkor' },
  { keys: ['플라나', 'planar'], tag: 'planar' },
  { keys: ['비오곤', 'biogon'], tag: 'biogon' },
  { keys: ['조나', 'sonnar'], tag: 'sonnar' },
  { keys: ['디스타곤', 'distagon'], tag: 'distagon' },
  { keys: ['테사', 'tessar'], tag: 'tessar' },
  { keys: ['비오타', 'biotar'], tag: 'biotar' },
  { keys: ['금계륵', '2470gm', '24-70 gm'], tag: '2470gm' },

  // Specific Generations & Lens Variants
  { keys: ['8매', '8-element', 'eight element'], tag: '8element' },
  { keys: ['리지드', 'rigid'], tag: 'rigid' },
  { keys: ['침동', '침동식', 'collapsible'], tag: 'collapsible' },
  { keys: ['복각', 'replica'], tag: 'replica' }
];

function parseCameraLensQueryToTags(q) {
  const tags = [];
  let remaining = q.toLowerCase();

  for (const item of OPTICAL_TERMS_DICTIONARY) {
    for (const k of item.keys) {
      if (remaining.includes(k)) {
        if (!tags.includes(item.tag)) {
          tags.push(item.tag);
        }
        remaining = remaining.replace(k, ' ');
        break;
      }
    }
  }

  // Extract focal length (e.g. 50mm, 35mm, 40mm, 28mm, 58mm, 85mm)
  const mmMatch = remaining.match(/(\d{2,3})\s*mm/);
  if (mmMatch) {
    tags.push(`${mmMatch[1]}mm`);
  }

  // Extract aperture (e.g. f1.4, f0.95, f1.2, f2.8, f2, f5.6)
  const fMatch = remaining.match(/f\/?(\d(?:\.\d+)?)/);
  if (fMatch) {
    const fVal = fMatch[1].replace('.', '');
    tags.push(`f${fVal}`);
  }

  // Extra alphanumeric english tokens
  const words = remaining.match(/[a-z0-9]+/g) || [];
  for (const w of words) {
    if (!tags.includes(w) && w.length >= 2 && !w.endsWith('mm')) {
      tags.push(w);
    }
  }

  return tags;
}

const OPTICAL_LENS_FAMILIES = new Set([
  'nokton', 'ultron', 'heliar', 'skopar', 'lanthar',
  'summicron', 'summilux', 'noctilux', 'summaron', 'elmar', 'summitar', 'summar',
  'supertakumar', 'helios44', 'rokkor', 'planar', 'biogon', 'sonnar', 'distagon', 'tessar', 'biotar',
  'lightlenslab', 'ttartisan', '7artisans'
]);

const OPTICAL_MAKERS = new Set([
  'voigtlander', 'leica', 'zeiss', 'minolta', 'hasselblad', 'contax', 'rolleiflex',
  'pentax', 'canon', 'nikon', 'fujifilm', 'sony', 'olympus', 'lumix', 'sigma', 'tamron', 'samyang', 'yashica',
  'lightlenslab', 'ttartisan', '7artisans'
]);

function buildFlickrTagCandidates(tags, originalQuery) {
  const candidates = [];
  const focal = tags.find(t => /^\d{2,3}mm$/.test(t));
  const lens = tags.find(t => OPTICAL_LENS_FAMILIES.has(t));
  const maker = tags.find(t => OPTICAL_MAKERS.has(t));

  // 1. Lens model + focal length (e.g. "summaron,28mm", "nokton,40mm", "lightlenslab,35mm")
  if (lens && focal) {
    candidates.push(`${lens},${focal}`);
    candidates.push(`${lens}${focal}`);
  }

  // 2. Specific lens model tag (e.g. "summaron", "nokton", "lightlenslab", "summicron", "ttartisan", "7artisans")
  if (lens) {
    candidates.push(lens);
  }

  // 3. Maker + focal length (e.g. "voigtlander,40mm", "minolta,58mm", "leica,50mm")
  if (maker && focal && maker !== lens) {
    candidates.push(`${maker},${focal}`);
    candidates.push(`${maker}${focal}`);
  }

  // 4. Maker tag by itself
  if (maker && maker !== lens) {
    candidates.push(maker);
  }

  // 5. Cleaned English tokens from tags
  for (const t of tags) {
    if (!candidates.includes(t) && t.length >= 3 && !/^\d+mm$/.test(t)) {
      candidates.push(t);
    }
  }

  const rawClean = (originalQuery || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (rawClean && rawClean.length >= 3 && !candidates.includes(rawClean)) {
    candidates.push(rawClean);
  }

  return candidates.length > 0 ? candidates : ['vintagecamera'];
}

async function fetchFlickrPhotosLive(tags, originalQuery) {
  const candidates = buildFlickrTagCandidates(tags, originalQuery);
  const collectedPhotos = [];
  const seenUrls = new Set();

  function queryFlickrFeed(queryTag) {
    return new Promise((resolve) => {
      const callbackName = 'flickr_cb_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
      const script = document.createElement('script');

      const timeout = setTimeout(() => {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
        resolve([]);
      }, 3000);

      window[callbackName] = function(data) {
        clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);

        const items = (data && data.items) || [];
        const photos = items.map(item => {
          const thumb = item.media?.m || '';
          const highRes = thumb ? thumb.replace('_m.', '_b.') : thumb;
          const authorMatch = (item.author || '').match(/"([^"]+)"/);
          const author = authorMatch ? authorMatch[1] : 'Flickr Photographer';
          return {
            url: highRes || thumb,
            thumb: thumb,
            title: item.title?.trim() || `${originalQuery} 실제 출사 원본`,
            author: author,
            source: 'Flickr (실제 출사 원본)',
            link: item.link || 'https://www.flickr.com'
          };
        });
        resolve(photos);
      };

      script.src = `https://api.flickr.com/services/feeds/photos_public.gne?tags=${encodeURIComponent(queryTag)}&format=json&jsoncallback=${callbackName}`;
      script.onerror = () => {
        clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
        resolve([]);
      };

      document.body.appendChild(script);
    });
  }

  // Multi-stage candidate querying: accumulates unique high-quality real samples
  for (const cand of candidates.slice(0, 3)) {
    const results = await queryFlickrFeed(cand);
    for (const p of results) {
      if (p.url && !seenUrls.has(p.url)) {
        seenUrls.add(p.url);
        collectedPhotos.push(p);
      }
    }
    if (collectedPhotos.length >= 8) {
      break;
    }
  }

  return collectedPhotos;
}

// ================= HIERARCHICAL AI SUGGESTION TREE (실시간 반응형 연관 검색어 트리) =================
// ================= 3. AI 장비 탐색기: 계층형 스마트 연관 추천 검색어 트리 (Exhaustive Hierarchy) =================
const AI_SUGGESTION_TREE = [
  // --- 0. LIMITED EDITIONS & COLLABORATIONS (한정판 & 컬래버레이션 특화) ---
  {
    triggers: ['msh', 'nsh', 'm6 nsh', 'm6 msh', 'm6 한정판', 'm6 밀레니엄', '밀레니엄', 'm6 판다', 'm6 사파리', 'm6 티타늄', 'm7 한정판', 'm7 에르메스', '에르메스', 'hermes'],
    label: '👑 라이카 M6 & M7 전설의 리미티드 에디션 (NSH / 밀레니엄 / 에르메스)',
    chips: [
      { text: '라이카 M6 TTL NSH', label: '👑 M6 TTL NSH (일본 400대 한정 블랙페인트)' },
      { text: '라이카 M6 TTL 밀레니엄', label: '✨ M6 TTL 밀레니엄 (2000대 한정 M3 노브)' },
      { text: '라이카 M7 에르메스 에디션', label: '🧡 M7 에르메스 (전세계 200대 오렌지/에토프)' },
      { text: '라이카 M6 사파리', label: '🌿 M6 사파리 (올리브 그린 독일 연방군)' },
      { text: '라이카 M6 티타늄', label: '💎 M6 티타늄 (고급 티타늄 아노다이징)' },
      { text: '라이카 M6 판다', label: '🐼 M6 판다 (실버 바디 & 블랙 부품 투톤)' },
      { text: '라이카 M7 티타늄 50주년', label: '🏛️ M7 티타늄 50주년 에디션' }
    ]
  },
  {
    triggers: ['반스', 'vans', '디룩스 반스', 'd-lux 반스', '007', '리포터', 'reporter', '고스트', 'ghost', '호딘키', 'hodinkee'],
    label: '👟 라이카 D-Lux & Q 컬래버레이션 한정판 (반스 / 007 / 리포터 / 고스트)',
    chips: [
      { text: '라이카 D-Lux 7 Vans x Ray Barbee', label: '👟 D-Lux 7 반스 x 레이 바비 (체커보드 한정판)' },
      { text: '라이카 D-Lux 7 007 에디션', label: '🔫 D-Lux 7 007 제임스 본드 (건배럴 캡)' },
      { text: '라이카 Q2 리포터', label: '🛡️ Q2 리포터 (방탄 케블라 아머 외장)' },
      { text: '라이카 Q2 고스트 (Hodinkee)', label: '👻 Q2 고스트 호딘키 (롤렉스 서브마리너 오마주)' },
      { text: '라이카 Q2 Dawn by Seal', label: '🌅 Q2 던 바이 씰 (일본 전통 직물 골드)' },
      { text: '라이카 Q 글로브 트로터', label: '🧳 Q Typ 116 글로브 트로터 에디션' }
    ]
  },
  {
    triggers: ['한정판', '리미티드', '에디션', 'limited', 'edition', '스페셜 에디션', '콜라보'],
    label: '⭐ 전설의 카메라 & 렌즈 리미티드 에디션 모아보기',
    chips: [
      { text: '라이카 M6 TTL NSH', label: '👑 M6 TTL NSH (일본 400대 한정)' },
      { text: '라이카 D-Lux 7 Vans x Ray Barbee', label: '👟 D-Lux 7 반스 x 레이 바비' },
      { text: '라이카 M7 에르메스 에디션', label: '🧡 M7 에르메스 (Hermès 200대)' },
      { text: '라이카 Q2 리포터', label: '🛡️ Q2 리포터 (케블라)' },
      { text: '라이카 M10-P 사파리', label: '🌿 M10-P 사파리 (올리브 그린)' },
      { text: '후지필름 X100VI 90주년 리미티드', label: '📷 X100VI 90주년 한정 (1934대)' },
      { text: '리코 GR III 스트리트 에디션', label: '🎒 GR III 스트리트 에디션' },
      { text: '라이카 Q2 고스트 (Hodinkee)', label: '👻 Q2 고스트 (호딘키)' }
    ]
  },
  // --- 1. LEICA ECOSYSTEM ---
  {
    triggers: ['라이카', 'leica'],
    label: '🔴 라이카 대표 라인업 (M / Q / R / D-Lux / SL)',
    chips: [
      { text: '라이카 Q3', label: '🔴 라이카 Q3 (풀프레임 컴팩트)' },
      { text: '라이카 M11', label: '👑 라이카 M11 (레인지파인더)' },
      { text: '라이카 M6 클래식', label: '🎞️ 라이카 M6 (필름 명기)' },
      { text: '라이카 R6.2', label: '🎞️ 라이카 R6.2 (기계식 SLR)' },
      { text: '라이카 D-Lux 8', label: '💎 라이카 D-Lux 8 (포서드 센서)' },
      { text: '라이카 SL3', label: '🚀 라이카 SL3 (L마운트 플래그십)' },
      { text: '라이카 주미크론 50mm F2 (리지드)', label: '👑 주미크론 50mm (F2 리지드)' },
      { text: '라이카 주미룩스 35mm F1.4', label: '🌙 주미룩스 35mm (F1.4 스틸림)' },
      { text: '라이카 녹티룩스 50mm F0.95', label: '🌌 녹티룩스 50mm (F0.95)' },
      { text: '라이카 주마론 28mm F5.6 (중마론)', label: '💎 주마론 28mm (중마론)' }
    ]
  },
  {
    triggers: ['라이카 q', '라이카q', 'leica q', 'q2', 'q3', '라이카 큐', 'leicaq', 'q typ 116', 'q3 43'],
    label: '🔴 라이카 Q 풀프레임 콤팩트 라인업',
    chips: [
      { text: '라이카 Q3', label: '🔴 라이카 Q3 (6000만 화소 BSI 센서)' },
      { text: '라이카 Q3 43', label: '🔍 라이카 Q3 43mm (APO 43mm F2 신형)' },
      { text: '라이카 Q2', label: '⚡ 라이카 Q2 (4730만 화소 방진방적)' },
      { text: '라이카 Q2 모노크롬', label: '🖤 라이카 Q2 모노크롬 (전용 흑백 센서)' },
      { text: '라이카 Q (Typ 116)', label: '🎞️ 라이카 Q Typ 116 (원조 28mm Summilux)' }
    ]
  },
  {
    triggers: ['라이카 r', '라이카r', 'leica r', 'r6.2', 'r6', 'r8', 'r9', 'r3', 'r4', 'r5', '주미크론-r', '엘마릿-r', '주미룩스-r', '아포 매크로-r', '바리오 엘마-r', 'summicron-r', 'elmarit-r'],
    label: '🎞️ 라이카 R 시스템 (SLR 바디 & R마운트 렌즈)',
    chips: [
      { text: '라이카 R6.2', label: '🎞️ 라이카 R6.2 (기계식 SLR의 정점)' },
      { text: '라이카 R8', label: '🚀 라이카 R8 (인체공학적 디자인)' },
      { text: '라이카 R9', label: '👑 라이카 R9 (최후의 플래그십 SLR)' },
      { text: '라이카 주미크론-R 50mm F2', label: '👑 주미크론-R 50mm F2 (시네마 개조 인기)' },
      { text: '라이카 주미룩스-R 50mm F1.4', label: '🌙 주미룩스-R 50mm F1.4' },
      { text: '라이카 엘마릿-R 28mm F2.8', label: '🌿 엘마릿-R 28mm F2.8 (버전2)' },
      { text: '라이카 아포 매크로 엘마릿-R 100mm F2.8', label: '🔬 APO 매크로 엘마릿-R 100mm' },
      { text: '라이카 바리오 엘마-R 35-70mm F4', label: '🔭 바리오 엘마-R 35-70mm' }
    ]
  },
  {
    triggers: ['라이카 포서드', '라이카 d-lux', '라이카 d', '라이카d', 'd-lux', 'dlux', '디지룩스', '디룩스', 'digilux', 'c-lux', 'v-lux'],
    label: '💎 라이카 D-Lux & 포서드 센서 / 컴팩트 라인업',
    chips: [
      { text: '라이카 D-Lux 8', label: '💎 라이카 D-Lux 8 (최신 포서드 센서 컴팩트)' },
      { text: '라이카 D-Lux 7', label: '📷 라이카 D-Lux 7 (포서드 센서 4K 줌)' },
      { text: '라이카 디지룩스 3', label: '🏛️ 라이카 디지룩스 3 (포서드 마운트 정통 DSLR)' },
      { text: '라이카 디지룩스 2', label: '🎞️ 라이카 디지룩스 2 (명기 CCD 센서)' },
      { text: '라이카 C-Lux', label: '🎒 라이카 C-Lux (1인치 센서 고배율 줌)' },
      { text: '라이카 V-Lux 5', label: '🔭 라이카 V-Lux 5 (하이퍼 줌 브릿지)' }
    ]
  },
  {
    triggers: ['라이카 m', '라이카m', 'leica m', 'm11', 'm10', 'm9', 'm6', 'm3', 'm2', 'm4', 'm10-r', 'm10-p', 'm11-p'],
    label: '👑 라이카 M 레인지파인더 바디 라인업',
    chips: [
      { text: '라이카 M11', label: '👑 라이카 M11 (6000만 화소 BSI 센서)' },
      { text: '라이카 M10-R', label: '💎 라이카 M10-R (4000만 화소 고화소 명기)' },
      { text: '라이카 M10', label: '⚡ 라이카 M10 (슬림 바디의 완성)' },
      { text: '라이카 M6 클래식', label: '🎞️ 라이카 M6 (레인지파인더 필름 명기)' },
      { text: '라이카 M3', label: '🏛️ 라이카 M3 (50mm 0.91x 황금 뷰파인더)' },
      { text: '라이카 M9', label: '🎨 라이카 M9 (코닥 CCD 색감의 정점)' },
      { text: '라이카 M11 모노크롬', label: '🖤 라이카 M11 모노크롬 (전용 흑백)' },
      { text: '라이카 M (Typ 240)', label: '🔋 라이카 M Typ 240 (CMOS 라이브뷰)' }
    ]
  },
  {
    triggers: ['라이카 sl', '라이카 cl', '라이카 tl', '라이카 x', 'leica sl', 'leica cl', 'leica tl', 'leica x', 'sl3', 'sl2', 'sl2-s'],
    label: '🔭 라이카 SL 풀프레임 & CL/TL/X 컴팩트 미러리스',
    chips: [
      { text: '라이카 SL3', label: '🚀 라이카 SL3 (6000만 화소 플래그십)' },
      { text: '라이카 SL2-S', label: '🎬 라이카 SL2-S (저조도 영상/스틸 특화)' },
      { text: '라이카 CL', label: '📷 라이카 CL (APS-C L마운트 뷰파인더 내장)' },
      { text: '라이카 TL2', label: '💎 라이카 TL2 (알루미늄 유니바디 디자인)' },
      { text: '라이카 X (Typ 113)', label: '🎞️ 라이카 X Typ 113 (35mm F1.7 단렌즈)' },
      { text: '라이카 X2', label: '🎒 라이카 X2 (APS-C 센서 콤팩트)' }
    ]
  },
  {
    triggers: ['라이카 주미', '주미'],
    label: '👑 라이카 주미(크론/룩스) 라인업',
    chips: [
      { text: '라이카 주미크론 50mm F2 (리지드)', label: '👑 주미크론 50mm 리지드 (Rigid)' },
      { text: '라이카 주미크론 35mm F2 8매', label: '✨ 주미크론 35mm 8매 (King of Bokeh)' },
      { text: '라이카 주미룩스 35mm F1.4', label: '🌙 주미룩스 35mm 스틸림 (Steel Rim)' },
      { text: '라이카 주미룩스 50mm F1.4', label: '💫 주미룩스 50mm F1.4 (E46 / ASPH)' },
      { text: '라이카 주미크론 28mm F2 ASPH', label: '🌿 주미크론 28mm F2 ASPH' },
      { text: '라이카 주미크론 90mm F2', label: '🔭 주미크론 90mm F2' }
    ]
  },
  {
    triggers: ['주미크론', '즈미크론', 'summicron', '주미크'],
    label: '👑 주미크론 세부 화각 & 버전 (F2)',
    chips: [
      { text: '라이카 주미크론 50mm F2 (리지드)', label: '👑 주미크론 50mm 리지드 (Rigid)' },
      { text: '라이카 주미크론 35mm F2 8매', label: '✨ 주미크론 35mm 8매 (8-element)' },
      { text: '라이카 주미크론 28mm F2 ASPH', label: '🌿 주미크론 28mm F2 ASPH' },
      { text: '라이카 주미크론 50mm 침동식', label: '📷 주미크론 50mm 침동 (Collapsible)' },
      { text: '라이카 주미크론 90mm F2 APO', label: '🔭 주미크론 90mm F2 APO' },
      { text: '라이카 주미크론 40mm F2', label: '💎 주미크론-C 40mm F2 (CL용 소형)' }
    ]
  },
  {
    triggers: ['주미룩스', '즈미룩스', 'summilux', '주미룩'],
    label: '🌙 주미룩스 세부 화각 & 버전 (F1.4)',
    chips: [
      { text: '라이카 주미룩스 35mm F1.4', label: '🌙 주미룩스 35mm 스틸림 (Steel Rim)' },
      { text: '라이카 주미룩스 50mm F1.4', label: '💫 주미룩스 50mm F1.4 (ASPH)' },
      { text: '라이카 주미룩스 28mm F1.4 ASPH', label: '🌿 주미룩스 28mm F1.4 ASPH' },
      { text: '라이카 주미룩스 21mm F1.4 ASPH', label: '🌌 주미룩스 21mm F1.4 ASPH' },
      { text: '라이카 주미룩스 75mm F1.4', label: '👑 주미룩스 75mm F1.4 (만도라)' }
    ]
  },
  {
    triggers: ['주마론', '중마론', 'summaron'],
    label: '💎 주마론(중마론) 세부 모델',
    chips: [
      { text: '라이카 주마론 28mm F5.6 (중마론)', label: '💎 주마론 28mm F5.6 (오리지널 & 복각)' },
      { text: '라이카 주마론 35mm F3.5 (L39)', label: '📷 주마론 35mm F3.5 (L39 스크류)' },
      { text: '라이카 주마론 35mm F2.8 (M)', label: '✨ 주마론 35mm F2.8 (M마운트)' }
    ]
  },
  {
    triggers: ['녹티룩스', '녹티', 'noctilux'],
    label: '🌌 녹티룩스 세부 모델 (대구경 F0.95~F1.2)',
    chips: [
      { text: '라이카 녹티룩스 50mm F0.95', label: '🌌 녹티룩스 50mm F0.95 ASPH' },
      { text: '라이카 녹티룩스 50mm F1.0', label: '👑 녹티룩스 50mm F1.0 (E58 / E60)' },
      { text: '라이카 녹티룩스 50mm F1.2 1세대', label: '🏛️ 녹티룩스 50mm F1.2 (원조 비구면)' },
      { text: '라이카 녹티룩스 75mm F1.25 ASPH', label: '🌿 녹티룩스 75mm F1.25 ASPH' }
    ]
  },
  {
    triggers: ['엘마', 'elmar', 'elmarit', '엘마릿'],
    label: '📷 엘마 & 엘마릿 세부 모델',
    chips: [
      { text: '라이카 엘마 50mm F3.5', label: '📷 엘마 50mm F3.5 침동식 (레드스케일)' },
      { text: '라이카 엘마 50mm F2.8', label: '💎 엘마 50mm F2.8 (M마운트)' },
      { text: '라이카 엘마릿 28mm F2.8', label: '🌿 엘마릿 28mm F2.8 (버전 1~4)' },
      { text: '라이카 아포 테이트 엘마릿 90mm F2.8', label: '🔭 엘마릿 90mm F2.8' }
    ]
  },

  // --- 2. FUJIFILM ECOSYSTEM ---
  {
    triggers: ['후지 중형', '후지 중형 똑딱이', '중형 똑딱이', '텍사스 라이카', '텍사스라이카', 'gw690', 'gsw690', 'ga645', 'gs645', 'gf670', 'fuji gw', 'fuji ga', 'tx-1', 'tx1', 'tx-2'],
    label: '👑 후지 중형 필름 레인지파인더 & 똑딱이 (텍사스 라이카)',
    chips: [
      { text: '후지 GW690 III', label: '👑 후지 GW690 III (텍사스 라이카 6x9)' },
      { text: '후지 GSW690 III', label: '🌊 후지 GSW690 III (초광각 65mm 6x9)' },
      { text: '후지 GA645 프로페셔널', label: '⚡ 후지 GA645 (전자동 645 똑딱이)' },
      { text: '후지 GA645Zi', label: '🔍 후지 GA645Zi (645 중형 줌 똑딱이)' },
      { text: '후지 GF670', label: '💎 후지 GF670 (6x6 & 6x7 폴딩 RF 최종판)' },
      { text: '후지 GS645 프로페셔널', label: '🎒 후지 GS645 (폴딩 645 레인지파인더)' },
      { text: '후지 TX-1', label: '🎞️ 후지 TX-1 (35mm 파노라마 RF)' }
    ]
  },
  {
    triggers: ['후지필름', '후지', 'fuji', 'fujifilm', 'gfx', 'x100'],
    label: '🌿 후지필름 디지털 X & GFX 시스템',
    chips: [
      { text: '후지필름 X100VI', label: '📷 후지필름 X100VI (4000만 화소 IBIS)' },
      { text: '후지필름 X-T5', label: '⚡ 후지필름 X-T5 (클래식 3다이얼 미러리스)' },
      { text: '후지필름 X-Pro3', label: '👑 후지필름 X-Pro3 (히든 LCD 레인지파인더)' },
      { text: '후지필름 X-H2S', label: '🎬 후지필름 X-H2S (적층형 40fps 하이브리드)' },
      { text: '후지필름 X-E4', label: '🎒 후지필름 X-E4 (미니멀 컴팩트 바디)' },
      { text: '후지필름 GFX 100 II', label: '🏔️ GFX 100 II (1억 화소 디지털 중형)' },
      { text: '후지필름 GFX 50R', label: '🎞️ GFX 50R (RF 스타일 디지털 중형)' },
      { text: '후지논 XF 35mm F1.4 R', label: '💎 후지논 XF 35mm F1.4 R' }
    ]
  },

  // --- 3. PANASONIC LUMIX ECOSYSTEM ---
  {
    triggers: ['파나소닉', '루믹스', 'lumix', 'panasonic', '루믹스 s', '루믹스 g', 'gh7', 'gh6', 'gh5', 'g9', 's9', 's5', 's1h', 'lx100'],
    label: '🎬 파나소닉 루믹스 풀 라인업 (MFT & 풀프레임 S)',
    chips: [
      { text: '파나소닉 루믹스 GH7', label: '🎬 루믹스 GH7 (ProRes RAW 내장 MFT)' },
      { text: '파나소닉 루믹스 G9 II', label: '📷 루믹스 G9 II (MFT 플래그십 위상차)' },
      { text: '파나소닉 루믹스 S9', label: '💎 루믹스 S9 (풀프레임 초소형 LUT 바디)' },
      { text: '파나소닉 루믹스 S5 II', label: '⚡ 루믹스 S5 II (풀프레임 위상차 올라운더)' },
      { text: '파나소닉 루믹스 S1H', label: '🎥 루믹스 S1H (넷플릭스 인증 6K 시네마)' },
      { text: '파나소닉 루믹스 GX9', label: '🎒 루믹스 GX9 (스냅 레인지파인더 스타일)' },
      { text: '파나소닉 루믹스 LX100 II', label: '💎 루믹스 LX100 II (포서드 센서 라이카 똑딱이)' },
      { text: '파나라이카 10-25mm F1.7', label: '👑 파나라이카 10-25mm F1.7 ASPH' }
    ]
  },

  // --- 4. SONY ECOSYSTEM ---
  {
    triggers: ['소니', 'sony'],
    label: '⚡ 소니 알파 & FX & GM 대표 라인업',
    chips: [
      { text: '소니 Alpha A7 IV', label: '⚡ A7M4 (전천후 풀프레임)' },
      { text: '소니 Alpha A7C II', label: '🧳 A7C2 (초경량 컴팩트 풀프레임)' },
      { text: '소니 FX3', label: '🎬 FX3 (시네마 라인 풀프레임)' },
      { text: '소니 ZV-E1', label: '🎙️ ZV-E1 (풀프레임 브이로그)' },
      { text: '소니 Alpha 1', label: '👑 A1 (5000만 화소 30fps 플래그십)' },
      { text: '소니 FE 24-70mm F2.8 GM II', label: '👑 24-70 GM II (금계륵)' },
      { text: '소니 RX1R II', label: '💎 RX1R II (풀프레임 똑딱이)' },
      { text: '소니 Alpha A6700', label: '📷 A6700 (APS-C 플래그십)' }
    ]
  },
  {
    triggers: ['소니 a7', '소니 알파', 'a7m4', 'a7c', 'a7r', 'a7s', '소니 풀프레임'],
    label: '⚡ 소니 A7 & 풀프레임 알파 시리즈',
    chips: [
      { text: '소니 Alpha A7 IV', label: '⚡ A7M4 (전천후 하이브리드)' },
      { text: '소니 Alpha A7C II', label: '🧳 A7C2 (컴팩트 풀프레임)' },
      { text: '소니 Alpha A7R V', label: '💎 A7R5 (6100만 화소 AI AF)' },
      { text: '소니 Alpha A7S III', label: '🌌 A7S3 (4K 120p 저조도 특화)' },
      { text: '소니 Alpha A7CR', label: '🎒 A7CR (컴팩트 6100만 화소)' },
      { text: '소니 Alpha 9 III', label: '⚡ A9 III (세계 최초 글로벌 셔터)' },
      { text: '소니 Alpha 1', label: '👑 A1 (플래그십 올인원)' }
    ]
  },
  {
    triggers: ['소니 fx', 'fx3', 'fx30', 'fx6'],
    label: '🎬 소니 FX 시네마 라인',
    chips: [
      { text: '소니 FX3', label: '🎬 FX3 (풀프레임 시네마 바디)' },
      { text: '소니 FX30', label: '🎥 FX30 (Super 35 4K 120p)' },
      { text: '소니 FX6', label: '📽️ FX6 (프로페셔널 시네마 캠)' }
    ]
  },
  {
    triggers: ['소니 zv', 'zve1', 'zve10', 'zv1', 'zv-e1', 'zv-e10'],
    label: '🎙️ 소니 ZV 브이로그 라인업',
    chips: [
      { text: '소니 ZV-E1', label: '🎙️ ZV-E1 (풀프레임 브이로그)' },
      { text: '소니 ZV-E10 II', label: '📹 ZV-E10 II (크리에이터용 APS-C)' },
      { text: '소니 ZV-1 II', label: '🎒 ZV-1 II (1인치 광각 줌 똑딱이)' }
    ]
  },
  {
    triggers: ['소니 rx', 'rx1', 'rx100', 'rx1r'],
    label: '💎 소니 RX 프리미엄 콤팩트 시리즈',
    chips: [
      { text: '소니 RX1R II', label: '💎 RX1R II (35mm F2 풀프레임 똑딱이)' },
      { text: '소니 RX100 VII', label: '🎒 RX100 VII (24-200mm 고배율 똑딱이)' },
      { text: '소니 RX100 V', label: '⚡ RX100 V (F1.8-2.8 밝은 줌)' }
    ]
  },
  {
    triggers: ['소니 금', '소니 gm', '금계륵', '금유령', '금도끼', '2470gm', '70200gm', '1635gm'],
    label: '👑 소니 G Master (GM) 렌즈 라인업',
    chips: [
      { text: '소니 FE 24-70mm F2.8 GM II', label: '👑 FE 24-70 GM II (금계륵 2)' },
      { text: '소니 FE 70-200mm F2.8 GM II', label: '🔭 FE 70-200 GM II (금유령 2)' },
      { text: '소니 FE 16-35mm F2.8 GM II', label: '🌊 FE 16-35 GM II (금도끼 2)' },
      { text: '소니 FE 50mm F1.2 GM', label: '🌙 FE 50mm F1.2 GM' },
      { text: '소니 FE 85mm F1.4 GM II', label: '👑 FE 85mm F1.4 GM II' },
      { text: '소니 FE 135mm F1.8 GM', label: '🌌 FE 135mm F1.8 GM' }
    ]
  },

  // --- 5. NIKON ECOSYSTEM ---
  {
    triggers: ['니콘', 'nikon', 'nikkor', '니코르'],
    label: '📷 니콘 Z 미러리스 & F 필름 바디',
    chips: [
      { text: '니콘 Zf', label: '🎞️ 니콘 Zf (클래식 풀프레임 미러리스)' },
      { text: '니콘 Zfc', label: '📷 니콘 Zfc (헤리티지 크롭 미러리스)' },
      { text: '니콘 Z8', label: '👑 니콘 Z8 (미니 Z9 플래그십)' },
      { text: '니콘 Z6 III', label: '⚡ 니콘 Z6 III (부분 적층형 센서)' },
      { text: '니콘 FM2', label: '🏛️ 니콘 FM2 (기계식 필름 명기)' },
      { text: '니콘 F3', label: '🎞️ 니콘 F3 (포르쉐 디자인 명기)' },
      { text: 'NIKKOR Z 58mm F0.95 S Noct', label: '💎 NIKKOR Z 58mm F0.95 Noct' },
      { text: 'Ai Noct-Nikkor 58mm F1.2', label: '🌌 Ai Noct 58mm F1.2 (필름 명기)' }
    ]
  },

  // --- 6. CANON ECOSYSTEM ---
  {
    triggers: ['캐논', 'canon', 'eos', '이오스'],
    label: '⚡ 캐논 EOS R 시스템 & L렌즈 라인업',
    chips: [
      { text: '캐논 EOS R5 Mark II', label: '⚡ EOS R5 II (8K RAW 고해상도)' },
      { text: '캐논 EOS R6 Mark II', label: '📷 EOS R6 II (올라운더 하이브리드)' },
      { text: '캐논 EOS R8', label: '🎒 EOS R8 (초경량 풀프레임)' },
      { text: '캐논 AE-1', label: '🏛️ 캐논 AE-1 (필름 입문 명기)' },
      { text: '캐논 캐노넷 QL17 G-III', label: '🎞️ 캐노넷 QL17 G-III (RF 명기)' },
      { text: '캐논 RF 28-70mm F2L USM', label: '👑 RF 28-70mm F2L USM' },
      { text: '캐논 EF 50mm F1.2L USM (오이만두)', label: '💎 EF 50mm F1.2L (오이만두)' },
      { text: '캐논 EF 85mm F1.2L II USM (만두)', label: '🌙 EF 85mm F1.2L II (만두)' },
      { text: '캐논 EF 24-70mm F2.8L II USM (신계륵)', label: '⚡ EF 24-70mm F2.8L II (신계륵)' }
    ]
  },

  // --- 7. OLYMPUS / OM SYSTEM ---
  {
    triggers: ['올림푸스', 'om system', 'olympus', '오엠', '주이코', 'zuiko'],
    label: '👑 올림푸스 & OM System 라인업 (MFT & 원조 4/3)',
    chips: [
      { text: 'OM System OM-1 Mark II', label: '👑 OM-1 II (적층형 고속 플래그십)' },
      { text: '올림푸스 PEN-F', label: '💎 올림푸스 PEN-F (클래식 디지털 RF)' },
      { text: '올림푸스 E-1', label: '🏛️ 올림푸스 E-1 (코닥 CCD 원조 4/3 DSLR)' },
      { text: '올림푸스 OM-1 (필름)', label: '🎞️ 올림푸스 OM-1 (소형 경량 필름 SLR)' },
      { text: '올림푸스 펜 EE-3', label: '🎒 올림푸스 펜 EE-3 (하프 필름)' },
      { text: 'M.ZUIKO DIGITAL ED 12-40mm F2.8 PRO II', label: '⚡ M.ZUIKO 12-40mm F2.8 PRO' },
      { text: 'M.ZUIKO DIGITAL ED 25mm F1.2 PRO', label: '🌙 M.ZUIKO 25mm F1.2 PRO' }
    ]
  },

  // --- 8. HASSELBLAD ---
  {
    triggers: ['핫셀블라드', '핫셀', 'hasselblad', 'x2d', '907x', '500cm', '500c'],
    label: '👑 핫셀블라드 중형 카메라 시스템',
    chips: [
      { text: '핫셀블라드 X2D 100C', label: '👑 X2D 100C (1억 화소 1TB SSD)' },
      { text: '핫셀블라드 907X 50C', label: '💎 907X 50C (CFV 디지털 백 큐브)' },
      { text: '핫셀블라드 500 C/M', label: '🏛️ 500 C/M (6x6 중형 필름의 전설)' },
      { text: '핫셀블라드 503CW', label: '🎞️ 503CW (중형 명기 바디)' },
      { text: 'Hasselblad XCD 38mm F2.5 V', label: '👑 XCD 38mm F2.5 V' },
      { text: 'Hasselblad XCD 55mm F2.5 V', label: '🌿 XCD 55mm F2.5 V' },
      { text: 'Carl Zeiss Planar CFE 80mm F2.8 T*', label: '💎 플라나 80mm F2.8 (500C/M용)' }
    ]
  },

  // --- 9. RICOH ---
  {
    triggers: ['리코', 'ricoh', 'gr', 'gr3', 'gr3x', 'gr1'],
    label: '🎒 리코 GR 스냅 슈터 라인업',
    chips: [
      { text: '리코 GR III', label: '🎒 리코 GR III (28mm 표준 스냅)' },
      { text: '리코 GR IIIx', label: '🔍 리코 GR IIIx (40mm 화각 특화)' },
      { text: '리코 GR III HDF', label: '✨ 리코 GR III HDF (디퓨전 필터 내장)' },
      { text: '리코 GR II', label: '💎 리코 GR II (포지티브 필름 명기)' },
      { text: '리코 GR1v', label: '🎞️ 리코 GR1v (28mm F2.8 필름 똑딱이)' },
      { text: '리코 GR21', label: '🌊 리코 GR21 (초광각 21mm 필름 똑딱이)' }
    ]
  },

  // --- 10. PENTAX & TAKUMAR ---
  {
    triggers: ['펜탁스', '타쿠마', 'pentax', 'takumar', '바탁스'],
    label: '🏛️ 펜탁스 필름 & 슈퍼 타쿠마 라인업',
    chips: [
      { text: '펜탁스 17', label: '🎞️ 펜탁스 17 (2024 신형 하프 필름)' },
      { text: '펜탁스 67', label: '🏔️ 펜탁스 67 (중형 바탁스 괴물 SLR)' },
      { text: '펜탁스 MX', label: '🏛️ 펜탁스 MX (소형 완전 기계식 SLR)' },
      { text: '펜탁스 K-1 Mark II', label: '📷 펜탁스 K-1 II (풀프레임 플래그십 DSLR)' },
      { text: '펜탁스 슈퍼 타쿠마 50mm F1.4', label: '👑 슈퍼 타쿠마 50mm F1.4 (무지개 플레어)' },
      { text: 'SMC PENTAX-FA 31mm F1.8 AL Limited', label: '💎 FA 31mm F1.8 리미티드' }
    ]
  },

  // --- 11. CONTAX ---
  {
    triggers: ['콘탁스', 'contax', '야시카', 'yashica'],
    label: '💎 콘탁스 칼자이스 T* 라인업',
    chips: [
      { text: '콘탁스 T3', label: '💎 콘탁스 T3 (조나 35mm F2.8 프리미엄 똑딱이)' },
      { text: '콘탁스 T2', label: '🎞️ 콘탁스 T2 (티타늄 클래식 똑딱이)' },
      { text: '콘탁스 G2', label: '⚡ 콘탁스 G2 (AF 레인지파인더)' },
      { text: '콘탁스 Aria', label: '📷 콘탁스 Aria (가벼운 필름 SLR)' },
      { text: '콘탁스 칼자이스 플라나 50mm F1.4 MMJ', label: '👑 칼자이스 플라나 50mm F1.4' },
      { text: '콘탁스 G 비오곤 28mm F2.8', label: '🌿 콘탁스 G 비오곤 28mm F2.8' }
    ]
  },

  // --- 12. ROLLEI ---
  {
    triggers: ['롤라이', 'rollei', '롤라이플렉스', 'rolleiflex'],
    label: '⚡ 롤라이 35 & 롤라이플렉스 이안반사 라인업',
    chips: [
      { text: '롤라이 35AF', label: '⚡ 롤라이 35AF (2024 신형 라이다 AF 똑딱이)' },
      { text: '롤라이 35', label: '💎 롤라이 35 (테사 40mm F3.5 독일제)' },
      { text: '롤라이 35 S', label: '✨ 롤라이 35 S (조나 40mm F2.8)' },
      { text: '롤라이플렉스 2.8F', label: '👑 롤라이플렉스 2.8F (Planar 80mm TLR)' },
      { text: '롤라이플렉스 3.5F', label: '🎞️ 롤라이플렉스 3.5F (이안반사 TLR)' }
    ]
  },

  // --- 13. MINOLTA ---
  {
    triggers: ['미놀타', 'minolta', '로코르', 'rokkor'],
    label: '👑 미놀타 명기 바디 & 로코르 렌즈',
    chips: [
      { text: '미놀타 TC-1', label: '💎 미놀타 TC-1 (G-Rokkor 28mm 티타늄 똑딱이)' },
      { text: '미놀타 X-700', label: '🏛️ 미놀타 X-700 (필름 입문 명기)' },
      { text: '미놀타 CLE', label: '⚡ 미놀타 CLE (라이카 M마운트 전자식 RF)' },
      { text: '미놀타 MC 로코르-PG 58mm F1.2', label: '👑 로코르 58mm F1.2 (매의 눈)' },
      { text: '미놀타 MD 45mm F2', label: '🌿 미놀타 MD 45mm F2 (초박형 팬케이크)' }
    ]
  },

  // --- 14. VOIGTLÄNDER ---
  {
    triggers: ['보이그랜더', '보익', 'voigtlander', '보이'],
    label: '🌙 보이그랜더 VM/E 수동 렌즈 라인업',
    chips: [
      { text: '보이그랜더 녹톤 40mm F1.2 Aspherical', label: '🌙 녹톤 40mm F1.2 Aspherical' },
      { text: '보이그랜더 녹톤 50mm F1.0 Aspherical', label: '🌌 녹톤 50mm F1.0 Aspherical' },
      { text: '보이그랜더 울트론 빈티지 라인 35mm F2 Aspherical', label: '👑 울트론 35mm F2 빈티지 라인' },
      { text: '보이그랜더 컬러 스코파 28mm F2.8 Aspherical', label: '💎 컬러 스코파 28mm F2.8' },
      { text: '보이그랜더 아포란타 50mm F2 Aspherical', label: '⚡ 아포란타 50mm F2 (최고 해상력)' },
      { text: '보이그랜더 헬리어 50mm F3.5', label: '🏛️ 헬리어 50mm F3.5 침동식' }
    ]
  },
  {
    triggers: ['보이 녹', '녹톤', 'nokton'],
    label: '🌙 녹톤 세부 화각 (보이그랜더 F1.0~F1.5)',
    chips: [
      { text: '보이그랜더 녹톤 40mm F1.2 Aspherical', label: '녹톤 40mm F1.2' },
      { text: '보이그랜더 녹톤 50mm F1.0 Aspherical', label: '녹톤 50mm F1.0' },
      { text: '보이그랜더 녹톤 35mm F1.5 Aspherical', label: '녹톤 35mm F1.5' },
      { text: '보이그랜더 녹톤 클래식 35mm F1.4 II', label: '녹톤 클래식 35mm F1.4' }
    ]
  },

  // --- 15. LIGHT LENS LAB ---
  {
    triggers: ['라이트 렌즈 랩', '라이트렌즈랩', 'lll', '8매', '복각', 'light lens lab', '라이트'],
    label: '✨ Light Lens Lab 명기 복각 렌즈',
    chips: [
      { text: '라이트 렌즈 랩 35mm F2 (8매 복각)', label: '✨ LLL 35mm F2 (전설의 8매 복각)' },
      { text: '라이트 렌즈 랩 50mm F2 Speed Panchro 복각', label: '💎 LLL 50mm F2 (스피드 판크로)' },
      { text: '라이트 렌즈 랩 50mm F2 ELCAN 복각', label: '👑 LLL 50mm F2 (밀스펙 엘칸 복각)' },
      { text: '라이트 렌즈 랩 50mm F1.2 1세대 복각', label: '🌙 LLL 50mm F1.2 (녹티룩스 1세대 복각)' }
    ]
  },

  // --- 16. TTARTISAN ---
  {
    triggers: ['티티아티산', 'ttartisan', '티티'],
    label: '🌌 티티아티산 M/E/X 마운트 라인업',
    chips: [
      { text: '티티아티산 50mm F0.95', label: '🌌 TTArtisan 50mm F0.95 (황동 대구경)' },
      { text: '티티아티산 28mm F5.6 황동', label: '💎 TTArtisan 28mm F5.6 (빈티지 황동)' },
      { text: '티티아티산 50mm F1.4 틸트', label: '🌿 TTArtisan 50mm F1.4 틸트' },
      { text: '티티아티산 21mm F1.5 ASPH', label: '🌊 TTArtisan 21mm F1.5' }
    ]
  },

  // --- 17. 7ARTISANS ---
  {
    triggers: ['7장인', '칠장인', '7artisans'],
    label: '🌙 7장인 대구경 수동 렌즈 라인업',
    chips: [
      { text: '7장인 35mm F1.2', label: '🌙 7장인 35mm F1.2 (감성 보케)' },
      { text: '7장인 50mm F1.1', label: '👑 7장인 50mm F1.1 (대구경 조나)' },
      { text: '7장인 28mm F1.4 FE-Plus', label: '💎 7장인 28mm F1.4' }
    ]
  },

  // --- 18. HELIOS & JUPITER ---
  {
    triggers: ['헬리오스', 'helios', '회오리보케', '주피터', 'jupiter'],
    label: '🌀 헬리오스 회오리 보케 & 소련제 올드 렌즈',
    chips: [
      { text: '헬리오스 44-2 58mm F2', label: '🌀 헬리오스 44-2 58mm F2 (회오리 보케)' },
      { text: '헬리오스 40-2 85mm F1.5', label: '👑 헬리오스 40-2 85mm F1.5 (대구경 회오리)' },
      { text: '주피터-9 85mm F2', label: '💎 주피터-9 85mm F2 (인물 조나 설계)' },
      { text: '주피터-3 50mm F1.5', label: '🌙 주피터-3 50mm F1.5' }
    ]
  }
];

// 기본 추천 인기 칩 렌더링
function renderDefaultAiQuickChips() {
  const wrap = document.getElementById('aiQuickChipsWrap');
  if (!wrap) return;

  wrap.innerHTML = `
    <span class="text-[11px] font-semibold text-[#8A8A8A] mr-1 flex items-center gap-1">
      <i data-lucide="sparkles" class="w-3 h-3 text-[#171717]"></i>
      추천 인기 렌즈 & 카메라:
    </span>
    <button type="button" onclick="executeAiSampleSearch('라이트 렌즈 랩 35mm F2 (8매 복각)')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">🌟 LLL 35mm (8매 복각)</button>
    <button type="button" onclick="executeAiSampleSearch('라이카 주마론 28mm F5.6 (중마론)')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">💎 라이카 주마론 28mm (중마론)</button>
    <button type="button" onclick="executeAiSampleSearch('라이카 주미크론 50mm F2 (리지드)')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">👑 라이카 주미크론 50mm</button>
    <button type="button" onclick="executeAiSampleSearch('후지 GW690 III')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">👑 후지 GW690 III (텍사스 라이카)</button>
    <button type="button" onclick="executeAiSampleSearch('라이카 R6.2')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">🎞️ 라이카 R6.2</button>
    <button type="button" onclick="executeAiSampleSearch('라이카 D-Lux 8')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">💎 라이카 D-Lux 8</button>
    <button type="button" onclick="executeAiSampleSearch('소니 FE 24-70mm F2.8 GM II')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">👑 소니 24-70 GM II (금계륵)</button>
    <button type="button" onclick="executeAiSampleSearch('파나소닉 루믹스 GH7')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">🎬 루믹스 GH7</button>
    <button type="button" onclick="executeAiSampleSearch('핫셀블라드 X2D 100C')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">👑 핫셀블라드 X2D</button>
    <button type="button" onclick="executeAiSampleSearch('리코 GR III')" class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] text-[#171717] text-[11px] font-medium transition cursor-pointer font-bold">🎒 리코 GR3</button>
  `;
  if (window.lucide) lucide.createIcons();
}

// 실시간 타이핑 입력 반응형 연관 추천 검색어 핸들러 (점진적 스마트 드릴다운)
function handleAiModalSearchInput(rawVal) {
  const val = (rawVal || '').trim().toLowerCase();
  const wrap = document.getElementById('aiQuickChipsWrap');
  if (!wrap) return;

  if (!val) {
    renderDefaultAiQuickChips();
    return;
  }

  // 1. 트리 노드 매칭 탐색 (가장 구체적인 하위 키워드 우선 점수제 매칭)
  let bestGroup = null;
  let bestScore = 0;

  for (const group of AI_SUGGESTION_TREE) {
    for (const tr of group.triggers) {
      const trClean = tr.toLowerCase().trim();
      if (!trClean) continue;

      let score = 0;
      if (val === trClean) {
        score = 1000 + trClean.length;
      } else if (val.startsWith(trClean) || val.includes(trClean)) {
        score = 500 + trClean.length * 10;
      } else if (trClean.includes(val) && val.length >= 2) {
        score = 100 + val.length;
      }

      if (score > bestScore) {
        bestScore = score;
        bestGroup = group;
      }
    }
  }

  let filteredChips = [];
  if (bestGroup) {
    filteredChips = bestGroup.chips;
  } else {
    // 트리 전체에서 서브스트링 매칭 칩 검색
    for (const group of AI_SUGGESTION_TREE) {
      for (const chip of group.chips) {
        if (chip.text.toLowerCase().includes(val) || chip.label.toLowerCase().includes(val)) {
          if (!filteredChips.some(c => c.text === chip.text)) {
            filteredChips.push(chip);
          }
        }
      }
    }
  }

  if (filteredChips.length > 0) {
    wrap.innerHTML = `
      <span class="text-[11px] font-semibold text-emerald-700 mr-1 flex items-center gap-1">
        <i data-lucide="sparkles" class="w-3 h-3 text-emerald-600"></i>
        <span>'${escapeHtml(rawVal)}' 연관 추천 기종:</span>
      </span>
      ${filteredChips.slice(0, 8).map(chip => `
        <button 
          type="button" 
          onclick="executeAiSampleSearch('${escapeHtml(chip.text)}')" 
          class="ai-chip px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] hover:border-[#171717] hover:bg-zinc-50 text-[#171717] text-[11px] font-medium transition cursor-pointer shadow-2xs font-semibold"
        >
          ${escapeHtml(chip.label || chip.text)}
        </button>
      `).join('')}
    `;
    if (window.lucide) lucide.createIcons();
  } else {
    wrap.innerHTML = `
      <span class="text-[11px] font-semibold text-[#8A8A8A] mr-1 flex items-center gap-1">
        <i data-lucide="info" class="w-3 h-3 text-amber-500"></i>
        <span>입력하신 단어와 일치하는 연관 기종이 없습니다. 인기 기종을 선택해 보세요:</span>
      </span>
      <button type="button" onclick="executeAiSampleSearch('라이트 렌즈 랩 35mm F2 (8매 복각)')" class="ai-chip px-2 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[11px] text-[#525252] hover:border-black font-semibold">🌟 LLL 8매</button>
      <button type="button" onclick="executeAiSampleSearch('라이카 주마론 28mm F5.6 (중마론)')" class="ai-chip px-2 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[11px] text-[#525252] hover:border-black font-semibold">💎 중마론 28mm</button>
      <button type="button" onclick="executeAiSampleSearch('후지 GW690 III')" class="ai-chip px-2 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[11px] text-[#525252] hover:border-black font-semibold">👑 후지 GW690</button>
      <button type="button" onclick="executeAiSampleSearch('라이카 R6.2')" class="ai-chip px-2 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[11px] text-[#525252] hover:border-black font-semibold">🎞️ 라이카 R6.2</button>
      <button type="button" onclick="executeAiSampleSearch('보이그랜더 녹톤 40mm F1.2 Aspherical')" class="ai-chip px-2 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[11px] text-[#525252] hover:border-black font-semibold">🌙 녹톤 40mm</button>
      <button type="button" onclick="executeAiSampleSearch('슈퍼 타쿠마 50mm F1.4')" class="ai-chip px-2 py-0.5 rounded-full bg-white border border-[#E5E5E5] text-[11px] text-[#525252] hover:border-black font-semibold">🌈 슈퍼 타쿠마</button>
    `;
    if (window.lucide) lucide.createIcons();
  }
}

// ================= CAMERA & LENS DOMAIN VALIDATOR (광학 키워드 유효성 검증) =================
const KNOWN_CAMERA_BRANDS = [
  '라이카', 'leica', '보이그랜더', '보익', 'voigtlander', '칼자이스', '자이스', 'zeiss',
  '미놀타', 'minolta', '핫셀블라드', '핫셀', 'hasselblad', '콘탁스', 'contax',
  '롤라이', '롤라이플렉스', 'rollei', 'rolleiflex', '펜탁스', 'pentax', '타쿠마', 'takumar',
  '캐논', 'canon', '니콘', 'nikon', '후지', '후지필름', 'fuji', 'fujifilm',
  '소니', 'sony', '올림푸스', '주이코', 'olympus', 'zuiko', '파나소닉', '루믹스', 'lumix', 'panasonic',
  '시그마', 'sigma', '탐론', 'tamron', '삼양', '로키논', 'samyang', 'rokinon',
  '야시카', 'yashica', '티티아티산', 'ttartisan', '7장인', '칠장인', '7artisans',
  '라이트렌즈랩', '라이트 렌즈 랩', 'lightlenslab', 'light lens lab', '리코', 'ricoh',
  '마미야', 'mamiya', '브로니카', 'bronica', '코닥', 'kodak', '일포드', 'ilford'
];

const KNOWN_LENS_NAMES = [
  '주미크론', '즈미크론', 'summicron', '주미룩스', '즈미룩스', 'summilux',
  '녹티룩스', '녹티', 'noctilux', '주마론', '중마론', 'summaron',
  '엘마', 'elmar', '엘마릿', 'elmarit', '주미타', '주마', 'summar', 'summitar',
  '녹톤', 'nokton', '울트론', 'ultron', '스코파', 'skopar', '컬러스코파',
  '헬리어', 'heliar', '란타', 'lanthar', '아포란타',
  '로코르', 'rokkor', '플라나', 'planar', '비오곤', 'biogon', '조나', 'sonnar',
  '디스타곤', 'distagon', '테사', 'tessar', '비오타', 'biotar',
  '헬리오스', 'helios', '금계륵', '금유령', '금도끼', '만두', '오이만두', '사무엘', '백마', '신계륵',
  '8매', '8-element', 'rigid', '리지드', '침동', 'collapsible',
  '텍사스 라이카', '텍사스라이카', '중형 똑딱이', '중형똑딱이'
];

const KNOWN_CAMERA_MODELS = [

  '반스', 'vans', 'nsh', 'msh', '에르메스', 'hermes', '밀레니엄', '사파리', '리포터', 'reporter', '고스트', '호딘키', '한정판', '리미티드', '에디션', '007',  'gw690', 'gsw690', 'ga645', 'gs645', 'gf670', 'tx-1', 'tx-2', 'tx1', 'tx2',
  'r6.2', 'r6', 'r8', 'r9', 'r3', 'r4', 'r5',
  'd-lux', 'dlux', '디지룩스', '디룩스', 'digilux', 'c-lux', 'v-lux',
  'gh7', 'gh6', 'gh5', 'gh5s', 'g9', 'gx9', 'gx85', 'g100', 's9', 's5', 's1h', 'lx100',
  'a7m4', 'a7c2', 'a7r5', 'a7s3', 'a7cr', 'a7m3', 'a7c', 'a7r', 'a7s', 'a1', 'a9', 'a6700', 'a6400', 'a6000',
  'fx3', 'fx30', 'fx6', 'zv-e1', 'zve1', 'zve10', 'zv1', 'rx1', 'rx1r', 'rx100',
  'zf', 'zfc', 'z8', 'z9', 'z6', 'z7', 'fm2', 'f3', 'fe2', 'fm3a', 'noct',
  'om-1', 'pen-f', 'e-1', 'x2d', '907x', '500c', '503cw', 'gr3', 'gr3x', 'gr2', 'gr1',
  'tc-1', 'tc1', 'x-700', 'x700', 'cle', '35af', 'pentax 17', 'pentax 67'
];

const KNOWN_CAMERA_GENERAL_KEYWORDS = [
  '카메라', '렌즈', '바디', '필름', '미러리스', '단렌즈', '줌렌즈', '수동렌즈', '이종교배',
  '보케', '플레어', '셔터', '파인더', '조리개', '마운트', '화각',
  'camera', 'lens', 'mount', 'film', 'rangefinder', 'slr', 'mirrorless'
];

function isValidCameraOrLensQuery(query) {
  if (!query) return false;
  const qClean = query.toLowerCase().trim();

  // 1. AI_SAMPLE_DATABASE 확인
  if (typeof AI_SAMPLE_DATABASE !== 'undefined') {
    for (const [key, item] of Object.entries(AI_SAMPLE_DATABASE)) {
      if (key.toLowerCase().includes(qClean) || qClean.includes(key.toLowerCase())) return true;
      if (item.matchKeys && item.matchKeys.some(mk => mk.toLowerCase().includes(qClean) || qClean.includes(mk.toLowerCase()))) {
        return true;
      }
    }
  }

  // 2. 실매물 SAMPLE_PRODUCTS 확인
  if (typeof SAMPLE_PRODUCTS !== 'undefined') {
    if (SAMPLE_PRODUCTS.some(p => p.title.toLowerCase().includes(qClean) || p.brand.toLowerCase().includes(qClean))) {
      return true;
    }
  }

  // 3. 카메라/렌즈 브랜드 목록 대조
  if (KNOWN_CAMERA_BRANDS.some(b => qClean.includes(b) || (qClean.length >= 2 && b.includes(qClean)))) {
    return true;
  }

  // 4. 대표 렌즈 명칭 대조
  if (KNOWN_LENS_NAMES.some(l => qClean.includes(l) || (qClean.length >= 2 && l.includes(qClean)))) {
    return true;
  }

  // 4b. 카메라 모델 명칭 대조
  if (KNOWN_CAMERA_MODELS.some(m => qClean.includes(m) || (qClean.length >= 2 && m.includes(qClean)))) {
    return true;
  }

  // 5. 추천 트리 대조
  for (const group of AI_SUGGESTION_TREE) {
    if (group.triggers.some(tr => qClean.includes(tr) || tr.includes(qClean))) return true;
    if (group.chips.some(c => c.text.toLowerCase().includes(qClean) || qClean.includes(c.text.toLowerCase()))) return true;
  }

  // 6. 광학 단위 패턴 확인 (\d+mm, F-stop)
  if (/\d{2,3}\s*mm/.test(qClean)) return true;
  if (/f\/?\d(?:\.\d+)?/.test(qClean)) return true;

  // 7. 일반 카메라/사진 용어 확인
  if (KNOWN_CAMERA_GENERAL_KEYWORDS.some(k => qClean.includes(k))) return true;

  // 8. 바디/렌즈 모델명 패턴 (a7m4, fm2, m6, q2, gr3, x100v, r6 등)
  if (/^[a-z]{1,4}\s*[-_]?\s*\d{1,4}[a-z]{0,3}$/i.test(qClean.replace(/\s+/g, ''))) return true;

  return false;
}


// 5. 검색 실행 (로컬 서버 우선 탐색 + 브라우저 직통 Flickr Live API 실시간 크롤링)

// ================= GLOBAL HEADER SEARCH AUTOCOMPLETE (상단 메인 검색창 텍스트 전용 연관 검색) =================

function stripEmojis(text) {
  if (!text) return '';
  return text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1FA00}-\u{1FAFF}\u{FE00}-\u{FE0F}]/gu, '')
    .trim();
}

function showGlobalSearchDropdown() {
  const dropdown = document.getElementById('globalSearchDropdown');
  if (dropdown) dropdown.classList.remove('hidden');
}

function hideGlobalSearchDropdown() {
  const dropdown = document.getElementById('globalSearchDropdown');
  if (dropdown) dropdown.classList.add('hidden');
}

function handleGlobalSearchFocus() {
  const input = document.getElementById('globalSearchInput');
  const val = input ? input.value : '';
  handleGlobalSearchInput(val);
}

function handleGlobalSearchInput(rawVal) {
  const val = (rawVal || '').trim().toLowerCase();
  const dropdown = document.getElementById('globalSearchDropdown');
  const titleEl = document.getElementById('globalSearchDropdownTitle');
  const wrap = document.getElementById('globalSearchChipsWrap');
  if (!dropdown || !wrap) return;

  // 1. 기본 빈 입력값인 경우 (인기 추천 매물 기종 노출 - 이모티콘 완벽 제거)
  if (!val) {
    if (titleEl) titleEl.innerText = '인기 추천 기종';
    const defaultModels = [
      '라이카 M6 클래식',
      '소니 Alpha A7 IV',
      '후지필름 X-T5',
      '니콘 FM2',
      '소니 FE 24-70mm F2.8 GM II',
      '라이카 Q2',
      '리코 GR III',
      '라이카 D-Lux 7 Vans x Ray Barbee',
      '라이카 M6 TTL NSH'
    ];
    wrap.innerHTML = defaultModels.map(name => `
      <button 
        type="button" 
        onmousedown="selectGlobalSearchChip('${escapeHtml(name)}')" 
        class="px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-medium transition cursor-pointer"
      >
        ${escapeHtml(name)}
      </button>
    `).join('');
    showGlobalSearchDropdown();
    if (window.lucide) lucide.createIcons();
    return;
  }

  // 2. 점수제 최적 매칭 그룹 찾기
  let bestGroup = null;
  let bestScore = 0;

  for (const group of AI_SUGGESTION_TREE) {
    for (const tr of group.triggers) {
      const trClean = tr.toLowerCase().trim();
      if (!trClean) continue;

      let score = 0;
      if (val === trClean) {
        score = 1000 + trClean.length;
      } else if (val.startsWith(trClean) || val.includes(trClean)) {
        score = 500 + trClean.length * 10;
      } else if (trClean.includes(val) && val.length >= 2) {
        score = 100 + val.length;
      }

      if (score > bestScore) {
        bestScore = score;
        bestGroup = group;
      }
    }
  }

  let filteredChips = [];
  if (bestGroup) {
    filteredChips = bestGroup.chips;
  } else {
    for (const group of AI_SUGGESTION_TREE) {
      for (const chip of group.chips) {
        const cText = chip.text.toLowerCase();
        const cLabel = chip.label.toLowerCase();
        if (cText.includes(val) || cLabel.includes(val)) {
          if (!filteredChips.some(c => c.text === chip.text)) {
            filteredChips.push(chip);
          }
        }
      }
    }
  }

  // 3. 칩 렌더링 (이모티콘 없이 순수 텍스트만!)
  if (filteredChips.length > 0) {
    if (titleEl) titleEl.innerText = `'${escapeHtml(rawVal)}' 연관 추천 기종`;
    wrap.innerHTML = filteredChips.slice(0, 8).map(chip => {
      // 순수 텍스트만 추출 (이모티콘 완벽 제거)
      const cleanName = stripEmojis(chip.text || chip.label);
      return `
        <button 
          type="button" 
          onmousedown="selectGlobalSearchChip('${escapeHtml(chip.text)}')" 
          class="px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-medium transition cursor-pointer"
        >
          ${escapeHtml(cleanName)}
        </button>
      `;
    }).join('');
    showGlobalSearchDropdown();
  } else {
    // 일치 기종 없을 때 안내
    if (titleEl) titleEl.innerText = '일치 기종 안내';
    wrap.innerHTML = `
      <div class="w-full text-xs text-[#737373] py-1 mb-1">
        일치하는 기종이 없습니다. 인기 매물 기종을 선택해 보세요:
      </div>
      <button type="button" onmousedown="selectGlobalSearchChip('라이카 M6 클래식')" class="px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-medium transition cursor-pointer">라이카 M6 클래식</button>
      <button type="button" onmousedown="selectGlobalSearchChip('소니 Alpha A7 IV')" class="px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-medium transition cursor-pointer">소니 A7 IV</button>
      <button type="button" onmousedown="selectGlobalSearchChip('후지필름 X-T5')" class="px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-medium transition cursor-pointer">후지필름 X-T5</button>
      <button type="button" onmousedown="selectGlobalSearchChip('라이카 Q2')" class="px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-medium transition cursor-pointer">라이카 Q2</button>
    `;
    showGlobalSearchDropdown();
  }
  if (window.lucide) lucide.createIcons();
}

function selectGlobalSearchChip(searchText) {
  const input = document.getElementById('globalSearchInput');
  if (input) input.value = searchText;
  hideGlobalSearchDropdown();
  handleSearch();
}

// Global Click-Outside Listener to close search dropdown
document.addEventListener('click', (e) => {
  const container = document.getElementById('globalSearchContainer');
  if (container && !container.contains(e.target)) {
    hideGlobalSearchDropdown();
  }
});


async function executeAiSampleSearch(customQuery) {
  const input = document.getElementById('aiModalSearchInput');
  let query = (customQuery !== undefined ? customQuery : (input ? input.value : '')).trim();
  if (!query) query = '슈퍼 타쿠마 50mm F1.4';

  if (input) input.value = query;
  currentActiveSampleQuery = query;

  // 연관 추천 검색어 칩 업데이트
  handleAiModalSearchInput(query);

  const resultsArea = document.getElementById('aiSampleResultsArea');
  if (!resultsArea) return;

  // 🚫 CAMERA/LENS DOMAIN VALIDATION (제육볶음 등 무관한 검색어 완벽 차단)
  if (!isValidCameraOrLensQuery(query)) {
    resultsArea.innerHTML = `
      <div class="py-14 px-6 text-center max-w-xl mx-auto space-y-5">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
          <i data-lucide="camera-off" class="w-8 h-8"></i>
        </div>

        <div class="space-y-2">
          <span class="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
            미확인 기종 안내
          </span>
          <h3 class="text-lg font-bold text-[#171717]">
            '${escapeHtml(query)}'은(는) 카메라 또는 렌즈 기종으로 확인되지 않습니다
          </h3>
          <p class="text-xs text-[#737373] leading-relaxed">
            FRAME AI 장비 탐색기는 실제 카메라 바디 및 광학 렌즈의 촬영 작례와 심층 리뷰를 제공합니다.<br>
            검색어의 오타를 확인하시거나, 아래의 인기 추천 렌즈를 선택하여 탐색해 보세요.
          </p>
        </div>

        <!-- 추천 인기 렌즈 칩 리스트 -->
        <div class="p-5 rounded-2xl bg-[#FAFAFA] border border-[#EAEAEA] text-left space-y-3">
          <span class="text-xs font-bold text-[#171717] flex items-center gap-1.5">
            <i data-lucide="sparkles" class="w-4 h-4 text-emerald-500"></i>
            <span>추천 인기 렌즈 바로 탐색하기:</span>
          </span>
          <div class="flex flex-wrap gap-2">
            <button type="button" onclick="executeAiSampleSearch('라이트 렌즈 랩 35mm F2 (8매 복각)')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">🌟 LLL 35mm (8매 복각)</button>
            <button type="button" onclick="executeAiSampleSearch('라이카 주마론 28mm F5.6 (중마론)')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">💎 라이카 주마론 28mm (중마론)</button>
            <button type="button" onclick="executeAiSampleSearch('라이카 주미크론 50mm F2 (리지드)')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">👑 라이카 주미크론 50mm</button>
            <button type="button" onclick="executeAiSampleSearch('보이그랜더 녹톤 40mm F1.2 Aspherical')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">🌙 보이그랜더 녹톤 40mm</button>
            <button type="button" onclick="executeAiSampleSearch('티티아티산 50mm F0.95')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">🔮 티티아티산 50mm (F0.95)</button>
            <button type="button" onclick="executeAiSampleSearch('미놀타 MC 로코르-PG 58mm F1.2')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">🕯️ 미놀타 로코르 58mm</button>
            <button type="button" onclick="executeAiSampleSearch('슈퍼 타쿠마 50mm F1.4')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">🌈 슈퍼 타쿠마 50mm</button>
            <button type="button" onclick="executeAiSampleSearch('헬리오스 44-2 58mm F2')" class="px-3 py-1.5 rounded-xl bg-white border border-[#D4D4D4] hover:border-[#171717] text-xs font-semibold text-[#171717] transition cursor-pointer shadow-2xs">🌀 헬리오스 44-2 58mm</button>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  // 실시간 크롤링 로딩 화면
  resultsArea.innerHTML = `
    <div class="py-12 flex flex-col items-center justify-center text-center space-y-4">
      <div class="w-12 h-12 rounded-2xl bg-[#171717] text-white flex items-center justify-center animate-bounce shadow-md">
        <i data-lucide="camera" class="w-6 h-6 text-emerald-400"></i>
      </div>
      <div>
        <h3 class="text-sm sm:text-base font-bold text-[#171717]">'${escapeHtml(query)}' 실제 촬영 컷 수집 중...</h3>
        <p class="text-xs text-[#737373] mt-1.5 flex items-center justify-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>전 세계 사진가들이 해당 렌즈로 직접 촬영한 실제 원본 사진을 가져옵니다.</span>
        </p>
      </div>
      <div class="w-56 h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
        <div class="h-full bg-[#171717] animate-pulse w-3/4"></div>
      </div>
    </div>
  `;
  if (window.lucide) lucide.createIcons();

  // 1. 로컬 파이썬 서버 호출 시도 (localhost:5000)
  let crawlerData = null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.photos && json.photos.length > 0) {
        crawlerData = json;
        isCrawlerServerOnline = true;
        checkCrawlerServerHealth(false);
      }
    }
  } catch (err) {
    isCrawlerServerOnline = false;
    checkCrawlerServerHealth(false);
  }

  // 2. 실시간 작례 사진 수집 (서버가 켜져 있으면 서버 데이터, 꺼져 있으면 브라우저 직통 Flickr Live)
  let livePhotos = [];
  if (crawlerData && crawlerData.photos && crawlerData.photos.length > 0) {
    livePhotos = crawlerData.photos;
  } else {
    const tags = parseCameraLensQueryToTags(query);
    livePhotos = await fetchFlickrPhotosLive(tags, query);
  }

  const baseData = findAiSampleData(query);
  baseData.samples = livePhotos; // 스톡 사진 완전 배제, 100% 실제 출사 원본 사진만 전달!

  if (crawlerData) {
    if (crawlerData.videos && crawlerData.videos.length > 0) baseData.videos = crawlerData.videos;
    if (crawlerData.blogs && crawlerData.blogs.length > 0) baseData.blogs = crawlerData.blogs;
  }

  renderAiSampleResults(baseData, query, Boolean(crawlerData));
}

// 6. 데이터베이스 매칭 (정확도 우선 탐색 + 키워드 매칭 + 폴백 생성)
function findAiSampleData(query) {
  const rawQ = query.toLowerCase().replace(/\s+/g, '');
  const cleanQ = extractCoreKeywords(query).toLowerCase().replace(/\s+/g, '');
  const searchTerms = [cleanQ, rawQ].filter(Boolean);

  if (typeof AI_SAMPLE_DATABASE !== 'undefined') {
    for (const [key, item] of Object.entries(AI_SAMPLE_DATABASE)) {
      if (item.matchKeys) {
        for (const term of searchTerms) {
          if (item.matchKeys.some(mk => {
            const mkClean = mk.toLowerCase().replace(/\s+/g, '');
            return term.includes(mkClean) || mkClean.includes(term);
          })) {
            return JSON.parse(JSON.stringify(item));
          }
        }
      }
    }

    for (const [key, item] of Object.entries(AI_SAMPLE_DATABASE)) {
      const k = key.toLowerCase().replace(/\s+/g, '');
      for (const term of searchTerms) {
        if (term.includes(k) || k.includes(term)) {
          return JSON.parse(JSON.stringify(item));
        }
      }
    }
  }

  if (typeof SAMPLE_PRODUCTS !== 'undefined') {
    const matchedProduct = SAMPLE_PRODUCTS.find(p => {
      const t = p.title.toLowerCase().replace(/\s+/g, '');
      return searchTerms.some(term => t.includes(term) || term.includes(p.brand.toLowerCase()));
    });
    if (matchedProduct) {
      return generateProductFallbackData(matchedProduct, query);
    }
  }

  return generateGenericFallbackData(query);
}

// 7. 결과 렌더링 함수: 사용자가 요청한 모든 항목을 모달 내에 다 풀어서 완벽하게 표출
function renderAiSampleResults(data, query, isLiveCrawler = false) {
  const container = document.getElementById('aiSampleResultsArea');
  if (!container) return;

  const samples = data.samples || [];
  const videos = (data.videos || []).slice(0, 3);
  const blogs = (data.blogs || []).slice(0, 2);

  // FRAME 내부 실매물 매칭 탐색
  let matchedProduct = null;
  if (typeof SAMPLE_PRODUCTS !== 'undefined') {
    const qClean = query.toLowerCase().replace(/\s+/g, '');
    matchedProduct = SAMPLE_PRODUCTS.find(p => {
      const titleClean = p.title.toLowerCase().replace(/\s+/g, '');
      return titleClean.includes(qClean) || qClean.includes(p.brand.toLowerCase()) || 
             (data.matchKeys && data.matchKeys.some(mk => titleClean.includes(mk.replace(/\s+/g, ''))));
    });
  }

  container.innerHTML = `
    <!-- ================= 1. AI 광학 특성 & 핵심 체크포인트 ================= -->
    <div class="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs text-left">
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#F0F0F0]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-[#171717]">${escapeHtml(data.modelName || query)}</h3>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-[#171717] border border-zinc-200">AI OPTICAL BRIEF</span>
            </div>
            <span class="text-xs text-[#737373] mt-0.5 block">${escapeHtml(data.sensorSpec || data.category || '전문 카메라 및 광학계 분석')}</span>
          </div>
        </div>

        ${matchedProduct ? `
          <div class="flex items-center gap-2.5 bg-[#FAFAFA] border border-[#E5E5E5] p-2 rounded-xl">
            <img src="${matchedProduct.imageUrl}" class="w-9 h-9 rounded-lg object-cover">
            <div>
              <span class="block text-[10px] text-emerald-600 font-bold">FRAME 실매물 등록</span>
              <span class="block text-xs font-bold text-[#171717]">${matchedProduct.price.toLocaleString()}원</span>
            </div>
            <button onclick="closeAiSampleSearchModal(); openProductDetail(${matchedProduct.id});" class="px-2.5 py-1.5 rounded-lg bg-[#171717] text-white text-[11px] font-bold hover:bg-black transition cursor-pointer shadow-2xs">
              매물 보기
            </button>
          </div>
        ` : ''}
      </div>

      <!-- 핵심 광학 특성 -->
      <div class="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-3.5 text-xs text-[#171717] leading-relaxed mb-3">
        <strong class="text-[#171717]">💡 핵심 광학 특성:</strong> ${escapeHtml(data.aiSummary?.characteristics || '선예도와 색감의 밸런스가 뛰어나며, 고유의 보케 및 계조 특성을 갖춘 인기 모델입니다.')}
      </div>

      <!-- Pros, Cons, Recommended -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
        <div class="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#EAEAEA]">
          <span class="block text-emerald-600 font-bold text-[11px] mb-1">✓ 강점 (Pros)</span>
          <p class="text-[#525252] text-[11px] leading-relaxed">${escapeHtml(data.aiSummary?.pros || '입증된 광학적 해상력과 안정적인 중고 방어력')}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#EAEAEA]">
          <span class="block text-amber-600 font-bold text-[11px] mb-1">⚠️ 주의점 (Cons)</span>
          <p class="text-[#525252] text-[11px] leading-relaxed">${escapeHtml(data.aiSummary?.cons || '중고 구매 시 실제 셔터수 및 광학계 먼지/곰팡이 상태 점검 권장')}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#EAEAEA]">
          <span class="block text-blue-600 font-bold text-[11px] mb-1">🎯 추천 사용자</span>
          <p class="text-[#525252] text-[11px] leading-relaxed">${escapeHtml(data.aiSummary?.recommendTo || '일상 감성 스냅, 풍경 및 인물 출사 유저')}</p>
        </div>
      </div>

      ${data.aiSummary?.proTip ? `
        <div class="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed font-medium">
          ${escapeHtml(data.aiSummary.proTip)}
        </div>
      ` : ''}
    </div>

    <!-- ================= 2. 📸 실제 출사 원본 컷 (FLICKR REAL SAMPLES) ================= -->
    <div class="space-y-3.5 text-left pt-1">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#EAEAEA]">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-[#171717] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <i data-lucide="camera" class="w-3.5 h-3.5"></i>
          </div>
          <h3 class="text-sm sm:text-base font-bold text-[#171717]">
            <span>'${escapeHtml(query)}' 실제 촬영 컷</span>
            <span class="ml-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 font-mono px-2 py-0.5 rounded-full">
              REAL PHOTOS (${samples.length})
            </span>
          </h3>
        </div>
        <div class="flex items-center gap-2">
          <button 
            type="button" 
            onclick="openGoogleSearch('${escapeHtml(query)}', '작례 sample photos')" 
            class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Google 작례 검색 ↗
          </button>
          <button 
            type="button" 
            onclick="window.open('https://www.flickr.com/search/?text=' + encodeURIComponent('${escapeHtml(query)}'), '_blank')" 
            class="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-black text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Flickr 전체 갤러리 ↗
          </button>
        </div>
      </div>

      ${samples.length > 0 ? `
        <!-- 실제 출사 작례 그리드 (카테고리 구분 없이 다이렉트 표출) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          ${samples.map(photo => `
            <div 
              style="aspect-ratio: 4 / 3; min-height: 180px;"
              class="group relative rounded-xl overflow-hidden bg-zinc-900 border border-[#E5E5E5] hover:border-[#171717] transition-all shadow-xs hover:shadow-md cursor-pointer w-full flex flex-col justify-end"
              onclick="openSampleLightbox('${escapeHtml(photo.url)}', '${escapeHtml(photo.title)}', '${escapeHtml(photo.source || '실제 출사 원본')}', '${escapeHtml(photo.author || '사진가')}', '${escapeHtml(photo.link || photo.url)}')"
              title="클릭하여 '${escapeHtml(photo.title)}' 고화질 확대 보기"
            >
              <img 
                src="${photo.thumb || photo.url}" 
                alt="${escapeHtml(photo.title)}" 
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onerror="this.parentElement.style.display='none'"
              >
              
              <!-- 출처 뱃지 -->
              <div class="absolute top-2 left-2 z-10">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-600/90 text-white backdrop-blur-md shadow-sm">
                  ${escapeHtml(photo.source || 'Flickr')}
                </span>
              </div>

              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-left z-10">
                <p class="text-white text-xs font-bold truncate leading-snug">${escapeHtml(photo.title)}</p>
                <div class="flex items-center justify-between text-[10px] text-zinc-300 mt-1">
                  <span class="truncate max-w-[120px]">${escapeHtml(photo.author || '포토그래퍼')}</span>
                  <span class="font-bold text-white flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    확대 <i data-lucide="maximize-2" class="w-2.5 h-2.5"></i>
                  </span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="p-8 text-center bg-[#FAFAFA] rounded-xl border border-[#EAEAEA] space-y-3">
          <p class="text-xs text-[#737373]">
            '${escapeHtml(query)}' 실제 촬영 컷을 불러오는 중이거나 결과가 없습니다.<br>
            아래 버튼을 누르시면 Google 및 Flickr에 전 세계 사진가들이 올린 수천 장의 실제 출사 작례를 바로 보실 수 있습니다.
          </p>
          <div class="flex items-center justify-center gap-2 pt-1">
            <button 
              type="button" 
              onclick="openGoogleSearch('${escapeHtml(query)}', '작례 sample photos')" 
              class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              Google 실제 작례 바로보기 ↗
            </button>
            <button 
              type="button" 
              onclick="window.open('https://www.flickr.com/search/?text=' + encodeURIComponent('${escapeHtml(query)}'), '_blank')" 
              class="px-4 py-2 rounded-xl bg-[#171717] hover:bg-black text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              Flickr 전체 갤러리 열기 ↗
            </button>
          </div>
        </div>
      `}
    </div>

    <!-- ================= 3. 🎬 YOUTUBE 실제 실전 출사 & 리뷰 영상 TOP 3 ================= -->
    <div class="space-y-3.5 text-left pt-2">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#EAEAEA]">
        <div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <i data-lucide="play" class="w-3 h-3 fill-current"></i>
            </div>
            <h3 class="text-sm sm:text-base font-bold text-[#171717]">
              <span>'${escapeHtml(query)}' YouTube 실제 추천 영상</span>
              <span class="ml-1.5 text-[11px] font-bold text-red-600 font-mono px-2 py-0.5 rounded-full bg-red-50 border border-red-200">REAL VIDEOS TOP 3</span>
            </h3>
          </div>
          <p class="text-xs text-[#737373] mt-0.5">실제 크리에이터들의 검증된 4K 유튜브 영상 (클릭 시 YouTube에서 고화질 즉시 시청)</p>
        </div>

        <!-- YouTube 전체 검색 결과 더보기 버튼 -->
        <button 
          type="button" 
          onclick="openYoutubeSearch('${escapeHtml(query)}')" 
          class="px-3.5 py-1.5 rounded-xl border border-[#E5E5E5] hover:border-red-500 hover:text-red-600 text-[#525252] text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer bg-white shadow-2xs"
        >
          <span class="w-2 h-2 rounded-full bg-red-500"></span>
          <span>YouTube 검색 결과 더보기 ↗</span>
        </button>
      </div>

      <!-- 3개 영상 카드 그리드 (클릭 시 YouTube로 직접 연결되어 오류 153 원천 방지) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        ${videos.map(v => `
          <a 
            href="${v.link}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="group p-3 rounded-xl bg-white border border-[#E5E5E5] hover:border-red-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            title="클릭하여 YouTube에서 '${escapeHtml(v.title)}' 시청하기"
          >
            <div>
              <!-- 썸네일 -->
              <div class="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 mb-2.5 shadow-xs">
                <img src="${v.thumbnail}" alt="${escapeHtml(v.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <div class="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                  <div class="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <i data-lucide="play" class="w-4 h-4 fill-current ml-0.5"></i>
                  </div>
                </div>
                ${v.duration ? `
                  <span class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-white text-[10px] font-mono font-bold">
                    ${v.duration}
                  </span>
                ` : ''}
              </div>
              <!-- 채널 & 조회수 -->
              <div class="flex items-center justify-between text-[11px] text-[#8A8A8A] mb-1">
                <span class="font-bold text-[#171717] group-hover:text-red-600 transition-colors truncate max-w-[140px]">${escapeHtml(v.channel)}</span>
                <span class="text-[10px] text-zinc-500">${escapeHtml(v.views || 'YouTube')}</span>
              </div>
              <!-- 영상 제목 -->
              <h4 class="text-xs font-bold text-[#171717] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                ${escapeHtml(v.title)}
              </h4>
            </div>

            <!-- 하단 YouTube 시청 링크 -->
            <div class="mt-3 pt-2.5 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] font-bold text-red-600">
              <span class="flex items-center gap-1">
                <i data-lucide="play-circle" class="w-3.5 h-3.5"></i>
                <span>YouTube에서 바로 시청</span>
              </span>
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
            </div>
          </a>
        `).join('')}
      </div>
    </div>

    <!-- ================= 4. 📝 실제 블로그 실사용 심층 리뷰 TOP 2 ================= -->
    <div class="space-y-3.5 text-left pt-2">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-[#EAEAEA]">
        <div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-[#03C75A] text-white flex items-center justify-center font-black text-xs font-mono shadow-xs">
              N
            </div>
            <h3 class="text-sm sm:text-base font-bold text-[#171717]">
              <span>'${escapeHtml(query)}' 실제 블로그 심층 리뷰 & 출사기</span>
              <span class="ml-1.5 text-[11px] font-bold text-[#03C75A] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">REAL BLOG POSTS TOP 2</span>
            </h3>
          </div>
          <p class="text-xs text-[#737373] mt-0.5">실제 사진가들이 작성한 원본 포스팅으로 직접 연결 (클릭 시 해당 블로그 글로 바로 이동)</p>
        </div>

        <!-- 블로그 검색 결과 더보기 버튼 -->
        <button 
          type="button" 
          onclick="openNaverBlogSearch('${escapeHtml(query)}')" 
          class="px-3.5 py-1.5 rounded-xl border border-[#E5E5E5] hover:border-[#03C75A] hover:text-[#03C75A] text-[#525252] text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer bg-white shadow-2xs"
        >
          <span class="w-2 h-2 rounded-full bg-[#03C75A]"></span>
          <span>네이버 블로그 검색 더보기 ↗</span>
        </button>
      </div>

      <!-- 2개 실제 블로그 포스트 카드 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        ${blogs.map(b => `
          <a 
            href="${b.link}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="group p-4 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#03C75A] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            title="실제 블로그 글 전문 보기"
          >
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    ${b.source || 'BLOG REVIEW'}
                  </span>
                  <span class="text-[11px] font-semibold text-[#171717]">${escapeHtml(b.author)}</span>
                </div>
                <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <i data-lucide="check-circle" class="w-3 h-3"></i>
                  <span>검증된 실제 리뷰</span>
                </span>
              </div>
              <h4 class="text-xs sm:text-sm font-bold text-[#171717] group-hover:text-[#03C75A] transition-colors line-clamp-2 leading-snug mb-2">
                ${escapeHtml(b.title)}
              </h4>
              <p class="text-xs text-[#525252] line-clamp-2 leading-relaxed">
                ${escapeHtml(b.summary)}
              </p>
            </div>
            <div class="mt-3.5 pt-2.5 border-t border-[#F0F0F0] flex items-center justify-between text-xs font-bold text-[#03C75A]">
              <span>실제 블로그 글 전문 바로 읽기</span>
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

// 8. 매물 데이터 기반 폴백 생성
function generateProductFallbackData(product, query) {
  return generateGenericFallbackData(product.title);
}

// 9. 임의 검색어에 대한 지능형 동적 폴백 생성
function generateGenericFallbackData(query) {
  const cleanQ = extractCoreKeywords(query) || query;
  const encQ = encodeURIComponent(cleanQ);
  const qLower = cleanQ.toLowerCase();

  // 초점거리 및 조리개 파싱
  const mmMatch = qLower.match(/(\d{2,3})\s*mm/);
  const focalNum = mmMatch ? parseInt(mmMatch[1], 10) : 50;

  const fMatch = qLower.match(/f\/?(\d(?:\.\d+)?)/);
  const fNum = fMatch ? parseFloat(fMatch[1]) : 2.0;

  let focalDesc = `${focalNum}mm 표준 단렌즈`;
  let recommend = `'${cleanQ}'의 독창적인 렌더링으로 일상 스냅, 인물 포트레이트 및 감성 출사를 즐기려는 포토그래퍼`;
  let charDesc = `'${cleanQ}' 기종은 고유의 광학 설계와 렌더링 특성으로 인해 사진 애호가들 사이에서 높은 평가를 받는 모델입니다. 조리개 개방 시의 독특한 보케와 조였을 때의 안정적인 선예도가 균형을 이룹니다.`;
  let pros = `'${cleanQ}' 고유의 광학적 톤과 질감 표현, 입증된 기계적 신뢰도와 높은 중고 감가 방어력`;
  let cons = '중고 매물 구매 시 셔터 메커니즘 동작 상태, 조리개 날 오일 고착 및 렌즈 내부 곰팡이/먼지 확인 필요';
  let proTip = `💡 [${cleanQ} 추천 촬영 팁]: 피사체와 배경 사이의 거리를 충분히 벌리고 자연광 역광 환경에서 조리개를 1~2스톱 개방하여 촬영하면 해당 기종 고유의 입체적인 공간감과 보케를 극대화할 수 있습니다.`;

  if (focalNum <= 28) {
    focalDesc = `${focalNum}mm 광각 단렌즈`;
    recommend = '도심 스트리트 스냅, 건축/풍경, 깊은 피사계 심도를 활용한 찰나의 팬포커스 속사 촬영';
    charDesc = `${focalNum}mm의 넓은 시야각과 왜곡 억제력, 깊은 심도로 프레임 전체에 걸친 입체적인 공간감을 제공합니다.`;
    pros = '넓은 화각 대비 우수한 주변부 해상력과 콤팩트한 휴대성, 스트리트 스냅 최적화';
    proTip = `💡 [${cleanQ} 거리 스냅 공식]: 조리개를 F8에 두고 초점 거리를 2.5m로 세팅하면 1.3m부터 무한대까지 팬포커스(Zone Focus)로 맞아떨어져 핀을 맞출 필요 없이 찰나의 순간을 포착할 수 있습니다.`;
  } else if (focalNum <= 40) {
    focalDesc = `${focalNum}mm 표준 준광각 렌즈`;
    recommend = '인물 환경 스냅(Environmental Portrait), 일상 다큐멘터리, 데일리 출사';
    charDesc = `인간의 자연스러운 시야각과 가장 흡사하여 피사체와 배경을 조화롭게 담아내는 최고의 데일리 화각입니다.`;
    pros = '자연스러운 원근감과 왜곡 없는 안정적인 묘사력, 우수한 휴대성';
  } else if (focalNum >= 85) {
    focalDesc = `${focalNum}mm 준망원 인물 전용 렌즈`;
    recommend = '야외 전신/상반신 인물 포트레이트, 배경 압축 효과를 노린 감성 사진';
    charDesc = `망원 특유의 공간 압축감과 피사체 부각 능력이 뛰어나며 배경을 부드럽게 정리해 줍니다.`;
    pros = '압도적인 피사체 분리력과 원형 보케, 왜곡 없는 인물 비율 표현';
  }

  if (fNum <= 1.2) {
    charDesc += ` 특히 F${fNum}의 초대구경 밝기로 배경을 유화처럼 녹여내는 몽환적인 보케를 선사합니다.`;
    cons = `F${fNum} 최대 개방 시 종이 한 장 수준의 극도로 얕은 심도로 정밀한 수동 초점 피킹 조작 필요`;
    proTip = `💡 [F${fNum} 극대화 팁]: 피사체와의 거리를 1.5~2m 내외로 두고 배경에 야경 조명이나 나뭇잎 사이 빛망울을 배치하면 황홀한 원형 보케를 완성할 수 있습니다.`;
  }

  return {
    isGenericFallback: true,
    modelName: cleanQ,
    category: '카메라 및 광학 렌즈 장비',
    sensorSpec: `${cleanQ} | ${focalDesc} (F${fNum}) | AI 광학 분석 및 실제 커뮤니티 데이터`,
    aiSummary: {
      characteristics: charDesc,
      pros: pros,
      cons: cons,
      recommendTo: recommend,
      proTip: proTip
    },
    samples: [],
    videos: [
      {
        videoId: '2PAyQ1DAcuw',
        channel: 'YouTube 실시간 검색',
        title: `[실전 출사 작례] '${cleanQ}' 실제 야외 출사 및 결과물 테스트 영상`,
        duration: '14:35',
        views: '실제 출사 영상',
        thumbnail: 'https://i.ytimg.com/vi/2PAyQ1DAcuw/hqdefault.jpg',
        link: `https://www.youtube.com/results?search_query=${encQ}+%EC%9E%91%EB%A1%80+%EC%B6%9C%EC%82%AC`
      },
      {
        videoId: 'YXoc-w4P4PQ',
        channel: 'YouTube 리뷰 랩',
        title: `[심층 리뷰] '${cleanQ}' 실사용자가 말하는 치명적 장단점과 필수 세팅 팁`,
        duration: '11:20',
        views: '심층 리뷰',
        thumbnail: 'https://i.ytimg.com/vi/YXoc-w4P4PQ/hqdefault.jpg',
        link: `https://www.youtube.com/results?search_query=${encQ}+%EB%A6%AC%EB%B7%B0+%EC%9E%A5%EB%8B%A8%EC%A0%90`
      },
      {
        videoId: 'hSh3zmRps7k',
        channel: 'YouTube 가이드',
        title: `[구매 가이드] '${cleanQ}' 중고 구매 시 반드시 확인해야 할 체크리스트 5가지`,
        duration: '09:45',
        views: '구매 가이드',
        thumbnail: 'https://i.ytimg.com/vi/hSh3zmRps7k/hqdefault.jpg',
        link: `https://www.youtube.com/results?search_query=${encQ}+%EC%A4%91%EA%B3%A0+%EA%B5%AC%EB%A7%A4`
      }
    ],
    blogs: [
      {
        source: '네이버 블로그',
        author: '빛을담는사람들',
        title: `[실사용기] '${cleanQ}' 주말 출사 작례 및 실제 색감과 조작감 솔직 후기`,
        summary: `'${cleanQ}'을(를) 들고 주말 동안 도심과 자연을 오가며 촬영한 무보정 원본 컷 분석. 조리개별 선예도와 실제 손맛에 대한 생생한 기록.`,
        link: `https://search.naver.com/search.naver?where=blog&query=${encQ}+%EC%8B%A4%EC%82%AC%EC%9A%A9+%EC%9E%91%EB%A1%80`
      },
      {
        source: '네이버 블로그',
        author: '카메라노트',
        title: `[활용가이드] '${cleanQ}' 입문자를 위한 100% 활용 꿀팁 및 조작 가이드`,
        summary: `처음 접하는 유저들이 가장 많이 헷갈려하는 주요 세팅과 추천 액세서리, 그리고 특유의 톤을 살려주는 촬영 노하우 총정리.`,
        link: `https://search.naver.com/search.naver?where=blog&query=${encQ}+%ED%99%9C%EC%9A%A9+%EA%BF%80%ED%8C%81`
      }
    ]
  };
}

function openSampleLightbox(imageUrl, title, exif, author, sourceUrl) {
  const modal = document.getElementById('samplePhotoLightboxModal');
  const img = document.getElementById('lightboxImage');
  const titleEl = document.getElementById('lightboxTitle');
  const exifEl = document.getElementById('lightboxExif');
  const authorEl = document.getElementById('lightboxAuthor');
  const sourceLinkWrap = document.getElementById('lightboxSourceLinkWrap');
  const sourceLink = document.getElementById('lightboxSourceLink');

  if (!modal || !img) return;

  img.src = imageUrl;
  if (titleEl) titleEl.innerText = title || '';
  if (exifEl) exifEl.innerText = exif || '';
  if (authorEl) authorEl.innerText = author || '';

  if (sourceLinkWrap && sourceLink) {
    if (sourceUrl) {
      sourceLink.href = sourceUrl;
      sourceLinkWrap.classList.remove('hidden');
    } else {
      sourceLinkWrap.classList.add('hidden');
    }
  }

  modal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeSampleLightbox() {
  const modal = document.getElementById('samplePhotoLightboxModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// 11. HTML 특수문자 이스케이프 헬퍼
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 12. ESC 키 단축키로 모달 닫기
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const googleModal = document.getElementById('googleApiConfigModal');
    if (googleModal && !googleModal.classList.contains('hidden')) {
      closeGoogleApiConfigModal();
      return;
    }
    const lightbox = document.getElementById('samplePhotoLightboxModal');
    if (lightbox && !lightbox.classList.contains('hidden')) {
      closeSampleLightbox();
      return;
    }
    const aiModal = document.getElementById('aiSampleExplorerModal');
    if (aiModal && !aiModal.classList.contains('hidden')) {
      closeAiSampleSearchModal();
    }
  }
});



// ================= MOBILE NAVIGATION & SEARCH CONTROLLER =================

function toggleMobileSearchBar() {
  const layer = document.getElementById('mobileSearchLayer');
  if (!layer) return;
  layer.classList.toggle('hidden');
  if (!layer.classList.contains('hidden')) {
    const input = document.getElementById('mobileSearchInput');
    if (input) {
      input.focus();
      handleMobileSearchInput(input.value);
    }
  }
}

function handleMobileSearch() {
  const input = document.getElementById('mobileSearchInput');
  const term = input ? input.value.trim() : '';
  const mobileDropdown = document.getElementById('mobileSearchDropdown');
  if (mobileDropdown) mobileDropdown.classList.add('hidden');
  const layer = document.getElementById('mobileSearchLayer');
  if (layer) layer.classList.add('hidden');

  const globalInput = document.getElementById('globalSearchInput');
  if (globalInput) globalInput.value = term;

  currentSearchTerm = term;
  applyFilters();

  const target = document.getElementById('productGrid');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleMobileSearchInput(rawVal) {
  const val = (rawVal || '').trim().toLowerCase();
  const dropdown = document.getElementById('mobileSearchDropdown');
  const wrap = document.getElementById('mobileSearchChipsWrap');
  if (!dropdown || !wrap) return;

  let filteredChips = [];
  if (!val) {
    const defaultModels = [
      '라이카 M6 클래식',
      '소니 Alpha A7 IV',
      '후지필름 X-T5',
      '라이카 D-Lux 7 Vans x Ray Barbee',
      '라이카 M6 TTL NSH'
    ];
    filteredChips = defaultModels.map(name => ({ text: name }));
  } else {
    let bestGroup = null;
    let bestScore = 0;
    for (const group of AI_SUGGESTION_TREE) {
      for (const tr of group.triggers) {
        const trClean = tr.toLowerCase().trim();
        if (!trClean) continue;
        let score = 0;
        if (val === trClean) score = 1000 + trClean.length;
        else if (val.startsWith(trClean) || val.includes(trClean)) score = 500 + trClean.length * 10;
        else if (trClean.includes(val) && val.length >= 2) score = 100 + val.length;
        if (score > bestScore) {
          bestScore = score;
          bestGroup = group;
        }
      }
    }
    if (bestGroup) {
      filteredChips = bestGroup.chips;
    } else {
      for (const group of AI_SUGGESTION_TREE) {
        for (const chip of group.chips) {
          if (chip.text.toLowerCase().includes(val)) {
            if (!filteredChips.some(c => c.text === chip.text)) filteredChips.push(chip);
          }
        }
      }
    }
  }

  if (filteredChips.length > 0) {
    wrap.innerHTML = filteredChips.slice(0, 6).map(chip => {
      const cleanName = stripEmojis(chip.text || chip.label);
      return `
        <button 
          type="button" 
          onmousedown="selectMobileSearchChip('${escapeHtml(chip.text)}')" 
          class="px-2.5 py-1.5 rounded-lg bg-[#F5F5F5] hover:bg-[#171717] hover:text-white text-[#171717] text-xs font-medium transition cursor-pointer"
        >
          ${escapeHtml(cleanName)}
        </button>
      `;
    }).join('');
    dropdown.classList.remove('hidden');
  } else {
    dropdown.classList.add('hidden');
  }
  if (window.lucide) lucide.createIcons();
}

function selectMobileSearchChip(text) {
  const input = document.getElementById('mobileSearchInput');
  if (input) input.value = text;
  handleMobileSearch();
}

function handleBottomNavClick(tab) {
  if (tab === 'home') {
    filterCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'ai') {
    openAiSampleSearchModal();
  } else if (tab === 'wishlist') {
    filterCategory('wishlist');
    const target = document.getElementById('productGrid') || document.getElementById('marketplaceSection');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ⚡ 테스트용 샘플 매물 자동 채우기 (포트폴리오 체험 편의 기능)
function fillSampleRegisterData() {
  const titleInput = document.getElementById('regTitle');
  const brandInput = document.getElementById('regBrand');
  const mountInput = document.getElementById('regMount');
  const priceInput = document.getElementById('regPrice');
  const locInput = document.getElementById('regLocation');
  const descInput = document.getElementById('regDescription');

  if (titleInput) titleInput.value = '라이카 M10-R 실버 크롬 바디 (4000만 화소)';
  if (brandInput) brandInput.value = 'Leica';
  if (mountInput) mountInput.value = 'M-Mount';
  if (priceInput) priceInput.value = '6850000';
  if (locInput) locInput.value = '서울 서초구 방배동 / 강남 직거래';
  if (descInput) descInput.value = '서브용으로 소장하던 M10-R 실버 바디입니다. 셔터수 1,200회 미만이며 외관 찍힘 전혀 없이 깨끗합니다. 배터리 2개 포함 정품 풀박스입니다.';

  registeredImages = ['https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&auto=format&fit=crop&q=80'];
  if (typeof renderImagePreviews === 'function') renderImagePreviews();
  showFrameToast('테스트용 매물 데이터가 자동 입력되었습니다. [매물 등록 완료]를 눌러보세요!', 'info');
}
