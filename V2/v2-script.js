const slides = document.querySelectorAll('.hero-slide');
const dotsWrap = document.getElementById('heroDots');
let slideIndex = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => showSlide(i));
  dotsWrap.appendChild(dot);
});

function showSlide(i) {
  slides[slideIndex].classList.remove('active');
  dotsWrap.children[slideIndex].classList.remove('active');
  slideIndex = i;
  slides[slideIndex].classList.add('active');
  dotsWrap.children[slideIndex].classList.add('active');
}

setInterval(() => {
  showSlide((slideIndex + 1) % slides.length);
}, 6000);

const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
navToggle.addEventListener('click', () => {
  mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
});
