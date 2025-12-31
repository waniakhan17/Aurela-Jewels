const searchIcon = document.getElementById('searchIcon');
const searchForm = document.getElementById('searchForm');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');

// Jab Search Icon par click ho
searchIcon.onclick = () => {
    searchForm.classList.add('active'); // Form show karein
    searchIcon.classList.add('hide');   // Icon hide karein
    searchInput.focus();                // Cursor seedha input box mein chala jaye
};

// Jab Close (X) icon par click ho (Optional)
if(closeSearch) {
    closeSearch.onclick = () => {
        searchForm.classList.remove('active');
        searchIcon.classList.remove('hide');
    };
}

// Agar user search bar ke bahar click kare toh wapas icon aa jaye
document.addEventListener('click', (e) => {
    if (!searchIcon.contains(e.target) && !searchForm.contains(e.target)) {
        searchForm.classList.remove('active');
        searchIcon.classList.remove('hide');
    }
});


    function sliderWithCloning(container, slide, gap = 25) {
  const slider = document.querySelector(container);
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(slide));
  if (slides.length === 0) return;

  slides.forEach((s) => {
    const clone = s.cloneNode(true);
    slider.appendChild(clone);
  });

  let index = 0;
  const slideWidth = slides[0].offsetWidth + gap;

  setInterval(() => {
    index++;
    slider.style.transition = "transform 0.6s ease";
    slider.style.transform = `translateX(-${index * slideWidth}px)`;

    if (index === slides.length) {
      setTimeout(() => {
        slider.style.transition = "none";
        index = 0;
        slider.style.transform = "translateX(0)";
      }, 600);
    }
  }, 3000);
}
document.addEventListener("DOMContentLoaded", () => {
  sliderWithCloning(".feature-cont", ".box"); // 🔹 run slider AFTER products added
  sliderWithCloning(".customers-container", ".box"); // static slider

  // Select all elements that need scroll animation
  const scrollElements = document.querySelectorAll(".fade-in, .scroll-animate");

  // Create one IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show"); // add the class
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.2 }
  ); // trigger when 20% visible

  // Observe all scroll elements
  scrollElements.forEach((el) => observer.observe(el));
});
