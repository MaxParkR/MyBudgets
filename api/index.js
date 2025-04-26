// Punto de entrada para las funciones serverless de Vercel
const authApp = require('./auth');

// Exporta la instancia de Express para serverless
module.exports = authApp;
