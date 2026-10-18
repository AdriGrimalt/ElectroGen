const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "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";

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Intentando conectar con la IA...");

          // Probamos con la API de Inference directa, la más rápida
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
              const errorText = await response.text();
              console.error("❌ Error IA:", errorText);
              // Si el error es 503, es que la IA está cargando
              if (response.status === 503) {
                  return res.status(503).send("IA cargando... espera 20 seg y dale otra vez.");
              }
              return res.status(response.status).send("Error en el servidor de la IA.");
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡Música recibida!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error:", err);
          res.status(500).send("Error de conexión.");
      }
  });

  app.listen(3001, () => {
      console.log('SERVIDOR ACTIVO');
  });
