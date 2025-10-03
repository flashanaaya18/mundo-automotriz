const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json()); // Asegurarse de que express puede parsear JSON
app.use(cors());

// Middleware de autenticación simple
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === process.env.ADMIN_PASSWORD) {
        next(); // La contraseña es correcta, continuar.
    } else {
        res.status(401).json({ success: false, message: 'No autorizado.' });
    }
};

// Conectar a MongoDB
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(process.env.MONGO_URI);
}

// Modelo de Mensaje
const Mensaje = mongoose.models.Mensaje || mongoose.model('Mensaje', new mongoose.Schema({
    nombre: String, email: String, asunto: String, mensaje: String, fecha: Date
}));

// Ruta protegida para obtener todos los mensajes
app.get('/api/messages', authMiddleware, async (req, res) => {
    try {
        // Buscamos todos los mensajes y los ordenamos por fecha descendente
        const messages = await Mensaje.find().sort({ fecha: -1 });
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// Ruta protegida para ELIMINAR un mensaje por su ID
app.delete('/api/messages/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await Mensaje.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: 'Mensaje no encontrado.' });
        }

        res.status(200).json({ success: true, message: 'Mensaje eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el mensaje:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

module.exports = app;