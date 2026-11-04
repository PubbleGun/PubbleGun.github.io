const header = document.querySelector('.site-header');
const menuPanel = document.querySelector('.menu-panel');
const menuTitle = document.querySelector('#menu-title');
const menuToggle = document.querySelector('.menu-toggle');
const navButtons = [...document.querySelectorAll('[data-menu]')];

document.addEventListener('keydown', event => {
  if (event.key === 'Tab') document.body.classList.add('keyboard-nav');
});
document.addEventListener('pointerdown', () => document.body.classList.remove('keyboard-nav'));

function setMenu(open, title = 'Product') {
  menuPanel.classList.toggle('is-open', open);
  menuPanel.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open && innerWidth < 701);
  menuTitle.textContent = title;
  navButtons.forEach(button => button.setAttribute('aria-expanded', String(open && button.dataset.menu === title)));
}

navButtons.forEach(button => button.addEventListener('click', () => {
  const open = !menuPanel.classList.contains('is-open') || menuTitle.textContent !== button.dataset.menu;
  setMenu(open, button.dataset.menu);
}));

menuToggle.addEventListener('click', () => setMenu(!menuPanel.classList.contains('is-open'), 'Menu'));
document.querySelector('.brand').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

let lastScrollY = window.scrollY;
let scrollTicking = false;

function updateHeaderSurface(scrollY = window.scrollY) {
  header.classList.toggle('is-scrolled', scrollY > 48);
}

function updateHeaderVisibility() {
  const currentScrollY = window.scrollY;
  const directionDelta = currentScrollY - lastScrollY;

  updateHeaderSurface(currentScrollY);

  if (currentScrollY <= 48 || directionDelta < -4) {
    header.classList.remove('is-hidden');
  } else if (directionDelta > 4 && !menuPanel.classList.contains('is-open')) {
    header.classList.add('is-hidden');
  }

  lastScrollY = currentScrollY;
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateHeaderVisibility);
    scrollTicking = true;
  }
}, { passive: true });

header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
updateHeaderSurface();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.querySelectorAll('.faq-item > button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('is-open');
      other.querySelector('button').setAttribute('aria-expanded', 'false');
      other.querySelector('i').textContent = '+';
    });
    if (!wasOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      button.querySelector('i').textContent = '−';
    }
  });
});
