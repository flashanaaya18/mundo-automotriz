const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Carga las variables de entorno
require('dotenv').config({ path: '../.env' });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta para manejar el login
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validación simple
    if (!password) {
        return res.status(400).json({ success: false, message: 'Se requiere una contraseña.' });
    }

    if (password === adminPassword) {
        // Creamos el payload del token
        const payload = { user: 'admin' };

        // Firmamos el token con nuestro secreto, con una expiración de 8 horas
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        // Enviamos el token al cliente
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso.', token: token });

    } else {
        res.status(401).json({ success: false, message: 'Contraseña incorrecta.' });
    }
});

module.exports = app;