/* ============================================
   PEAKLINE ACCOUNTING - MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Nav scroll effect ----
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // ---- Scroll fade-in animations ----
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // ---- Stats counter animation ----
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Testimonial Carousel ----
  document.querySelectorAll('.testimonials').forEach(section => {
    const track = section.querySelector('.testimonials-track');
    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    let currentIndex = 0;

    function getCardWidth() {
      const card = cards[0];
      const style = getComputedStyle(track);
      const gap = parseInt(style.gap) || 24;
      return card.offsetWidth + gap;
    }

    function scrollTo(index) {
      const maxIndex = Math.max(0, cards.length - getVisibleCards());
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
    }

    function getVisibleCards() {
      const wrapper = track.parentElement;
      const cardWidth = getCardWidth();
      return Math.floor(wrapper.offsetWidth / cardWidth) || 1;
    }

    nextBtn.addEventListener('click', () => scrollTo(currentIndex + 1));
    prevBtn.addEventListener('click', () => scrollTo(currentIndex - 1));

    // Reset on resize
    window.addEventListener('resize', () => scrollTo(currentIndex));
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-list').forEach(list => {
    const items = list.querySelectorAll('.faq-item');

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items in this list
        items.forEach(other => other.classList.remove('active'));

        // Open clicked item if it wasn't already open
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  });

  // ---- Pricing Toggle ----
  const pricingToggle = document.getElementById('pricingToggle');
  const monthlyCards = document.getElementById('monthlyCards');
  const oneoffCards = document.getElementById('oneoffCards');

  if (pricingToggle && monthlyCards && oneoffCards) {
    const buttons = pricingToggle.querySelectorAll('button');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const plan = btn.dataset.plan;
        if (plan === 'monthly') {
          monthlyCards.style.display = 'grid';
          oneoffCards.style.display = 'none';
        } else {
          monthlyCards.style.display = 'none';
          oneoffCards.style.display = 'grid';
        }
      });
    });
  }

});
