import { InputUI } from "./InputModel";
import React from "react";
import { InputController } from ".";

export function InputView({ controller }: { controller: InputController }) {
  const component = this.props.controller.get() as InputUI;
  return (
    <form
      key={"form_" + component.id}
      style={{
        width: this.props.controller.getWidth() + "px",
        height: this.props.controller.getHeight() + "px",
      }}
    >
      <label key={"label_" + component.id}>
        {component.label}
        {React.createElement(
          "input",

          {
            className: "remove-all-styles",
            // ref: this.componentRef,
            id: component.id,
            key: component.id,
            type: "text",
            name: component.id,
            value: component.value,
            size: this.props.controller.getWidth(),

            ...this.props.controller.getListeners(),
          }
        )}
      </label>
    </form>
  );
}
