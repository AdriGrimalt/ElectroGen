const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Servidor Pro Vivo y Conectado!');
});

app.post('/generate', async (req, res) => {
    try {
        const apiKey = process.env.STABILITY_API_KEY;
        if (!apiKey) {
            console.error("❌ Falta STABILITY_API_KEY en Render");
            return res.status(500).send("Falta configurar STABILITY_API_KEY en Render.");
        }

        const promptText = req.body.inputs || "Hardcore techno beat, 170 BPM, studio quality";
        console.log("🚀 Generando en Stable Audio 2:", promptText);

        // Stability AI exige obligatoriamente multipart/form-data (FormData)
        const formData = new FormData();
        formData.append('prompt', promptText);
        formData.append('output_format', 'mp3');
        formData.append('duration', '30');
        formData.append('model', 'stable-audio-2');

        const response = await fetch(
            "https://api.stability.ai/v2beta/audio/stable-audio-2/text-to-audio",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Accept": "audio/*"
                },
                body: formData
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error de Stability AI:", response.status, errorText);
            return res.status(response.status).send("Error de Stability AI: " + errorText);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log("✅ ¡Canción generada con éxito!");
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(arrayBuffer));

    } catch (err) {
        console.error("💥 Error crítico en el servidor:", err.message);
        res.status(500).send("Error interno: " + err.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVIDOR STABLE AUDIO 2 ACTIVO EN PUERTO ${PORT}`);
});
