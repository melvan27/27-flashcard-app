import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck, createCard } from "./utils/api/index";
import CardForm from "./CardForm";

function AddCard() {
  const { deckId } = useParams();
  const history = useHistory();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    // load the selected card
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

  const handleSubmit = async (formData) => {
    try {
      // create the new card and add it to the deck
      await createCard(deckId, formData);

      // redirect to the add card page
      history.push(`/decks/${deckId}/cards/new`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!deck) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Add Card
          </li>
        </ol>
      </nav>
      <h2>{deck.name}: Add Card</h2>
      <CardForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddCard;
