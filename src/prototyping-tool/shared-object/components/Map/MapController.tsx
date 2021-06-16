/* eslint-disable no-undef */
import React from "react";
import { GenericController } from "../UIComponent/UIComponentController";
import { MapUI } from "./MapModel";
import { MapView } from "./MapView";

export class MapController extends GenericController<MapUI> {
  generateWidget(): JSX.Element {
    return <MapView controller={this} />;
  }
}
