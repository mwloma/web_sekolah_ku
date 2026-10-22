/* =========================================
   JAVASCRIPT SMANCIS
   Menu, tab fasilitas, hero slider, ekskul
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  // 1. MENU NAVIGASI SELULER
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Buka menu' : 'Tutup menu');
      menuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-bars" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Buka menu');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      });
    });
  }

  // 2. TAB FASILITAS
  const tabButtons = [...document.querySelectorAll('.tab-btn')];
  const tabContents = [...document.querySelectorAll('.tab-content')];

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.tab;
      tabButtons.forEach(btn => {
        const active = btn === button;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      tabContents.forEach(panel => {
        const active = panel.id === `content-${selected}`;
        panel.hidden = !active;
        panel.classList.toggle('hidden', !active);
      });
    });
  });

  // 3. HERO SLIDER OTOMATIS
  const heroSlider = document.getElementById('hero-slider');

  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll('.hero-slide')];
    const dotsContainer = document.getElementById('hero-dots');
    const prev = document.getElementById('hero-prev');
    const next = document.getElementById('hero-next');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
    let timer = null;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Buka slide ${i + 1}`);
        dot.addEventListener('click', () => { show(i); restart(); });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? [...dotsContainer.querySelectorAll('button')] : [];

    function show(i) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => {
        const active = n === index;
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-hidden', String(!active));
        if (active) slide.removeAttribute('inert');
        else slide.setAttribute('inert', '');
      });
      dots.forEach((dot, n) => {
        const active = n === index;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function stop() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (!document.hidden && !reduced.matches && slides.length > 1) {
        timer = window.setInterval(() => show(index + 1), 5000);
      }
    }

    function restart() { stop(); start(); }
    prev?.addEventListener('click', () => { show(index - 1); restart(); });
    next?.addEventListener('click', () => { show(index + 1); restart(); });
    heroSlider.addEventListener('mouseenter', stop);
    heroSlider.addEventListener('mouseleave', start);
    heroSlider.addEventListener('focusin', stop);
    heroSlider.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    reduced.addEventListener?.('change', start);
    show(index);
    start();
  }

  // 4. SLIDER EKSTRAKURIKULER: autoplay, panah, swipe, titik
  const carousel = document.getElementById('ekskul-carousel');
  const track = document.getElementById('ekskul-track');
  const viewport = carousel?.querySelector('.ekskul-viewport');
  const prevButton = document.getElementById('ekskul-prev');
  const nextButton = document.getElementById('ekskul-next');
  const dotsContainer = document.getElementById('ekskul-dots');

  if (carousel && track && viewport) {
    const cards = [...track.querySelectorAll('.ekskul-card')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let visible = getVisible();
    let timer = null;
    let resizeTimer = null;
    let startX = 0;

    function getVisible() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function maxIndex() {
      return Math.max(0, cards.length - visible);
    }

    function step() {
      if (!cards[0]) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function move(animate = true) {
      track.style.transition = (!animate || reduced.matches)
        ? 'none'
        : 'transform 750ms cubic-bezier(.22, 1, .36, 1)';
      track.style.transform = `translate3d(${-index * step()}px, 0, 0)`;
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = [...dotsContainer.querySelectorAll('button')];
      const activePage = Math.min(dots.length - 1, Math.floor(index / visible));
      dots.forEach((dot, i) => {
        const active = i === activePage;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const pages = Math.max(1, Math.ceil((cards.length - visible + 1) / visible));
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'ekskul-dot';
        dot.setAttribute('aria-label', `Lihat kelompok ekstrakurikuler ${i + 1}`);
        dot.addEventListener('click', () => {
          index = Math.min(i * visible, maxIndex());
          move();
          updateDots();
          restart();
        });
        dotsContainer.appendChild(dot);
      }
      updateDots();
    }

    function go(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      move();
      updateDots();
    }

    function nextSlide() { go(index >= maxIndex() ? 0 : index + 1); }
    function prevSlide() { go(index <= 0 ? maxIndex() : index - 1); }

    function stop() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (!document.hidden && !reduced.matches && cards.length > visible) {
        timer = window.setInterval(nextSlide, 4200);
      }
    }

    function restart() { stop(); start(); }

    prevButton?.addEventListener('click', () => { prevSlide(); restart(); });
    nextButton?.addEventListener('click', () => { nextSlide(); restart(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    viewport.addEventListener('touchstart', event => {
      startX = event.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', event => {
      const delta = event.changedTouches[0].screenX - startX;
      if (Math.abs(delta) > 45) {
        delta < 0 ? nextSlide() : prevSlide();
        restart();
      }
    }, { passive: true });

    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { nextSlide(); restart(); }
      if (event.key === 'ArrowLeft') { prevSlide(); restart(); }
    });

    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const newVisible = getVisible();
        if (newVisible !== visible) {
          visible = newVisible;
          index = Math.min(index, maxIndex());
          buildDots();
        }
        move(false);
        restart();
      }, 160);
    });

    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    reduced.addEventListener?.('change', () => { move(false); restart(); });
    buildDots();
    move(false);
    start();
  }

  // 5. TAHUN COPYRIGHT OTOMATIS
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
