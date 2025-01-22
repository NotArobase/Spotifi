import React, { useState } from "react";

export default function Faq() {
  // Liste des questions et réponses
  const faqData = [
    {
      question: "Comment ajouter une chanson à ma playlist ?",
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      answer: "Accédez à votre playlist, puis sélectionner le + afin d'ajouter une nouvelle ligne et choisir la chanson à rajouter",
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      answer: "cliquez sur l'onglet créer Playlist disponible sur la barre de navigation, puis renplissez les informations obliagaoires de votre nouvelle playlist",
    },
    {
      question: "Comment activer la fonction de répétition (loop) ?",
      answer: "Cliquez sur le bouton de répétition dans le lecteur. \n Vous pouvez choisir entre 'pas de loop', Répéter une chanson','Répéter toute la playlist'.",
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    },
    {
      question: "Puis-je écouter de la musique hors ligne ?",
      answer: "oui, cette fonctionnalité est bien disponible. \n En effet, une connexion Internet n'est nécessaire pour écouter votre musique locale. \n Renseignez votre dossier local dans en bas de la page d'accueil.",
    },
    {
      question: "Comment supprimer une chanson de ma playlist ?",
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      answer: "Accédez à votre playlist, puis cliquez sur le - à côté de la chanson que vous souhaitez retirer.",
    },
    {
      question: "Puis-je partager ma playlist avec mes amis ?",
      answer: "Non, cette fonctionnalité n'est pas encore disponible.",
=======
      answer: "Accédez à votre playlist, ",
>>>>>>> Stashed changes
=======
      answer: "Accédez à votre playlist, ",
>>>>>>> Stashed changes
=======
      answer: "Accédez à votre playlist, ",
>>>>>>> Stashed changes
=======
      answer: "Accédez à votre playlist, ",
>>>>>>> Stashed changes
    },
  ];

  // État pour gérer les réponses affichées
  const [openIndex, setOpenIndex] = useState(null);

  // Fonction pour gérer l'affichage d'une réponse
  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>FAQ - Questions Fréquemment Posées</h2>
      <ul style={styles.list}>
        {faqData.map((item, index) => (
          <li key={index} style={styles.item}>
            <div
              style={styles.question}
              onClick={() => toggleAnswer(index)}
            >
              {item.question}
              <span style={styles.icon}>
                {openIndex === index ? "-" : "+"}
              </span>
            </div>
            {openIndex === index && (
              <div style={styles.answer}>{item.answer}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Styles simples pour la FAQ
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    marginBottom: "15px",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
  },
  question: {
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  answer: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#555",
  },
  icon: {
    fontSize: "20px",
    fontWeight: "bold",
  },
};
