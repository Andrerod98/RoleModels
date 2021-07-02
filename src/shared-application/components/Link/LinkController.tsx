/* eslint-disable no-undef */
import React from "react";
import { GenericController } from "../UIComponent";
import { LinkUI } from "./LinkModel";
import { LinkView } from "./LinkView";

export class LinkController extends GenericController<LinkUI> {
  generateWidget(): JSX.Element {
    return <LinkView controller={this} />;
  }
}
