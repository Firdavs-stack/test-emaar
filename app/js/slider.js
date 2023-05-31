const swiper = new Swiper(".appartments__slider", {
   loop: true,
   pagination: {
      el: ".appartments__pagination",
   },

   navigation: {
      nextEl: ".appartments__next",
      prevEl: ".appartments__prev",
   },
});
