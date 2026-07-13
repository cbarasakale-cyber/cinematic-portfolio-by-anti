/* ═══════════════════════════════════════════════════════════
   CASE STUDY 04 — PREMIUM BRAND IDENTITY
   Script: Advanced Motion Design Systems
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  
  /* ─── 1. Text-Mask Glides (Intersection Observer) ─── */
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px", // Trigger slightly before it comes fully into view
    threshold: 0.1
  };

  const textObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".tm-wrap").forEach((el, index) => {
    // Add slight stagger delay if they are batched together
    const inner = el.querySelector('.tm-inner');
    if(inner) {
      inner.style.transitionDelay = `${(index % 5) * 0.1}s`;
    }
    textObserver.observe(el);
  });

  /* ─── 2. The Fluid Line Thread (Scroll-bound SVG) ─── */
  const linePath = document.getElementById("scrollLine");
  if (linePath) {
    const pathLength = linePath.getTotalLength();
    linePath.style.strokeDasharray = pathLength;
    linePath.style.strokeDashoffset = pathLength;

    window.addEventListener("scroll", () => {
      // Calculate scroll percentage
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight;
      const scrollPercent = scrollTop / scrollHeight;

      // Draw the line down based on scroll
      const drawLength = pathLength * scrollPercent;
      linePath.style.strokeDashoffset = pathLength - drawLength;
    }, { passive: true });
  }

  /* ─── 3. 3D Spatial Grid Cards (Mouse-Hover Tilt Matrix) ─── */
  const cards3D = document.querySelectorAll('.cs4-card-3d');
  
  cards3D.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      // Calculate cursor position inside the card relative to the center
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation amounts (tweak the divisor to make it more/less subtle)
      const rotateX = ((y - centerY) / centerY) * -8; // max 8 deg tilt
      const rotateY = ((x - centerX) / centerX) * 8; 

      // Apply transformation matrix directly
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly snap back to 0
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  /* ─── 4. Lightbox Modal ─── */
  const lightbox = document.getElementById('cs4Lightbox');
  const lightboxImg = document.getElementById('cs4LightboxImg');
  const galleryImages = document.querySelectorAll('.cs4-asset-present img');

  if (lightbox && lightboxImg) {
    galleryImages.forEach(img => {
      img.style.cursor = 'zoom-in'; // Let user know it's clickable
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      });
    });

    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
      // optional: wait for transition then clear src
      setTimeout(() => { if(!lightbox.classList.contains('active')) lightboxImg.src = ''; }, 300);
    });
  }

});
