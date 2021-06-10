import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { RadioUI } from "./RadioModel";

export class RadioView extends UIComponentView {
  render() {
    const component = this.props.controller.get() as RadioUI;

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
                  size: this.props.controller.getWidth(),

                  ...this.props.controller.getListeners(),
                }
              )}
            </label>
          );
        })}
      </form>
    );
  }
}
