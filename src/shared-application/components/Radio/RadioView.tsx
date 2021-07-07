import React from "react";
import { RadioController } from ".";
import { RadioUI } from "./RadioModel";

export function RadioView({ controller }: { controller: RadioController }) {
  const component = controller.get() as RadioUI;

  return (
    <form key={"form_" + component.id}>
      {component.values.map((value, index) => {
        return (
          <label key={"label_" + component.id + "_" + value}>
            {value}
            {React.createElement(
              "input",

              {
                className: "remove-all-styles",
                // ref: this.componentRef,
                id: value,
                key: component.id + index,
                type: "radio",
                name: component.id,
                value: value,
                size: controller.getWidth(),

                ...controller.getListeners(),
              }
            )}
          </label>
        );
      })}
    </form>
  );
}
