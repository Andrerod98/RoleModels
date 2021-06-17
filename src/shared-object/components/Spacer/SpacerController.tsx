/* eslint-disable no-undef */
import React from "react";
import { SpacerUI, SpacerView } from ".";
import { GenericController } from "../UIComponent/UIComponentController";

export class SpacerController extends GenericController<SpacerUI> {
  generateWidget(): JSX.Element {
    return <SpacerView controller={this} />;
  }
}
