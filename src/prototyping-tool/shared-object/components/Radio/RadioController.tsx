/* eslint-disable no-undef */
import React from "react";
import { GenericController } from "../UIComponent";
import { RadioUI } from "./RadioModel";
import { RadioView } from "./RadioView";

export class RadioController extends GenericController<RadioUI> {
  generateWidget(): JSX.Element {
    return <RadioView controller={this} />;
  }
}
