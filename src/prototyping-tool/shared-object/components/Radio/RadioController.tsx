/* eslint-disable no-undef */
import React from "react";
import { UIComponentController } from "../UIComponent/UIComponentController";
import { RadioUI } from "./RadioModel";
import { RadioView } from "./RadioView";

export class RadioController extends UIComponentController {
  constructor(protected model: RadioUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <RadioView controller={this} />;
  }
}
