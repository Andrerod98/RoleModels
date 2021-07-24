/* eslint-disable no-undef */
import React from "react";
import { EditableUI, EditableView as EditableView } from ".";
import { GenericController } from "../UIComponent/UIComponentController";

export class EditableController extends GenericController<EditableUI> {
  generateWidget(): JSX.Element {
    return <EditableView controller={this} />;
  }
}
