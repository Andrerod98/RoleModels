/* eslint-disable no-undef */
import React from "react";
import { BoardModel, BoardView as BoardView } from ".";
import { GenericController } from "../UIComponent";

export class BoardController extends GenericController<BoardModel> {
  withDrawCard(): string {
    const component = this.get() as BoardModel;
    const deckCards = [...component.deckCards];
    const newCard = deckCards.pop();
    this.update({ ...component, deckCards: deckCards });
    return newCard;
  }

  playCard(card: string) {
    const component = this.get() as BoardModel;
    this.update({
      ...component,
      playedCards: [...component.playedCards, card],
    });
  }

  generateWidget(): JSX.Element {
    return <BoardView controller={this} />;
  }
}
