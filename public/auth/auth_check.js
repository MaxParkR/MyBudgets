// Script para verificar si el usuario está autenticado
function isAuthenticated() {
    // Verificar si existe un token en localStorage
    return localStorage.getItem('token') !== null;
}

// Función para redirigir al login si no está autenticado
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/auth/login.html';
    }
}

// Función para redirigir al dashboard si ya está autenticado
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = '/index.html';
    }
}

// Exportar funciones para uso en otros scripts
window.auth = {
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated
};
