/* eslint-disable no-undef */
import React from "react";
import { CheckboxView as CheckboxView } from ".";
import { IUIComponent } from "../UIComponent";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class CheckboxController extends UIComponentController {
  constructor(protected model: IUIComponent) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <CheckboxView controller={this} />;
  }
}
