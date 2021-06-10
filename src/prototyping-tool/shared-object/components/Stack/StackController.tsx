/* eslint-disable no-undef */
import React from "react";
import { StackUI, StackView as StackView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class StackController extends UIComponentController {
  constructor(protected model: StackUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <StackView controller={this} />;
  }
}
