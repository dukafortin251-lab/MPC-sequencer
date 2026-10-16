import { useState, useEffect, useRef } from 'react';
import Pad from './components/Pad.jsx';
import './App.css';

// --- CONFIGURATION PAR DÉFAUT DES PADS ---
const initialPads = [
  { id: 'pad1', nom: 'Kick', touche: 'q', fichierAudio: '/sons/mon-kick-lourd.wav' },
  { id: 'pad2', nom: 'Snare', touche: 't', fichierAudio: '/sons/caisse-claire-sec.wav' },
  { id: 'pad3', nom: 'Hi-hat', touche: 'n', fichierAudio: '/sons/hi-hat.wav' },
  { id: 'pad4', nom: 'Open Hat', touche: 'g', fichierAudio: '/sons/open-hat.wav' },
  { id: 'pad5', nom: 'Perc', touche: 'p', fichierAudio: '/sons/perc.wav' },
  { id: 'pad6', nom: 'Bass 808', touche: 'b', fichierAudio: '/sons/808.wav' },
  { id: 'pad7', nom: 'FX', touche: 'v', fichierAudio: '/sons/fx.wav' },
  { id: 'pad8', nom: 'Sample', touche: 'r', fichierAudio: '/sons/melody.wav' },
  { id: 'pad9', nom: 'Pad 9', touche: 'a', fichierAudio: '' },
  { id: 'pad10', nom: 'Pad 10', touche: 'z', fichierAudio: '' },
  { id: 'pad11', nom: 'Pad 11', touche: 'e', fichierAudio: '' },
  { id: 'pad12', nom: 'Pad 12', touche: 'u', fichierAudio: '' },
  { id: 'pad13', nom: 'Pad 13', touche: 'i', fichierAudio: '' },
  { id: 'pad14', nom: 'Pad 14', touche: 'o', fichierAudio: '' },
  { id: 'pad15', nom: 'Pad 15', touche: 'k', fichierAudio: '' },
  { id: 'pad16', nom: 'Pad 16', touche: 'l', fichierAudio: '' },
];

export default function App() {
  const [pads, setPads] = useState(initialPads); // NOUVEAU: Les pads sont en mémoire !
  const [sequence, setSequence] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePadId, setActivePadId] = useState(null);

  const isRecordingRef = useRef(false);
  const startTimeRef = useRef(0);
  const timersRef = useRef([]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // --- CHANGER LE SON D'UN PAD (Quand on glisse un fichier) ---
  const modifierPad = (padId, file) => {
    const newAudioUrl = URL.createObjectURL(file); // Crée un lien virtuel vers ton fichier local
    const shortName = file.name.substring(0, 10); // Raccourcit le nom du fichier

    // Met à jour la liste des pads avec le nouveau son
    setPads(prevPads => prevPads.map(pad => 
      pad.id === padId ? { ...pad, nom: shortName, fichierAudio: newAudioUrl } : pad
    ));
  };

  const ajouterSon = (nom, fichier, id) => {
    if (!fichier) return; 

    const audio = new Audio(fichier);
    audio.play().catch((e) => console.log("Erreur audio", e));

    if (id) {
      setActivePadId(id);
      setTimeout(() => setActivePadId(null), 150);
    }

    if (isRecordingRef.current) {
      const timeElapsed = Date.now() - startTimeRef.current;
      setSequence((prev) => [...prev, { nom, fichier, id, time: timeElapsed }]);
    }
  };

  // ... (Garde toggleRec, playSequence, stopSequence exactement comme avant) ...
  const toggleRec = () => {
    if (!isRecording) {
      setIsPlaying(false);
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
      setSequence([]); 
      startTimeRef.current = Date.now(); 
      setIsRecording(true); 
    } else {
      setIsRecording(false); 
    }
  };

  const playSequence = () => {
    if (sequence.length === 0 || isPlaying) return;
    setIsPlaying(true);
    setIsRecording(false);

    sequence.forEach((note) => {
      const timer = setTimeout(() => {
        const audio = new Audio(note.fichier);
        audio.play().catch(e => console.log("Erreur", e));
        if (note.id) {
           setActivePadId(note.id);
           setTimeout(() => setActivePadId(null), 150);
        }
      }, note.time);
      timersRef.current.push(timer);
    });

    if (sequence.length > 0) {
      const maxTime = Math.max(...sequence.map(n => n.time));
      const endTimer = setTimeout(() => {
        setIsPlaying(false);
        timersRef.current = [];
      }, maxTime + 300);
      timersRef.current.push(endTimer);
    }
  };

  const stopSequence = () => {
    setIsPlaying(false);
    setIsRecording(false);
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  };

  // --- NOUVELLE GESTION DU CLAVIER (Dynamique) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      // On cherche dans le tableau "pads" si la touche correspond à un Pad
      const padTrouve = pads.find(p => p.touche === key);
      if (padTrouve) {
        ajouterSon(padTrouve.nom, padTrouve.fichierAudio, padTrouve.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pads]); // Important: se met à jour quand on modifie un son

  return (
    <div className="mpc-container">
      <h1>Mon Mini MPC</h1>

      <div className="mpc-screen">
        <div className="screen-status">
          {isRecording && <span className="rec-indicator">● REC</span>}
          {isPlaying && <span style={{color: '#2eb82e', fontWeight: 'bold'}}>▶ PLAY</span>}
        </div>
        <p>Séquence : {sequence.length > 0 ? sequence.map(s => s.nom).join(" - ") : "Appuie sur un pad..."}</p>
      </div>

      <div className="mpc-controls-bar">
        <button className="ctrl-btn" onClick={stopSequence}>■ STOP</button>
        <button className={`ctrl-btn ${isPlaying ? 'active-play' : ''}`} onClick={playSequence}>▶ PLAY</button>
        <button className={`ctrl-btn ${isRecording ? 'active-rec' : ''}`} onClick={toggleRec}>● REC</button>
      </div>

      <div className="pads-grid">
        {/* NOUVEAU : On utilise .map() pour générer automatiquement les 16 pads */}
        {pads.map((pad) => (
          <Pad 
            key={pad.id} 
            id={pad.id} 
            nom={pad.nom} 
            touche={pad.touche}
            fichierAudio={pad.fichierAudio} 
            jouerSon={ajouterSon} 
            estActif={activePadId === pad.id}
            onFileUpdate={modifierPad} 
          />
        ))}
      </div>
      
      <div className="mpc-palm-rest"></div>
    </div>
  );
}