/**
 * @file auth_script.js
 * Maneja la animación de cambio entre los formularios de inicio de sesión y registro.
 */

// Selecciona el contenedor principal.
const container = document.getElementById('container');
// Selecciona el botón para ir al formulario de registro (en el panel derecho).
const registroBtn = document.getElementById('registro');
// Selecciona el botón para ir al formulario de inicio de sesión (en el panel izquierdo).
const loginBtn = document.getElementById('login');

/**
 * Añade un listener al botón 'Registrarme'.
 * Al hacer clic, añade la clase 'active' al contenedor principal.
 * Esto dispara las animaciones CSS para mostrar el formulario de registro
 * y el panel izquierdo del toggle.
 */
registroBtn.addEventListener('click', () =>{
    container.classList.add("active");
});

/**
 * Añade un listener al botón 'Iniciar Sesión' (en el panel del toggle).
 * Al hacer clic, elimina la clase 'active' del contenedor principal.
 * Esto dispara las animaciones CSS para mostrar el formulario de inicio de sesión
 * y el panel derecho del toggle.
 */
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

