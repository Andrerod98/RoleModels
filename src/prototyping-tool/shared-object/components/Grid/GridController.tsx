/* eslint-disable no-undef */
import React from "react";
import { GridUI, GridView as GridView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class GridController extends UIComponentController {
  constructor(protected model: GridUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <GridView controller={this} />;
  }
}
