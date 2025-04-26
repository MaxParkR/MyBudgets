// Archivo principal del servidor Express
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors'); // Importar cors
const connectDB = require('./config/db'); // Importar función de conexión a BD
const path = require('path'); // Módulo path de Node para manejar rutas de archivo

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Para parsear JSON

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.get('/api/test', (req, res) => res.send('Ruta API de prueba funcionando')); // Ruta de prueba para API
app.use('/api/auth', require('./routes/auth'));

// Ruta fallback para servir index.html (o login.html si se prefiere) para rutas no API
// Si tienes un SPA, esto es útil. Por ahora, servir estáticos es suficiente.
/* app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  }
}); */

const PORT = process.env.PORT || 5000; // Usar puerto de variable de entorno o 5000

app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`)); 