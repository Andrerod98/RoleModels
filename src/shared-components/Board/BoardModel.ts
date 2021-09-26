import { IUIComponent } from "../UIComponent/UIComponentModel";

export interface BoardModel extends IUIComponent {
  playedCards: string[];
  deckCards: string[];
  currentPlayer: string;
}
