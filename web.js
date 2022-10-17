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
    console.log(siblings);

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

//////////// STICKY NAVIGATION ////////////
/*
// Not good performance !!!
const initialCoords = section1.getBoundingClientRect();

window.addEventListener("scroll", function () {
  console.log(window.scrollY);

  if (this.window.scrollY > initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
});
*/

//////////// STICKY NAVIGATION: INTERSECTION OBSERVER API ////////////
const navHeight = nav.getBoundingClientRect().height;

// Callback function (1. parameter)
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

// Intersection Observer
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////////// REVEAL SECTIONS ////////////
// Callback function (1. parameter)
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // Guard clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

// Intersection Observer
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});
