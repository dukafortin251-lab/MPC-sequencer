import React, { useState } from 'react';

export default function Pad({ id, nom, fichierAudio, touche, jouerSon, estActif, onFileUpdate }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    jouerSon(nom, fichierAudio, id);
  };

  // --- GESTION DU DRAG & DROP ---
  const handleDragOver = (e) => {
    e.preventDefault(); // Indispensable pour autoriser le "lâcher"
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovered(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('audio/'))) {
      onFileUpdate(id, file); // Envoie le fichier à App.jsx
    } else {
      alert("Glisse un fichier audio (.mp3, .wav) !");
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpdate(id, file);
  };

  return (
    <button 
      className={`mpc-pad ${estActif ? 'active-hit' : ''} ${isHovered ? 'pad-hover' : ''}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="pad-touche">{touche.toUpperCase()}</span>
      <span className="pad-name">{nom}</span>
      
      {/* Bouton d'upload (dossier) caché dans le coin */}
      <label className="pad-upload-btn" onClick={(e) => e.stopPropagation()}>
        <input 
          type="file" 
          accept=".mp3,.wav" 
          style={{ display: 'none' }} 
          onChange={handleFileInput} 
        />
        📁
      </label>
    </button>
  );
}