import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDecks, deleteDeck } from "./utils/api/index";

function Home() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    // load the decks
    const loadDecks = async () => {
      try {
        const decksData = await listDecks(abortController.signal);
        setDecks(decksData);
      } catch (error) {
        console.error(error);
      }
    };
    loadDecks();

    return () => {
      abortController.abort();
    };
  }, []);

  const handleDeleteDeck = async (deckId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this deck? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        // delete the deck and update
        await deleteDeck(deckId);
        setDecks((prevDecks) =>
          prevDecks.filter((deck) => deck.id !== deckId)
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Link to="/decks/new" className="btn btn-primary">
        Create Deck
      </Link>

      {decks.map((deck) => (
        <div key={deck.id} className="card">
          <div className="card-body">
            <h5 className="card-title">{deck.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{deck.cards.length} cards</h6>
            <p className="card-text">{deck.description}</p>
            <Link to={`/decks/${deck.id}`} className="btn btn-secondary mr-2">
              View
            </Link>
            <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">
              Study
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteDeck(deck.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
