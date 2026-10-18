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

          // Probamos la URL oficial más estable de Stability AI
          const response = await axios({
              method: 'post',
              url: "https://api.stability.ai/v2beta/stable-audio/generate",
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
          console.error("❌ Error Stability AI:", err.response ? err.response.status : err.message);

          // Si el error es 404, es que la URL cambió. Enviamos un error claro al usuario.
          if (err.response && err.response.status === 404) {
              res.status(404).send("La API de Stability ha cambiado su dirección. Contacta con el soporte.");
          } else {
              res.status(500).send("Error en la IA: " + err.message);
          }
      }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 SERVIDOR PRO ACTIVO EN PUERTO ${PORT}`);
  });
