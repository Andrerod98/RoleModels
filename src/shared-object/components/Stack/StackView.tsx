import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { StackUI } from ".";
import { Stack } from "@chakra-ui/react";
import { StackController } from "./StackController";
import { UIComponentController } from "../UIComponent";

export class StackView extends UIComponentView {
  render() {
    const controller = this.props.controller as StackController;
    const component = controller.get() as StackUI;

    return (
      <Stack key={"stack_" + component.id} {...component}>
        {controller
          .getChildren()
          .map((component: UIComponentController) =>
            component.generateWidget()
          )}
      </Stack>
    );
  }
}
