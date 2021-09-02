/* eslint-disable no-undef */
import React from "react";
import { StockDetailsModel, StockDetailsView as StockDetailsView } from ".";
import { GenericController } from "../UIComponent";

export class StockDetailsController extends GenericController<StockDetailsModel> {
  generateWidget(): JSX.Element {
    return <StockDetailsView controller={this} />;
  }
}
