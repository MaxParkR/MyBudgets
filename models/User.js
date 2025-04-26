// Modelo de usuario para Mongoose 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true // Puedes descomentar si el nombre es obligatorio
    },
    email: {
        type: String,
        required: true,
        unique: true, // Asegura que no haya emails duplicados
        lowercase: true // Guarda emails en minúsculas para consistencia
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now // Fecha de creación del usuario
    }
});

// Middleware (hook) de Mongoose que se ejecuta ANTES de guardar (.save())
UserSchema.pre('save', async function(next) {
    // Solo hashear la contraseña si ha sido modificada (o es nueva)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generar un 'salt' para añadir aleatoriedad al hash
        const salt = await bcrypt.genSalt(10); // 10 es el número de rondas (costo computacional)
        // Hashear la contraseña con el salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Pasar el error al siguiente middleware o al manejador de errores
    }
});

// (Opcional) Método para comparar contraseñas (útil para el login)
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};


module.exports = mongoose.model('User', UserSchema); 