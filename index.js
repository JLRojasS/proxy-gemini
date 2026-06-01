// index.js - El guardián de tu API KEY
const express = require('express');
const cors = require('cors');
const app = express();

// Acepta peticiones de cualquier parte de tu dominio de GitHub Pages
app.use(cors({ 
  origin: [
    'https://jlrojass.github.io', 
    'https://jlrojass.github.io/Consola_Administracion'
  ],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.post('/api/analisis', async (req, res) => {
    const API_KEY = process.env.GEMINI_API_KEY; // Esto lo configuraremos en Render
    const { prompt } = req.body;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Fallo en la comunicación con Google' });
    }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy blindado activo'));
