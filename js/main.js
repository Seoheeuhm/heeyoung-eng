/* ========================================
   HY-ENG Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    // Close menu on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // --- Header Scroll Effect ---
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active Nav Highlighting ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage !== 'index.html') {
      link.classList.remove('active');
    }
  });

  // --- Scroll-to-hash on page load (for products.html#orings etc.) ---
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const offset = header ? header.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  }

  // --- Helper: Send via direct mailto fallback ---
  function sendViaMailto(form) {
    const company = form.querySelector('[name="회사명_또는_담당자"]')?.value || '';
    const phone = form.querySelector('[name="연락처"]')?.value || '';
    const email = form.querySelector('#customerEmail')?.value || '';
    const product = form.querySelector('[name="문의_제품종류"]')?.value || '';
    const partNumber = form.querySelector('[name="파카_품번"]')?.value || '';
    const dimensions = form.querySelector('[name="규격_치수"]')?.value || '';
    const conditions = form.querySelector('[name="사용조건_유체_온도_압력"]')?.value || '';
    const quantity = form.querySelector('[name="요청수량"]')?.value || '';
    const message = form.querySelector('[name="상세_문의내용"]')?.value || '';

    const subject = encodeURIComponent(`[희영이엔지 온라인 견적 요청] ${company} - ${product}`);
    const bodyText = `■ 회사명/이름: ${company}
■ 연락처: ${phone}
■ 회신 이메일: ${email}
■ 문의 제품: ${product}
■ 파카 품번: ${partNumber}
■ 규격/치수: ${dimensions}
■ 사용 조건(유체·온도·압력): ${conditions}
■ 요청 수량: ${quantity}
■ 상세 문의사항:
${message}

------------------------------------
※ 희영이엔지 공식 홈페이지 온라인 견적 문의`;

    const body = encodeURIComponent(bodyText);
    window.location.href = `mailto:info@hy-eng.co.kr?subject=${subject}&body=${body}`;
  }

  // --- Online Quote Form Real Submission (info@hy-eng.co.kr) ---
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('quoteSubmitBtn') || quoteForm.querySelector('button[type="submit"]');
      const resultMsg = document.getElementById('quoteResultMsg');
      const originalBtnHtml = submitBtn.innerHTML;

      // 필수 입력 필드 검증
      const companyInput = quoteForm.querySelector('[name="회사명_또는_담당자"]');
      const phoneInput = quoteForm.querySelector('[name="연락처"]');
      const productSelect = quoteForm.querySelector('[name="문의_제품종류"]');
      const emailInput = quoteForm.querySelector('#customerEmail');

      let isValid = true;
      [companyInput, phoneInput, productSelect].forEach(input => {
        if (!input || !input.value.trim()) {
          if (input) input.style.borderColor = '#e74c3c';
          isValid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        alert('회사명/이름, 연락처, 제품 종류는 필수 입력 항목입니다.');
        return;
      }

      // [환경 구분 1] 내 컴퓨터 로컬 파일(file://)로 연 경우
      // FormSubmit은 보안상 file:// 프로토콜을 차단하므로, 로컬 테스트 시에는 메일 클라이언트로 즉시 연결
      if (window.location.protocol === 'file:') {
        alert('【로컬 파일 테스트 안내】\n현재 웹 서버가 아닌 내 컴퓨터 로컬 파일(file://)로 실행 중입니다.\n\nFormSubmit 보안 정책상 file:// 은 직접 전송이 제한되므로, 작성하신 내용이 info@hy-eng.co.kr로 자동 완성된 메일 창을 열어드립니다.\n\n※ 실제 웹사이트(www.hy-eng.co.kr)에 업로드하시면 이 창 없이 웹에서 info@hy-eng.co.kr로 즉시 자동 전송됩니다.');
        sendViaMailto(quoteForm);
        quoteForm.reset();
        return;
      }

      // [환경 구분 2] 실제 웹 서버(http:// 또는 https:// / localhost / hy-eng.co.kr) 환경
      const replyToField = quoteForm.querySelector('[name="_replyto"]');
      if (replyToField && emailInput && emailInput.value.trim()) {
        replyToField.value = emailInput.value.trim();
      }

      // 전송 중 상태 표시
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> info@hy-eng.co.kr 전송 중...';
      if (resultMsg) resultMsg.style.display = 'none';

      try {
        const formData = new FormData(quoteForm);
        const response = await fetch('https://formsubmit.co/ajax/info@hy-eng.co.kr', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true)) {
          if (resultMsg) {
            resultMsg.style.display = 'block';
            resultMsg.style.background = '#e8f5e9';
            resultMsg.style.color = '#2e7d32';
            resultMsg.style.border = '1px solid #a5d6a7';
            resultMsg.innerHTML = '<i class="fas fa-check-circle"></i> <strong>견적 요청이 info@hy-eng.co.kr로 안전하게 발송되었습니다!</strong><br>' +
              '희영이엔지 담당자가 확인 후 영업시간 기준 1시간 내로 회신드리겠습니다.<br>' +
              '<small style="color:#555;">(급하신 문의는 02-6337-0128 또는 010-4594-8037로 전화주시면 바로 상담이 가능합니다.)</small>';
          }
          alert('견적 문의가 정상적으로 발송되었습니다!\n\n수신 이메일: info@hy-eng.co.kr\n담당자가 확인 후 신속히 회신드리겠습니다.');
          quoteForm.reset();
        } else {
          throw new Error('FormSubmit AJAX failure');
        }
      } catch (err) {
        console.warn('FormSubmit failed, fallback to mailto:', err);
        alert('온라인 전송 연결이 원활하지 않아 info@hy-eng.co.kr 직통 메일로 연결합니다.\n\n급하신 문의는 전화(02-6337-0128) 주시면 가장 빠르게 처리됩니다.');
        sendViaMailto(quoteForm);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

  // --- Intersection Observer for Animations ---
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.product-card, .why-card, .guide-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

});
