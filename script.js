// ── Contact form (Formspree)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const btn = form.querySelector('.submit-btn');
const btnText = btn.querySelector('.btn-text');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  btn.classList.add('loading');
  btnText.textContent = 'Sending...';
  status.textContent = '';
  status.className = 'form-status';
  const data = new FormData(form);
  try {
    const res = await fetch('https://formspree.io/f/mgonbrap', {
      method: 'POST', body: data, headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      status.textContent = "✓ Message sent! I'll get back to you soon.";
      status.classList.add('ok');
      form.reset();
    } else {
      const err = await res.json();
      status.textContent = '✗ ' + (err?.error || 'Something went wrong. Try again.');
      status.classList.add('err');
    }
  } catch (e) {
    status.textContent = '✗ Network error. Try again.';
    status.classList.add('err');
  } finally {
    btn.classList.remove('loading');
    btnText.textContent = 'Send message';
  }
});

// ── Smooth inertial scroll
let currentY = window.scrollY, targetY = window.scrollY, rafId = null;
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  targetY += e.deltaY * 0.9;
  targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));
  if (!rafId) animate();
}, { passive: false });

function animate() {
  currentY += (targetY - currentY) * 0.08;
  if (Math.abs(targetY - currentY) < 0.5) { currentY = targetY; rafId = null; }
  else rafId = requestAnimationFrame(animate);
  window.scrollTo(0, currentY);
}

window.addEventListener('scroll', () => {
  if (!rafId) { currentY = window.scrollY; targetY = window.scrollY; }
});

// ── Nav scroll behavior
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Smooth anchor navigation (works with inertial scroll)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    targetY = target.getBoundingClientRect().top + window.scrollY;
    targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));
    if (!rafId) animate();
  });
});

// ── Back to top button
const topBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  topBtn.classList.toggle('visible', window.scrollY > 400);
});
topBtn.addEventListener('click', () => {
  targetY = 0;
  if (!rafId) animate();
});

// ── Typewriter
const roles = ['JS Developer', 'NestJS Engineer', 'Backend Enthusiast', 'Software Engineer'];
let ri = 0, ci = 0, deleting = false, paused = false, typeTimer = null;
const tw = document.getElementById('typewriter');
const twContainer = document.querySelector('.hero-typewriter');

function type() {
  if (paused) return;
  const word = roles[ri];
  if (!deleting) {
    tw.textContent = word.slice(0, ci + 1); ci++;
    if (ci === word.length) { deleting = true; typeTimer = setTimeout(type, 1600); return; }
  } else {
    tw.textContent = word.slice(0, ci - 1); ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  typeTimer = setTimeout(type, deleting ? 55 : 95);
}
setTimeout(type, 1200);

twContainer.addEventListener('mouseenter', () => {
  paused = true;
  clearTimeout(typeTimer);
});
twContainer.addEventListener('mouseleave', () => {
  paused = false;
  type();
});

// ── IntersectionObserver for skill cards
const cards = document.querySelectorAll('.skill-card');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 100);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
cards.forEach(c => obs.observe(c));