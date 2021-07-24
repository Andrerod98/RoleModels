import { RadioGroup, Stack, Radio } from "@chakra-ui/react";
import React from "react";
import { RadioController } from ".";
import { RadioUI } from "./RadioModel";

export function RadioView({ controller }: { controller: RadioController }) {
  const { value, ...component } = controller.get() as RadioUI;

  return (
    <RadioGroup
      key={"radio-group-" + component.id}
      onChange={(nextValue) => {
        controller.emitEvent("onChange", nextValue);
        controller.update({ ...component, value: nextValue });
      }}
      value={value}
    >
      <Stack direction='row'>
        {component.values.map((value, index) => {
          return (
            <Radio key={"radio-item-" + index} value={value}>
              {value}
            </Radio>
          );
        })}
      </Stack>
    </RadioGroup>
  );
}
