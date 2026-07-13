/* ═══════════════════════════════════════════════════════════
   CASE STUDY 03 — CORPORATE & INSTITUTIONAL DOCUMENTARIES
   Script: Scroll Reveal & Interactions
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  /* ─── 1. Intersection Observer for Scroll Animations ─── */
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-slide-up, .text-mask-reveal").forEach(el => {
    revealObserver.observe(el);
  });

  /* ─── 2. Text Mask Word-by-Word Splitting ─── */
  document.querySelectorAll('.text-mask-reveal').forEach(heading => {
    const text = heading.textContent;
    const words = text.split(' ');
    heading.innerHTML = '';
    
    words.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      
      const innerSpan = document.createElement('span');
      innerSpan.className = 'word-inner';
      innerSpan.textContent = word + (index < words.length - 1 ? ' ' : '');
      
      // Delay stagger
      innerSpan.style.transitionDelay = `${index * 0.04}s`;
      
      wordSpan.appendChild(innerSpan);
      heading.appendChild(wordSpan);
    });
  });

  /* ─── 3. Auto-hide Navbar on Scroll ─── */
  const nav = document.getElementById("cs3Nav");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      nav.classList.add("hidden");
    } else {
      nav.classList.remove("hidden");
    }
    lastScrollY = window.scrollY;
  }, { passive: true });
});
