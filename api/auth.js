// función serverless para autenticación en Vercel
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('../models/User');

// Crear una instancia de Express
const app = express();

// Configuración CORS para permitir solicitudes desde cualquier origen en desarrollo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para procesar JSON
app.use(express.json());

// Conectar a MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Conectado a MongoDB (serverless)');
    }
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    return { error: 'Error de conexión a la base de datos' };
  }
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  await connectDB();
  
  try {
    const { email, password } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // Generar JWT
    const payload = {
      user: { id: user.id }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secrettemp12345',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error en login:', err.message);
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  await connectDB();
  
  try {
    const { name, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    user = new User({
      name,
      email,
      password 
    });

    // Guardar usuario
    await user.save();

    // Generar JWT
    const payload = {
      user: { id: user.id }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secrettemp12345',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Error en registro:', err.message);
    res.status(500).json({ msg: 'Error del servidor', error: err.message });
  }
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Error del servidor', error: err.message });
});

// Exportar la instancia de Express para serverless
module.exports = app;
