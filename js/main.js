/* ============================================
   REIOD LOCKER — main.js
   Interactions, animations, accordion, nav
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  /* ---- Mobile menu toggle ---- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu?.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  /* Close mobile menu on nav link click */
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      hamburger?.querySelectorAll('span').forEach(s => s.style.transform = s.style.opacity = '');
    });
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ---- Staggered children reveal ---- */
  document.querySelectorAll('.stagger-parent').forEach(parent => {
    const children = parent.querySelectorAll('.stagger-child');
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 100);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    staggerObserver.observe(parent);
  });

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ---- Lightbox ---- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');

  document.querySelectorAll('.gallery-item[data-img]').forEach(item => {
    item.addEventListener('click', () => {
      if (lightboxImg) lightboxImg.src = item.getAttribute('data-img');
      if (lightboxCaption) lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    /* Keyboard accessibility */
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ---- Counter animation ---- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stats-section').forEach(el => counterObserver.observe(el));

  /* ---- Distributor form submit ---- */
  const distForm = document.getElementById('dist-form');
  distForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = distForm.querySelector('button[type=submit]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Application Submitted!';
    btn.disabled = true;
    btn.style.background = '#168A00';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.background = '';
      distForm.reset();
    }, 4000);
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.background = link.getAttribute('href') === '#' + current ? 'var(--light-green)' : '';
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--primary-dark)' : '';
    });
  });

  /* ---- Contact form → Web3Forms ---- */
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit-btn');

    // Update subject hidden field from the select
    const topicSel = document.getElementById('cf-subject-sel');
    const subjectHidden = document.getElementById('cf-subject-hidden');
    if (topicSel && subjectHidden) {
      subjectHidden.value = topicSel.value
        ? `Reiod Locker – ${topicSel.value}`
        : 'Reiod Locker – New Contact Form Submission';
    }

    // Loading state
    const origText = btn.innerHTML;
    btn.innerHTML = '⏳ Sending...';
    btn.disabled = true;
    if (contactFeedback) contactFeedback.style.display = 'none';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        if (contactFeedback) {
          contactFeedback.style.display = 'block';
          contactFeedback.style.background = '#EAF8E5';
          contactFeedback.style.color = '#168A00';
          contactFeedback.style.border = '1.5px solid #C5EDBA';
          contactFeedback.innerHTML = '✅ Message sent successfully! We\'ll get back to you soon.';
        }
        contactForm.reset();
        btn.innerHTML = '✅ Sent!';
        btn.style.background = '#168A00';
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.disabled = false;
          btn.style.background = '';
          if (contactFeedback) contactFeedback.style.display = 'none';
        }, 5000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      if (contactFeedback) {
        contactFeedback.style.display = 'block';
        contactFeedback.style.background = '#FEF2F2';
        contactFeedback.style.color = '#DC2626';
        contactFeedback.style.border = '1.5px solid #FECACA';
        contactFeedback.innerHTML = '❌ Something went wrong. Please try again or contact us on WhatsApp.';
      }
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  });

  /* ---- Year in footer ---- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
