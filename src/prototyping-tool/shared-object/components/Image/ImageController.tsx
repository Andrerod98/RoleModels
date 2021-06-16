/* eslint-disable no-undef */
import React from "react";
import { ImageUI, ImageView } from ".";
import { GenericController } from "../UIComponent/UIComponentController";

export class ImageController extends GenericController<ImageUI> {
  generateWidget(): JSX.Element {
    return <ImageView controller={this} />;
  }
}
