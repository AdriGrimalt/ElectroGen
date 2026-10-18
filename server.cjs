const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "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";

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Intentando conectar con la IA...");

          // CAMBIO DE MODELO: de small a medium para evitar saturación
          const response = await fetch(
              "https://api-inference.huggingface.co/models/facebook/musicgen-medium",
              {
                  headers: {
                      "Authorization": "Bearer " + HF_TOKEN,
                      "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify(req.body),
              }
          );

          if (!response.ok) {
              const errorText = await response.text();
              console.error("❌ Error de la IA:", errorText);
              return res.status(response.status).send(errorText);
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ ¡Música recibida!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error crítico:", err);
          res.status(500).send(err.message);
      }
  });

  app.listen(3001, () => {
      console.log('--------------------------------------------------');
      console.log('🚀 SERVIDOR ACTIVO EN http://localhost:3001');
      console.log('--------------------------------------------------');
  });
