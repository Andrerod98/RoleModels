/* eslint-disable no-undef */
import React from "react";
import { UIComponentController } from "../UIComponent/UIComponentController";
import { InputUI } from "./InputModel";
import { InputView } from "./InputView";

export class InputController extends UIComponentController {
  constructor(protected model: InputUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <InputView controller={this} />;
  }
}
