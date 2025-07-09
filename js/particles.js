// ================================
// 🌌 PARTICULAS FLOTANTES
// ================================

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const numParticles = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (
      this.x < 0 || this.x > canvas.width ||
      this.y < 0 || this.y > canvas.height
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color-text') + this.opacity;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < numParticles; i++) {
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

initParticles();
animateParticles();
