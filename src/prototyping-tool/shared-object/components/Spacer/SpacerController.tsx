/* eslint-disable no-undef */
import React from "react";
import { SpacerUI, SpacerView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class SpacerController extends UIComponentController {
  constructor(protected model: SpacerUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <SpacerView controller={this} />;
  }
}
