// Rutas para autenticación (registro, login) 
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importar el modelo de Usuario

// @route   POST api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Validar si el usuario ya existe
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // 2. Crear nueva instancia de usuario (la contraseña se hashea en el pre-save hook)
        user = new User({
            name,
            email,
            password
        });

        // 3. Guardar usuario en la BD
        await user.save();

        // 4. Crear el payload para JWT (lo que queremos incluir en el token)
        const payload = {
            user: {
                id: user.id // El id asignado por MongoDB
            }
        };

        // 5. Firmar el token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Necesitaremos definir esta variable de entorno
            { expiresIn: 360000 }, // Duración del token (ej. 100 horas)
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Devolver el token al cliente
            }
        );

    } catch (err) {
        console.error('Error en registro:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST api/auth/login
// @desc    Iniciar sesión (Autenticar usuario y obtener token)
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar si el usuario existe
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' }); // Mensaje genérico
        }

        // 2. Comparar la contraseña ingresada con la almacenada (hasheada)
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' }); // Mensaje genérico
        }

        // 3. Si las credenciales son correctas, crear y firmar el token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 }, // Misma duración o diferente si se prefiere
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error('Error en login:', err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router; 