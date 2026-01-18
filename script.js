
// HOME
const symbols = document.querySelectorAll(".symbol");
const enterBtn = document.getElementById("enterBtn");

let currentStep = 1;

// Símbolos correctos en orden
const correctCount = 5;

symbols.forEach(symbol => {
  symbol.addEventListener("click", () => {

    if (symbol.classList.contains("trap")) {
      // Si es trampa, reinicia puzzle
      triggerError();
      return;
    }

    const order = Number(symbol.dataset.order);

    if (order === currentStep) {
      symbol.classList.add("active");
      currentStep++;

      if (currentStep > correctCount) {
        showEnterButton();
      }

    } else {
      triggerError();
    }
  });

  // Microbrillo al pasar por el símbolo correcto siguiente
  symbol.addEventListener("mouseenter", () => {
    if (Number(symbol.dataset.order) === currentStep) {
      symbol.style.boxShadow = "0 0 25px #d6bdfc";
    }
  });
  symbol.addEventListener("mouseleave", () => {
    symbol.style.boxShadow = "";
  });
});

function triggerError() {
  symbols.forEach(symbol => {
    symbol.classList.remove("active");
    symbol.classList.remove("error");
    void symbol.offsetWidth; // reinicia animación
    symbol.classList.add("error");
  });
  currentStep = 1;
}

function showEnterButton() {
  enterBtn.classList.add("show");

  // Botón solo se puede pulsar una vez
  enterBtn.addEventListener("click", () => {
    window.location.href = "landing.html";
  }, { once: true });
}


// Countdown
const countdown = () => {
  const eventDate = new Date('2026-09-12T00:00:00');
  const now = new Date();
  const diff = eventDate - now;

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
  const minutes = Math.floor(diff / (1000 * 60) % 60);
  const seconds = Math.floor(diff / 1000 % 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
};
setInterval(countdown, 1000);

//Caroussel

const swiper = new Swiper('.swiper', {
  loop: true,
  autoplay: {
    delay: 3000,    // 3000 ms = 3 segundos
    disableOnInteraction: false, // No pausa al interactuar
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 20 },
    960: { slidesPerView: 3, spaceBetween: 30 },
  },
});



