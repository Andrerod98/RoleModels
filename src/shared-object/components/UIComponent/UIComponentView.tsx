import * as React from "react";
import { UIComponentController } from "./UIComponentController";

interface UIComponentProps {
  controller: UIComponentController;
}

export function UIComponentView(props: UIComponentProps) {
  const controller = this.props.controller;
  return React.createElement(
    controller.get().name,

    {
      className: "remove-all-styles",
      // ref: this.componentRef,
      id: controller.get().id,
      key: controller.get().id,
      style: {
        ...controller.get().style,
      },
      ...controller.getListeners(),
      onClick: () => {
        controller.emit("click");
      },
    },

    controller.get().value
  );
}
