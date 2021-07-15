import React from "react";
import { Spacer } from "@chakra-ui/react";
import { SpacerController } from "./SpacerController";
import { SpacerUI } from ".";

export function SpacerView({ controller }: { controller: SpacerController }) {
  const component = controller.get() as SpacerUI;
  return <Spacer key={"spacer-" + component.id} />;
}
