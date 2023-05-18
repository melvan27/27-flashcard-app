import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readCard, updateCard, readDeck } from "./utils/api/index";
import CardForm from "./CardForm";

function EditCard() {
  const { deckId, cardId } = useParams();
  const history = useHistory();
  const [card, setCard] = useState(null);
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadCard = async () => {
      try {
        const cardData = await readCard(cardId, abortController.signal);
        setCard(cardData);
      } catch (error) {
        console.error(error);
      }
    };

    const loadDeck = async () => {
      try {
        const deckData = await readDeck(deckId, abortController.signal);
        setDeck(deckData);
      } catch (error) {
        console.error(error);
      }
    };

    loadCard();
    loadDeck();

    return () => {
      abortController.abort();
    };
  }, [deckId, cardId]);

  const handleSubmit = async (formData) => {
    try {
      await updateCard({ ...formData, id: cardId });
      history.push(`/decks/${deckId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!card || !deck) {
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
            Edit Card {cardId}
          </li>
        </ol>
      </nav>
      <h2>Edit Card</h2>
      <CardForm onSubmit={handleSubmit} initialValues={card} isEdit={true} />
    </div>
  );
}

export default EditCard;
