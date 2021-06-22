/* eslint-disable @typescript-eslint/no-empty-function */
import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { ImageUI } from ".";
import { Image } from "@chakra-ui/image";

export class ImageView extends UIComponentView {
  render() {
    const { children, ...component } = this.props.controller.get() as ImageUI;

    const element = (
      <Image
        {...component}
        onError={() => {}}
        onClick={this.props.controller.getListener("onClick")}
      />
    );

    return element;
  }
}
