const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());
  app.use(express.json());

  const HF_TOKEN = "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";

  app.post('/generate', async (req, res) => {
      try {
          console.log("🚀 Generando canción completa...");

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
              const err = await response.text();
              console.error("❌ Error IA:", err);
              return res.status(response.status).send("La IA está cargando, reintenta en 10 seg.");
          }

          const arrayBuffer = await response.arrayBuffer();
          console.log("✅ Canción generada con éxito!");
          res.send(Buffer.from(arrayBuffer));
      } catch (err) {
          console.error("💥 Error Servidor:", err);
          res.status(500).send("Error de conexión.");
      }
  });

  app.listen(3001, () => {
      console.log('🚀 SERVIDOR NUBE ACTIVO EN PUERTO 3001');
  });
  Guarda los cambios en GitHub (Commit changes). Espera 2 minutos a que Render diga "Live".

  ---

  2. Actualiza la Web en tu PC (App.jsx)

  Borra todo en tu App.jsx y pega este código. He vuelto a poner el diseño elegante, pero usando un método que no rompe
  la línea, para que no tengas el error de Unterminated string.

  import React, { useState, useRef } from 'react';
  import { Play, Square, Music, Zap, Volume2, Sliders, Download } from 'lucide-react';

  const ElectroGen = () => {
    const [prompt, setPrompt] = useState('');
    const [genre, setGenre] = useState('Hardcore');
    const [intensity, setIntensity] = useState(80);
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audio, setAudio] = useState(null);
    const [library, setLibrary] = useState([]);

    const genres = ['Hardcore', 'Techno', 'Acid', 'Hardstyle', 'Gabber', 'Psytrance', 'Industrial', 'Electro'];

    const handleGenerate = async () => {
      if (!prompt) return alert("Escribe una descripción.");
      setIsGenerating(true);
      try {
        const text = genre + " music, " + prompt + ", high energy, " + intensity + "% power, studio quality";
        const response = await fetch("https://electrogen-server.onrender.com/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: text }),
        });

        if (!response.ok) throw new Error("La IA está despertando. Reintenta en 20 seg.");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudio(new Audio(url));

        setLibrary(prev => [{
          id: Date.now(),
          name: "Track " + (prev.length + 1),
          url: url,
          genre: genre
        }, ...prev]);

        alert("¡Canción generada! Dale al Play.");
      } catch (e) {
        alert(e.message);
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <div className="min-h-screen bg-black text-white p-10 font-sans">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Zap className="text-green-500" />
            <h1 className="text-3xl font-black italic">ElectroGen <span className="text-green-500">AI</span></h1>
          </div}
          <button className="bg-green-600 text-black px-4 py-2 rounded-full font-bold">PRO</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-6">
            <div className="flex items-center gap-2 text-green-500">
              <Sliders size={20} />
              <h2 className="font-bold uppercase text-sm">Configuración</h2>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-sm h-32"
              placeholder="Ej: Hardcore Techno agresivo, bombos saturados, 175 BPM..."
            />
            <div className="grid grid-cols-2 gap-2">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border ${genre === g ? 'bg-green-500 text-black' :
  'bg-zinc-800 text-gray-400'}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-black uppercase ${isGenerating ? 'bg-zinc-800 text-gray-500' :
  'bg-green-500 text-black'}`}
            >
              {isGenerating ? "Generando Canción..." : "CREAR CANCIÓN"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-green-900 p-8 rounded-3xl flex flex-col items-center text-center
  space-y-6">
              <div className={`w-48 h-48 rounded-2xl flex items-center justify-center border ${audioUrl ?
  'bg-green-500/10 border-green-500 animate-pulse' : 'bg-zinc-800 border-zinc-700'}`}>
                <Music size={64} className={audioUrl ? "text-green-500" : "text-zinc-600"} />
              </div>
              <h3 className="text-2xl font-bold">{audioUrl ? '¡Track Listo!' : 'Esperando...'}</h3>
              <div className="flex items-center gap-6">
                <button className="p-4 bg-zinc-800 rounded-full text-gray-500" onClick={() => audio &&
  audio.pause()}><Square size={24} /></button>
                <button
                  onClick={() => audio && audio.play()}
                  className={`p-6 rounded-full text-black ${audioUrl ? 'bg-green-500' : 'bg-zinc-700'}`}
                >
                  <Play size={32} fill="currentColor" />
                </button>
                <button className="p-4 bg-zinc-800 rounded-full text-gray-500"><Volume2 size={24} /></button>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase text-gray-500">Mis Canciones</h2>
              {library.map(track => (
                <div key={track.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800
  rounded-xl">
                  <span className="text-sm font-bold">{track.name} - {track.genre}</span>
                  <button onClick={() => { setAudioUrl(track.url); setAudio(new Audio(track.url)); }}
  className="text-green-500 text-xs">Play</button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  };

  export default ElectroGen;
