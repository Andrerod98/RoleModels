/* eslint-disable no-undef */
import React from "react";
import { BoxUI, BoxView as BoxView } from ".";
import { GenericController } from "../UIComponent";

export class BoxController extends GenericController<BoxUI> {
  generateWidget(): JSX.Element {
    return <BoxView controller={this} />;
  }
}
