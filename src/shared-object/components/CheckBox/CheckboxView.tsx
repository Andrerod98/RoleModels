import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { CheckboxUI } from ".";
import { Checkbox } from "@chakra-ui/react";
import { CheckboxController } from "./CheckboxController";

export class CheckboxView extends UIComponentView {
  render() {
    const controller = this.props.controller as CheckboxController;
    const component = controller.get() as CheckboxUI;

    return <Checkbox key={"checkbox_" + component.id} {...component} />;
  }
}
