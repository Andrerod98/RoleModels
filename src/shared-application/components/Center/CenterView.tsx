import React from "react";
import { CenterUI } from ".";
import { Center } from "@chakra-ui/react";
import { CenterController } from "./CenterController";
import { UIComponentController } from "../UIComponent";

export function CenterView({ controller }: { controller: CenterController }) {
  const component = controller.get() as CenterUI;

  return (
    <Center
      key={"center-" + component.id}
      onClick={() => controller.emitEvent("onClick")}
      {...component}
    >
      {controller
        .getChildren()
        .map((component: UIComponentController) => component.generateWidget())}
    </Center>
  );
}
