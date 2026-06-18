/* =============================================
   PARQUI PAISAGISMO – main.js
   ============================================= */

// ---------- Header scroll effect ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

// ---------- Mobile menu ----------
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---------- Hero slider ----------
(function () {
  const slides    = document.querySelectorAll('.hero__slide');
  const dotsWrap  = document.getElementById('heroDots');
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero__dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
    resetTimer();
  }

  function next() { goTo((current + 1) % slides.length); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  resetTimer();
})();

// ---------- Counter animation ----------
(function () {
  const counters = document.querySelectorAll('.numbers__value[data-target]');
  let triggered  = false;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = Math.ceil(target / (duration / 16));
    let current    = 0;

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const numSection = document.querySelector('.numbers');
  const numObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      counters.forEach(animateCounter);
    }
  }, { threshold: .4 });
  if (numSection) numObserver.observe(numSection);
})();

// ---------- Portfolio filter ----------
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio__item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });
})();

// ---------- Testimonials carousel (mobile) ----------
(function () {
  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  const cards   = Array.from(track.querySelectorAll('.testimonial-card'));

  function visible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  let current = 0;

  function update() {
    const v = visible();
    const total = cards.length;
    cards.forEach((card, i) => {
      card.style.display = (i >= current && i < current + v) ? '' : 'none';
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current + v >= total;
    prevBtn.style.opacity = prevBtn.disabled ? '.4' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '.4' : '1';
  }

  prevBtn.addEventListener('click', () => { if (current > 0) { current--; update(); } });
  nextBtn.addEventListener('click', () => {
    if (current + visible() < cards.length) { current++; update(); }
  });

  window.addEventListener('resize', update);
  update();
})();

// ---------- Contact form (mock submit) ----------
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando…';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = '✓ Mensagem enviada!';
    btn.style.background = '#25d366';
    this.reset();
    setTimeout(() => {
      btn.textContent = 'Enviar mensagem';
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }, 1200);
});

// ---------- Scroll reveal ----------
(function () {
  const els = document.querySelectorAll(
    '.service-card, .portfolio__item, .testimonial-card, .about__images, .about__content, .contact__info, .contact__form'
  );
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: .1 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    reveal.observe(el);
  });
})();
