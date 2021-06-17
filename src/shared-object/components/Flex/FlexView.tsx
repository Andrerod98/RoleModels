import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { FlexUI } from ".";
import { Flex } from "@chakra-ui/react";
import { FlexController } from "./FlexController";
import { UIComponentController } from "../UIComponent";

export class FlexView extends UIComponentView {
  render() {
    const controller = this.props.controller as FlexController;
    const component = controller.get() as FlexUI;

    return (
      <Flex key={"flex_" + component.id} {...component}>
        {controller
          .getChildren()
          .map((component: UIComponentController) =>
            component.generateWidget()
          )}
      </Flex>
    );
  }
}
