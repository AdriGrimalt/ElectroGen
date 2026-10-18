const express = require('express');
  const cors = require('cors');
  const axios = require('axios');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "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";

  async function generateMusic(prompt, retries = 3) {
      for (let i = 0; i < retries; i++) {
          try {
              console.log(`🚀 Intento ${i + 1} la IA...`);
              const response = await axios({
                  method: 'post',
                  url: "https://api-inference.huggingface.co/models/facebook/musicgen-small",
                  headers: {
                      "Authorization": "Bearer " + HF_TOKEN,
                      "Content-Type": "application/json"
                  },
                  data: { inputs: prompt },
                  responseType: 'arraybuffer'
              });

              return response.data;
          } catch (e) {
              if (e.response && e.response.status === 503) {
                  console.log("😴 IA despertando... esperando 15 seg...");
                  await new Promise(resolve => setTimeout(resolve, 15000));
                  continue;
              }
              if (i === retries - 1) throw e;
              console.log("⚠️ Error temporal, reintentando...");
              await new Promise(resolve => setTimeout(resolve, 5000));
          }
      }
  }

  app.post('/generate', async (req, res) => {
      try {
          const cleanPrompt = req.body.inputs.split(',').slice(0, 3).join(', ');
          console.log("🎵 Generando: " + cleanPrompt);

          const audioBuffer = await generateMusic(cleanPrompt);
          console.log("✅ ¡ÉXITO!");
          res.send(Buffer.from(audioBuffer));
      } catch (err) {
          console.error("💥 Error Final:", err.message);
          res.status(500).send("Error de la IA. Inténtalo de nuevo.");
      }
  });
