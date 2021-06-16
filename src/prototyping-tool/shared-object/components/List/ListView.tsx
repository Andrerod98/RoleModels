import { UIComponentView } from "../UIComponent/UIComponentView";
import { ListUI } from "./ListModel";
import React from "react";
import { ListController } from ".";

export class ListView extends UIComponentView {
  render() {
    const controller = this.props.controller as ListController;
    const component = controller.get() as ListUI;

    return (
      <ol id={component.id} key={component.id}>
        {component.items.map((uiComponent, index) =>
          React.createElement(
            "li",

            {
              className: "remove-all-styles",
              id: component.id + "_" + index,
              key: index,
            },

            uiComponent
          )
        )}
      </ol>
    );
  }
}
