/* eslint-disable no-undef */
import React from "react";
import { DrawingToolsModel, DrawingToolsView as DrawingToolsView } from ".";
import { GenericController } from "../UIComponent";

export class DrawingToolsController extends GenericController<DrawingToolsModel> {
  generateWidget(): JSX.Element {
    return <DrawingToolsView controller={this} />;
  }
}
