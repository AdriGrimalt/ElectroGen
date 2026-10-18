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
