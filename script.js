const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && e.target !== burger) setMenu(false);
});

document.getElementById('schedule').addEventListener('click', () => {
  const note = document.getElementById('demo-note');
  note.hidden = false;
});
