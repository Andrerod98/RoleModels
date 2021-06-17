/* eslint-disable no-undef */
import React from "react";
import { GenericController } from "../UIComponent";
import { InputUI } from "./InputModel";
import { InputView } from "./InputView";

export class InputController extends GenericController<InputUI> {
  generateWidget(): JSX.Element {
    return <InputView controller={this} />;
  }
}
