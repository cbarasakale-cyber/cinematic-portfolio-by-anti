document.addEventListener('DOMContentLoaded', () => {
  initAmbientBackground();
  initHeroVideo();
  initReelSelector();
  initTextReveal();
  initBeforeAfterSlider();
  initTimelinePlayhead();
  initFluidWaveDivider();
  initSpectrogramParade();
  initSFXSynth();
  initScrollAnimations();
});

/**
 * Initializes lazy loading and interaction for the hero vertical video reel,
 * adding an anamorphic letterbox reveal transition on page load.
 */
function initHeroVideo() {
  const video = document.getElementById('hero-reel');
  const container = document.querySelector('.hero-video-container');

  if (!container) return;

  // Trigger anamorphic opening shutter delay
  setTimeout(() => {
    container.classList.add('revealed');
  }, 400);

  if (!video) return;

  // IntersectionObserver to lazy load the video sources and autoplay
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (video.readyState === 0) {
          video.load();
        }
        
        video.play()
          .then(() => {
            container.classList.add('playing');
          })
          .catch(err => {
            console.log('Autoplay was prevented, waiting for user click.', err);
          });
      } else {
        video.pause();
        container.classList.remove('playing');
      }
    });
  }, { threshold: 0.25 });

  videoObserver.observe(video);

  // Toggle play/pause on click
  container.addEventListener('click', () => {
    if (container.classList.contains('is-iframe')) return;
    if (video.paused) {
      video.play();
      container.classList.add('playing');
    } else {
      video.pause();
      container.classList.remove('playing');
    }
  });
}

/**
 * Splits text elements into animate-ready word blocks.
 */
function initTextReveal() {
  const elements = document.querySelectorAll('.text-mask-reveal');
  elements.forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words.map((word, index) => {
      return `<span class="word-mask" style="transition-delay: ${index * 0.04}s"><span class="word-inner">${word}</span></span>`;
    }).join(' ');
  });
}

/**
 * Sets up pointer/touch drag event listeners for the comparison slider,
 * including a floating comparison tag that tracks the pointer.
 */
function initBeforeAfterSlider() {
  const slider = document.getElementById('before-after-slider');
  if (!slider) return;

  let isDragging = false;

  // Create floating magnetic comparison tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'compare-tooltip';
  tooltip.textContent = 'Drag to Compare';
  slider.appendChild(tooltip);

  // Update slider position based on client X position
  function updateSliderPosition(clientX, clientY) {
    const rect = slider.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    
    percentage = Math.max(0, Math.min(100, percentage));
    slider.style.setProperty('--slider-pos', `${percentage}%`);

    // Move tooltip to follow cursor
    tooltip.style.left = `${offsetX}px`;
    tooltip.style.top = `${clientY - rect.top}px`;
  }

  // Pointer Down (starts drag)
  slider.addEventListener('pointerdown', (e) => {
    isDragging = true;
    slider.setPointerCapture(e.pointerId);
    tooltip.textContent = 'REVEALING GRADE';
    updateSliderPosition(e.clientX, e.clientY);
  });

  // Pointer Move
  slider.addEventListener('pointermove', (e) => {
    const rect = slider.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    tooltip.style.left = `${offsetX}px`;
    tooltip.style.top = `${e.clientY - rect.top}px`;

    if (!isDragging) return;
    updateSliderPosition(e.clientX, e.clientY);
  });

  // Pointer Up/Cancel
  slider.addEventListener('pointerup', (e) => {
    isDragging = false;
    tooltip.textContent = 'Drag to Compare';
    slider.releasePointerCapture(e.pointerId);
  });

  slider.addEventListener('pointercancel', () => {
    isDragging = false;
    tooltip.textContent = 'Drag to Compare';
  });
}

/**
 * Sets up the edit rhythm playhead tracker.
 */
function initTimelinePlayhead() {
  const track = document.getElementById('timeline-track');
  const playhead = document.getElementById('timeline-playhead');
  const playheadTime = playhead?.querySelector('.playhead-time');
  const segments = document.querySelectorAll('.timeline-segment');

  if (!track || !playhead) return;

  track.addEventListener('pointermove', (e) => {
    const rect = track.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    // Position playhead
    playhead.style.left = `${percentage}%`;
    playhead.style.opacity = '1';
    
    // Calculate simulated timeline time (total edit length 3.30s)
    const time = ((percentage / 100) * 3.3).toFixed(2);
    if (playheadTime) {
      playheadTime.textContent = `${time}s`;
    }
  });

  track.addEventListener('pointerleave', () => {
    playhead.style.opacity = '0';
  });

  // Highlight cards below
  segments.forEach((seg) => {
    seg.addEventListener('pointerenter', () => {
      const cards = document.querySelectorAll('.desc-card');
      cards.forEach(c => c.classList.remove('active-card'));
      
      let cardIdx = -1;
      if (seg.classList.contains('segment-match')) {
        cardIdx = 0; 
      } else if (seg.classList.contains('segment-freeze')) {
        cardIdx = 1; 
      } else if (seg.classList.contains('segment-ramp')) {
        cardIdx = 2; 
      } else if (seg.classList.contains('segment-fast')) {
        cardIdx = 0; 
      } else if (seg.classList.contains('segment-hold')) {
        cardIdx = 2;
      }
      
      if (cardIdx >= 0 && cards[cardIdx]) {
        cards[cardIdx].classList.add('active-card');
      }
    });

    seg.addEventListener('pointerleave', () => {
      const cards = document.querySelectorAll('.desc-card');
      cards.forEach(c => c.classList.remove('active-card'));
    });
  });
}

/**
 * Renders a fluid undulating sine wave divider on an HTML5 canvas.
 */
function initFluidWaveDivider() {
  const canvas = document.getElementById('fluid-wave-divider');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let t = 0;

  function resize() {
    canvas.width = canvas.parentNode.getBoundingClientRect().width;
    canvas.height = 70;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.015;

    // Draw three layered waves
    const waves = [
      { yOffset: 35, amplitude: 12, speed: 0.05, frequency: 0.008, color: 'rgba(229, 91, 52, 0.45)', lineWidth: 1.5 },
      { yOffset: 35, amplitude: 8, speed: -0.07, frequency: 0.015, color: 'rgba(229, 91, 52, 0.25)', lineWidth: 1 },
      { yOffset: 35, amplitude: 15, speed: 0.02, frequency: 0.005, color: 'rgba(229, 91, 52, 0.15)', lineWidth: 0.8 }
    ];

    waves.forEach(w => {
      ctx.strokeStyle = w.color;
      ctx.lineWidth = w.lineWidth;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        // undulate wave height
        const y = Math.sin(x * w.frequency + t + w.speed * 10) * w.amplitude + w.yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    animationId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/**
 * Animates a real-time moving RGB Parade / Spectrogram monitor and syncs a frame timecode.
 */
function initSpectrogramParade() {
  const canvas = document.getElementById('spectrogram-canvas');
  const timecodeEl = document.getElementById('live-timecode');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let frameCount = 0;

  function resize() {
    const parentRect = canvas.parentNode.getBoundingClientRect();
    canvas.width = parentRect.width;
    canvas.height = 90; // minimal height matches parent wrapper
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // Calculate timecode text
    const elapsedSecs = ((frameCount % 150) / 150 * 3.3).toFixed(2);
    if (timecodeEl) {
      timecodeEl.textContent = `${elapsedSecs}s`;
    }

    const midY = canvas.height / 2;

    // 1. Draw Technical Viewfinder Dotted Grid
    ctx.strokeStyle = 'rgba(222, 214, 200, 0.03)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]); // dotted lines
    
    // Vertical grid lines
    const gridSpacingX = 50;
    for (let x = gridSpacingX; x < canvas.width; x += gridSpacingX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    // Horizontal grid lines
    const gridSpacingY = 25;
    for (let y = gridSpacingY; y < canvas.height; y += gridSpacingY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.setLineDash([]); // Reset line dash

    // Draw little tech crosshairs (+) at markers
    const markersX = [canvas.width * 0.18, canvas.width * 0.48, canvas.width * 0.78];
    ctx.strokeStyle = 'rgba(198, 255, 0, 0.22)';
    ctx.lineWidth = 1;
    markersX.forEach(mx => {
      ctx.beginPath();
      // Horizontal crosshair tick
      ctx.moveTo(mx - 5, midY);
      ctx.lineTo(mx + 5, midY);
      // Vertical crosshair tick
      ctx.moveTo(mx, midY - 5);
      ctx.lineTo(mx, midY + 5);
      ctx.stroke();
    });

    // 2. Draw Muted Secondary Ambient Wave (Low, Mid, and High segments out-of-phase)
    ctx.strokeStyle = 'rgba(128, 119, 107, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    for (let x = 0; x < canvas.width; x++) {
      const u = x / canvas.width;
      
      const w_low = Math.exp(-Math.pow((u - 0.22) / 0.16, 2));
      const w_mid = Math.exp(-Math.pow((u - 0.50) / 0.16, 2));
      const w_high = Math.exp(-Math.pow((u - 0.78) / 0.15, 2));

      const y2_low = Math.sin(u * Math.PI * 6 - frameCount * 0.03 + Math.PI/2) * 12;
      const y2_mid = Math.sin(u * Math.PI * 18 - frameCount * 0.06 + Math.PI/2) * 8;
      const y2_high = Math.sin(u * Math.PI * 90 + frameCount * 0.18 + Math.PI/2) * 6;
      
      const y2 = y2_low * w_low + y2_mid * w_mid + y2_high * w_high;
      ctx.lineTo(x, midY + y2);
    }
    ctx.stroke();

    // 3. Generate coordinates for Main Glowing Wave (Low, Mid, High Transitions)
    const points = [];
    for (let x = 0; x < canvas.width; x++) {
      const u = x / canvas.width;

      // Base envelopes centered on key regions
      const w_low = Math.exp(-Math.pow((u - 0.22) / 0.16, 2));
      const w_mid = Math.exp(-Math.pow((u - 0.50) / 0.16, 2));
      const w_high = Math.exp(-Math.pow((u - 0.78) / 0.15, 2));

      // Wave Math for distinct frequencies (per reference)
      // Low Frequency (Large sweeping waves)
      const y_low = Math.sin(u * Math.PI * 6 - frameCount * 0.04) * (26 + Math.sin(frameCount * 0.08) * 4);
      
      // Mid Frequency (Medium waves)
      const y_mid = Math.sin(u * Math.PI * 18 - frameCount * 0.08) * (14 + Math.cos(frameCount * 0.06) * 3);
      
      // High Frequency (Dense jittery spikes)
      const y_high = (Math.sin(u * Math.PI * 110 + frameCount * 0.24) * 0.7 + (Math.sin(frameCount * 0.95 + u * 240) * 0.3)) * 25;

      // Blend frequencies smoothly using Gaussian weights
      const y = y_low * w_low + y_mid * w_mid + y_high * w_high;
      
      points.push({ x, y: midY + y });
    }

    // 4. Draw Main Wave Gradient Fill (Area fill under the path)
    ctx.beginPath();
    ctx.moveTo(0, midY);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    
    const fillGrad = ctx.createLinearGradient(0, midY, 0, canvas.height);
    fillGrad.addColorStop(0, 'rgba(198, 255, 0, 0.06)');
    fillGrad.addColorStop(1, 'rgba(198, 255, 0, 0.00)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // 5. Draw Main Wave Outer Glow Stroke
    ctx.strokeStyle = 'var(--color-accent)';
    ctx.lineWidth = 3.0;
    ctx.shadowColor = 'rgba(198, 255, 0, 0.55)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow for core line

    // 6. Draw Hot-Core Vector Highlight (White neon core line)
    ctx.strokeStyle = '#fbfaf7';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    animationId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/**
 * Sound Design Synthesizer using Web Audio API and HTML5 canvas visualization.
 */
function initSFXSynth() {
  const pads = document.querySelectorAll('.sfx-pad-btn');
  const canvas = document.getElementById('sound-wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let audioCtx = null;
  let animationFrameId = null;
  let waveNodes = [];

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function animateRipples() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const midY = canvas.height / 2;
    ctx.strokeStyle = '#1d1b19';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.stroke();

    ctx.strokeStyle = 'var(--color-accent)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, midY);

    for (let x = 0; x < canvas.width; x++) {
      let displacement = 0;
      waveNodes.forEach(node => {
        const dist = Math.abs(x - node.x);
        if (dist < node.radius) {
          const age = (Date.now() - node.startTime) / 1000;
          const life = age / node.duration;
          if (life < 1) {
            const envelope = Math.sin(life * Math.PI);
            const freqModifier = node.type === 'riser' ? (1 + age * 3) : (1 - age * 0.5);
            displacement += Math.sin((x - node.x) * (0.08 * freqModifier) - age * 30) * node.amplitude * envelope;
          }
        }
      });
      ctx.lineTo(x, midY + displacement);
    }
    ctx.stroke();

    waveNodes = waveNodes.filter(node => (Date.now() - node.startTime) / 1000 < node.duration);

    if (waveNodes.length > 0) {
      animationFrameId = requestAnimationFrame(animateRipples);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'var(--color-accent)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(canvas.width, midY);
      ctx.stroke();
      animationFrameId = null;
    }
  }

  function addWaveRipple(x, amplitude, duration, type) {
    waveNodes.push({
      x: x || canvas.width / 2,
      radius: 200,
      amplitude: amplitude || 25,
      duration: duration || 0.6,
      startTime: Date.now(),
      type: type
    });
    if (!animationFrameId) {
      animateRipples();
    }
  }

  function resizeCanvas() {
    const parent = canvas.parentNode;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 60;
    
    ctx.strokeStyle = 'var(--color-accent)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(rect.width, 30);
    ctx.stroke();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerSynthSound(type) {
    try {
      const actx = getAudioContext();
      const masterGain = actx.createGain();
      masterGain.gain.setValueAtTime(0.12, actx.currentTime);
      masterGain.connect(actx.destination);

      if (type === 'whoosh') {
        const bufferSize = actx.sampleRate * 0.8;
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = actx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = actx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 6.0;
        
        filter.frequency.setValueAtTime(120, actx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1200, actx.currentTime + 0.35);
        filter.frequency.exponentialRampToValueAtTime(140, actx.currentTime + 0.75);

        const gainNode = actx.createGain();
        gainNode.gain.setValueAtTime(0.001, actx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1.0, actx.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.75);

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterGain);

        noiseNode.start();
        addWaveRipple(canvas.width / 5, 20, 0.8, 'whoosh');
      } 
      else if (type === 'subdrop') {
        const osc = actx.createOscillator();
        const gainNode = actx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, actx.currentTime + 1.2);

        gainNode.gain.setValueAtTime(1.2, actx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 1.2);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start();
        osc.stop(actx.currentTime + 1.25);
        addWaveRipple(canvas.width * 2/5, 28, 1.2, 'subdrop');
      } 
      else if (type === 'riser') {
        const osc = actx.createOscillator();
        const filter = actx.createBiquadFilter();
        const gainNode = actx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, actx.currentTime);
        osc.frequency.linearRampToValueAtTime(540, actx.currentTime + 1.5);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, actx.currentTime);
        filter.frequency.linearRampToValueAtTime(700, actx.currentTime + 1.5);

        gainNode.gain.setValueAtTime(0.001, actx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.6, actx.currentTime + 1.2);
        gainNode.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 1.5);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start();
        osc.stop(actx.currentTime + 1.55);
        addWaveRipple(canvas.width * 3/5, 18, 1.5, 'riser');
      } 
      else if (type === 'impact') {
        const osc = actx.createOscillator();
        const kickGain = actx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, actx.currentTime + 0.18);

        kickGain.gain.setValueAtTime(1.8, actx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.28);

        osc.connect(kickGain);
        kickGain.connect(masterGain);
        osc.start();
        osc.stop(actx.currentTime + 0.3);

        const bufferSize = actx.sampleRate * 0.12;
        const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = actx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = actx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1200, actx.currentTime);

        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.25, actx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.08);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noise.start();
        addWaveRipple(canvas.width * 4/5, 34, 0.4, 'impact');
      }
    } catch (e) {
      console.log('Web Audio context blocked.', e);
    }
  }

  pads.forEach(pad => {
    pad.addEventListener('click', () => {
      const type = pad.dataset.sfx;
      triggerSynthSound(type);
    });
  });
}

/**
 * Triggers a digital digit scramble ticker on statistic items.
 */
function animateStatCounter(element) {
  const finalValue = element.textContent.trim();
  const isPercent = finalValue.includes('%');
  const isPlus = finalValue.includes('+');
  
  // Extract number digits
  const numValue = parseInt(finalValue.replace(/[^0-9]/g, ''), 10);
  if (isNaN(numValue)) return;

  const duration = 750; // duration of count-up in ms
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing formula (easeOutExpo)
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = Math.floor(easeProgress * numValue);

    // Format output
    let output = currentValue.toLocaleString();
    if (isPercent) output += '%';
    if (isPlus) output += '+';
    
    element.textContent = output;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = finalValue; // secure final string
    }
  }

  requestAnimationFrame(update);
}

/**
 * Setup IntersectionObserver for fade-in animations and hard-cut stats on scroll.
 */
function initScrollAnimations() {
  const animElements = document.querySelectorAll('.fade-slide-up, .scroll-hard-cut');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.08
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // If it is a statistic number, trigger scramble counter
        const statNumber = entry.target.querySelector('.stat-number');
        if (statNumber) {
          animateStatCounter(statNumber);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animElements.forEach(el => {
    animationObserver.observe(el);
  });
}

/**
 * Background floating particles engine (editing & music elements)
 */
function initAmbientBackground() {
  const canvas = document.getElementById('ambient-particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 20;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Create editing and audio technical elements
  const types = ['timecode', 'playhead', 'filmframe', 'audiobar', 'waveform', 'crosshair'];

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(true));
  }

  function createParticle(randomY = false) {
    return {
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + 60,
      vy: -(0.15 + Math.random() * 0.35), // slowly float upwards
      vx: (Math.random() * 0.2 - 0.1), // subtle drift left/right
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() * 0.004 - 0.002), // very slow spin
      scale: 0.9 + Math.random() * 0.9, // Refined scale size (0.9x to 1.8x)
      type: types[Math.floor(Math.random() * types.length)],
      opacity: 0,
      targetOpacity: 0.15 + Math.random() * 0.15, // Increased target opacity range (15% to 30%)
      fadeSpeed: 0.005 + Math.random() * 0.005,
      // Timecode specific string
      timecodeStr: generateTimecodeString(),
      // Audio bars dynamic offsets
      barHeights: [15, 25, 10, 20].map(h => ({ target: h, current: h * Math.random() }))
    };
  }

  function generateTimecodeString() {
    const hr = String(Math.floor(Math.random() * 2)).padStart(2, '0');
    const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const sec = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${hr}:${min}:${sec}:08`;
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.scale(p.scale, p.scale);

    ctx.fillStyle = `rgba(240, 160, 50, ${p.opacity})`; // Warm Film Gold/Amber color
    ctx.strokeStyle = `rgba(240, 160, 50, ${p.opacity})`;
    ctx.lineWidth = 1;

    switch (p.type) {
      case 'timecode':
        ctx.font = '700 10px JetBrains Mono, monospace';
        ctx.fillText(p.timecodeStr, -35, 0);
        break;

      case 'playhead':
        // Outlined playhead triangle pointing down
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, -10);
        ctx.lineTo(0, 5);
        ctx.closePath();
        ctx.stroke();
        break;

      case 'filmframe':
        // Outlined film strip frame
        ctx.beginPath();
        ctx.rect(-15, -20, 30, 40);
        ctx.stroke();
        // Film holes left & right
        for (let yOffset = -15; yOffset <= 15; yOffset += 10) {
          ctx.beginPath();
          ctx.rect(-12, yOffset - 2, 3, 4);
          ctx.rect(9, yOffset - 2, 3, 4);
          ctx.fill();
        }
        break;

      case 'audiobar':
        // Pulsing audio equalizer bars
        p.barHeights.forEach((b, index) => {
          if (Math.random() < 0.05) {
            b.target = 5 + Math.random() * 25;
          }
          b.current += (b.target - b.current) * 0.1;
          ctx.fillRect(-16 + index * 8, -b.current / 2, 4, b.current);
        });
        break;

      case 'waveform':
        // Draw a tiny undulating sine wave
        ctx.beginPath();
        for (let px = -20; px <= 20; px += 2) {
          const py = Math.sin(px * 0.15 + (Date.now() * 0.003)) * 6;
          if (px === -20) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        break;

      case 'crosshair':
        // Clean technical alignment crosshair marker
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-12, 0); ctx.lineTo(12, 0);
        ctx.moveTo(0, -12); ctx.lineTo(0, 12);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, idx) => {
      // Update position
      p.y += p.vy;
      p.x += p.vx;
      p.rotation += p.vRotation;

      // Handle fading in and out
      if (p.y < 80 || p.y > canvas.height - 80 || p.x < 80 || p.x > canvas.width - 80) {
        // Fade out near edges
        p.opacity = Math.max(0, p.opacity - p.fadeSpeed * 1.5);
      } else {
        // Fade in
        p.opacity = Math.min(p.targetOpacity, p.opacity + p.fadeSpeed);
      }

      // Recreate particle if it floats off screen or fully fades out
      if (p.y < -60 || p.opacity <= 0 && p.y < canvas.height / 2) {
        particles[idx] = createParticle(false);
      } else {
        drawParticle(p);
      }
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/**
 * Initializes the case study reel/video selector buttons.
 */
function initReelSelector() {
  const container = document.querySelector('.hero-video-container');
  const buttons = document.querySelectorAll('.selector-btn');
  if (!container || buttons.length === 0) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and add to the clicked one
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const source = btn.dataset.source;
      
      // Clean up existing iframe if any
      const existingIframe = container.querySelector('iframe');
      if (existingIframe) {
        existingIframe.remove();
      }

      if (source === 'youtube') {
        container.classList.add('is-iframe');

        // Create iframe
        const videoId = btn.dataset.videoId;
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`;
        iframe.frameBorder = '0';
        iframe.allow = 'autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.objectFit = 'cover';

        container.appendChild(iframe);
      }
    });
  });
}
