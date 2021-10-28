/* eslint-disable no-undef */
import React from "react";
import { StockTableModel, StockTableView as StockTableView } from ".";
import { GenericController } from "../UIComponent";

export class StockTableController extends GenericController<StockTableModel> {
  generateWidget(): JSX.Element {
    return <StockTableView controller={this} />;
  }
}
