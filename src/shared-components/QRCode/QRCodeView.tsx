import React from "react";
import { QRCodeUI } from ".";
import { QRCodeController } from "./QRCodeController";
const QRCode = require("qrcode.react");

export function QRCodeView({ controller }: { controller: QRCodeController }) {
  const { value, ...component } = controller.get() as QRCodeUI;

  return (
    <QRCode key={"qrcode-view-" + component.id} value={"qr/" + component.id} />
  );
}
