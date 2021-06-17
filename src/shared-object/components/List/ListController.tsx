/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
import React from "react";
import { GenericController } from "../UIComponent/UIComponentController";
import { ListUI } from "./ListModel";
import { ListView } from "./ListView";

export class ListController extends GenericController<ListUI> {
  generateWidget(): JSX.Element {
    return <ListView controller={this} />;
  }
}
