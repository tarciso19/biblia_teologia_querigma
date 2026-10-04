const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    siteNav.classList.remove("is-open");
  });
}

const carousel = document.querySelector(".home-carousel");
const carouselTrack = carousel?.querySelector("[data-carousel-track]");

if (carousel && carouselTrack) {
  const slides = [...carouselTrack.querySelectorAll(".carousel-slide")];
  const pagination = [...document.querySelectorAll("[data-carousel-to]")];
  const currentCount = document.querySelector("[data-carousel-current]");
  let activeIndex = 0;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    carouselTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
    });
    pagination.forEach((button, buttonIndex) => {
      button.setAttribute("aria-pressed", String(buttonIndex === activeIndex));
    });
    if (currentCount) currentCount.textContent = String(activeIndex + 1).padStart(2, "0");
  }

  carousel.querySelector("[data-carousel-previous]")?.addEventListener("click", () => showSlide(activeIndex - 1));
  carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => showSlide(activeIndex + 1));
  pagination.forEach((button) => {
    button.addEventListener("click", () => showSlide(Number(button.dataset.carouselTo)));
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1);
  });
  showSlide(activeIndex);
}