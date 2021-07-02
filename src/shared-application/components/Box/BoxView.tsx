import React from "react";
import { BoxUI } from ".";
import { Box } from "@chakra-ui/react";
import { BoxController } from "./BoxController";
import { UIComponentController } from "../UIComponent";

export function BoxView({ controller }: { controller: BoxController }) {
  const component = controller.get() as BoxUI;

  return (
    <Box key={"box_" + component.id} {...component}>
      {controller
        .getChildren()
        .map((component: UIComponentController) => component.generateWidget())}
    </Box>
  );
}