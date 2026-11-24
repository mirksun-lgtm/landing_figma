const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

const slides = [
  { src: 'assets/podium.jpg', alt: 'Three white cylindrical podiums on a warm beige background' },
  { src: 'assets/spheres.jpg', alt: 'Balanced concrete spheres' }
];
const slide = document.getElementById('slide');
let current = 0;

document.querySelectorAll('[data-slide]').forEach((button) => {
  button.addEventListener('click', () => {
    current = (current + (button.dataset.slide === 'next' ? 1 : slides.length - 1)) % slides.length;
    slide.src = slides[current].src;
    slide.alt = slides[current].alt;
  });
});
