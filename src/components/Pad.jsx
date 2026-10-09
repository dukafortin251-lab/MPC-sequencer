// src/components/Pad.jsx
export default function Pad({ nom, fichierAudio, jouerSon }) {
  return (
    // Crée un vrai bouton HTML cliquable et applique la classe CSS pad-btn
    // Attend le clic de l'utilisateur pour exécuter jouerSon avec le nom et le fichierAudio
    <button className="pad-btn" onClick={() => jouerSon(nom, fichierAudio)}>
      {nom}
    </button>
  );
}