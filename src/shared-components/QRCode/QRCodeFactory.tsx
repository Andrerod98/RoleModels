import React from "react";
import { ImQrcode } from "react-icons/im";
import { QRCodeController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";
import { QRCodeUI } from "./QRCodeModel";

export class QRCodeFactory extends UIComponentFactory {
  public get name() {
    return "qrcode";
  }

  public get example() {
    return {
      id: "qr-id",
      name: "qrcode",
      value: "",
      nScanned: 0,
    };
  }

  public get icon() {
    return <ImQrcode />;
  }

  public generateComponent(
    component: QRCodeUI,
    parent?: UIComponentController
  ) {
    return new QRCodeController(component, this.factoriesManager, parent);
  }
}
