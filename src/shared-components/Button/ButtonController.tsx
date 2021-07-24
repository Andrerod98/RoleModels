/* eslint-disable no-undef */
import React from "react";
import { ButtonUI, BoxView as BoxView } from ".";
import { GenericController } from "../UIComponent";

export class ButtonController extends GenericController<ButtonUI> {
  generateWidget(): JSX.Element {
    return <BoxView controller={this} />;
  }
}
