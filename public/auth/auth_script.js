/**
 * @file auth_script.js
 * Maneja la animación de cambio entre los formularios de inicio de sesión y registro,
 * y la comunicación con el backend para autenticación.
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

// Seleccionar Formularios
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Seleccionar Contenedores de Mensajes de Error
const loginErrorMsg = document.getElementById('login-error-message');
const registerErrorMsg = document.getElementById('register-error-message');

// Función para mostrar errores
const displayError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block'; 
};

// Función para ocultar errores
const clearError = (element) => {
    element.textContent = '';
    element.style.display = 'none';
};

// Determinar la URL base de la API según el entorno
const getApiBaseUrl = () => {
    // En producción (Vercel)
    if (window.location.hostname !== 'localhost') {
        // Usar la misma URL base que el frontend en Vercel
        return window.location.origin;
    }
    // En desarrollo local
    return 'http://localhost:5000';
};

// Listener para el formulario de Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir envío por defecto
        clearError(loginErrorMsg); // Limpiar errores previos

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const apiBaseUrl = getApiBaseUrl();
            const res = await fetch(`${apiBaseUrl}/api/auth/login`, { // Ruta del backend con URL base dinámica
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                // Si hay error, mostrar mensaje del backend o uno genérico
                displayError(loginErrorMsg, data.msg || 'Error al iniciar sesión. Verifica tus credenciales.');
            } else {
                // Éxito: guardar token y redirigir
                localStorage.setItem('token', data.token);
                window.location.href = '../index.html'; // Redirigir al landing page
            }

        } catch (error) {
            console.error('Error en fetch login:', error);
            console.log('URL utilizada:', `${getApiBaseUrl()}/api/auth/login`);
            console.log('Detalles del error:', {
                mensaje: error.message,
                stack: error.stack,
                tipo: error.name
            });
            displayError(loginErrorMsg, `Error: ${error.message}. Revisa la consola para más detalles.`);
        }
    });
}

// Listener para el formulario de Registro
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError(registerErrorMsg);

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // Validación simple (se podrían añadir más)
        if (!email || !password) {
            displayError(registerErrorMsg, 'Email y contraseña son requeridos.');
            return;
        }

        try {
            const apiBaseUrl = getApiBaseUrl();
            const res = await fetch(`${apiBaseUrl}/api/auth/register`, { // Ruta del backend con URL base dinámica
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                displayError(registerErrorMsg, data.msg || 'Error al registrar. Inténtalo de nuevo.');
            } else {
                localStorage.setItem('token', data.token);
                window.location.href = '../index.html'; //ingresa al landing page
            }

        } catch (error) {
            console.error('Error en fetch register:', error);
            console.log('URL utilizada:', `${getApiBaseUrl()}/api/auth/register`);
            console.log('Detalles del error:', {
                mensaje: error.message,
                stack: error.stack,
                tipo: error.name
            });
            displayError(registerErrorMsg, `Error: ${error.message}. Revisa la consola para más detalles.`);
        }
    });
}

