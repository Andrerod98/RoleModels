import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { EditableUI } from ".";
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { EditableController } from "./EditableController";

export class EditableView extends UIComponentView {
  render() {
    const controller = this.props.controller as EditableController;
    const component = controller.get() as EditableUI;

    return (
      <Editable key={"editable_" + component.id} {...component}>
        <EditablePreview />
        <EditableInput />
      </Editable>
    );
  }
}
