"use strict";

const navLinks = document.querySelector(".nav__links");
const allSections = document.querySelectorAll(".section");
const tabs = document.querySelectorAll(".operations__tab");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const imgTargets = document.querySelectorAll("img[data-src]");
const operations = document.querySelector(".operations__tab-container");
const operationsContent = document.querySelectorAll(".operations__content");

// Smooth Scrolling
navLinks.addEventListener("click", function (e) {
  e.preventDefault();
  if (!e.target.classList.contains("nav__link")) return;

  const id = e.target.getAttribute("href");
  document.querySelector(id).scrollIntoView({ behavior: "smooth" });
});

btnScrollTo.addEventListener("click", function (e) {
  document.querySelector("#section--1").scrollIntoView({ behavior: "smooth" });
});

// Reveal Sections
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy Loading Images
const loadImage = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function (e) {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0.15,
});

imgTargets.forEach(function (image) {
  imageObserver.observe(image);
});

// Operations
operations.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  if (!clicked) return;

  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));

  operationsContent.forEach((content) =>
    content.classList.remove("operations__content--active")
  );

  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// slider
const sliderContainer = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

let currentSlide = 0;
const maxSlide = slides.length - 1;

const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const activateDot = (slideNumber) => {
  document.querySelectorAll(".dots__dot").forEach((dot) => {
    dot.classList.remove("dots__dot--active");
  });

  document
    .querySelector(`.dots__dot[data-slide="${slideNumber}"]`)
    .classList.add("dots__dot--active");
};
activateDot(currentSlide);

const goToSlide = (slideNumber) => {
  slides.forEach((s, i) => {
    console.log(i);
    s.style.transform = `translateX(${100 * (i - slideNumber)}%)`;
  });
};
goToSlide(currentSlide);

const nextSlide = () => {
  if (currentSlide === maxSlide) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

const prevSlide = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlide;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

dotContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("dots__dot")) return;

  const { slide } = e.target.dataset;
  goToSlide(slide);
  activateDot(slide);
});
