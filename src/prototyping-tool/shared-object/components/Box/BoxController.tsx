/* eslint-disable no-undef */
import React from "react";
import { BoxView as BoxView } from ".";
import { IUIComponent } from "../UIComponent";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class BoxController extends UIComponentController {
  constructor(protected model: IUIComponent) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <BoxView controller={this} />;
  }
}
