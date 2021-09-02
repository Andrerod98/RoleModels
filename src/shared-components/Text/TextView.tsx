import React from "react";
import { TextModel } from ".";
import { Text } from "@chakra-ui/react";
import { TextController } from "./TextController";

export function TextView({ controller }: { controller: TextController }) {
  const { value, ...component } = controller.get() as TextModel;

  return (
    <Text key={"text-" + component.id} {...component}>
      {value}
    </Text>
  );
}
