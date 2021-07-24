import React from "react";
import { CgDisplaySpacing } from "react-icons/cg";
import { PDFReaderUI, PDFReaderController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class PDFReaderFactory extends UIComponentFactory {
  public get name() {
    return "pdfreader";
  }

  public get example() {
    return {
      id: "pdfreader-id",
      name: "pdfreader",
      url: "http://www.africau.edu/images/default/sample.pdf",
    };
  }

  public get icon() {
    return <CgDisplaySpacing />;
  }

  public generateComponent(
    component: PDFReaderUI,
    parent?: UIComponentController
  ): PDFReaderController {
    return new PDFReaderController(component, this.factoriesManager, parent);
  }
}
