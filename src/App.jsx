import { useState, useEffect } from 'react';
import Pad from './components/Pad.jsx';
import './App.css';

export default function App() {
  const [sequence, setSequence] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const ajouterSon = (nom, fichier) => {
    const audio = new Audio(fichier);
    audio.play().catch((e) => console.log("Erreur audio", e));

    if (isRecording) {
      setSequence((prevSequence) => [...prevSequence, nom]);
    }
  };

  // Fonction pour allumer/éteindre le mode REC
  const toggleRec = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="mpc-container">
      <h1>Mon Mini MPC</h1>

      {/* 1. L'écran LCD */}
      <div className="mpc-screen">
        <div className="screen-status">
          {isRecording && <span className="rec-indicator">● REC</span>}
        </div>
        <p>Séquence : {sequence.length > 0 ? sequence.join(" - ") : "Appuie sur un pad..."}</p>
      </div>

      {/* 2. La barre de contrôle avec le bouton REC */}
      <div className="mpc-controls-bar">
        <button 
          className={`ctrl-btn ${isRecording ? 'active-rec' : ''}`} 
          onClick={toggleRec}
        >
          REC
        </button>
      </div>

      {/* La grille des Pads */}
      <div className="pads-grid">
        <Pad nom="Kick" fichierAudio="/sons/mon-kick-lourd.wav" jouerSon={ajouterSon} />
        <Pad nom="Snare" fichierAudio="/sons/caisse-claire-sec.wav" jouerSon={ajouterSon} />
        <Pad nom="Hi-hat" fichierAudio="/sons/hi-hat.wav" jouerSon={ajouterSon} />
        <Pad nom="Open Hat" fichierAudio="/sons/open-hat.wav" jouerSon={ajouterSon} />
        <Pad nom="Perc" fichierAudio="/sons/perc.wav" jouerSon={ajouterSon} />
        <Pad nom="Bass 808" fichierAudio="/sons/808.wav" jouerSon={ajouterSon} />
        <Pad nom="FX" fichierAudio="/sons/fx.wav" jouerSon={ajouterSon} />
        </div>
    </div>
  );
}