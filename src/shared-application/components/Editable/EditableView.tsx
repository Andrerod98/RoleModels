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
    <Editable key={"editable_" + component.id} {...component}>
      <EditablePreview />
      <EditableInput />
    </Editable>
  );
}
