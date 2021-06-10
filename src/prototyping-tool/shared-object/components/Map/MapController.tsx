/* eslint-disable no-undef */
import React from "react";
import { UIComponentController } from "../UIComponent/UIComponentController";
import { MapUI } from "./MapModel";
import { MapView } from "./MapView";

export class MapController extends UIComponentController {
  constructor(protected model: MapUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <MapView controller={this} />;
  }
}
