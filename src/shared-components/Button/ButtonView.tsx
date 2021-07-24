import React from "react";
import { ButtonUI } from ".";
import { Button } from "@chakra-ui/react";
import { ButtonController } from "./ButtonController";

export function BoxView({ controller }: { controller: ButtonController }) {
  const { value, ...component } = controller.get() as ButtonUI;

  return (
    <Button
      key={"button-" + component.id}
      {...component}
      onClick={() => {
        controller.emitEvent("onClick");
      }}
    >
      {value}
    </Button>
  );
}
