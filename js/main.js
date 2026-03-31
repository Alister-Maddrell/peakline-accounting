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
      threshold: 0.05,
      rootMargin: '50px 0px 0px 0px'
    });

    // Make all elements visible immediately on load, then observe for future ones
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        fadeObserver.observe(el);
      }
    });

    // Also check on scroll for any missed elements
    const checkFadeIns = () => {
      fadeElements.forEach(el => {
        if (!el.classList.contains('visible')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 50) {
            el.classList.add('visible');
          }
        }
      });
    };
    window.addEventListener('scroll', checkFadeIns, { passive: true });
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
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Testimonial Carousel (drag + auto-scroll) ----
  document.querySelectorAll('.testimonials-track-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.testimonials-track');
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    wrapper.style.cursor = 'grab';

    wrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      wrapper.style.cursor = 'grabbing';
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
      track.style.transition = 'none';
    });

    wrapper.addEventListener('mouseleave', () => {
      isDown = false;
      wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mouseup', () => {
      isDown = false;
      wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      wrapper.scrollLeft = scrollLeft - walk;
    });

    // Enable native scroll
    wrapper.style.overflowX = 'auto';
    wrapper.style.scrollSnapType = 'x mandatory';
    wrapper.style.scrollbarWidth = 'none';
  });

  // ---- Seamless Infinite Marquees ----
  // Clone content until it's at least 2x viewport width, then animate by half
  function initMarquee(wrapper, trackSelector, speed) {
    const track = wrapper.querySelector(trackSelector);
    if (!track) return;

    // Get all original children as an array
    const items = Array.from(track.children);
    if (items.length === 0) return;

    // Remove any previous set wrappers - flatten to raw items
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      if (item.classList && (item.classList.contains('brand-ticker-set') || item.classList.contains('testimonial-marquee-set'))) {
        // Unwrap set contents
        Array.from(item.children).forEach(child => fragment.appendChild(child.cloneNode(true)));
      } else {
        fragment.appendChild(item.cloneNode(true));
      }
    });

    // Clear track and add flattened items
    track.innerHTML = '';
    track.appendChild(fragment);

    // Now measure one set of items
    const originalItems = Array.from(track.children);
    const setWidth = originalItems.reduce((w, el) => {
      const style = getComputedStyle(el);
      return w + el.offsetWidth + parseFloat(style.marginRight || 0);
    }, 0);

    // Clone items until we have at least 3x viewport width
    const viewportWidth = window.innerWidth;
    const clonesNeeded = Math.ceil((viewportWidth * 3) / setWidth);

    for (let i = 0; i < clonesNeeded; i++) {
      originalItems.forEach(item => {
        track.appendChild(item.cloneNode(true));
      });
    }

    // Set the animation offset to exactly one set width
    track.style.setProperty('--marquee-offset', `-${setWidth}px`);
    track.style.setProperty('--marquee-duration', `${setWidth / speed}s`);
  }

  // Init brand ticker
  document.querySelectorAll('.brand-ticker-wrapper').forEach(wrapper => {
    initMarquee(wrapper, '.brand-ticker', 50); // 50px per second
  });

  // Init testimonial marquee
  document.querySelectorAll('.testimonial-marquee-wrapper').forEach(wrapper => {
    initMarquee(wrapper, '.testimonial-marquee', 40); // 40px per second
  });

  // Init text ticker (social proof)
  document.querySelectorAll('.ticker-wrapper').forEach(wrapper => {
    initMarquee(wrapper, '.ticker', 30);
  });

  // ---- Packages Scroll Button ----
  document.querySelectorAll('.packages-scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scroll = btn.closest('.packages-scroll-wrapper').querySelector('.packages-scroll');
      if (scroll) {
        scroll.scrollBy({ left: 300, behavior: 'smooth' });
      }
    });
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-list').forEach(list => {
    const items = list.querySelectorAll('.faq-item');

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(other => other.classList.remove('active'));
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
