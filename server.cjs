const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Tu API Key de Stability AI integrada
  const STABILITY_API_KEY = "sk-6jmzf41PAriCMabeM6PHkgbPFu6ZbAXnWF15qUrDL9p6ewIz";

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Solicitando audio profesional a Stable Audio...");

          const response = await fetch(
              "https://api.stability.ai/v2beta/stable-audio/generate",
              {
                  method: "POST",
                  headers: {
                      "Authorization": "Bearer " + STABILITY_API_KEY,
                      "Accept": "audio/mpeg",
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                      prompt: req.body.inputs,
                      seconds: 30
                  }),
              }
          );

          if (!response.ok) {
              const errorText = await response.text();
              console.error("❌ Error Stability AI:", errorText);
              return res.status(response.status).send("Error en la API profesional. Intenta de nuevo.");
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡Audio profesional recibido!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error crítico:", err);
          res.status(500).send("Error de conexión con el servidor de música.");
      }
  });

  app.listen(3001, () => {
      console.log('🚀 SERVIDOR STABLE AUDIO ACTIVO EN PUERTO 3001');
  });
