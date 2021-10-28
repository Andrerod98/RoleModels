/* eslint-disable no-undef */
import React from "react";
import { NewsTableModel, NewsTableView as NewsTableView } from ".";
import { GenericController } from "../UIComponent";

export class NewsTableController extends GenericController<NewsTableModel> {
  generateWidget(): JSX.Element {
    return <NewsTableView controller={this} />;
  }
}
