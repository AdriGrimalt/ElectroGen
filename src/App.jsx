import React, { useState } from 'react';
  import { Play, Square, Music, Zap, Volume2, Sliders } from 'lucide-react';

  const ElectroGen = () => {
    const [prompt, setPrompt] = useState('');
    const [genre, setGenre] = useState('Hardcore');
    const [intensity, setIntensity] = useState(80);
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audio, setAudio] = useState(null);

    const genres = ['Hardcore', 'Techno', 'Acid', 'Hardstyle', 'Gabber', 'Psytrance', 'Industrial', 'Electro'];

    const handleGenerate = async () => {
      if (!prompt) {
        alert("Escribe una descripción.");
        return;
      }
      setIsGenerating(true);
      try {
        const text = genre + " music, " + prompt + ", high energy, " + intensity + "% power";

        // AQUÍ ESTÁ LA LÍNEA DEL FETCH (Cambiado a 127.0.0.1)
        const response = await fetch("http://127.0.0.1:3001/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: text }),
        });

        if (!response.ok) {
          throw new Error("El servidor respondió con error. Espera 30s.");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const newAudio = new Audio(url);
        setAudio(newAudio);
        alert("¡Track listo!");
      } catch (error) {
        alert("Error de conexión: " + error.message);
      } finally {
        setIsGenerating(false);
      }
    };

    const togglePlay = () => {
      if (audio) {
        if (audio.paused) audio.play();
        else audio.pause();
      }
    };

    return (
      <div className="min-h-screen bg-black text-white p-10">
        <header className="flex items-center gap-2 mb-10">
          <Zap className="text-green-500" />
          <h1 className="text-2xl font-bold">ElectroGen AI</h1>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
            <h2 className="text-green-500 font-bold">CONFIG</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black p-2 rounded text-white border border-zinc-700"
              placeholder="Ej: Hardcore Techno 175BPM..."
            />
            <div className="grid grid-cols-2 gap-2">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className="p-2 bg-zinc-800 rounded text-xs"
                  style={{ color: genre === g ? 'green' : 'white' }}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full p-4 bg-green-600 text-black font-bold rounded"
            >
              {isGenerating ? "Generando..." : "GENERAR"}
            </button>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl flex flex-col items-center space-y-4">
            <Music size={64} className={audioUrl ? "text-green-500" : "text-zinc-600"} />
            <h3 className="font-bold">{audioUrl ? "Listo" : "Vacío"}</h3>
            <div className="flex gap-4">
              <button className="p-2 bg-zinc-800 rounded" onClick={() => audio && audio.pause()}><Square size={20}
  /></button>
              <button className="p-4 bg-green-600 rounded" onClick={togglePlay}><Play size={24} /></button>
              <button className="p-2 bg-zinc-800 rounded"><Volume2 size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ElectroGen;