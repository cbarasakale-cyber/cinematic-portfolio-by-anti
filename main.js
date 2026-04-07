// ── LENIS SMOOTH SCROLL ──
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ── LOADER ──
const loader = document.getElementById('loader');
const progressEl = document.querySelector('.loader-progress');
const loaderLine = document.querySelector('.loader-line');
const words = document.querySelectorAll('.word');

let progress = 0;
const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 1;
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        startIntro();
    }
    progressEl.innerText = progress.toString().padStart(2, '0');
    loaderLine.style.width = progress + '%';
}, 100);

function startIntro() {
    const tl = gsap.timeline();
    tl.to(words, {
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out"
    })
    .to(loader, {
        y: "-100%",
        duration: 1.5,
        ease: "power4.inOut",
        delay: 0.5
    }, "+=0.5")
    .from(".hero-title .line", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: "power4.out"
    }, "-=0.5")
    .from(".hero-meta", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
    }, "-=1");
}

// ── HERO CANVAS (CINEMATIC DUST) ──
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.init();
    }
    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = `rgba(197, 165, 114, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resize);
resize();
initParticles();
animateParticles();

// ── SCROLL ANIMATIONS ──
gsap.registerPlugin(ScrollTrigger);

// Work horizontal parallax or simple reveal
const workItems = document.querySelectorAll('.work-item');
workItems.forEach(item => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top bottom-=100px",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
});

// About section reveal
gsap.from(".about-p", {
    scrollTrigger: {
        trigger: ".about",
        start: "top center",
    },
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
});

// ── FILTER LOGIC ──
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        workItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                gsap.to(item, { opacity: 1, scale: 1, display: "block", duration: 0.5 });
            } else {
                gsap.to(item, { opacity: 0, scale: 0.9, display: "none", duration: 0.5 });
            }
        });
        
        // Refresh ScrollTrigger
        setTimeout(() => ScrollTrigger.refresh(), 600);
    });
});

// ── MODAL LOGIC ──
const modal = document.getElementById('videoModal');
const iframe = document.getElementById('videoIframe');
const closeBtn = document.querySelector('.modal-close');
const modalBg = document.querySelector('.modal-bg');

workItems.forEach(item => {
    item.addEventListener('click', () => {
        const videoId = item.dataset.video;
        const type = item.dataset.category === 'reels' ? 'short' : 'video';
        
        // Handle YouTube shorts vs normal videos
        let url = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        if (type === 'short') {
            // Note: YouTube shorts can be embedded using the same embed link, 
            // but sometimes they need specific parameters or a different player size.
            // For this cinematic look, we'll keep the 16:9 container for all, or 
            // update if needed.
        }
        
        iframe.src = url;
        modal.classList.add('active');
        lenis.stop();
    });
});

function closeModal() {
    modal.classList.remove('active');
    iframe.src = '';
    lenis.start();
}

closeBtn.addEventListener('click', closeModal);
modalBg.addEventListener('click', closeModal);

// ── CURSOR (Subtle dot) ──
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background: var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
    transition: transform 0.1s ease-out;
`;
document.body.appendChild(cursor);

window.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .work-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(4)';
        cursor.style.backgroundColor = 'transparent';
        cursor.style.border = '1px solid var(--accent)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'var(--accent)';
        cursor.style.border = 'none';
    });
});
