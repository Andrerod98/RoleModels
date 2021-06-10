import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { BoxUI } from ".";
import { Box } from "@chakra-ui/react";
import { BoxController } from "./BoxController";
import { UIComponentController } from "../UIComponent";

export class BoxView extends UIComponentView {
  render() {
    const controller = this.props.controller as BoxController;
    const component = controller.get() as BoxUI;

    return (
      <Box key={"box_" + component.id} {...component}>
        {controller
          .getChildren()
          .map((component: UIComponentController) =>
            component.generateWidget()
          )}
      </Box>
    );
  }
}
