import React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import Home from "../Home";
import Deck from "../Deck";
import Study from "../Study";
import NotFound from "./NotFound";
import CreateDeck from "../CreateDeck";
import EditDeck from "../EditDeck";
import AddCard from "../AddCard";
import EditCard from "../EditCard";

function Layout() {
  return (
    <div className="container">
      <Header />
      <div className="mt-4">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/decks/new">
            <CreateDeck />
          </Route>
          <Route exact path="/decks/:deckId/edit">
            <EditDeck />
          </Route>
          <Route exact path="/decks/:deckId/study">
            <Study />
          </Route>
          <Route exact path="/decks/:deckId/cards/new">
            <AddCard />
          </Route>
          <Route exact path="/decks/:deckId/cards/:cardId/edit">
            <EditCard />
          </Route>
          <Route exact path="/decks/:deckId">
            <Deck />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Layout;
