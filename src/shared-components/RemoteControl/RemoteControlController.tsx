/* eslint-disable no-undef */
import React from "react";
import { RemoteControlModel, RemoteControlView as RemoteControlView } from ".";
import { GenericController } from "../UIComponent";

export class RemoteControlController extends GenericController<RemoteControlModel> {
  generateWidget(): JSX.Element {
    return <RemoteControlView controller={this} />;
  }
}
