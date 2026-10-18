const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "hf_ZaxQNtttxOaCloAVyRrJnHwajGkpgwRJs";

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Intentando generar música...");

          const response = await fetch(
              "https://api-inference.huggingface.co/models/facebook/musicgen-small",
              {
                  headers: {
                      "Authorization": "Bearer " + HF_TOKEN,
                      "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify({ inputs: req.body.inputs }),
              }
          );

          if (!response.ok) {
              // Si la IA está cargando, le decimos al usuario que espere
              if (response.status === 503) {
                  return res.status(503).send("La IA está despertando... dale otra vez en 10 seg.");
              }
              const errText = await response.text();
              return res.status(response.status).send("Error de la IA: " + errText);
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡Música generada!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error:", err);
          res.status(500).send("Error de conexión.");
      }
  });

  app.listen(3001, () => {
      console.log('🚀 SERVIDOR ACTIVO EN PUERTO 3001');
  });
