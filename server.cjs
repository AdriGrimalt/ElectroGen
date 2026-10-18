const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "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";

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Petición recibida...");
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
              console.error("❌ Error de la IA:", errorText);
              return res.status(response.status).send("La IA está cargando, reintenta en 10 seg.");
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡Música recibida!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error:", err);
          res.status(500).send(err.message);
      }
  });

  app.listen(3001, () => {
      console.log('SERVIDOR ACTIVO');
  });
