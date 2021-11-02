/* eslint-disable no-undef */
import React from "react";
import { SlideControlsModel, SlideControlsView as SlideControlsView } from ".";
import { GenericController } from "../UIComponent";

export class SlideControlsController extends GenericController<SlideControlsModel> {
  generateWidget(): JSX.Element {
    return <SlideControlsView controller={this} />;
  }
}
