import React from "react";
import { FlexUI } from ".";
import { Flex } from "@chakra-ui/react";
import { FlexController } from "./FlexController";
import { UIComponentController } from "../UIComponent";

export function FlexView({ controller }: { controller: FlexController }) {
  const component = controller.get() as FlexUI;

  return (
    <Flex
      key={"flex-" + component.id}
      onClick={() => controller.emitEvent("onClick")}
      {...component}
    >
      {controller
        .getChildren()
        .map((component: UIComponentController) => component.generateWidget())}
    </Flex>
  );
}
