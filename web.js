"use strict";

//////////// ELEMENTS ////////////
// MODAL WINDOW
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
// SMOOTH SCROLLING
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
// TABBED COMPONENT
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
// MENU FADE ANIMATION
const nav = document.querySelector(".nav");
// STICKY NAVIGATION: INTERSECTION OBSERVER API
const header = document.querySelector(".header");
// REVEAL SECTIONS
const allSections = document.querySelectorAll(".section");
// LAZY LOADING IMAGES
const imgTargets = document.querySelectorAll("img[data-src]");

//////////// MODAL WINDOW ////////////
// FUNCTIONS
const openModal = function (e) {
  // Prevent from scrolling
  e.preventDefault();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// EVENT LISTENERS
btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////// BUTTON SMOOTH SCROLLING ////////////
btnScrollTo.addEventListener("click", function (e) {
  /*
  // Old way of scrolling
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // // Smooth Scrolling
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: "smooth",
  });
  */
  // New way of Smooth Scrolling
  section1.scrollIntoView({ behavior: "smooth" });
});

//////////// PAGE NAVIGATION ////////////
/*
// Not good performance !!!
document.querySelectorAll(".nav__link").forEach(function (el) {
  el.addEventListener("click", function (e) {
    // Prevent from scrolling
    e.preventDefault();

    const id = this.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  });
});
*/

// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  // Prevent from scrolling
  e.preventDefault();
  // console.log(e.target);

  // Matching strategy
  if (
    e.target.classList.contains("nav__link") &&
    !e.target.classList.contains("nav__link--btn")
  ) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//////////// TABBED COMPONENT ////////////
tabsContainer.addEventListener("click", function (e) {
  // Matching strategy
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove("operations__tab--active"));
  tabsContent.forEach(c => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//////////// MENU FADE ANIMATION ////////////
// FUNCTION
const handleHover = function (e) {
  // console.log(this, e.currentTarget);

  if (e.target.classList.contains("nav__link")) {
    // Elements
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// EVENT LISTENERS
// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener("mouseout", function (e) {
//   handleHover(e, 1);

// Passing "argument" in handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
/*
//////////// STICKY NAVIGATION ////////////

// Not good performance !!!
const initialCoords = section1.getBoundingClientRect();

window.addEventListener("scroll", function () {
  // console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
});
*/

//////////// STICKY NAVIGATION: INTERSECTION OBSERVER API ////////////
const navHeight = nav.getBoundingClientRect().height;

// CALLBACK FUNCTION (1. parameter)
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

// INTERSECTION OBSERVER
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//////////// REVEAL SECTIONS ////////////
// CALLBACK FUNCTION (1. parameter)
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

// INTERSECTION OBSERVER
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//////////// LAZY LOADING IMAGES ////////////
// CALLBACK FUNCTION (1. parameter)
const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

// INTERSECTION OBSERVER
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  treshold: 0,
  rootMargin: "200px", //hide loading img effect
});
imgTargets.forEach(img => imgObserver.observe(img));

//////////// SLIDER ////////////
const slider = function () {
  // ELEMENTS
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  // GLOBAL VARIABLES
  let curSlide = 0;
  const maxSlide = slides.length;

  // FUNCTIONS
  // Creating Dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activate dot
  const activateDot = function (slide) {
    // Remove active classes
    document
      .querySelectorAll(".dots__dot")
      .forEach(dot => dot.classList.remove("dots__dot--active"));

    // Add active class
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // Go to slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Init function
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // EVENT LISTENERS
  // Next slide
  btnRight.addEventListener("click", nextSlide);

  // Previous slide
  btnLeft.addEventListener("click", prevSlide);

  // Keyboard next/previous slide
  document.addEventListener("keydown", function (e) {
    // console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  // Dots click
  dotContainer.addEventListener("click", function (e) {
    // Matching strategy
    if (e.target.classList.contains("dots__dot")) {
      // const slide  = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
