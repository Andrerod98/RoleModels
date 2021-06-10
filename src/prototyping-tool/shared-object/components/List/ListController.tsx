/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
import React from "react";
import { UIComponentController } from "../UIComponent/UIComponentController";
import { ListUI } from "./ListModel";
import { ListView } from "./ListView";

export class ListController extends UIComponentController {
  private itemsListeners = {};
  constructor(protected model: ListUI) {
    super(model);
  }

  addEventListenerToItem(listener: { [event: string]: (...args: any) => any }) {
    this.itemsListeners = { ...this.itemsListeners, ...listener };
  }

  removeItemEventListener() {}

  public getItemListeners(): { [event: string]: (...args: any) => any } {
    return this.itemsListeners;
  }

  generateWidget(): JSX.Element {
    return <ListView controller={this} />;
  }
}
