import { UIComponentView } from "../UIComponent/UIComponentView";
import { LinkUI } from "./LinkModel";
import React from "react";

export class LinkView extends UIComponentView {
  render() {
    const component = this.props.controller.get() as LinkUI;
    return (
      <a
        key={component.id}
        href={component.href}
        style={component.style}
        onClick={() => {
          return false;
        }}
      >
        {component.value}
      </a>
    );
  }
}
