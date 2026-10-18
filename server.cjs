const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const STABILITY_API_KEY = "sk-6jmzf41PAriCMabeM6PHkgbPFu6ZbAXnWF15qUrDL9p6ewIz";

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Solicitud recibida para el prompt:", req.body.inputs);

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
                      // Quitamos seconds para dejar que la IA use el default y evitar errores de validación
                  }),
              }
          );

          if (!response.ok) {
              const errorText = await response.text();
              console.error("❌ RESPUESTA ERROR DE STABILITY:", errorText);
              return res.status(response.status).send("Error API: " + errorText);
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡ÉXITO! Audio recibido.");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 ERROR CRÍTICO:", err);
          res.status(500).send("Error de conexión.");
      }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR PRO ACTIVO EN PUERTO ${PORT}`);
  });
