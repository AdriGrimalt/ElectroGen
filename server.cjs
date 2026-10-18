const express = require('express');
  const cors = require('cors');
  const axios = require('axios');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const STABILITY_API_KEY = "sk-6jmzf41PAriCMabeM6PHkgbPFu6ZbAXnWF15qUrDL9p6ewIz";

  app.// Salud del servidor
  app.get('/health', (req, res) => {
      res.send('Servidor Pro Vivo!');
  });

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Llamando a la API estable de Stability...");

          // URL ACTUALIZADA: Usamos la ruta v1 que es la más estable para audio
          const response = await axios({
              method: 'post',
              url: "https://api.stability.ai/v1/generation/stable-audio/generate",
              headers: {
                  "Authorization": "Bearer " + STABILITY_API_KEY,
                  "Accept": "audio/mpeg",
                  "Content-Type": "application/json"
              },
              data: {
                  prompt: req.body.inputs,
                  seconds: 30
              },
              responseType: 'arraybuffer'
          });

          console.log("✅ ¡AUDIO RECIBIDO!");
          res.send(Buffer.from(response.data));
      } catch (err) {
          console.error("❌ Detalle del error:");
          if (err.response) {
              console.error("Status:", err.response.status);
              console.error("Data:", err.response.data.toString());
          } else {
              console.error("Mensaje:", err.message);
          }
          res.status(500).send("Error en la API: " + (err.response ? err.response.status : err.message));
      }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SERVIDOR ACTIVO EN PUERTO ${PORT}`);
  });
