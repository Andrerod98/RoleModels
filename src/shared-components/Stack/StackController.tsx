/* eslint-disable no-undef */
import React from "react";
import { StackUI, StackView as StackView } from ".";
import { GenericController } from "../UIComponent";

export class StackController extends GenericController<StackUI> {
  generateWidget(): JSX.Element {
    return <StackView controller={this} />;
  }
}
