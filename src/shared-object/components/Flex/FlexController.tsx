/* eslint-disable no-undef */
import React from "react";
import { FlexUI, FlexView as FlexView } from ".";
import { GenericController } from "../UIComponent/UIComponentController";

export class FlexController extends GenericController<FlexUI> {
  generateWidget(): JSX.Element {
    return <FlexView controller={this} />;
  }
}
