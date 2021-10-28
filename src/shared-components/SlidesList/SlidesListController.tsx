/* eslint-disable no-undef */
import React from "react";
import { SlidesListModel, SlidesListView as SlidesListView } from ".";
import { GenericController } from "../UIComponent";

export class SlidesListController extends GenericController<SlidesListModel> {
  generateWidget(): JSX.Element {
    return <SlidesListView controller={this} />;
  }
}
