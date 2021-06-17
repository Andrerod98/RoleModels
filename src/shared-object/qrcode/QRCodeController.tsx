/* eslint-disable no-undef */
import { SharedCell } from "@fluidframework/cell";
import * as React from "react";
import { IQRCode } from "./IQRCode";
const QRCode = require("qrcode.react");

export class QRCodeController {
  constructor(readonly sharedInc: SharedCell) {}

  public onScan(listener: () => void) {
    this.sharedInc.on("valueChanged", listener);
  }

  public scan() {
    const qr = this.getQRCode();
    this.sharedInc.set({ ...qr, nScanned: qr.nScanned });
  }

  public getQRCode(): IQRCode {
    return this.sharedInc.get();
  }

  public generate(): JSX.Element {
    const qr = this.getQRCode();
    return <QRCode value={"qr/" + qr.id}></QRCode>;
  }
}
