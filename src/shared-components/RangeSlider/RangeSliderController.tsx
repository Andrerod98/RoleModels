/* eslint-disable no-undef */
import React from "react";
import { RangeSliderModel, RangeSliderView as RangeSliderView } from ".";
import { GenericController } from "../UIComponent";

export class RangeSliderController extends GenericController<RangeSliderModel> {
  generateWidget(): JSX.Element {
    return <RangeSliderView controller={this} />;
  }
}
