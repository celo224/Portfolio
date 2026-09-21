/* ================================================================
   STEVE ANTTO D — Cinematic Portfolio
   Interactive Layer: Particles, Scroll Triggers, Effects
   ================================================================ */

(function () {
  'use strict';

  // ── PARTICLE CANVAS SYSTEM ─────────────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let animFrame;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.targetOpacity = this.opacity;

      // Color: 70% cyan, 20% electric blue, 10% indigo
      const roll = Math.random();
      if (roll < 0.7) {
        this.color = { r: 6, g: 182, b: 212 };       // cyan
      } else if (roll < 0.9) {
        this.color = { r: 59, g: 130, b: 246 };       // electric blue
      } else {
        this.color = { r: 99, g: 102, b: 241 };       // indigo
      }

      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Subtle mouse repulsion
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.15;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }

      // Pulse opacity
      this.pulsePhase += this.pulseSpeed;
      this.opacity = this.targetOpacity + Math.sin(this.pulsePhase) * 0.15;

      // Wrap around
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0, this.opacity)})`;
      ctx.fill();

      // Glow for larger particles
      if (this.size > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0, this.opacity * 0.1)})`;
        ctx.fill();
      }
    }
  }

  function initParticles() {
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connections between close particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const opacity = (1 - dist / 100) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    for (const p of particles) {
      p.update();
      p.draw();
    }

    animFrame = requestAnimationFrame(animateParticles);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Init
  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });


  // ── NEURAL NETWORK MINI CANVAS (Hero Monitor) ─────────────────
  const neuralMiniCanvas = document.getElementById('neural-mini-canvas');
  if (neuralMiniCanvas) {
    const nCtx = neuralMiniCanvas.getContext('2d');
    const nodes = [];
    const layers = [3, 5, 4, 2];
    let neuralPhase = 0;

    // Create nodes
    layers.forEach((count, layerIdx) => {
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: 25 + layerIdx * 60,
          y: 10 + (i * 70) / count + (70 / count - 10) / 2,
          layer: layerIdx,
          idx: i
        });
      }
    });

    function animateNeural() {
      nCtx.clearRect(0, 0, 230, 90);
      neuralPhase += 0.02;

      // Draw connections
      for (const n1 of nodes) {
        for (const n2 of nodes) {
          if (n2.layer === n1.layer + 1) {
            const pulse = (Math.sin(neuralPhase + n1.idx * 0.5 + n2.idx * 0.3) + 1) / 2;
            nCtx.beginPath();
            nCtx.moveTo(n1.x, n1.y);
            nCtx.lineTo(n2.x, n2.y);
            nCtx.strokeStyle = `rgba(6, 182, 212, ${0.08 + pulse * 0.15})`;
            nCtx.lineWidth = 0.5;
            nCtx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = (Math.sin(neuralPhase + n.idx * 0.7) + 1) / 2;
        const r = 2 + pulse * 1.5;

        // Glow
        nCtx.beginPath();
        nCtx.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
        nCtx.fillStyle = `rgba(6, 182, 212, ${0.05 + pulse * 0.08})`;
        nCtx.fill();

        // Node
        nCtx.beginPath();
        nCtx.arc(n.x, n.y, r, 0, Math.PI * 2);
        nCtx.fillStyle = `rgba(6, 182, 212, ${0.4 + pulse * 0.4})`;
        nCtx.fill();
      }

      requestAnimationFrame(animateNeural);
    }

    animateNeural();
  }


  // ── NEURAL NETWORK BACKGROUND CANVAS (AI Agent Scene) ─────────
  const neuralBgCanvas = document.getElementById('neural-bg-canvas');
  if (neuralBgCanvas) {
    const nbCtx = neuralBgCanvas.getContext('2d');
    const bgNodes = [];
    let bgPhase = 0;

    function resizeNeuralBg() {
      const rect = neuralBgCanvas.parentElement.getBoundingClientRect();
      neuralBgCanvas.width = rect.width;
      neuralBgCanvas.height = rect.height;

      // Regenerate nodes
      bgNodes.length = 0;
      const count = 40;
      for (let i = 0; i < count; i++) {
        bgNodes.push({
          x: Math.random() * neuralBgCanvas.width,
          y: Math.random() * neuralBgCanvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1
        });
      }
    }

    function animateNeuralBg() {
      nbCtx.clearRect(0, 0, neuralBgCanvas.width, neuralBgCanvas.height);
      bgPhase += 0.01;

      // Update & draw
      for (const n of bgNodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > neuralBgCanvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > neuralBgCanvas.height) n.vy *= -1;
      }

      // Connections
      for (let i = 0; i < bgNodes.length; i++) {
        for (let j = i + 1; j < bgNodes.length; j++) {
          const dx = bgNodes[i].x - bgNodes[j].x;
          const dy = bgNodes[i].y - bgNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.12;
            const pulse = (Math.sin(bgPhase + i * 0.2) + 1) / 2;
            nbCtx.beginPath();
            nbCtx.moveTo(bgNodes[i].x, bgNodes[i].y);
            nbCtx.lineTo(bgNodes[j].x, bgNodes[j].y);
            nbCtx.strokeStyle = `rgba(99, 102, 241, ${opacity * (0.5 + pulse * 0.5)})`;
            nbCtx.lineWidth = 0.5;
            nbCtx.stroke();
          }
        }
      }

      // Nodes
      for (const n of bgNodes) {
        const pulse = (Math.sin(bgPhase + n.x * 0.01) + 1) / 2;
        nbCtx.beginPath();
        nbCtx.arc(n.x, n.y, n.size + pulse, 0, Math.PI * 2);
        nbCtx.fillStyle = `rgba(99, 102, 241, ${0.2 + pulse * 0.3})`;
        nbCtx.fill();
      }

      requestAnimationFrame(animateNeuralBg);
    }

    resizeNeuralBg();
    animateNeuralBg();

    window.addEventListener('resize', resizeNeuralBg);
  }


  // ── INTERSECTION OBSERVER — SCROLL REVEAL ─────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ── SCENE TRACKING — NAV DOTS & COUNTER ───────────────────────
  const scenes = document.querySelectorAll('.scene');
  const dots = document.querySelectorAll('.scene-nav .dot');
  const counterEl = document.getElementById('scene-counter');
  const counterCurrent = counterEl ? counterEl.querySelector('.current') : null;
  const lensFlare = document.getElementById('lens-flare');

  let currentScene = 0;
  let lastFlareScene = -1;

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(scenes).indexOf(entry.target);
        if (idx !== -1 && idx !== currentScene) {
          currentScene = idx;
          updateSceneIndicator(idx);

          // Trigger lens flare on scene change
          if (idx !== lastFlareScene) {
            triggerLensFlare();
            lastFlareScene = idx;
          }
        }
      }
    });
  }, {
    threshold: 0.4
  });

  scenes.forEach(scene => sceneObserver.observe(scene));

  function updateSceneIndicator(idx) {
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });

    // Update counter
    if (counterCurrent) {
      counterCurrent.textContent = String(idx + 1).padStart(2, '0');
    }
  }

  // Dot click navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sceneIdx = parseInt(dot.dataset.scene, 10);
      const target = document.getElementById(`scene-${sceneIdx}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ── LENS FLARE EFFECT ─────────────────────────────────────────
  function triggerLensFlare() {
    if (!lensFlare) return;
    lensFlare.classList.remove('active');

    // Force reflow
    void lensFlare.offsetWidth;

    lensFlare.classList.add('active');

    setTimeout(() => {
      lensFlare.classList.remove('active');
    }, 3000);
  }


  // ── PARALLAX ON MOUSE MOVE (Hero Scene) ───────────────────────
  const heroScene = document.getElementById('scene-0');

  if (heroScene) {
    const monitors = heroScene.querySelectorAll('.monitor');

    document.addEventListener('mousemove', (e) => {
      const rect = heroScene.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (e.clientX - centerX) / centerX;
      const offsetY = (e.clientY - centerY) / centerY;

      monitors.forEach((monitor, i) => {
        const depth = (i + 1) * 3;
        monitor.style.transform = `translate(${offsetX * depth}px, ${offsetY * depth}px)`;
      });
    });
  }


  // ── SMOOTH SCROLL HIDE INDICATOR ──────────────────────────────
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '';
        scrollIndicator.style.pointerEvents = '';
      }
    }, { passive: true });
  }


  // ── KEYBOARD NAVIGATION ───────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(currentScene + 1, scenes.length - 1);
      document.getElementById(`scene-${next}`)?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(currentScene - 1, 0);
      document.getElementById(`scene-${prev}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  });


  // ── IoT DATA ANIMATION (simulate changing values) ─────────────
  const iotMonitor = document.getElementById('monitor-iot');
  if (iotMonitor) {
    const content = iotMonitor.querySelector('.monitor-content');
    setInterval(() => {
      const moisture = (70 + Math.random() * 8).toFixed(1);
      const temp = (27 + Math.random() * 3).toFixed(1);
      const humidity = (62 + Math.random() * 8).toFixed(1);
      const nitrogen = Math.floor(38 + Math.random() * 10);
      const pumpActive = Math.random() > 0.3;

      content.innerHTML = `
        <span class="comment">// Real-time Sensor Data</span><br>
        <span class="func">soil_moisture</span>: <span class="string">${moisture}%</span> ${parseFloat(moisture) > 73 ? '▲' : '▼'}<br>
        <span class="func">temperature</span>: &nbsp;<span class="string">${temp}°C</span><br>
        <span class="func">humidity</span>: &nbsp;&nbsp;&nbsp;<span class="string">${humidity}%</span><br>
        <span class="func">npk_nitrogen</span>: <span class="string">${nitrogen} mg/kg</span><br>
        <span class="func">pump_status</span>: &nbsp;<span class="keyword">${pumpActive ? 'ACTIVE' : 'IDLE'}</span> ${pumpActive ? '●' : '○'}
      `;
    }, 3000);
  }


  // ── PRELOAD CRITICAL ASSETS ───────────────────────────────────
  // Ensures smooth experience after initial load
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Trigger initial lens flare after a delay
    setTimeout(triggerLensFlare, 2500);
  });

})();
