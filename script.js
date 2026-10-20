/* JavaScript SMANCIS: menu, tab fasilitas, hero slider, dan slider ekstrakurikuler */
document.addEventListener('DOMContentLoaded', () => {
  // Menu seluler
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', isOpen);
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Buka menu' : 'Tutup menu');
      menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-bars" aria-hidden="true"></i>' : '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded','false');
      menuBtn.setAttribute('aria-label','Buka menu'); menuBtn.innerHTML='<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    }));
  }

  // Tab fasilitas
  const tabButtons = [...document.querySelectorAll('.tab-btn')];
  const tabContents = [...document.querySelectorAll('.tab-content')];
  tabButtons.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.tab;
    tabButtons.forEach(btn => {
      const active = btn === button; btn.classList.toggle('active', active);
      btn.classList.toggle('bg-green-700', active); btn.classList.toggle('text-white', active);
      btn.classList.toggle('border-green-700', active); btn.classList.toggle('bg-white', !active);
      btn.classList.toggle('text-slate-600', !active); btn.classList.toggle('border-green-200', !active);
      btn.setAttribute('aria-selected', String(active));
    });
    tabContents.forEach(panel => { const active = panel.id === `content-${selected}`; panel.hidden = !active; panel.classList.toggle('hidden', !active); });
  }));

  // Hero slider — satu pengendali saja
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    const slides = [...heroSlider.querySelectorAll('.hero-slide')];
    const prev = document.getElementById('hero-prev'); const next = document.getElementById('hero-next');
    let index = Math.max(0, slides.findIndex(s => s.classList.contains('active'))); let timer = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function show(i) { if (!slides.length) return; index = (i + slides.length) % slides.length; slides.forEach((s,n) => { const active=n===index; s.classList.toggle('active',active); s.style.display=active?'block':'none'; s.setAttribute('aria-hidden',String(!active)); }); }
    function stop(){ if(timer){clearInterval(timer);timer=null;} }
    function start(){ stop(); if(!document.hidden&&!reduced.matches&&slides.length>1) timer=setInterval(()=>show(index+1),5000); }
    prev?.addEventListener('click',()=>{show(index-1);start();}); next?.addEventListener('click',()=>{show(index+1);start();});
    heroSlider.addEventListener('mouseenter',stop); heroSlider.addEventListener('mouseleave',start);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start()); reduced.addEventListener?.('change',start);
    show(index); start();
  }

  // Slider ekstrakurikuler: tombol, swipe HP, titik navigasi, dan autoplay
  const carousel = document.getElementById('ekskul-carousel');
  const track = document.getElementById('ekskul-track');
  const viewport = carousel?.querySelector('.ekskul-viewport');
  const prev = document.getElementById('ekskul-prev'); const next = document.getElementById('ekskul-next');
  const dotsContainer = document.getElementById('ekskul-dots');
  if (carousel && track && viewport) {
    const cards = [...track.querySelectorAll('.ekskul-card')];
    let index=0, visible=3, timer=null, resizeTimer=null, startX=0, endX=0;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    function getVisible(){ return window.innerWidth<=640?1:window.innerWidth<=1024?2:3; }
    function maxIndex(){ return Math.max(0,cards.length-visible); }
    function step(){ if(!cards[0]) return 0; const style=getComputedStyle(track); return cards[0].getBoundingClientRect().width+(parseFloat(style.columnGap)||parseFloat(style.gap)||0); }
    function move(animate=true){ track.style.transition=(!animate||reduced.matches)?'none':''; track.style.transform=`translate3d(${-index*step()}px,0,0)`; }
    function updateDots(){ if(!dotsContainer)return; const dots=[...dotsContainer.querySelectorAll('button')]; const activePage=Math.floor(index/visible); dots.forEach((d,i)=>{const active=i===activePage;d.classList.toggle('active',active);d.setAttribute('aria-current',String(active));}); }
    function buildDots(){ if(!dotsContainer)return; dotsContainer.innerHTML=''; const pages=Math.ceil(cards.length/visible); for(let i=0;i<pages;i++){const b=document.createElement('button');b.type='button';b.className='ekskul-dot';b.setAttribute('aria-label',`Lihat kelompok ekstrakurikuler ${i+1}`);b.addEventListener('click',()=>{index=Math.min(i*visible,maxIndex());move();updateDots();restart();});dotsContainer.appendChild(b);}updateDots(); }
    function go(i){index=Math.max(0,Math.min(i,maxIndex()));move();updateDots();}
    function nextSlide(){go(index>=maxIndex()?0:index+1);} function prevSlide(){go(index<=0?maxIndex():index-1);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    function start(){stop();if(!document.hidden&&!reduced.matches&&cards.length>visible)timer=setInterval(nextSlide,4000);}
    function restart(){stop();start();}
    prev?.addEventListener('click',()=>{prevSlide();restart();}); next?.addEventListener('click',()=>{nextSlide();restart();});
    carousel.addEventListener('mouseenter',stop); carousel.addEventListener('mouseleave',start);
    viewport.addEventListener('touchstart',e=>{startX=e.changedTouches[0].screenX;},{passive:true});
    viewport.addEventListener('touchend',e=>{endX=e.changedTouches[0].screenX;const delta=endX-startX;if(Math.abs(delta)>45){delta<0?nextSlide():prevSlide();restart();}},{passive:true});
    carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){nextSlide();restart();}else if(e.key==='ArrowLeft'){prevSlide();restart();}});
    window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const v=getVisible();if(v!==visible){visible=v;index=Math.min(index,maxIndex());buildDots();}move(false);restart();},150);});
    document.addEventListener('visibilitychange',()=>document.hidden?stop():start()); reduced.addEventListener?.('change',()=>{move(false);restart();});
    visible=getVisible();buildDots();move(false);start();
  }

  const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
});
