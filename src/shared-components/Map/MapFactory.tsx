import React from "react";
import { BiMapAlt } from "react-icons/bi";
import { MapUI, MapController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class MapFactory extends UIComponentFactory {
  public get name() {
    return "map";
  }

  public get example() {
    return {
      id: "map-id",
      name: "map",
      width: "100%",
      height: "100%",
      type: "satelite",
      center: { lat: 59.95, lng: 30.33 },
      zoom: 11,
    };
  }

  public get icon() {
    return <BiMapAlt />;
  }

  public generateComponent(
    component: MapUI,
    parent?: UIComponentController
  ): MapController {
    return new MapController(component, this.factoriesManager, parent);
  }
}
