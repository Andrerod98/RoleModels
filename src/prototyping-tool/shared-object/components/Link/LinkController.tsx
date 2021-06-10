/* eslint-disable no-undef */
import React from "react";
import { UIComponentController } from "../UIComponent/UIComponentController";
import { LinkUI } from "./LinkModel";
import { LinkView } from "./LinkView";

export class LinkController extends UIComponentController {
  constructor(protected model: LinkUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <LinkView controller={this} />;
  }
}
