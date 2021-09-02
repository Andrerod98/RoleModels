/* eslint-disable no-undef */
import React from "react";
import { AreaChartModel, AreaChartView as AreaChartView } from ".";
import { GenericController } from "../UIComponent";

export class AreaChartController extends GenericController<AreaChartModel> {
  generateWidget(): JSX.Element {
    return <AreaChartView controller={this} />;
  }
}
