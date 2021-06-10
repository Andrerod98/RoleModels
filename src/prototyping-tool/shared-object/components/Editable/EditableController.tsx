/* eslint-disable no-undef */
import React from "react";
import { EditableUI, EditableView as EditableView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class EditableController extends UIComponentController {
  constructor(protected model: EditableUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <EditableView controller={this} />;
  }
}
