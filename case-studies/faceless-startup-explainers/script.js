/* ═══════════════════════════════════════════════════════════
   CASE STUDY 02 — FACELESS STARTUP EXPLAINER
   Script: Scroll Reveals, Text Mask Animation, Ambient Canvas
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. SCROLL REVEAL — IntersectionObserver
     ───────────────────────────────────────── */
  function initScrollReveals() {
    const revealEls = document.querySelectorAll('.fade-slide-up');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────
     2. TEXT MASK REVEAL — Word-by-Word
     ───────────────────────────────────────── */
  function initTextMaskReveals() {
    const textEls = document.querySelectorAll('.text-mask-reveal');

    textEls.forEach((el) => {
      // Skip if already processed
      if (el.dataset.maskProcessed) return;
      el.dataset.maskProcessed = 'true';

      const text = el.textContent.trim();
      const words = text.split(/\s+/);

      el.innerHTML = '';
      el.setAttribute('aria-label', text);

      words.forEach((word, i) => {
        const mask = document.createElement('span');
        mask.className = 'word-mask';
        mask.setAttribute('aria-hidden', 'true');

        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = word;
        inner.style.transitionDelay = `${i * 0.06}s`;

        mask.appendChild(inner);
        el.appendChild(mask);
      });
    });

    // Observe text-mask-reveal parents for revealing
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    textEls.forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────
     3. AMBIENT PARTICLE CANVAS
     Floating geometric shapes: triangles,
     hexagons, circles — data/infographic feel
     ───────────────────────────────────────── */
  function initAmbientCanvas() {
    const canvas = document.getElementById('cs2-ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animId;
    let particles = [];
    const PARTICLE_COUNT = 35;

    // Colors
    const colors = [
      'rgba(100, 255, 218, 0.06)',  // teal-mint
      'rgba(100, 255, 218, 0.04)',
      'rgba(255, 179, 71, 0.04)',   // amber
      'rgba(167, 139, 250, 0.04)',  // violet
      'rgba(255, 255, 255, 0.03)',  // white
    ];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticle() {
      const type = Math.random();
      let shape;
      if (type < 0.3) shape = 'triangle';
      else if (type < 0.55) shape = 'hexagon';
      else if (type < 0.75) shape = 'diamond';
      else shape = 'circle';

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 18 + 6,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.15 - 0.05,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.004,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shape,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.008 + 0.003,
      };
    }

    function drawTriangle(ctx, x, y, size, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.restore();
    }

    function drawHexagon(ctx, x, y, size, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.restore();
    }

    function drawDiamond(ctx, x, y, size, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();
      ctx.restore();
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.pulse += p.pulseSpeed;

        // Wrap around edges
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        const pulseScale = 0.85 + Math.sin(p.pulse) * 0.15;
        const currentSize = p.size * pulseScale;

        ctx.globalAlpha = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;

        switch (p.shape) {
          case 'triangle':
            drawTriangle(ctx, p.x, p.y, currentSize, p.rotation);
            ctx.stroke();
            break;
          case 'hexagon':
            drawHexagon(ctx, p.x, p.y, currentSize, p.rotation);
            ctx.fill();
            break;
          case 'diamond':
            drawDiamond(ctx, p.x, p.y, currentSize, p.rotation);
            ctx.stroke();
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize * 0.5, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    }

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
      }, 150);
    });

    resize();
    initParticles();
    animate();

    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(animate);
      }
    });
  }

  /* ─────────────────────────────────────────
     4. NAVBAR SCROLL BEHAVIOR
     Hide on scroll down, show on scroll up
     ───────────────────────────────────────── */
  function initNavbarScroll() {
    const nav = document.getElementById('cs2Topnav');
    if (!nav) return;

    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 120) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }

      lastScrollY = currentY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     5. INIT
     ───────────────────────────────────────── */
  function init() {
    initScrollReveals();
    initTextMaskReveals();
    initAmbientCanvas();
    initNavbarScroll();
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
