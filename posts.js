const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors());

// Conectar a MongoDB
if (mongoose.connection.readyState !== 1) {
    mongoose.connect(process.env.MONGO_URI);
}

// --- ESQUEMA Y MODELO PARA LOS ARTÍCULOS DEL BLOG ---
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL amigable
    summary: { type: String, required: true }, // Resumen corto
    content: { type: String, required: true }, // Contenido completo en HTML/Markdown
    featuredImage: { type: String, required: true }, // URL de la imagen de portada
    author: { type: String, default: 'Mundo Automotriz' },
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

// --- RUTA PARA OBTENER LOS ARTÍCULOS ---
app.get('/api/posts', async (req, res) => {
    const { slug, page = 1, limit = 6, search = '' } = req.query;

    if (slug) {
        // --- OBTENER UN SOLO POST POR SLUG ---
        try {
            const post = await Post.findOne({ slug });
            if (!post) {
                return res
                    .status(404)
                    .json({ success: false, message: 'Artículo no encontrado.' });
            }
            res.status(200).json({ success: true, data: post });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error interno del servidor.' });
        }
    } else {
        // --- OBTENER LISTA DE POSTS CON PAGINACIÓN Y BÚSQUEDA ---
        try {
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const skip = (pageNum - 1) * limitNum;
            const searchQuery = search ? { title: { $regex: search, $options: 'i' } } : {};

            const posts = await Post.find(searchQuery).sort({ createdAt: -1 }).skip(skip).limit(limitNum);
            const totalPosts = await Post.countDocuments(searchQuery);
            const totalPages = Math.ceil(totalPosts / limitNum);

            res.status(200).json({ success: true, data: posts, pagination: { currentPage: pageNum, totalPages, totalPosts } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error interno del servidor.' });
        }
    }
});

module.exports = app;