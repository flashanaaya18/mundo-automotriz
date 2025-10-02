const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Carga las variables de entorno
require('dotenv').config({ path: '../.env' });

// Inicializa una mini-app de Express
const app = express();

// Middlewares
app.use(cors()); // Permite peticiones
app.use(express.json()); // Parsea el body de la petición

// Conectar a MongoDB una sola vez
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Conectado a MongoDB para la función.'))
        .catch(err => console.error('Error conectando a MongoDB:', err));
}

// Definir el esquema y modelo (si no está ya definido)
const Mensaje = mongoose.models.Mensaje || mongoose.model('Mensaje', new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    asunto: { type: String },
    mensaje: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
}));

// La lógica de tu ruta POST
app.post('/api/contact', async (req, res) => {
    const { nombre, email, asunto, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ success: false, message: 'Por favor, completa todos los campos requeridos.' });
    }

    try {
        // 1. Guardar en la Base de Datos
        const nuevoMensaje = new Mensaje({ nombre, email, asunto, mensaje });
        await nuevoMensaje.save();
        console.log('Mensaje guardado en la base de datos.');

        // 2. Enviar Email (Opcional)
        // Descomenta si quieres enviar emails en producción
        /*
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        const mailOptions = { ... }; // Misma configuración de antes
        await transporter.sendMail(mailOptions);
        console.log('Notificación por correo enviada.');
        */

        res.status(200).json({ success: true, message: '¡Mensaje recibido con éxito! Gracias por contactarnos.' });

    } catch (error) {
        console.error('Error en el proceso de contacto:', error);
        res.status(500).json({ success: false, message: 'Hubo un error al procesar tu mensaje.' });
    }
});

// Exporta la app para que Vercel la use.
// Vercel convertirá esto en una Serverless Function.
module.exports = app;