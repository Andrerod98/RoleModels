/* eslint-disable no-undef */
import React from "react";
import { CenterUI, CenterView as CenterView } from ".";
import { GenericController } from "../UIComponent";

export class CenterController extends GenericController<CenterUI> {
  generateWidget(): JSX.Element {
    return <CenterView controller={this} />;
  }
}
