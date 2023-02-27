'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContents = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

const allSections = document.querySelectorAll('.section');
const allImages = document.querySelectorAll('.features__img');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////////
// Functions
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    logo.style.opacity = this;
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  }
};

let currSlide = 0;
const goToSlide = function (slideNum) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slideNum)}%)  `;
  });
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
const activateDot = function (slideNum) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(d => d.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slideNum}"]`)
    .classList.add('dots__dot--active');
};

const nextSlide = function () {
  if (currSlide === slides.length - 1) currSlide = 0;
  else currSlide++;
  goToSlide(currSlide);
  activateDot(currSlide);
};
const prevSlide = function () {
  if (currSlide === 0) currSlide = slides.length - 1;
  else currSlide--;
  goToSlide(currSlide);
  activateDot(currSlide);
};

////////////////////////////////////////
// Event handlers
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Navigation Smooth Scrolling
document
  .querySelector('.nav__links')
  .addEventListener('click', function (parent) {
    parent.preventDefault();

    if (parent.target.classList.contains('nav__link')) {
      const id = parent.target.getAttribute('href');
      console.log(id);
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
      });
    }
  });

//button (learn-more) smooth scrolling
btnScollTo.addEventListener('click', e =>
  section1.scrollIntoView({
    behavior: 'smooth',
  })
);

//Tabbed element
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  console.log(clicked);

  //Active Tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Active Content area
  tabsContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Nav fade animation
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky nav
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});

navObserver.observe(header);

//Revealing sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
  entry;
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images
const loadImage = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('lazy-img');
    entry.target.src = entry.target.dataset.src;
    observer.unobserve(entry.target);
  }
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 1,
});

allImages.forEach(img => {
  img.classList.add('lazy-img');
  imageObserver.observe(img);
});

//Slider
goToSlide(0);
createDots();
activateDot(0);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    goToSlide(e.target.dataset.slide);
    activateDot(e.target.dataset.slide);
  }
});
