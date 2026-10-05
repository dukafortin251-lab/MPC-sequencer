import { useState } from 'react';
import './App.css'; 

// 1. LE PAD (Il reçoit maintenant le nom ET le fichier audio)
function Pad({ nom, fichierAudio, jouerSon }) {
  return (
    // Quand on clique, on envoie le nom (pour l'écran) et le fichier (pour les enceintes)
    <button className="pad-btn" onClick={() => jouerSon(nom, fichierAudio)}>
      {nom}
    </button>
  );
}

// 2. L'APPLICATION
export default function App() {
  const [sequence, setSequence] = useState([]);

  // La fonction reçoit les deux infos
  const ajouterSon = (nomDuSon, fichier) => {
    // 1. Affichage sur l'écran noir
    setSequence([...sequence, nomDuSon]);
    
    // 2. Lecture du son
    const pisteAudio = new Audio(fichier);
    pisteAudio.play();
  };

  return (
    <div className="mpc-container">
      <h2>🎛️ Séquenceur</h2>
      
      <div className="mpc-screen">
        {sequence.length === 0 ? "En attente..." : sequence.join(" - ")}
      </div>

      <div className="pads-grid">
        {/* On donne un nom et un fichier différent à chaque bouton ! */}
        <Pad nom="Kick" fichierAudio="/sons/mon-kick-lourd.wav" jouerSon={ajouterSon} />

        <Pad nom="Snare" fichierAudio="/sons/caisse-claire-sec.wav" jouerSon={ajouterSon} />

        <Pad nom="Hi-Hat" fichierAudio="/sons/hi-hat.wav" jouerSon={ajouterSon} />

        <Pad nom="Vocals" fichierAudio="/sons/sample-voix.wav" jouerSon={ajouterSon} />
      </div>

      <button className="reset-btn" onClick={() => setSequence([])}>
        Effacer
      </button>
    </div>
  );
}