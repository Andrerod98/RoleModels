/* eslint-disable no-undef */
import React from "react";
import { BrushChartModel, BrushChartView } from ".";

import { GenericController } from "../UIComponent";

export class BrushChartController extends GenericController<BrushChartModel> {
  generateWidget(): JSX.Element {
    return <BrushChartView controller={this} />;
  }
}
