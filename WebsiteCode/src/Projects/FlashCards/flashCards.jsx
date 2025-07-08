import React, { useState } from "react";
import siteData from "../../assets/MyWebsite.json";
import "./FlashCards.css";

const FlashCards = () => {
  const [activeTopic, setActiveTopic] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);

  const handleTopicClick = (index) => {
    setActiveTopic(index === activeTopic ? null : index);
    setFlippedCard(null);
  };

  const handleCardClick = (cardIndex) => {
    setFlippedCard(cardIndex === flippedCard ? null : cardIndex);
  };

  return (
    <div className="flashcard-page">
      <h1 className="flashcard-title">Flash Cards</h1>
      {siteData.flashCards.map((group, topicIndex) => (
        <div key={topicIndex} className="flashcard-topic">
          <button className="topic-button" onClick={() => handleTopicClick(topicIndex)}>
            {group.topic}
          </button>
          {activeTopic === topicIndex && (
            <div className={`flashcard-list ${activeTopic === topicIndex ? "active" : ""}`}>
              {group.cards.map((card, cardIndex) => (
                <div
                    key={cardIndex}
                    className={`flashcard ${flippedCard === cardIndex ? "flipped" : ""}`}
                    onClick={() => handleCardClick(cardIndex)}
                >
                  <div className="flashcard-question">{card.question}</div>
                  {flippedCard === cardIndex && (
                    <p className="flashcard-answer">{card.answer}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlashCards;