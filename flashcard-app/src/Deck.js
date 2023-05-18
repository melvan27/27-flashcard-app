import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "./utils/api/index";

function Deck() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);

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

  const handleDeleteDeck = async () => {
    // delete the selected deck
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this deck? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await deleteDeck(deckId);
        setDeck(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteCard = async (cardId) => {
    // delete the desired card
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this card? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        await deleteCard(cardId);
        // remove the deleted card from the deck
        setDeck((prevDeck) => ({
          ...prevDeck,
          cards: prevDeck.cards.filter((card) => card.id !== cardId),
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!deck) {
    return <div>Loading...</div>;
  }

  const { name, description, cards } = deck;

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {name}
          </li>
        </ol>
      </nav>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <Link to={`/decks/${deckId}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <Link to={`/decks/${deckId}/study`} className="btn btn-primary">
            Study
          </Link>
          <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary">
            Add Cards
          </Link>
          <button className="btn btn-danger" onClick={handleDeleteDeck}>
            Delete
          </button>
        </div>
      </div>
      <h2 className="mt-4">Cards</h2>
      {cards.length > 0 ? (
        <div className="card-list">
          {cards.map((card) => (
            <div key={card.id} className="card">
              <div className="card-body">
                <p className="card-text">{card.front}</p>
                <p className="card-text">{card.back}</p>
                <Link
                  to={`/decks/${deckId}/cards/${card.id}/edit`}
                  className="btn btn-secondary mr-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No cards found in this deck.</p>
      )}
    </div>
  );
}

export default Deck;
