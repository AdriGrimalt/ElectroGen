const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Servidor ElectroGen PRO Studio Vivo!');
});

app.post('/generate', async (req, res) => {
    try {
        const apiKey = process.env.STABILITY_API_KEY;
        if (!apiKey) {
            return res.status(500).send("Falta configurar STABILITY_API_KEY en Render.");
        }

        const promptText = req.body.inputs || "Commercial electronic anthem, full track structure, 170 BPM";
        const trackDuration = req.body.duration || "45";
        
        console.log(`🎛️ Generando track (${trackDuration}s):`, promptText);

        const formData = new FormData();
        formData.append('prompt', promptText);
        formData.append('output_format', 'mp3');
        formData.append('duration', trackDuration); 
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
        console.log("✅ ¡Masterización completada con éxito!");
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(arrayBuffer));

    } catch (err) {
        console.error("💥 Error crítico:", err.message);
        res.status(500).send("Error interno: " + err.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVIDOR STUDIO ACTIVO EN PUERTO ${PORT}`);
});
