/**
 * @file script.js
 * Funcionalidad principal de la página MyBudgets:
 * - Control del menú de navegación móvil.
 * - Efecto de cambio de estilo en el header al hacer scroll.
 * - Inicialización del carrusel de reseñas (Swiper).
 * - Inicialización de animaciones de aparición al hacer scroll (ScrollReveal).
 */


//selecionar botón de navegación
const navTrigger = document.querySelector('#navTrigger');
// El contenedor de la navegación.
const nav = document.querySelector('#nav');

// Botón para cerrar menú (X).
const navCloseBtn = document.querySelector('#navCloseBtn');

//seleccionar opciones header
const header = document.querySelector('header');

//añade un click event listener  al botón de apertura de la barra de navegación
navTrigger.addEventListener("click", () =>{
    nav.classList.toggle("is-open");
});

//añade un click event listener al botón de cierre de la barra de navegación
navCloseBtn.addEventListener("click", () =>{
    //elimina la clase "is-open" del elemento de navegación
    nav.classList.remove("is-open");
});

//anade un scroll event listener a la ventana
window.addEventListener("scroll", () =>{
   //obtiene la posición de desplazamiento vertical
   const scrollY = window.scrollY;
   //añade o elimina el activador de la clase del header dependiendo de la posición dada
   //por el scroll position

   scrollY > 50 
   ? header.classList.add("is-active") 
   : header.classList.remove("is-active");
});

//swiper
const swiper = new Swiper(".swiper", {
    loop: true,
    slidesPerView: 1,  
    spaceBetween: 20,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2, 
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 3, 
            spaceBetween: 30,
        },
    },
});

//animaciones
const sr = ScrollReveal({
    origin: "bottom",
    distance: "60px",
    duration: 3000,
    delay: 600,
    reset: true, // reinicia las animaciones
});

//configuraciones personalizadas para elementos especificos
const revealFromTop = {
    origin: "top",
};

const revealWhitInterval = {
    distance: "100px",
    interval: 100, 
};

const revealFromLeft = {
    distance: "100px",
    origin: "left",
};

const revealFromRight = {
    distance: "100px",
    origin: "right",
};

const revealWhitShortDistance= {
    distance: "60px", 
};

const revealWithDelay = {
    distance: "100px",
    delay: 400,
};

//banner
sr.reveal(".banner__text", revealFromTop);
sr.reveal(".banner__image");

//brands
sr.reveal(".brands__title", revealWithDelay);
sr.reveal(".brands__img", revealWhitInterval);

//beneficios
sr.reveal(".beneficios__title", revealWhitShortDistance);
sr.reveal(".beneficio__text", revealFromLeft);
sr.reveal(".beneficio__img", revealFromRight);
sr.reveal(".beneficio--2 .beneficio__img", revealFromLeft);
sr.reveal(".beneficio--2 .beneficio__text", revealFromRight);

//reseñas
sr.reveal(".resenias, .resenias__container",{
    distance: "100px",
});

//servicios
sr.reveal(".servicios__title, .servicios__item",revealWhitInterval);

//contactanos
sr.reveal(".contacto__form-wrapper");
sr.reveal(".contacto__img", revealFromTop);

//footer
sr.reveal(".footer");