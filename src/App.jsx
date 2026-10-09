import { useState, useEffect } from 'react';
import Pad from './components/Pad.jsx';
import './App.css';

export default function App() {
// La mémoire de notre séquence
  const [sequence, setSequence] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

 return (
    <div className="mpc-container">
      <h1>Mon Mini MPC</h1>

      {/* La grille des Pads */}
      <div className="pads-grid">
        <Pad nom="Kick" fichierAudio="/sons/mon-kick-lourd.wav" jouerSon={ajouterSon} />
        <Pad nom="Snare" fichierAudio="/sons/caisse-claire-sec.wav" jouerSon={ajouterSon} />
      </div>
    </div>
  )
};