const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "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";

  async function generateMusic(prompt, retries = 3) {
      for (let i = 0; i < retries; i++) {
          try {
              console.log(`🚀 Intento ${i + 1} para: ${prompt.substring(0, 20)}...`);
              const response = await fetch(
                  "https://api-inference.huggingface.co/models/facebook/musicgen-small",
                  {
                      headers: {
                          "Authorization": "Bearer " + HF_TOKEN,
                          "Content-Type": "application/json"
                      },
                      method: "POST",
                      body: JSON.stringify({ inputs: prompt }),
                  }
              );

              if (response.ok) {
                  return await response.arrayBuffer();
              }

              if (response.status === 503) {
                  console.log("😴 IA despertando... esperando 15 seg...");
                  await new Promise(resolve => setTimeout(resolve, 15000));
                  continue;
              }

              const errText = await response.text();
              throw new Error(errText);
          } catch (e) {
              if (i === retries - 1) throw e;
              console.log("⚠️ Error temporal, reintentando en 5 seg...");
              await new Promise(resolve => setTimeout(resolve, 5000));
          }
      }
      throw new Error("La IA no respondió.");
  }

  app.post('/generate', async (req, res) => {
      try {
          // Limpiamos el prompt para que sea más corto y rápido de procesar
          const cleanPrompt = req.body.inputs.split(',').slice(0, 3).join(', ');
          console.log("🎵 Generando: " + cleanPrompt);

          const audioBuffer = await generateMusic(cleanPrompt);
          console.log("✅ ¡SÍ! Audio recibido.");
          res.send(Buffer.from(audioBuffer));
      } catch (err) {
          console.error("💥 Error Final:", err.message);
          res.status(500).send(err.message);
      }
  });
