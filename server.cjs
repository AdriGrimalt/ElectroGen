const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "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";

  // Función para intentar generar la música varias veces si la IA está cargando
  async function generateMusic(prompt, retries = 3) {
      for (let i = 0; i < retries; i++) {
          try {
              console.log(`🚀 Intento ${i + 1} de generar música...`);
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
                  console.log("😴 La IA está despertando... esperando 10 segundos...");
                  await new Promise(resolve => setTimeout(resolve, 10000));
                  continue; // Intenta de nuevo
              }

              const err = await response.text();
              throw new Error(err);
          } catch (e) {
              if (i === retries - 1) throw e;
              console.log("⚠️ Error temporal, reintentando...");
              await new Promise(resolve => setTimeout(resolve, 5000));
          }
      }
      throw new Error("La IA no respondió después de varios intentos.");
  }

  app.post('/generate', async (req, res) => {
      try {
          const audioBuffer = await generateMusic(req.body.inputs);
          console.log("✅ ¡Éxito! Música enviada al navegador.");
          res.send(Buffer.from(audioBuffer));
      } catch (err) {
          console.error("💥 Error Final:", err.message);
          res.status(500).send(err.message);
      }
  });

  app.get('/health', (req, res) => res.send('Vivo!'));

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
      console.log(`🚀 SERVIDOR ESTABLE ACTIVO EN PUERTO ${PORT}`);
  });
