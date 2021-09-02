/* eslint-disable no-undef */
import React from "react";
import { XYChartModel, XYChartView } from ".";

import { GenericController } from "../UIComponent";

export class XYChartController extends GenericController<XYChartModel> {
  generateWidget(): JSX.Element {
    return <XYChartView controller={this} />;
  }
}
