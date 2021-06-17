import { UIComponentView } from "../UIComponent/UIComponentView";
import React from "react";
import { GridUI } from ".";
import { Grid } from "@chakra-ui/react";
import { GridController } from "./GridController";
import { UIComponentController } from "../UIComponent";

export class GridView extends UIComponentView {
  render() {
    const controller = this.props.controller as GridController;
    const component = controller.get() as GridUI;

    return (
      <Grid key={"grid_" + component.id} {...component}>
        {controller
          .getChildren()
          .map((component: UIComponentController) =>
            component.generateWidget()
          )}
      </Grid>
    );
  }
}
