'use strict';

const EMAIL = 'hyeng128@naver.com';

/* GNB 제품 카테고리 (anyseal.kr 방식 — 제품만) */
const PRODS = [
  { label:'O-링',      href:'oring.html' },
  { label:'회전형 씰', href:'rotary.html' },
  { label:'피스톤 씰', href:'piston.html' },
  { label:'로드 씰',   href:'rod.html'   },
  { label:'백업 링',   href:'backup.html'},
  { label:'와이퍼',    href:'wiper.html' },
  { label:'버퍼 씰',  href:'buffer.html'},
];

function headerHTML(cur) {
  const items = PRODS.map(p => {
    const on = (cur === p.href) ? ' cur' : '';
    return `<li class="gnb-item${on}"><a href="${p.href}">${p.label}</a></li>`;
  }).join('');

  return `
<div id="header">
  <div class="hdt">
    <h1><a href="index.html" class="site-logo">
      <div class="sl-mark">
        <span class="sl-h">H</span>
        <span class="sl-y-box">
          <!-- 타원: Y 중심, -25deg, H-Y 사이 선 끊김(stroke-dasharray) -->
          <svg class="sl-oval-svg" viewBox="0 0 100 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="61" cy="37" rx="56" ry="31" stroke="#f07820" stroke-width="5.5" fill="none"
              stroke-dasharray="151 54 74"/>
          </svg>
          <span class="sl-y">Y</span>
        </span>
      </div>
      <span class="sl-name">희영이엔지</span>
    </a></h1>
  </div>
  <nav id="gnb">
    <div class="gnb-inner">
      <ul class="gnb-list">${items}</ul>
    </div>
  </nav>
</div>`;
}

/* 제품 서브 네비 바 (제품 페이지 상단) */
function prodSubNavHTML(curHref) {
  const links = PRODS.map(p => {
    const on = p.href === curHref ? ' class="on"' : '';
    return `<a href="${p.href}"${on}>${p.label}</a>`;
  }).join('');
  return `
<div class="sub-nav-bar">
  <div class="sub-nav-inner">
    <a href="index.html">홈</a><span class="sep">›</span>
    <a href="oring.html">제품소개</a><span class="sep">›</span>
    ${links}
  </div>
</div>`;
}

function footerHTML() {
  return `
<div id="footer">
  <div class="ft-main">
    <div class="inner ft-inner">
      <div>
        <div class="ft-logo">
          <div class="ftl-mk">HY</div>
          <div><strong>주식회사 희영이엔지</strong><small>HEEYOUNG ENG CO., LTD.</small></div>
        </div>
        <p class="ft-slogan">Parker Hannifin Korea 공인 씰 전문 대리점</p>
      </div>
      <address class="ft-addr">
        <li><b>주소</b> 서울시 금천구 시흥동 984번지 시흥유통상가 31동 249호</li>
        <li><b>사업자번호</b> 119-86-56059</li>
        <li><b>TEL</b> 02-6337-0128 &nbsp;|&nbsp; <b>FAX</b> 02-6269-0128 &nbsp;|&nbsp; <b>H.P</b> 010-4594-8037</li>
        <li><b>E-MAIL</b> ${EMAIL}</li>
      </address>
      <nav class="ft-nav">
        <ul>
          ${PRODS.map(p=>`<li><a href="${p.href}">${p.label}</a></li>`).join('')}
        </ul>
      </nav>
    </div>
  </div>
  <div class="ft-copy">
    <div class="inner ft-copy-inner">
      <p>COPYRIGHT &copy; 2024 주식회사 희영이엔지. All Rights Reserved.</p>
      <p class="ft-note">Parker Hannifin® is a registered trademark of Parker Hannifin Corporation.</p>
    </div>
  </div>
</div>
<div id="quick"><ul>
  <li><a href="mailto:hyeng@naver.com">이메일<br>상담</a></li>
  <li class="q-tel"><a href="tel:02-6337-0128">전화<br>상담</a></li>
</ul></div>
<button class="go-top" id="goTop">▲</button>`;
}

function sidebarHTML() {
  const cats = PRODS;
  return `
<aside class="sidebar">
  <div class="sb-box">
    <div class="sb-head">연락처</div>
    <div class="sb-body">
      <ul class="info-list">
        <li><span class="il-lbl">TEL</span><a href="tel:02-6337-0128" class="il-val big">02-6337-0128</a></li>
        <li><span class="il-lbl">FAX</span><span class="il-val">02-6269-0128</span></li>
        <li><span class="il-lbl">H.P</span><a href="tel:010-4594-8037" class="il-val">010-4594-8037</a></li>
        <li><span class="il-lbl">EMAIL</span><a href="mailto:${EMAIL}" class="il-val sm">${EMAIL}</a></li>
      </ul>
    </div>
  </div>
  <div class="sb-box sb-parker">
    <div class="pk-inner">
      <div class="pk-mark">P</div>
      <div class="pk-text">
        <strong>Parker Hannifin Korea</strong>
        <span>공인 씰 전문 대리점</span>
        <em>14년 신뢰</em>
      </div>
    </div>
  </div>
</aside>`;
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page || '';

  document.getElementById('header-placeholder')?.outerHTML.replace;
  const hPh = document.getElementById('header-placeholder');
  if (hPh) hPh.outerHTML = headerHTML(page);

  const fPh = document.getElementById('footer-placeholder');
  if (fPh) fPh.outerHTML = footerHTML();

  document.querySelectorAll('.sidebar-placeholder').forEach(el => {
    el.outerHTML = sidebarHTML();
  });

  const snPh = document.getElementById('sub-nav-placeholder');
  if (snPh) snPh.outerHTML = prodSubNavHTML(page);

  /* Hamburger */
  document.getElementById('hamburger')?.addEventListener('click', function() {
    this.classList.toggle('open');
    document.getElementById('mobNav')?.classList.toggle('open');
  });

  /* Scroll / goTop */
  const goTop = document.getElementById('goTop');
  window.addEventListener('scroll', () => {
    goTop?.classList.toggle('show', window.scrollY > 260);
  }, { passive:true });
  goTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* Sidebar cat link hover */
  document.querySelectorAll('.sb-cat-link').forEach(a => {
    a.addEventListener('mouseenter', () => { a.style.background='#2171b8'; a.style.color='#fff'; });
    a.addEventListener('mouseleave', () => { a.style.background=''; a.style.color=''; });
  });

  /* Fade-in */
  const io = new IntersectionObserver(entries => {
    entries.forEach((e,i) => {
      if (e.isIntersecting) {
        e.target.style.transition=`opacity .4s ${(i%6)*55}ms ease,transform .4s ${(i%6)*55}ms ease`;
        e.target.style.opacity='1'; e.target.style.transform='translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold:.08 });
  document.querySelectorAll('.pp-card,.pc-card,.cl-item,.as-item').forEach(el=>{
    el.style.opacity='0'; el.style.transform='translateY(12px)'; io.observe(el);
  });
});
