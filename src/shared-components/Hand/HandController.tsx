/* eslint-disable no-undef */
import React from "react";
import { HandModel, HandView as HandView } from ".";
import { GenericController } from "../UIComponent";

export class HandController extends GenericController<HandModel> {
  playCard(card: string) {
    const component = this.get() as HandModel;
    const cards = [...component.cards];
    const index = component.cards.indexOf(card);
    cards.splice(index, 1);
    this.update({ ...component, cards: cards });
  }

  drawCard(card: string) {
    const component = this.get() as HandModel;

    this.update({ ...component, cards: [...component.cards, card] });
  }

  flipCards() {
    const component = this.get() as HandModel;

    this.update({ ...component, flipped: !component.flipped });
  }

  generateWidget(): JSX.Element {
    return <HandView controller={this} />;
  }
}
