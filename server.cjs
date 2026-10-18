const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('Servidor Pro v2 Vivo!');
});

app.post('/generate', async (req, res) => {
    try {
        const apiKey = process.env.STABILITY_API_KEY;
        if (!apiKey) {
            return res.status(500).send("Falta configurar STABILITY_API_KEY en Render.");
        }

        const promptText = req.body.inputs || "Commercial electronic anthem, full track structure, intro, drop, breakdown, 170 BPM";
        console.log("🎛️ Generando track elaborado en Stable Audio 2:", promptText);

        // Subimos la duración a 45-60 segundos para permitir mayor desarrollo y estructura
        const formData = new FormData();
        formData.append('prompt', promptText);
        formData.append('output_format', 'mp3');
        formData.append('duration', '45'); 
        formData.append('model', 'stable-audio-2');

        const response = await fetch(
            "https://api.stability.ai/v2beta/audio/stable-audio-2/text-to-audio",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Accept": "audio/*"
                },
                body: formData
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error de Stability AI:", response.status, errorText);
            return res.status(response.status).send("Error de Stability AI: " + errorText);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log("✅ ¡Masterización completada con éxito!");
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(arrayBuffer));

    } catch (err) {
        console.error("💥 Error crítico:", err.message);
        res.status(500).send("Error interno: " + err.message);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVIDOR ELABORADO ACTIVO EN PUERTO ${PORT}`);
});
Guarda los cambios en GitHub (Commit changes).

Ve a tu panel de Render, haz clic en Manual Deploy -> Clear build cache & deploy para que coja la nueva versión.

Paso 2: Elevar la calidad musical desde la web (App.jsx)
Para que las canciones suenen con arreglos más complejos, capas de sintetizadores, efectos de mezcla de estudio y una atmósfera verdaderamente inmersiva, vamos a actualizar también el diccionario de estilos de tu página web.

Abre Visual Studio Code y entra en tu archivo src/App.jsx.

Borra todo su contenido y pega esta versión mejorada con un motor de lenguaje musical mucho más rico:

JavaScript
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

const ElectroGen = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audio, setAudio] = useState(null);
  const [library, setLibrary] = useState([]);

  // Diccionario de alta fidelidad con capas de producción, mezcla y estructura de club
  const styleDict = {
    'Hardcore': 'mastered commercial hardcore, heavy distorted gabber kick drum, atmospheric synth pads, emotional breakdown, huge festival mainstage drop, crisp hi-hats, professional club mixing',
    'Techno': 'peak time industrial techno, hypnotic hypnotic sequence, rolling deep sub-bass, atmospheric soundscapes, warehouse reverb, complex rhythmic percussion, driving groove',
    'Acid': 'uncompromising acid techno, resonant squelchy TB-303 bassline modulation, crisp snappy 909 drums, hypnotic trippy sequence, immersive spatial effects, rave energy',
    'Hardstyle': 'euphoric hardstyle masterpiece, massive super-saw chord stabs, emotional vocal atmospheres, deep reverse bass drop, pristine festival mixing, anthemic progression',
    'Gabber': 'underground gabber terror, overdriven distorted reverse bass, high tempo aggressive synth leads, raw industrial percussion, relentless dark energy',
    'Psytrance': 'psychedelic trance journey, rolling triplet bassline, complex ethereal arpeggios, otherworldly sound design, deep atmospheric spaces, powerful dynamic drop',
    'Industrial': 'raw industrial electronics, heavy metallic percussion loops, distorted atmospheric drones, cold cyberpunk aesthetic, driving relentless mechanical rhythm',
    'Electro': 'futuristic electro funk, sharp vocoder vocal accents, crisp 808 drum machine patterns, catchy analog synthesizer hooks, slick modern club production'
  };

  const genres = Object.keys(styleDict);

  const toggleGenre = (g) => {
    let next = [...selectedGenres];
    if (next.includes(g)) {
      next = next.filter(item => item !== g);
    } else {
      next.push(g);
    }
    setSelectedGenres(next);

    if (next.length === 0) {
      setPrompt('');
      return;
    }
    const p = next.map(item => styleDict[item]).join(', ');
    // Instrucciones estrictas de mezcla y estructura para evitar temas planos
    setPrompt(p + ", full track arrangement, dynamic tension and release, professional mastering, high fidelity studio sound");
  };

  const handleGen = async () => {
    if (!prompt) return alert("Selecciona al menos un género.");
    setIsGenerating(true);
    try {
      const res = await fetch("https://electrogen-server.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error al generar el audio profesional.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      const newAudio = new Audio(url);
      setAudio(newAudio);

      const trackNames = ["Hypnotic Realm", "Neon Eclipse", "Cybernetic Core", "Abyss Echo", "Rave Dimension", "Synthetic Horizon", "Acidic Pulse"];
      const randomTitle = trackNames[Math.floor(Math.random() * trackNames.length)] + " " + Math.floor(Math.random() * 999);

      const newTrack = {
        id: Date.now(),
        name: randomTitle,
        genres: selectedGenres.join(' + '),
        url: url
      };

      setLibrary(prev => [newTrack, ...prev]);
      alert("¡Obra maestra generada con éxito!");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', maxWidth: '900px', margin: '0 auto 30px auto'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <Lucide.Zap color="#22c55e" size={32} />
          <h1 style={{fontSize: '28px', fontWeight: '900', fontStyle: 'italic'}}>ElectroGen <span style={{color: '#22c55e'}}>STUDIO</span></h1>
        </div>
        <span style={{fontSize: '11px', color: '#22c55e', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold'}}>MASTERING EDITION</span>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto'}}>
        
        {/* PANEL IZQUIERDO: ESTILOS */}
        <div style={{backgroundColor: '#18181b', padding: '25px', borderRadius: '20px', border: '1px solid #27272a'}}>
          <h2 style={{color: '#22c55e', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase'}}>Capas de Producción y Estilos</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px'}}>
            {genres.map(g => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                style={{
                  padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold',
                  backgroundColor: selectedGenres.includes(g) ? '#22c55e' : '#27272a',
                  color: selectedGenres.includes(g) ? 'black' : '#a1a1aa',
                  border: '1px solid #3f3f46', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {g}
              </button>
            ))}
          </div>

          <label style={{fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 'bold'}}>Prompt de Mezcla Profesional</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{width: '100%', backgroundColor: 'black', color: 'white', padding: '12px', borderRadius: '10px', height: '95px', border: '1px solid #3f3f46', marginTop: '5px', marginBottom: '20px', fontSize: '12px', outline: 'none'}}
          />

          <button
            onClick={handleGen}
            disabled={isGenerating}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px',
              fontWeight: '900', textTransform: 'uppercase', fontSize: '13px',
              backgroundColor: isGenerating ? '#27272a' : '#22c55e',
              color: isGenerating ? '#71717a' : 'black',
              border: 'none', cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? "Masterizando Track Elaborado..." : "Generar Track Pro Studio"}
          </button>
        </div>

        {/* PANEL DERECHO: REPRODUCTOR Y LIBRERÍA */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          <div style={{backgroundColor: '#18181b', border: '1px solid #065f46', padding: '25px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', textAlign: 'center'}}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid #3f3f46', backgroundColor: audioUrl ? 'rgba(34, 197, 94, 0.1)' : '#27272a'
            }}>
              <Lucide.Music size={40} color={audioUrl ? '#22c55e' : '#52525b'} />
            </div>
            <div>
              <h3 style={{fontSize: '16px', fontWeight: 'bold'}}>{audioUrl ? '¡Masterizado Listo!' : 'Estudio en pausa'}</h3>
            </div>

            <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
              <button onClick={() => audio && audio.pause()} style={{padding: '10px', borderRadius: '50%', backgroundColor: '#27272a', color: '#a1a1aa', border: 'none', cursor: 'pointer'}}>
                <Lucide.Square size={16} />
              </button>
              <button onClick={() => audio && audio.play()} style={{padding: '15px', borderRadius: '50%', backgroundColor: audioUrl ? '#22c55e' : '#27272a', color: 'black', border: 'none', cursor: audioUrl ? 'pointer' : 'not-allowed'}}>
                <Lucide.Play size={20} fill="currentColor" />
              </button>
              {audioUrl && (
                <a href={audioUrl} download="electrogen-studio-track.mp3" style={{padding: '10px', borderRadius: '50%', backgroundColor: '#22c55e', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Lucide.Download size={16} />
                </a>
              )}
            </div>
          </div>

          {/* LIBRERÍA DE CANCIONES */}
          <div style={{backgroundColor: '#18181b', padding: '20px', borderRadius: '20px', border: '1px solid #27272a', flex: 1, maxHeight: '220px', overflowY: 'auto'}}>
            <h4 style={{fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '10px'}}>Estudio / Biblioteca</h4>
            {library.length === 0 ? (
              <p style={{fontSize: '12px', color: '#52525b', textAlign: 'center', marginTop: '20px'}}>Tus producciones masterizadas aparecerán aquí.</p>
            ) : (
              library.map(track => (
                <div key={track.id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#27272a', padding: '10px 15px', borderRadius: '10px', marginBottom: '8px'}}>
                  <div style={{textAlign: 'left', overflow: 'hidden'}}>
                    <div style={{fontSize: '13px', fontWeight: 'bold', color: 'white'}}>{track.name}</div>
                    <div style={{fontSize: '10px', color: '#a1a1aa'}}>{track.genres}</div>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button 
                      onClick={() => { setAudioUrl(track.url); const playAudio = new Audio(track.url); setAudio(playAudio); playAudio.play(); }}
                      style={{backgroundColor: '#22c55e', color: 'black', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer'}}
                    >
                      Play
                    </button>
                    <a href={track.url} download={`${track.name}.mp3`} style={{backgroundColor: '#3f3f46', color: 'white', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', display: 'flex', alignItems: 'center'}}>
                      <Lucide.Download size={14} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ElectroGen;
