const express = require('express');
  const cors = require('cors');
  const axios = require('axios');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const STABILITY_API_KEY = "sk-6jmzf41PAriCMabeM6PHkgbPFu6ZbAXnWF15qUrDL9p6ewIz";

  app.get('/health', (req, res) => {
      res.send('Servidor Pro Vivo!');
  });

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Solicitando audio profesional...");

          // Intentamos la URL principal de Stable Audio
          const response = await axios({
              method: 'post',
              url: "https://api.stability.ai/v1/generation/stable-audio/generate",
              headers: {
                  "Authorization": "Bearer " + STABILITY_API_KEY,
                  "Accept": "audio/mpeg",
                  "Content-Type": "application/json"
              },
              data: {
                  prompt: req.body.inputs,
                  seconds: 30
              },
              responseType: 'arraybuffer'
          });

          console.log("✅ ¡Audio recibido!");
          res.send(Buffer.from(response.data));
      } catch (err) {
          console.error("💥 Error Stability AI:", err.response ? err.response.status : err.message);

          // Si da 404, intentamos la URL alternativa
          if (err.response && err.response.status === 404) {
              console.log("🔄 Intentando URL alternativa...");
              try {
                  const altResponse = await axios({
                      method: 'post',
                      url: "https://api.stability.ai/v2beta/stable-audio/generate",
                      headers: {
                          "Authorization": "Bearer " + STABILITY_API_KEY,
                          "Accept": "audio/mpeg",
                          "Content-Type": "application/json"
                      },
                      data: { prompt: req.body.inputs, seconds: 30 },
                      responseType: 'arraybuffer'
                  });
                  return res.send(Buffer.from(altResponse.data));
              } catch (altErr) {
                  res.status(500).send("Ambas URLs de la IA fallaron. Revisa tu API Key.");
              }
          } else {
              res.status(500).send("Error en el servidor de música: " + err.message);
          }
      }
  });
