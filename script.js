/* ============================================
   ============================================ */

'use strict';

// ===== INIT AOS =====
AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 2200);
});

// ===== PARTICLES =====
(function createParticles() {
  const container = document.getElementById('particles-bg');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 60 + 20;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 15}s;
    `;
    container.appendChild(p);
  }
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('mainNavbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// Smooth scroll for nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('show')) {
          document.querySelector('.navbar-toggler').click();
        }
      }
    }
  });
});

// ===== HERO BUTTON SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// ===== STATS COUNTER =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString('ar-SA');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString('ar-SA');
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const target = parseInt(num.dataset.target);
        animateCounter(num, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== PORTFOLIO MODAL =====
const portfolioModal = document.getElementById('portfolioModal');
const modalImg = document.getElementById('modalImg');
const modalTitleBar = document.getElementById('modalTitleBar');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

let currentModalIndex = 0;
const allPortfolioImgs = [];

// Gather all images
document.querySelectorAll('.portfolio-zoom').forEach((btn, index) => {
  allPortfolioImgs.push({ src: btn.dataset.img, title: btn.dataset.title });
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentModalIndex = index;
    openModal(index);
  });
});

function openModal(index) {
  currentModalIndex = index;
  const data = allPortfolioImgs[index];
  modalImg.style.opacity = 0;
  modalImg.src = data.src;
  modalImg.alt = data.title;
  modalTitleBar.textContent = data.title;
  portfolioModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { modalImg.style.opacity = 1; }, 100);
}

function closeModal() {
  portfolioModal.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

modalPrev.addEventListener('click', () => {
  currentModalIndex = (currentModalIndex - 1 + allPortfolioImgs.length) % allPortfolioImgs.length;
  openModal(currentModalIndex);
});

modalNext.addEventListener('click', () => {
  currentModalIndex = (currentModalIndex + 1) % allPortfolioImgs.length;
  openModal(currentModalIndex);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!portfolioModal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') modalPrev.click();
  if (e.key === 'ArrowLeft') modalNext.click();
});

// Touch/swipe on modal
let touchStartX = 0;
portfolioModal.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
portfolioModal.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) modalNext.click();
    else modalPrev.click();
  }
});

// ===== TESTIMONIALS SLIDER =====
const testiTrack = document.getElementById('testiTrack');
const testiDotsContainer = document.getElementById('testiDots');
const testiPrev = document.getElementById('testiPrev');
const testiNext = document.getElementById('testiNext');
const testiCards = document.querySelectorAll('.testi-card');

let currentTesti = 0;
let testiPerView = window.innerWidth >= 768 ? 3 : 1;
const totalTesti = testiCards.length;
const testiDots = [];

// Create dots
function createTestiDots() {
  testiDotsContainer.innerHTML = '';
  const pages = Math.ceil(totalTesti / testiPerView);
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsContainer.appendChild(dot);
    testiDots.push(dot);
  }
}

function updateTestiDots(page) {
  document.querySelectorAll('.testi-dot').forEach((d, i) => {
    d.classList.toggle('active', i === page);
  });
}

function goToTesti(page) {
  currentTesti = page;
  testiPerView = window.innerWidth >= 768 ? 3 : 1;
  const cardWidth = testiCards[0].offsetWidth + 24;
  const offset = page * testiPerView * cardWidth;
  testiTrack.style.transform = `translateX(${offset}px)`;
  updateTestiDots(page);
}

testiPrev.addEventListener('click', () => {
  const pages = Math.ceil(totalTesti / testiPerView);
  currentTesti = (currentTesti - 1 + pages) % pages;
  goToTesti(currentTesti);
});
testiNext.addEventListener('click', () => {
  const pages = Math.ceil(totalTesti / testiPerView);
  currentTesti = (currentTesti + 1) % pages;
  goToTesti(currentTesti);
});

createTestiDots();

// Auto-play testimonials
let testiAutoPlay = setInterval(() => testiNext.click(), 5000);
testiTrack.parentElement.addEventListener('mouseenter', () => clearInterval(testiAutoPlay));
testiTrack.parentElement.addEventListener('mouseleave', () => {
  testiAutoPlay = setInterval(() => testiNext.click(), 5000);
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backToTop.classList.add('visible');
  else backToTop.classList.remove('visible');
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== COOKIE NOTICE =====
const cookieNotice = document.getElementById('cookieNotice');
const cookieAccept = document.getElementById('cookieAccept');

if (!localStorage.getItem('cookieAccepted')) {
  setTimeout(() => cookieNotice.classList.add('show'), 2500);
}
cookieAccept.addEventListener('click', () => {
  cookieNotice.classList.remove('show');
  localStorage.setItem('cookieAccepted', 'true');
});

// ===== WHATSAPP CHAT BUBBLE =====
const chatBubble = document.getElementById('chatBubble');
chatBubble.addEventListener('click', () => {
  window.open('https://wa.me/966500000000?text=مرحباً، أريد الاستفسار عن خدمات شركة البيان', '_blank');
});

// ===== CONTACT FORM =====
const submitContactBtn = document.getElementById('submitContactBtn');
const contactSuccess = document.getElementById('contactSuccess');

submitContactBtn.addEventListener('click', () => {
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();

  if (!name || !phone) {
    // Shake effect
    submitContactBtn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { submitContactBtn.style.animation = ''; }, 500);
    return;
  }

  // Simulate sending
  submitContactBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> جاري الإرسال...';
  submitContactBtn.disabled = true;

  setTimeout(() => {
    submitContactBtn.innerHTML = '<i class="bi bi-send-fill"></i> إرسال الطلب';
    submitContactBtn.disabled = false;
    contactSuccess.classList.remove('d-none');
    // Clear fields
    ['contactName','contactPhone','contactEmail','contactMsg'].forEach(id => {
      document.getElementById(id).value = '';
    });
    setTimeout(() => contactSuccess.classList.add('d-none'), 5000);
  }, 1800);
});

// Add shake keyframe
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
</style>
`);

// ===== NEWSLETTER =====
const nlSubmit = document.getElementById('nlSubmit');
const nlSuccess = document.getElementById('nlSuccess');

nlSubmit.addEventListener('click', () => {
  const email = document.getElementById('nlEmail').value.trim();
  if (!email || !email.includes('@')) return;
  nlSubmit.textContent = '...';
  nlSubmit.disabled = true;
  setTimeout(() => {
    nlSuccess.classList.remove('d-none');
    document.getElementById('nlEmail').value = '';
    nlSubmit.innerHTML = 'اشترك <i class="bi bi-arrow-left"></i>';
    nlSubmit.disabled = false;
  }, 1200);
});

// ===== VIDEO MODAL =====
const videoModal = document.getElementById('videoModal');
const promoPlayBtn = document.getElementById('promoPlayBtn');
const videoModalClose = document.getElementById('videoModalClose');
const videoModalBackdrop = document.getElementById('videoModalBackdrop');

promoPlayBtn.addEventListener('click', () => {
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});
[videoModalClose, videoModalBackdrop].forEach(el => {
  el.addEventListener('click', () => {
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== TICKER PAUSE ON HOVER =====
const tickerMove = document.querySelector('.ticker-move');
if (tickerMove) {
  tickerMove.addEventListener('mouseenter', () => { tickerMove.style.animationPlayState = 'paused'; });
  tickerMove.addEventListener('mouseleave', () => { tickerMove.style.animationPlayState = 'running'; });
}

// ===== PARALLAX HERO SHAPES =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.hero-shapes .shape').forEach((s, i) => {
    const speed = 0.05 + i * 0.03;
    s.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ===== RIPPLE EFFECT ON BUTTONS =====
document.querySelectorAll('.btn-hero-primary, .btn-primary-green, .btn-contact-submit').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top: ${e.clientY - rect.top - size/2}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out forwards;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes rippleEffect {
  to { transform: scale(4); opacity: 0; }
}
</style>
`);

// ===== TYPED TEXT EFFECT IN HERO =====
(function typeEffect() {
  const target = document.querySelector('.hero-title');
  if (!target) return;
  const words = ['الجمال', 'الإبداع', 'الطبيعة', 'الفن'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typedEl = document.createElement('span');
  typedEl.className = 'text-accent typed-text';
  typedEl.style.borderRight = '3px solid var(--gold-light)';
  typedEl.style.paddingRight = '2px';

  // Replace the span.text-accent with typing element
  const existingAccent = target.querySelector('.text-accent');
  if (existingAccent) existingAccent.replaceWith(typedEl);

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 80 : 120;
    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 2500);
})();

// ===== SCROLL PROGRESS BAR =====
(function addScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position: fixed; top: 0; right: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, var(--green-main), var(--gold-light));
    width: 0%; z-index: 9999; transition: width 0.1s linear;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (winScroll / height * 100) + '%';
  });
})();

// ===== SERVICE CARDS 3D TILT =====
document.querySelectorAll('.service-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 6;
    const ry = ((x - cx) / cx) * -6;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.4s ease';
  });
});

// ===== LAZY LOAD IMAGES =====
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', () => { img.style.opacity = '1'; });
      }
      imageObserver.unobserve(img);
    }
  });
});
lazyImages.forEach(img => imageObserver.observe(img));

// ===== MOBILE SWIPE TESTIMONIALS =====
let touchStartXTesti = 0;
if (testiTrack) {
  testiTrack.addEventListener('touchstart', e => { touchStartXTesti = e.changedTouches[0].screenX; }, { passive: true });
  testiTrack.addEventListener('touchend', e => {
    const diff = touchStartXTesti - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) testiNext.click();
      else testiPrev.click();
    }
  });
}

// ===== RESIZE HANDLER =====
window.addEventListener('resize', () => {
  testiPerView = window.innerWidth >= 768 ? 3 : 1;
  createTestiDots();
  goToTesti(0);
});

// ===== CITY TAGS HOVER ANIMATION =====
document.querySelectorAll('.city-tag').forEach((tag, i) => {
  tag.style.transitionDelay = `${i * 0.03}s`;
});

// ===== NAVBAR TOGGLER ANIMATION =====
const navToggler = document.querySelector('.navbar-toggler');
if (navToggler) {
  navToggler.addEventListener('click', function() {
    this.classList.toggle('open');
    const spans = this.querySelectorAll('.toggler-icon span');
    if (this.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

console.log('%c🌴 شركة البيان - تنسيق الحدائق وزراعة النخيل 🌴', 'color: #2d6a4f; font-size: 16px; font-weight: bold;');
console.log('%c جميع الحقوق محفوظة © 2025', 'color: #c9a227; font-size: 12px;');