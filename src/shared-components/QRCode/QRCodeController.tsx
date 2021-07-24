/* eslint-disable no-undef */
import React from "react";
import { UIComponentController } from "../UIComponent/UIComponentController";
import { QRCodeUI } from "./QRCodeModel";
import { QRCodeView } from "./QRCodeView";
//import { IFluidDataStoreRuntime } from "@fluidframework/datastore-definitions";
//import { IFluidHandle } from "@fluidframework/core-interfaces";

export class QRCodeController extends UIComponentController {
  //private sharedQR: SharedCell;
  constructor(
    protected model: QRCodeUI,
    //private readonly sharedQRMap: SharedMap,
    //readonly runtime: IFluidDataStoreRuntime,
    readonly factoriesManager,
    parent?: UIComponentController
  ) {
    super(model, factoriesManager, parent);

    //this.loadSharedQR();
  }

  /*async loadSharedQR() {
    if (this.sharedQRMap.has(this.model.id)) {
      this.sharedQR = await this.sharedQRMap
        .get<IFluidHandle<SharedCell>>(this.model.id)
        .get();
    } else {
      this.sharedQR = SharedCell.create(this.runtime);

      this.sharedQR.set(this.model);
      this.sharedQRMap.set(this.model.id, this.sharedQR.handle);
    }
  }*/

  scan() {
    this.emitEvent("onScan", this.model.value);
  }

  generateWidget(): JSX.Element {
    return <QRCodeView controller={this} />;
  }
}
