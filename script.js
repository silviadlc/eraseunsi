
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
