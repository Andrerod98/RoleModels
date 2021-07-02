/* eslint-disable no-undef */
import React from "react";
import { ThrowableUI, ThrowableView } from ".";
import { GenericController } from "../UIComponent";

export class ThrowableController extends GenericController<ThrowableUI> {
  generateWidget(): JSX.Element {
    return <ThrowableView controller={this} />;
  }
}
