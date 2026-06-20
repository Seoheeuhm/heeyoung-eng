'use strict';

/* ── Header scroll ── */
const header = document.getElementById('header');
const goTop  = document.getElementById('goTop');

window.addEventListener('scroll', () => {
  goTop.classList.toggle('show', window.scrollY > 300);
}, { passive: true });

goTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
});
function closeMob() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
}

/* ── Smooth scroll with header offset ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    // header height: hdt + gnb
    const hdt = document.querySelector('.hdt');
    const gnb = document.getElementById('gnb');
    const offset = (hdt ? hdt.offsetHeight : 0) + (gnb ? gnb.offsetHeight : 44) + 4;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    closeMob();
  });
});

/* ── Slider ── */
const slides = Array.from(document.querySelectorAll('.slide'));
const dots   = Array.from(document.querySelectorAll('.sdot'));
let cur = 0, timer;

function goSlide(n) {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
}
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => goSlide(cur + 1), 5000);
}
document.getElementById('sPrev').addEventListener('click', () => { goSlide(cur - 1); startTimer(); });
document.getElementById('sNext').addEventListener('click', () => { goSlide(cur + 1); startTimer(); });
dots.forEach(d => d.addEventListener('click', () => { goSlide(+d.dataset.i); startTimer(); }));
startTimer();

/* ── Product tabs ── */
const ptabs  = document.querySelectorAll('.ptab');
const pcards = document.querySelectorAll('.pc');
ptabs.forEach(tab => {
  tab.addEventListener('click', () => {
    ptabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    pcards.forEach(c => c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat));
  });
});

/* ── Quick sidebar form ── */
const quickForm = document.getElementById('quickForm');
const qfResult  = document.getElementById('qfResult');
quickForm.addEventListener('submit', e => {
  e.preventDefault();
  qfResult.className = 'qf-result';
  let ok = true;
  quickForm.querySelectorAll('[required]').forEach(f => {
    f.style.borderColor = '';
    if (!f.value.trim()) { ok = false; f.style.borderColor = '#e05a10'; }
  });
  if (!ok) { qfResult.className = 'qf-result err'; qfResult.textContent = '필수 항목을 입력해 주세요.'; return; }
  const btn = quickForm.querySelector('.qf-btn');
  btn.disabled = true; btn.textContent = '전송 중...';
  setTimeout(() => {
    qfResult.className = 'qf-result ok';
    qfResult.textContent = '접수되었습니다. 감사합니다.';
    quickForm.reset();
    btn.disabled = false; btn.textContent = '문의 보내기';
  }, 900);
});

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
const cfResult    = document.getElementById('cfResult');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  cfResult.className = 'cf-result';
  let ok = true;
  contactForm.querySelectorAll('[required]').forEach(f => {
    f.style.borderColor = '';
    if (f.type === 'checkbox') {
      if (!f.checked) ok = false;
    } else if (!f.value.trim()) {
      ok = false; f.style.borderColor = '#e05a10';
    }
  });
  if (!document.getElementById('agree').checked) ok = false;
  if (!ok) { cfResult.className = 'cf-result err'; cfResult.textContent = '필수 항목을 모두 입력·동의해 주세요.'; return; }
  const btn = contactForm.querySelector('.cf-btn');
  btn.disabled = true; btn.textContent = '전송 중...';
  setTimeout(() => {
    cfResult.className = 'cf-result ok';
    cfResult.textContent = '문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.';
    contactForm.reset();
    btn.disabled = false; btn.textContent = '문의 보내기';
  }, 900);
});

/* ── Scroll fade-in ── */
const fadeEls = document.querySelectorAll('.pc, .ci, .why-list li, .as-item');
const io = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = (i % 6) * 55;
      entry.target.style.transition = `opacity .4s ${delay}ms ease, transform .4s ${delay}ms ease`;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  io.observe(el);
});

/* ── GNB active ── */
const gnbAs = document.querySelectorAll('.gnb-item > a');
const secs  = document.querySelectorAll('section[id], div[id="about"], div[id="products"], div[id="clients"]');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      gnbAs.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + e.target.id) a.style.color = '#f5a030';
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

document.querySelectorAll('#about, #products, #clients, #contact').forEach(s => s && secObs.observe(s));
