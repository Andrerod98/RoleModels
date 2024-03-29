import React from "react";
import { CheckboxUI } from ".";
import { Checkbox } from "@chakra-ui/react";
import { CheckboxController } from "./CheckboxController";

export function CheckboxView({
  controller,
}: {
  controller: CheckboxController;
}) {
  const component = controller.get() as CheckboxUI;

  return (
    <Checkbox
      onClick={() => controller.emitEvent("onClick")}
      key={"checkbox-" + component.id}
      {...component}
    />
  );
}
