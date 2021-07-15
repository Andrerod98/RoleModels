import { InputUI } from "./InputModel";
import React from "react";
import { InputController } from ".";
import { Input } from "@chakra-ui/react";

export function InputView({ controller }: { controller: InputController }) {
  const { children, ...component } = controller.get() as InputUI;
  return (
    <Input
      key={"input-" + component.id}
      {...component}
      value={component.value}
      onChange={(nextValue) => {
        controller.emitEvent("onChange", nextValue);
        controller.update({ ...component, value: nextValue });
      }}
    />
  );
}
