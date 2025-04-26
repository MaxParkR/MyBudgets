// Archivo principal del servidor Express
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors'); // Importar cors
const connectDB = require('./config/db'); // Importar función de conexión a BD
const path = require('path'); // Módulo path de Node para manejar rutas de archivo

// Conectar a la base de datos
connectDB();

const app = express();

// Configuración de CORS más detallada para produccion
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.vercel\.app$/, /vercel\.app$/] // Dominios permitidos en producción
    : 'http://localhost:5000', // En desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions)); // CORS con opciones específicas
app.use(express.json()); // Para parsear JSON

// Middleware para manejar errores de JSON mal formado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ msg: 'JSON mal formado' });
  }
  next();
});

// Servir archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.get('/api/test', (req, res) => res.send('Ruta API de prueba funcionando')); // Ruta de prueba para API
app.use('/api/auth', require('./routes/auth'));

// Redireccionar a la página de login cuando se accede a la raíz
app.get('/', (req, res) => {
  res.redirect('/auth/login.html');
});

// Ruta fallback para servir index.html (o login.html si se prefiere) para rutas no API
// Si tienes un SPA, esto es útil. Por ahora, servir estáticos es suficiente.
/* app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  }
}); */

const PORT = process.env.PORT || 5000; // Usar puerto de variable de entorno o 5000

app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`)); 