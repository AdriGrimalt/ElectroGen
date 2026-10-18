const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const STABILITY_API_KEY = "sk-6jmzf41PAriCMabeM6PHkgbPFu6ZbAXnWF15qUrDL9p6ewIz";

  app.get('/health', (req, res) => {
      res.send('Servidor vivo!');
  });

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Solicitando audio profesional...");

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
              console.error("❌ Error API:", errorText);
              return res.status(response.status).send("Error Stability AI: " + errorText);
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡Audio recibido!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error:", err);
          res.status(500).send("Error de conexión.");
      }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR PRO ACTIVO EN PUERTO ${PORT}`);
  });
