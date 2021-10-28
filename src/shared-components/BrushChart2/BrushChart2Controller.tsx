/* eslint-disable no-undef */
import React from "react";
import { BrushChart2Model, BrushChart2View as BrushChart2View } from ".";
import { GenericController } from "../UIComponent";

export class BrushChart2Controller extends GenericController<BrushChart2Model> {
  generateWidget(): JSX.Element {
    return <BrushChart2View controller={this} />;
  }
}
