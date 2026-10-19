
/* ========================================
   JAVASCRIPT WEBSITE SMANCIS
======================================== */

/* 1. MENU NAVIGASI MOBILE */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');

        menuBtn.setAttribute('aria-expanded', String(!isHidden));
        menuBtn.setAttribute(
            'aria-label',
            isHidden ? 'Buka menu' : 'Tutup menu'
        );

        menuBtn.innerHTML = isHidden
            ? '<i class="fa-solid fa-bars" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Buka menu');
            menuBtn.innerHTML =
                '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
        });
    });
}

/* 2. TAB FASILITAS */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selected = button.dataset.tab;

        tabButtons.forEach(btn => {
            const isSelected = btn === button;

            btn.classList.toggle('active', isSelected);
            btn.classList.toggle('bg-white', !isSelected);
            btn.classList.toggle('text-slate-600', !isSelected);

            btn.setAttribute('aria-selected', String(isSelected));
        });

        tabContents.forEach(content => {
            const isSelected =
                content.id === `content-${selected}`;

            content.hidden = !isSelected;
            content.classList.toggle('hidden', !isSelected);
        });
    });
});

/* 3. HERO SLIDER OTOMATIS */
const heroSlider = document.getElementById('hero-slider');

if (heroSlider) {
    const heroSlides = Array.from(
        heroSlider.querySelectorAll('.hero-slide')
    );

    const heroDots = document.getElementById('hero-dots');
    const heroPrev = document.getElementById('hero-prev');
    const heroNext = document.getElementById('hero-next');

    let activeIndex = Math.max(
        0,
        heroSlides.findIndex(slide =>
            slide.classList.contains('active')
        )
    );

    let sliderTimer = null;
    const sliderInterval = 5000;

    const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    /* Membuat titik navigasi otomatis */
    if (heroDots) {
        heroDots.innerHTML = '';

        heroSlides.forEach((slide, index) => {
            const dot = document.createElement('button');

            dot.type = 'button';
            dot.className =
                'h-3 w-3 rounded-full border border-white bg-transparent opacity-70';

            dot.setAttribute(
                'aria-label',
                `Buka slide ${index + 1}`
            );

            dot.addEventListener('click', () => {
                showHeroSlide(index);
                startHeroSlider();
            });

            heroDots.appendChild(dot);
        });
    }

    const dots = heroDots
        ? Array.from(heroDots.querySelectorAll('button'))
        : [];

    /* Menampilkan slide yang dipilih */
    function showHeroSlide(index) {
        if (!heroSlides.length) return;

        activeIndex =
            (index + heroSlides.length) % heroSlides.length;

        heroSlides.forEach((slide, i) => {
            const isActive = i === activeIndex;

            slide.classList.toggle('active', isActive);
            slide.setAttribute(
                'aria-hidden',
                String(!isActive)
            );

            if (isActive) {
                slide.removeAttribute('inert');
            } else {
                slide.setAttribute('inert', '');
            }
        });

        /* Memperbarui titik navigasi */
        dots.forEach((dot, i) => {
            const isActive = i === activeIndex;

            dot.classList.toggle('w-8', isActive);
            dot.classList.toggle('bg-white', isActive);
            dot.classList.toggle(
                'bg-transparent',
                !isActive
            );
            dot.classList.toggle(
                'opacity-100',
                isActive
            );
            dot.classList.toggle(
                'opacity-70',
                !isActive
            );

            dot.setAttribute(
                'aria-current',
                isActive ? 'true' : 'false'
            );
        });
    }

    /* Menghentikan slider otomatis */
    function stopHeroSlider() {
        if (sliderTimer !== null) {
            clearInterval(sliderTimer);
            sliderTimer = null;
        }
    }

    /* Menjalankan slider setiap 5 detik */
    function startHeroSlider() {
        stopHeroSlider();

        if (
            document.hidden ||
            reduceMotion.matches ||
            heroSlides.length < 2
        ) {
            return;
        }

        sliderTimer = setInterval(() => {
            showHeroSlide(activeIndex + 1);
        }, sliderInterval);
    }

    /* Tombol slide berikutnya */
    heroNext?.addEventListener('click', () => {
        showHeroSlide(activeIndex + 1);
        startHeroSlider();
    });

    /* Tombol slide sebelumnya */
    heroPrev?.addEventListener('click', () => {
        showHeroSlide(activeIndex - 1);
        startHeroSlider();
    });

    /* Berhenti saat kursor berada di slider */
    heroSlider.addEventListener(
        'mouseenter',
        stopHeroSlider
    );

    heroSlider.addEventListener(
        'mouseleave',
        startHeroSlider
    );

    /* Menghentikan slider ketika tab browser tidak aktif */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopHeroSlider();
        } else {
            startHeroSlider();
        }
    });

    /* Mengikuti pengaturan pengurangan animasi */
    if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener(
            'change',
            startHeroSlider
        );
    }

    /* Menampilkan slide awal dan menjalankan slider */
    showHeroSlide(activeIndex);
    startHeroSlider();
}

/* 4. TAHUN COPYRIGHT OTOMATIS */
const yearElement = document.getElementById('year');

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
