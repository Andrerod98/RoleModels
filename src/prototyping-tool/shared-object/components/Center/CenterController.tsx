/* eslint-disable no-undef */
import React from "react";
import { CenterUI, CenterView as CenterView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class CenterController extends UIComponentController {
  constructor(protected model: CenterUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <CenterView controller={this} />;
  }
}
