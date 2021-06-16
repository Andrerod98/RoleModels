/* eslint-disable no-undef */
import React from "react";
import { GridUI, GridView as GridView } from ".";
import { GenericController } from "../UIComponent";

export class GridController extends GenericController<GridUI> {
  generateWidget(): JSX.Element {
    return <GridView controller={this} />;
  }
}
