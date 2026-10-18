const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const STABILITY_API_KEY = "sk-6jmzf41PAriCMabeM6PHkgbPFu6ZbAXnWF15qUrDL9p6ewIz";

  app.// Salud del servidor
  app.get('/health', (req, res) => {
      res.send('El servidor Pro está vivo!');
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
              const errText = await response.text();
              console.error("❌ Error Stability AI:", errText);
              return res.status(response.status).send("Error Stability AI: " + errText);
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡Audio profesional recibido!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error crítico:", err);
          res.status(500).send("Error de conexión.");
      }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR PRO ACTIVO EN PUERTO ${PORT}`);
  });
  (Perdón, cometí un pequeño error en el código arriba, puse app.// Salud en lugar de app.get. Usa este código
  corregido:)

  const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const STABILITY_API_KEY = "sk-6jmzf41PAriCMabeM6PHkgbPFu6ZbAXnWF15qUrDL9p6ewIz";

  app.get('/health', (req, res) => {
      res.send('El servidor Pro está vivo!');
  });

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Solicitando audio profesional...");
          const response = await fetch(
              "https://api-inference.huggingface.co/models/facebook/musicgen-small", // Volvemos a musicgen por
  estabilidad inicial
              {
                  headers: {
                      "Authorization": "Bearer " + STABILITY_API_KEY,
                      "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify({ inputs: req.body.inputs }),
              }
          );

          if (!response.ok) {
              const errText = await response.text();
              return res.status(response.status).send("Error IA: " + errText);
          }

          const arrayBuffer = await response.arrayBuffer();
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          res.status(500).send(err.message);
      }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR PRO ACTIVO EN PUERTO ${PORT}`);
  });
