import { SharedMap } from "@fluidframework/map";
import { SharedCell } from "@fluidframework/cell";
import { QRCodeController } from "./QRCodeController";

export class QRManager {
  qrs: Map<string, QRCodeController>;
  constructor(readonly qrSharedMap: SharedMap) {
    this.qrs = new Map<string, QRCodeController>();
  }

  public loadQR(sharedCell: SharedCell): void {
    const qrcode = new QRCodeController(sharedCell);
    this.qrs.set(qrcode.getQRCode().id, qrcode);
  }

  public addQR(sharedCell: SharedCell): QRCodeController {
    const id = sharedCell.get().id;
    if (this.qrs.has(id)) {
      return this.qrs.get(id);
    }

    this.qrSharedMap.set(id, sharedCell.handle);

    const qrcode = new QRCodeController(sharedCell);
    this.qrs.set(id, qrcode);
    return qrcode;
  }

  public getQR(id: string) {
    return this.qrs.get(id);
  }

  public async loadQRCodes() {
    for (const handle of this.qrSharedMap.values()) {
      const sharedCell = await handle.get();
      if (sharedCell !== undefined) {
        this.loadQR(sharedCell);
      }
    }
    console.log("" + this.qrSharedMap.size + " QR Codes loaded.");
  }

  public getQRsWithIds(ids: string[]) {
    const result = [];
    ids.forEach((id) => {
      const cv = this.qrs.get(id);

      if (cv !== undefined) result.push(cv);
    });
    return result;
  }
}
