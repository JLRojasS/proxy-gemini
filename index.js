const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS ultra-compatible con GitHub Pages
const allowedOrigins = [
  'https://jlrojass.github.io',
  'https://jlrojass.github.io/Consola_Administracion'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como apps móviles o curl) o que vengan de tu GitHub
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por seguridad de CORS - Origen no autorizado'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Ruta principal para verificar que el servidor esté vivo
app.get('/', (req, res) => {
  res.send('Servidor Proxy de JL operando con éxito 🚀');
});

// Ruta de análisis conectada a Gemini
app.post('/api/analisis', async (req, res) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  const { prompt } = req.body;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Falta la variable de entorno GEMINI_API_KEY en Render' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Fallo crítico al conectar con Google Gemini' });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Guardian de la API activo en puerto 3000'));