import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

function CardForm({ onSubmit, initialValues, isEdit }) {
  const [formData, setFormData] = useState(initialValues || {});
  const { deckId } = useParams();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="front">Front</label>
        <textarea
          className="form-control"
          id="front"
          name="front"
          value={formData.front || ""}
          onChange={handleChange}
          rows="3"
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="back">Back</label>
        <textarea
          className="form-control"
          id="back"
          name="back"
          value={formData.back || ""}
          onChange={handleChange}
          rows="3"
          required
        ></textarea>
      </div>
      {isEdit ? (
        <>
          <Link to={`/decks/${deckId}`} className="btn btn-secondary mr-2">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </>
      ) : (
        <>
          <Link to={`/decks/${deckId}`} className="btn btn-secondary mr-2">
            Done
          </Link>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </>
      )}
    </form>
  );
}

export default CardForm;
