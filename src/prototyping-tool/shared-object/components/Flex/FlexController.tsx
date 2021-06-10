/* eslint-disable no-undef */
import React from "react";
import { FlexUI, FlexView as FlexView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class FlexController extends UIComponentController {
  constructor(protected model: FlexUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <FlexView controller={this} />;
  }
}
