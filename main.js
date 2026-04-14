/* ═══════════════════════════════════════════════════════════
   CHANDRAKANT — CINEMATIC PORTFOLIO — main.js
   All interactions, animations, and particle systems
   ═══════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    // Wait for all scripts to load
    window.addEventListener("load", init);

    let lenis = null;

    function init() {
        initIntro();
        initCustomCursor();
        initThumbnails();
    }

    /* ═══════════════════════════════════════
       1. CINEMATIC INTRO — Design Cover Style
       ═══════════════════════════════════════ */
    function initIntro() {
        const loader = document.getElementById("introLoader");
        const title = document.getElementById("introTitle");
        const chars = title.querySelectorAll(".char");
        const glowChar = document.getElementById("introGlowChar");
        const signaturePath = document.getElementById("signaturePath");
        const signatureText = document.querySelector(".signature-text-plain");
        const selectionBox = document.getElementById("introSelection");
        const selLines = selectionBox.querySelectorAll(".sel-line");
        const selCorners = selectionBox.querySelectorAll(".sel-corner");
        const metaText = document.querySelector(".intro-top-meta");
        const progressBar = document.getElementById("introProgressBar");
        const progressWrap = document.querySelector(".intro-progress-wrap");

        if (!loader) { bootSite(); return; }

        // ── Create GSAP Timeline ──
        const tl = gsap.timeline({
            onComplete: () => {
                loader.classList.add("fade-out");
                setTimeout(() => {
                    loader.style.display = "none";
                    bootSite();
                    if (typeof refreshScroll === "function") refreshScroll();
                }, 1200);
            }
        });

        // ── Stage 1: Initial Atmosphere (0s) ──
        tl.set([title, selectionBox, progressWrap], { opacity: 1 });
        
        // ── Stage 2: Main Text Reveal (0.5s) ──
        tl.to(metaText, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0.2);
        
        tl.to(chars, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: "expo.out"
        }, 0.5);

        // ── Stage 3: Light Source Activation (1.5s) ──
        tl.to(glowChar, {
            className: "char light-source",
            duration: 0.1,
            onStart: () => {
                // Subtle flicker effect using GSAP
                gsap.to(glowChar, {
                    opacity: 0.7,
                    repeat: 5,
                    yoyo: true,
                    duration: 0.05,
                    ease: "rough({ template: none.out, strength: 2, points: 20, taper: 'none', randomize: true, clamp: true})",
                    onComplete: () => gsap.set(glowChar, { opacity: 1 })
                });
            }
        }, 1.5);

        // ── Stage 4: Signature Handwriting (2.0s) ──
        tl.to(signaturePath, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut"
        }, 2.0);

        tl.to(signatureText, {
            opacity: 1,
            duration: 0.8
        }, 2.8);

        // EXTRA: Fade out the writing path to "reveal" the clean text without overlay
        tl.to(signaturePath, {
            opacity: 0,
            duration: 0.4
        }, 3.5);

        // ── Stage 5: Selection Box Draw & Tool Icons (2.5s) ──
        tl.to(selectionBox, { opacity: 1, duration: 0.1 }, 2.5);
        
        // Horizontal lines
        tl.to([selLines[2], selLines[3]], { width: "100%", duration: 0.8, ease: "power2.inOut" }, 2.6);
        // Vertical lines
        tl.to([selLines[0], selLines[1]], { height: "100%", duration: 0.8, ease: "power2.inOut" }, 2.8);
        
        // Tool Icons Pop-in
        tl.to(".intro-tool-icon", {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: "back.out(2.5)"
        }, 3.0);

        // Corner handles
        tl.to(selCorners, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(2)"
        }, 3.2);

        // ── Stage 6: Progress & Zoom (0-4.5s) ──
        tl.to(progressWrap, { opacity: 1, duration: 0.5 }, 0.5);
        tl.to(progressBar, { width: "100%", duration: 4.5, ease: "none" }, 0);

        // Cinematic subtle scale-up
        tl.to(".intro-content", {
            scale: 1.05,
            duration: 5,
            ease: "none"
        }, 0);
    }


    /* ═══════════════════════════════════════
       2. BOOT SITE — after intro fades
       ═══════════════════════════════════════ */
    function bootSite() {
        initLenis();
        initNavbar();
        initMobileMenu();
        initHeroAnimations();
        initThreeJSBackground();
        initShowreelAnimations(); 
        initThumbnails(); 
        initScrollAnimations();
        init3DTilt();
        initHoverPreviews();
        initVideoModal();
        initTimelineGlow();
        initAboutCanvas();
        initGraphicDesign();
        initCountUp();
        initCustomCursor();
        
        // Final refresh sequence
        setTimeout(() => ScrollTrigger.refresh(), 500);
        setTimeout(() => ScrollTrigger.refresh(), 1500);
        
        // Safety Net: Force reveal after 2.5s if animations didn't trigger
        setTimeout(() => {
            document.querySelectorAll(".reveal-el").forEach(el => {
                el.classList.add("is-revealed");
            });
        }, 2500);
    }

    /* ═══════════════════════════════════════
       3. LENIS SMOOTH SCROLL
       ═══════════════════════════════════════ */
    function initLenis() {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Smooth scroll for anchor links
        document.querySelectorAll("[data-scroll]").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute("href"));
                if (target) {
                    lenis.scrollTo(target, { offset: -40, duration: 1.5 });
                }
                // Close mobile menu if open
                closeMobileMenu();
            });
        });
    }

    /* ═══════════════════════════════════════
       4. NAVBAR
       ═══════════════════════════════════════ */
    function initNavbar() {
        const navbar = document.getElementById("navbar");

        // Show navbar after intro
        setTimeout(() => {
            navbar.classList.add("visible");
        }, 200);

        // Scroll detection
        window.addEventListener("scroll", () => {
            if (window.scrollY > 60) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    /* ═══════════════════════════════════════
       5. MOBILE MENU
       ═══════════════════════════════════════ */
    let mobileMenuOpen = false;

    function initMobileMenu() {
        const toggle = document.getElementById("mobileToggle");
        const menu = document.getElementById("mobileMenu");

        toggle.addEventListener("click", () => {
            mobileMenuOpen = !mobileMenuOpen;
            toggle.classList.toggle("active", mobileMenuOpen);
            menu.classList.toggle("active", mobileMenuOpen);

            if (mobileMenuOpen && lenis) {
                lenis.stop();
            } else if (lenis) {
                lenis.start();
            }
        });

        // Close on link click
        menu.querySelectorAll("[data-scroll]").forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu();
            });
        });
    }

    function closeMobileMenu() {
        const toggle = document.getElementById("mobileToggle");
        const menu = document.getElementById("mobileMenu");
        mobileMenuOpen = false;
        if (toggle) toggle.classList.remove("active");
        if (menu) menu.classList.remove("active");
        if (lenis) lenis.start();
    }

    /* ═══════════════════════════════════════
       6. HERO ANIMATIONS (GSAP)
       ═══════════════════════════════════════ */
    function initHeroAnimations() {
        const tl = gsap.timeline({ delay: 0.2 });

        // Stagger hero text
        tl.fromTo(".hero-title",
            { opacity: 0, y: 60, scale: 1.1 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
            0.5
        );
        tl.fromTo(".hero-subtitle",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        );
        tl.fromTo(".hero-tagline",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.4"
        );
        tl.fromTo(".scroll-indicator",
            { opacity: 0 },
            { opacity: 1, duration: 1 },
            "-=0.3"
        );

        // Parallax on mouse move
        const heroContent = document.getElementById("heroContent");
        const hero = document.querySelector(".hero");
        const floatingSvgs = document.querySelectorAll(".hero-svg-item");

        hero.addEventListener("mousemove", (e) => {
            const xShift = (e.clientX / window.innerWidth - 0.5) * 30;
            const yShift = (e.clientY / window.innerHeight - 0.5) * 20;

            gsap.to(heroContent, {
                x: xShift,
                y: yShift,
                duration: 1,
                ease: "power2.out",
            });

            gsap.to(".hero-glow", {
                x: xShift * 1.5,
                y: yShift * 1.5,
                duration: 1.2,
                ease: "power2.out",
            });

            // Float SVGs independently
            floatingSvgs.forEach((svg) => {
                const speed = parseFloat(svg.getAttribute("data-speed") || "1");
                gsap.to(svg, {
                    x: xShift * speed * 2,
                    y: yShift * speed * 2,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });
        });

        hero.addEventListener("mouseleave", () => {
            gsap.to(heroContent, { x: 0, y: 0, duration: 1, ease: "power2.out" });
            gsap.to(".hero-glow", { x: 0, y: 0, duration: 1.2, ease: "power2.out" });
            
            floatingSvgs.forEach((svg) => {
                gsap.to(svg, { x: 0, y: 0, duration: 1.5, ease: "power2.out" });
            });
        });
    }

    /* ═══════════════════════════════════════
       7. GLOBAL 3D BACKGROUND (THREE.JS)
       ═══════════════════════════════════════ */
    function initThreeJSBackground() {
        const canvas = document.getElementById("threeBackground");
        if (!canvas || typeof THREE === "undefined") return;

        const scene = new THREE.Scene();
        // Fog for depth (dark space)
        scene.fog = new THREE.FogExp2(0x0b0b0b, 0.015);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 60;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // ── SPLINES (NEURAL THREADS) ──
        const splines = [];
        const splineObjects = []; // Store lines for animation
        const numSplines = 12; // Increased for full page coverage
        
        // Colors for particles (Theme)
        const colors = [
            new THREE.Color(0xBF5AF2), // Purple
            new THREE.Color(0x6C63FF), // Blueish
            new THREE.Color(0xFFFFFF), // White
            new THREE.Color(0x0A84FF)  // Light Blue
        ];

        for (let i = 0; i < numSplines; i++) {
            const points = [];
            // Generate organic curve points spanning across screen
            const startX = -120 - Math.random() * 40;
            const endX = 120 + Math.random() * 40;
            const steps = 10;
            
            // To cover "full page scroll", we start Y from top and map down deeply
            const baseY = 80 - (Math.random() * 450); 
            
            for (let j = 0; j <= steps; j++) {
                const x = startX + ((endX - startX) * (j / steps));
                const y = baseY + (Math.random() - 0.5) * 120;
                const z = (Math.random() - 0.5) * 80 - (i * 8); 
                points.push(new THREE.Vector3(x, y, z));
            }

            const curve = new THREE.CatmullRomCurve3(points);
            curve.closed = false;
            splines.push(curve);

            // Draw Silver line along curve with heavy glow
            const pointsGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(150));
            const lineMat = new THREE.LineBasicMaterial({ 
                color: 0xffffff, // Brighter white/silver
                transparent: true, 
                opacity: 0.45,   // Higher intensity
                blending: THREE.AdditiveBlending
            });
            const splineObject = new THREE.Line(pointsGeo, lineMat);
            splineObject.userData.basePts = curve.getPoints(150);
            splineObjects.push(splineObject);
            mainGroup.add(splineObject);
        }

        // ── PARTICLES ALONG THREADS ──
        const particleCount = window.innerWidth > 768 ? 1200 : 500; // Optimize for mobile
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        const pColors = new Float32Array(particleCount * 3);
        const pSizes = new Float32Array(particleCount);
        
        // Custom data array to animate particles
        const pData = [];

        for (let i = 0; i < particleCount; i++) {
            // Randomly assign to a spline
            const splineIndex = Math.floor(Math.random() * numSplines);
            const progress = Math.random(); // 0 to 1 along curve
            const speed = 0.0003 + Math.random() * 0.0007; // Flow speed
            
            // Random offset from core spline (for organic thick effect)
            const radius = Math.random() * 2.5;
            const theta = Math.random() * Math.PI * 2;
            const offsetX = Math.cos(theta) * radius;
            const offsetY = Math.sin(theta) * radius;
            const offsetZ = (Math.random() - 0.5) * radius * 2;

            pData.push({ splineIndex, progress, speed, offsetX, offsetY, offsetZ });

            const baseColor = colors[Math.floor(Math.random() * colors.length)];
            pColors[i * 3]     = baseColor.r;
            pColors[i * 3 + 1] = baseColor.g;
            pColors[i * 3 + 2] = baseColor.b;

            // Size variance
            pSizes[i] = Math.random() * 3.0 + 1.0;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
        pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

        // Premium Soft-Glow Shader for Particles
        const pMat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    // Stronger pulsing size based on time and unique particle size
                    float pulse = 1.0 + sin(time * 3.0 + size * 10.0) * 0.8;
                    gl_PointSize = size * pulse * (100.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    // Soft circular glow falloff
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float alpha = pow((0.5 - dist) * 2.0, 1.5); // Smoother falloff
                    gl_FragColor = vec4(vColor, alpha * 2.0); // Doubled Intensity
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particleSystem = new THREE.Points(pGeo, pMat);
        mainGroup.add(particleSystem);

        // ── INTERACTION STATE ──
        let mouseX = 0;
        let mouseY = -1000;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - windowHalfX);
            mouseY = (e.clientY - windowHalfY);
        });

        // ── ANIMATION LOOP ──
        let time = 0;
        const posAttr = pGeo.attributes.position;

        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;
            pMat.uniforms.time.value = time;

            // Smoothly Lerp group rotation for mouse follow
            targetX = mouseX * 0.0003;
            targetY = mouseY * 0.0003;
            
            mainGroup.rotation.y += (targetX - mainGroup.rotation.y) * 0.05;
            mainGroup.rotation.x += (targetY - mainGroup.rotation.x) * 0.05;

            // Scroll parallax depth effect
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            mainGroup.position.y = scrollY * 0.025; // Shift up 
            mainGroup.rotation.z = -scrollY * 0.00015; // Slight twist over scroll

            // Approximate Mouse to world mapping
            const worldMouseX = (mouseX / windowHalfX) * 45;
            const worldMouseY = -(mouseY / windowHalfY) * 30 - mainGroup.position.y;

            // Animate Thread Geometries to flow smoothly
            for (let i = 0; i < numSplines; i++) {
                const lineObj = splineObjects[i];
                const pos = lineObj.geometry.attributes.position;
                const pts = lineObj.userData.basePts;
                for(let j = 0; j < pts.length; j++) {
                    const waveOffset = Math.sin(time + pts[j].x * 0.05) * 1.5;
                    pos.setXYZ(j, pts[j].x, pts[j].y + waveOffset, pts[j].z);
                }
                pos.needsUpdate = true;
            }

            // Update particles along splines
            for (let i = 0; i < particleCount; i++) {
                const data = pData[i];
                data.progress += data.speed;
                if (data.progress > 1) data.progress = 0; // Loop curve

                const spline = splines[data.splineIndex];
                const pt = spline.getPointAt(data.progress);

                // Subtle undulation offset
                const waveOffset = Math.sin(time + pt.x * 0.05) * 1.5;

                let basX = pt.x + data.offsetX;
                let basY = pt.y + data.offsetY + waveOffset;
                let basZ = pt.z + data.offsetZ;

                // Physics: Mouse Repulsion
                let pushX = 0;
                let pushY = 0;
                let pushZ = 0;
                
                if (mouseY !== -1000) {
                    const dx = basX - worldMouseX;
                    const dy = basY - worldMouseY;
                    const distSq = dx*dx + dy*dy;

                    if (distSq < 200) { // radius of interaction
                        const force = (200 - distSq) / 200;
                        const dist = Math.sqrt(distSq);
                        if (dist > 0.001) {
                            pushX = (dx / dist) * force * 5.0; // repel strength
                            pushY = (dy / dist) * force * 5.0;
                            pushZ = force * 3.0; // push slightly back
                        }
                    }
                }

                posAttr.setXYZ(
                    i, 
                    basX + pushX, 
                    basY + pushY, 
                    basZ + pushZ
                );
            }
            posAttr.needsUpdate = true;

            renderer.render(scene, camera);
        }

        animate();

        // ── RESIZE HANDLING ──
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /* ═══════════════════════════════════════
       8. LOAD THUMBNAILS (lazy)
       ═══════════════════════════════════════ */
    function initThumbnails() {
        document.querySelectorAll(".card-thumb[data-thumb]").forEach((el) => {
            const id = el.getAttribute("data-thumb");
            
            // Set fallback first to ensure no black boxes
            el.style.backgroundImage = `url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`;
            
            // Try high res upgrade
            const img = new Image();
            img.onload = () => {
                // Only upgrade if hqdefault worked or we have a valid img
                if (img.width > 120) {
                   el.style.backgroundImage = `url('${img.src}')`;
                }
            };
            img.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        });
    }

    /* ═══════════════════════════════════════
       9. SCROLL ANIMATIONS (GSAP ScrollTrigger)
       ═══════════════════════════════════════ */
    function initScrollAnimations() {
        // 1. 3D Experience Timeline Animation
        gsap.utils.toArray(".timeline-item").forEach((item, i) => {
            const side = item.getAttribute("data-side");
            const entryX = side === "left" ? -100 : 100;

            gsap.from(item, {
                opacity: 0,
                x: entryX,
                z: -500,
                rotationX: 45,
                rotationY: side === "left" ? 15 : -15,
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                }
            });
        });

        // 2. About and Contact reveals
        gsap.utils.toArray("#about .reveal-el, #contact .reveal-el").forEach((el, i) => {
            gsap.from(el, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                }
            });
        });

        // 3. Parallax hero fade out on scroll
        gsap.to(".hero-content", {
            y: -100,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });
    }

    /* ═══════════════════════════════════════
       9b. SPLIT SHOWREEL PARALLAX
       ═══════════════════════════════════════ */
    function initShowreelAnimations() {
        // Unified grid reveal and subtle paralax for each category
        gsap.utils.toArray(".category-section").forEach((section) => {
            gsap.from(section.querySelectorAll(".video-card"), {
                opacity: 0,
                y: 50,
                scale: 0.95,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                }
            });
        });
    }

    /* ═══════════════════════════════════════
       9c. 3D TILT EFFECT
       ═══════════════════════════════════════ */
    function init3DTilt() {
        const cards = document.querySelectorAll(".tilt-card");

        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8; // max 8 deg
                const rotateY = ((x - centerX) / centerX) * 8;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    ease: "power1.out",
                    duration: 0.4
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    ease: "power2.out",
                    duration: 0.8
                });
            });
        });
    }

    /* ═══════════════════════════════════════
       9d. HOVER VIDEO PREVIEWS
       ═══════════════════════════════════════ */
    function initHoverPreviews() {
        const cards = document.querySelectorAll(".tilt-card");

        cards.forEach(card => {
            const videoElem = card.querySelector(".card-hover-video");
            // As a placeholder, we won't inject full Youtube iframes on hover because of performance.
            // A user can manually add `src="preview.mp4"` in HTML.
            
            card.addEventListener("mouseenter", () => {
                if(videoElem && videoElem.src) {
                    videoElem.play().catch(e => { /* Ignore auto-play strict rules */ });
                }
            });

            card.addEventListener("mouseleave", () => {
                if(videoElem && videoElem.src) {
                    videoElem.pause();
                    videoElem.currentTime = 0;
                }
            });
        });
    }

    /* ═══════════════════════════════════════
       10. VIDEO MODAL (SMOOTH ZOOM)
       ═══════════════════════════════════════ */
    function initVideoModal() {
        const modal = document.getElementById("videoModal");
        const iframe = document.getElementById("modalIframe");
        const closeBtn = document.getElementById("closeModal");
        const modalContent = document.getElementById("modalContent");
        const cards = document.querySelectorAll(".tilt-card");

        let expandingCard = null;

        cards.forEach((card) => {
            card.addEventListener("click", () => {
                const videoId = card.getAttribute("data-video-id");
                const type = card.getAttribute("data-type");
                if (!videoId) return;

                // Stop scrolling
                if (lenis) lenis.stop();
                
                // Show modal overlay
                modal.classList.add("active");

                // Set iframe src (Youtube)
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                iframe.src = embedUrl;

                if (type === "short") {
                    modalContent.classList.add("is-vertical");
                } else {
                    modalContent.classList.remove("is-vertical");
                }
            });
        });

        function closeModal() {
            modal.classList.remove("active");
            
            // Allow animation to finish before clearing source
            setTimeout(() => {
                iframe.src = "";
                if (lenis) lenis.start();
            }, 400); 
        }

        closeBtn.addEventListener("click", closeModal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });

        // Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("active")) {
                closeModal();
            }
        });
    }

    /* ═══════════════════════════════════════
       11. TIMELINE GLOW LINE
       ═══════════════════════════════════════ */
    function initTimelineGlow() {
        const glowLine = document.getElementById("timelineGlow");
        if (!glowLine) return;

        gsap.to(glowLine, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top 70%",
                end: "bottom 30%",
                scrub: 1,
            },
        });
    }

    /* ═══════════════════════════════════════
       12. ABOUT VISUAL ORB (Canvas)
       ═══════════════════════════════════════ */
    function initAboutCanvas() {
        const canvas = document.getElementById("aboutCanvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const container = canvas.parentElement;

        function resize() {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * 2; // 2x for retina
            canvas.height = rect.height * 2;
            ctx.scale(2, 2);
        }
        resize();
        window.addEventListener("resize", resize);

        const w = () => canvas.width / 2;
        const h = () => canvas.height / 2;

        let time = 0;

        function draw() {
            const cw = w();
            const ch = h();
            ctx.clearRect(0, 0, cw, ch);

            const cx = cw / 2;
            const cy = ch / 2;

            // Rotating orbital rings
            for (let ring = 0; ring < 4; ring++) {
                const radius = 60 + ring * 30;
                const speed = 0.005 + ring * 0.003;
                const particleCount = 12 + ring * 6;

                for (let i = 0; i < particleCount; i++) {
                    const angle = (Math.PI * 2 / particleCount) * i + time * speed * (ring % 2 === 0 ? 1 : -1);
                    const x = cx + Math.cos(angle) * radius;
                    const y = cy + Math.sin(angle) * radius * 0.6; // Squish for 3D effect
                    const dotR = 1.5 + Math.sin(time * 0.02 + i) * 0.5;
                    const alpha = 0.2 + Math.sin(time * 0.03 + i * 0.5) * 0.15;

                    ctx.beginPath();
                    ctx.arc(x, y, dotR, 0, Math.PI * 2);
                    const color = ring % 2 === 0 ? `108, 99, 255` : `191, 90, 242`;
                    ctx.fillStyle = `rgba(${color}, ${alpha})`;
                    ctx.fill();
                }
            }

            // Central glow
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
            gradient.addColorStop(0, `rgba(108, 99, 255, ${0.15 + Math.sin(time * 0.02) * 0.05})`);
            gradient.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(cx, cy, 40, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            time++;
            requestAnimationFrame(draw);
        }
        draw();
    }

    /* ═══════════════════════════════════════
       13. STATS COUNT UP
       ═══════════════════════════════════════ */
    function initCountUp() {
        const statNumbers = document.querySelectorAll(".stat-number");

        statNumbers.forEach((el) => {
            const target = parseInt(el.getAttribute("data-count"), 10);

            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: target,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function () {
                            el.textContent = Math.floor(this.targets()[0].val);
                        },
                    });
                },
            });
        });
    }

    /* ═══════════════════════════════════════
       14. MINIMALIST CUSTOM CURSOR
       ═══════════════════════════════════════ */
    function initCustomCursor() {
        if (window.innerWidth <= 768) return;

        const cursor = document.getElementById("cursor");
        const dot = cursor.querySelector(".cursor-dot");
        const ring = cursor.querySelector(".cursor-ring");

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let lastSparkle = 0;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Spawn sparkles on move (throttle)
            const now = Date.now();
            if (now - lastSparkle > 40) {
                spawnSparkle(e.clientX, e.clientY);
                lastSparkle = now;
            }
        });

        function spawnSparkle(x, y) {
            const sparkle = document.createElement("div");
            sparkle.className = "cursor-sparkle";
            document.body.appendChild(sparkle);
            
            const size = Math.random() * 8 + 3; // Slightly larger for gold
            const destX = (Math.random() - 0.5) * 80;
            const destY = (Math.random() - 0.5) * 80;
            
            gsap.set(sparkle, {
                x: x,
                y: y,
                width: size,
                height: size,
                opacity: 1,
                scale: 1,
                rotate: Math.random() * 360
            });
            
            gsap.to(sparkle, {
                x: x + destX,
                y: y + destY,
                opacity: 0,
                scale: 0,
                rotate: "+=180",
                duration: 1 + Math.random() * 0.5,
                ease: "power2.out",
                onComplete: () => sparkle.remove()
            });
        }

        function update() {
            // Smooth follow for the ring
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            gsap.set(dot, { x: mouseX, y: mouseY });
            gsap.set(ring, { x: ringX, y: ringY });

            requestAnimationFrame(update);
        }
        update();

        // Interaction scaling
        const targets = document.querySelectorAll("a, button, .video-card, .gd-card");
        targets.forEach(t => {
            t.addEventListener("mouseenter", () => {
                gsap.to(ring, { scale: 1.5, duration: 0.3 });
            });
            t.addEventListener("mouseleave", () => {
                gsap.to(ring, { scale: 1, duration: 0.3 });
            });
        });
    }

    /* ═══════════════════════════════════════
       15. GRAPHIC DESIGN — SCROLL ANIMATIONS
       ═══════════════════════════════════════ */
    function initGraphicDesign() {
        const section = document.querySelector(".graphic-design");
        if (!section) return;

        // Minimal editorial header reveal
        const scrollIndicator = document.querySelector(".scroll-indicator-v2");
        if (scrollIndicator) {
            gsap.from(scrollIndicator, {
                opacity: 0,
                y: 20,
                duration: 1,
                delay: 2.2,
                ease: "power2.out"
            });
        }

        const headerChildren = section.querySelectorAll(".gd-header > *");
        gsap.from(headerChildren, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".gd-header",
                start: "top 85%",
            }
        });

        // Category reveal + card stagger for each category
        document.querySelectorAll(".gd-category").forEach((cat) => {
            // Category label
            gsap.from(cat.querySelector(".gd-category-label"), {
                opacity: 0,
                x: -30,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cat,
                    start: "top 85%",
                }
            });

            // Cards stagger — handle reveal cleanly without the conflicting CSS class
            const cards = cat.querySelectorAll(".gd-card");
            // Set initial state for GSAP
            gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });
            
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                stagger: 0.15,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: cat,
                    start: "top 75%",
                }
            });
        });

        // Mark all remaining gd-reveal elements (headers, titles) as visible
        document.querySelectorAll(".gd-reveal").forEach((el) => {
            ScrollTrigger.create({
                trigger: el,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    el.classList.add("is-visible");
                }
            });
        });

        // Initialize the image lightbox
        initImageLightbox();
    }

    /* ═══════════════════════════════════════
       16. IMAGE LIGHTBOX (for Graphic Design)
       ═══════════════════════════════════════ */
    function initImageLightbox() {
        const lightbox = document.getElementById("imgLightbox");
        const lightboxImg = document.getElementById("imgLightboxImg");
        const closeBtn = document.getElementById("imgLightboxClose");

        if (!lightbox || !lightboxImg || !closeBtn) return;

        // Click on any GD card -> open lightbox
        document.querySelectorAll(".gd-card[data-fullimg]").forEach((card) => {
            card.addEventListener("click", () => {
                const imgUrl = card.getAttribute("data-fullimg");
                if (!imgUrl) return;

                lightboxImg.src = imgUrl;
                lightbox.classList.add("active");

                if (lenis) lenis.stop();
            });
        });

        function closeLightbox() {
            lightbox.classList.remove("active");
            setTimeout(() => {
                lightboxImg.src = "";
                if (lenis) lenis.start();
            }, 400);
        }

        closeBtn.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    /* ═══════════════════════════════════════
       REFRESH SCROLLTRIGGER (after intro)
       ═══════════════════════════════════════ */
    /* ═══════════════════════════════════════
       17. 3D TILT EFFECT FOR CARDS
       ═══════════════════════════════════════ */
    function init3DTilt() {
        const cards = document.querySelectorAll(".tilt-card, .gd-card");
        
        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10; // Subtle tilt factor
                const rotateY = (centerX - x) / 10;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: 1.05,
                    duration: 0.5,
                    ease: "power2.out",
                    perspective: 1000
                });
            });
            
            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    /* ═══════════════════════════════════════
       18. CINEMATIC DUST DISINTEGRATION
       ═══════════════════════════════════════ */
    function initDustTransition() {
        // --- Canvas Setup ---
        const canvas = document.createElement('canvas');
        canvas.id = 'dustCanvas';
        canvas.style.cssText = 'position:fixed;inset:0;z-index:50;pointer-events:none;width:100%;height:100%;';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let W, H;
        let particles = [];
        const MAX_PARTICLES = 500;
        let rafId = null;

        function resize() {
            W = canvas.width = window.innerWidth * (window.devicePixelRatio > 1 ? 1.5 : 1);
            H = canvas.height = window.innerHeight * (window.devicePixelRatio > 1 ? 1.5 : 1);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            const scale = W / window.innerWidth;
            ctx.scale(scale, scale);
        }
        resize();
        window.addEventListener('resize', resize);

        // --- Particle Factory ---
        function createParticle(x, y, isEmber) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2.5 + 0.5;
            return {
                x, y,
                vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5,
                vy: -(Math.random() * 3.5 + 1.2) + Math.sin(angle) * speed * 0.4,
                size: isEmber ? (Math.random() * 4.5 + 2) : (Math.random() * 3.5 + 0.8),
                life: 1,
                decay: 0.005 + Math.random() * 0.01,
                isEmber,
                hue: isEmber ? (18 + Math.random() * 22) : (200 + Math.random() * 60),
                sat: isEmber ? (95 + Math.random() * 5) : (45 + Math.random() * 25), 
                light: isEmber ? (50 + Math.random() * 30) : (80 + Math.random() * 20),
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 4
            };
        }

        // --- Render Loop ---
        function render() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                // Physics
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.985;
                p.vy *= 0.985;
                p.vy -= 0.03;  // upward drift
                p.life -= p.decay;
                p.size *= 0.998;
                p.rotation += p.rotSpeed;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                const alpha = Math.max(0, p.life * p.life); // ease-out fade

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.globalAlpha = alpha;

                if (p.isEmber) {
                    // Glow layer
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${alpha * 1.0})`;
                    ctx.fillStyle = `hsl(${p.hue}, ${p.sat}%, ${p.light}%)`;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.shadowBlur = 0;
                } else {
                    // Dust particle — slight square shape for more "debris" feel
                    ctx.fillStyle = `hsl(${p.hue}, ${p.sat}%, ${p.light}%)`;
                    ctx.beginPath();
                    // Draw irregular shapes for a more organic dust feel
                    if (Math.random() > 0.5) {
                        ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
                    } else {
                        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    }
                    ctx.fill();
                }

                ctx.restore();
            }

            ctx.globalAlpha = 1;

            if (particles.length > 0) {
                rafId = requestAnimationFrame(render);
            } else {
                rafId = null;
            }
        }

        function startRender() {
            if (!rafId) {
                rafId = requestAnimationFrame(render);
            }
        }

        // --- Spawn Dust from Section ---
        function spawnDust(rect, intensity) {
            if (particles.length >= MAX_PARTICLES) return;

            const count = Math.floor(intensity * 25) + 2; // Significant increase in density

            for (let i = 0; i < count; i++) {
                // Determine visible Y bounds
                const viewTop = Math.max(0, rect.top);
                const viewBottom = Math.min(window.innerHeight, rect.bottom);
                
                if (viewBottom <= viewTop) continue;

                const x = rect.left + Math.random() * rect.width;
                // Spawn within the visible portion of the section
                const y = viewTop + Math.random() * (viewBottom - viewTop);

                const isEmber = Math.random() < 0.15; // More embers
                particles.push(createParticle(x, y, isEmber));
            }

            startRender();
        }

        // --- Hook into each section ---
        const sections = document.querySelectorAll(
            '.hero, .showreel-split-wrapper, .graphic-design, .experience, .about, .contact'
        );

        sections.forEach((section) => {
            let lastProgress = 0;

            // Identify the content container to fade
            const content = section.querySelector('.hero-content')
                || section.querySelector('.section-container')
                || section.querySelector('.contact-inner')
                || section.children[0];

            ScrollTrigger.create({
                trigger: section,
                start: 'center center',
                end: 'bottom top',
                onUpdate: (self) => {
                    const p = self.progress;
                    const delta = p - lastProgress;
                    lastProgress = p;

                    // --- Dissolve zone: last 60% of scroll-out ---
                    if (p > 0.35 && p < 0.98) {
                        const dissolve = (p - 0.35) / 0.63; // 0..1

                        // Spawn particles only on forward scroll
                        if (delta > 0 && content) {
                            const rect = section.getBoundingClientRect();
                            spawnDust(rect, dissolve);
                        }

                        // More dramatic content treatment
                        if (content) {
                            const fadeAmount = dissolve * dissolve; // ease-in
                            gsap.to(content, {
                                opacity: 1 - fadeAmount * 0.75, // More fade
                                filter: `brightness(${1 + fadeAmount * 0.8}) saturate(${1 - fadeAmount * 0.4})`,
                                duration: 0.1,
                                overwrite: 'auto'
                            });
                        }
                    }

                    // --- Reset when scrolling back ---
                    if (p <= 0.35 && content) {
                        gsap.set(content, { opacity: 1, filter: 'none' });
                    }
                }
            });
        });

        // Trigger periodic refreshes during boot to sync layout
        let refreshInterval = setInterval(() => ScrollTrigger.refresh(), 800);
        setTimeout(() => clearInterval(refreshInterval), 4000);
    }

})();
