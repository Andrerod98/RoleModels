import React from "react";
import { StackUI } from ".";
import { Stack } from "@chakra-ui/react";
import { StackController } from "./StackController";
import { UIComponentController } from "../UIComponent";

export function StackView({ controller }: { controller: StackController }) {
  const component = controller.get() as StackUI;

  return (
    <Stack
      key={"stack-" + component.id}
      onClick={() => controller.emitEvent("onClick")}
      {...component}
    >
      {controller
        .getChildren()
        .map((component: UIComponentController) => component.generateWidget())}
    </Stack>
  );
}
