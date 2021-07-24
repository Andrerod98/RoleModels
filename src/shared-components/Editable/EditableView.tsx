import React from "react";
import { EditableUI } from ".";
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { EditableController } from "./EditableController";

export function EditableView({
  controller,
}: {
  controller: EditableController;
}) {
  const component = controller.get() as EditableUI;

  return (
    <Editable
      key={"editable-" + component.id}
      {...component}
      onChange={(nextValue: string) =>
        controller.emitEvent("onChange", nextValue)
      }
    >
      <EditablePreview />
      <EditableInput />
    </Editable>
  );
}
