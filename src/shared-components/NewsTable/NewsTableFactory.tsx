import React from "react";
import { MdOutlineDraw } from "react-icons/md";
import { NewsTableModel, NewsTableController } from ".";
import { UIComponentController, UIComponentFactory } from "../UIComponent";

export class NewsTableFactory extends UIComponentFactory {
  public get name() {
    return "news-table";
  }

  public get example() {
    return {
      id: "news-table-id",
      name: "news-table",
      h: "100%",
      w: "100%",
      children: [],
    };
  }

  public get icon() {
    return <MdOutlineDraw />;
  }

  public generateComponent(
    component: NewsTableModel,
    parent?: UIComponentController
  ): NewsTableController {
    return new NewsTableController(component, this.factoriesManager, parent);
  }
}
