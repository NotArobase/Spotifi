import React, { useState } from "react";

export default function Faq() {
  // Liste des questions et réponses
  const faqData = [
    {
      question: "Comment ajouter une chanson à ma playlist ?",
      answer: "Accédez à votre playlist, puis sélectionner le + afin d'ajouter une nouvelle ligne et choisir la chanson à rajouter",
    },
    {
      question: "Puis-je écouter de la musique hors ligne ?",
      answer: "Non, cette fonctionnalité n'est pas encore disponible. Une connexion Internet est nécessaire pour écouter de la musique.",
    },
    {
      question: "Comment supprimer une chanson de ma playlist ?",
      answer: "Accédez à votre playlist, puis cliquez sur le - à côté de la chanson que vous souhaitez retirer.",
    },
    {
      question: "Puis-je partager ma playlist avec mes amis ?",
      answer: "Non, cette fonctionnalité n'est pas encore disponible.",
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
