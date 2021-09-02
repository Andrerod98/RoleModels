/* eslint-disable no-undef */
import React from "react";
import { TextModel, TextView as TextView } from ".";
import { GenericController } from "../UIComponent";

export class TextController extends GenericController<TextModel> {
  generateWidget(): JSX.Element {
    return <TextView controller={this} />;
  }
}
