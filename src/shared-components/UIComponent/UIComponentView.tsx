import * as React from "react";
import { UIComponentController } from "./UIComponentController";

interface UIComponentProps {
  controller: UIComponentController;
}

export function UIComponentView(props: UIComponentProps) {
  const controller = props.controller;
  return React.createElement(
    controller.get().name,
    {
      className: "remove-all-styles",
      id: controller.get().id,
      key: "uicomponent-" + controller.get().id,
      style: {
        ...controller.get().style,
      },
      onClick: () => {
        controller.emitEvent("onClick");
      },
    },

    controller.get().value
  );
}
