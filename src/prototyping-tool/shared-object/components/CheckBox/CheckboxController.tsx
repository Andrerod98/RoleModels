/* eslint-disable no-undef */
import React from "react";
import { CheckboxView as CheckboxView } from ".";
import { GenericController } from "../UIComponent";
import { CheckboxUI } from "./CheckboxModel";

export class CheckboxController extends GenericController<CheckboxUI> {
  generateWidget(): JSX.Element {
    return <CheckboxView controller={this} />;
  }
}
