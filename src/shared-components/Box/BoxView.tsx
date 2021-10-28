import React from "react";
import { BoxUI } from ".";
import { Box } from "@chakra-ui/react";
import { DrawingToolsController } from "./BoxController";
import { UIComponentController } from "../UIComponent";

export function BoxView({
  controller,
}: {
  controller: DrawingToolsController;
}) {
  const component = controller.get() as BoxUI;

  return (
    <Box
      key={"box-" + component.id}
      onClick={() => controller.emitEvent("onClick")}
      {...component}
    >
      {controller
        .getChildren()
        .map((component: UIComponentController) => component.generateWidget())}
    </Box>
  );
}
