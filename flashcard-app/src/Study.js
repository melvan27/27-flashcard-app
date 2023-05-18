import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck } from "./utils/api/index";

function Study() {
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    // load the selected deck
    const loadDeck = async () => {
      try {
        const deckData = await readDeck(deckId, abortController.signal);
        setDeck(deckData);
      } catch (error) {
        console.error(error);
      }
    };
    loadDeck();

    return () => {
      abortController.abort();
    };
  }, [deckId]);

  const flipCard = () => {
    // flip card to opposite side
    if (isFront) {
      setIsFront(false);
      if (currentCardIndex === deck.cards.length - 1) {
        // restart or return to home at the end of the deck
        setTimeout(() => {
          const confirmRestart = window.confirm(
            "You have reached the end of the deck. Do you want to restart?\nClick 'OK' to restart the deck.\nClick 'Cancel' to return to the home page."
          );
          if (confirmRestart) {
            restartDeck();
          } else {
            history.push('/');
          }
        }, 500); // delay to ensure card is flipped to the back by the time the restart prompt appears
      }
    } else {
      setIsFront(true);
    }
  };  

  const nextCard = () => {
    // go to next card in the deck
    setCurrentCardIndex((prevIndex) => prevIndex + 1);
    setIsFront(true);
  };

  const restartDeck = () => {
    // go back to the start of the deck
    setCurrentCardIndex(0);
    setIsFront(true);
  };

  if (!deck) {
    return <div>Loading...</div>;
  }

  const { name, cards } = deck;

  if (cards.length < 3) {
    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>{name}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Study
            </li>
          </ol>
        </nav>
        <h2>Not enough cards.</h2>
        <p>
          You need at least 3 cards to study. There are currently{" "}
          {cards.length} {cards.length === 1 ? "card" : "cards"} in this deck.
        </p>
        <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary">
          Add Cards
        </Link>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Study
          </li>
        </ol>
      </nav>
      <h2>Study: {name}</h2>
      <h3>Card {currentCardIndex + 1} of {cards.length}</h3>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            {isFront ? "Front" : "Back"}
          </h5>
          <p className="card-text">
            {isFront ? currentCard.front : currentCard.back}
          </p>
          <button className="btn btn-secondary" onClick={flipCard}>
            Flip
          </button>
          {!isFront && (
            <>
              <button className="btn btn-primary" onClick={nextCard}>
                Next
              </button>
              <button
                className="btn btn-danger"
                onClick={() => restartDeck()}
              >
                Restart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Study;
