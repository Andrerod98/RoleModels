/* eslint-disable no-undef */
import React from "react";
import { ImageUI, ImageView } from ".";
import { UIComponentController } from "../UIComponent/UIComponentController";

export class ImageController extends UIComponentController {
  constructor(protected model: ImageUI) {
    super(model);
  }

  generateWidget(): JSX.Element {
    return <ImageView controller={this} />;
  }
}
