/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-namespace */
import React from "react";
import { Canvas } from "./Canvas";
import { ViewsBar } from "./ViewsBar";
import { CatalogBarItem } from "./CatalogBarItem";
import { ToolBar } from "./ToolBar";
import { Diagram } from "../../diagram/Diagram";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { DndContext } from "@dnd-kit/core";
import { Project } from "../../Project";
import { RoleNodeModel } from "../../diagram/nodes/role-node/RoleNodeModel";
import { ViewNodeModel } from "../../diagram/nodes/view-node/ViewNodeModel";
import { ViewNodeWidget } from "../../diagram/nodes/view-node/ViewNodeWidget";
import { Flex } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { View } from "../../../prototyping-tool/shared-object/views/View";
interface CombinedTabProps {
  app: Diagram;
  project: Project;
}

export const CombinedTab = (props: CombinedTabProps) => {
  const handleDragMove = (e: any) => {};

  const handleDragEnd = (e: any) => {
    if (!e.over || !e.active) return;
    console.log(e);
    const model = props.app
      .getActiveDiagram()
      .getNode(e.over.id) as RoleNodeModel;

    const model2 = props.app
      .getActiveDiagram()
      .getNode(e.active.id) as ViewNodeModel;

    console.log(model2.getPorts());

    model.addItem(model2);
    console.log(model.getItems());
    props.app.getDiagramEngine();
  };
  return (
    <Flex h={"100%"}>
      <ViewsBar>
        {props.project
          .getLayoutManager("individual")
          .getViews()
          .map((view: View, index: number) => {
            return (
              <CatalogBarItem
                key={"ci-" + index}
                model={{ type: "button", view: view.toView() }}
                name={view.getId()}
              >
                <ViewNodeWidget
                  isPreview={true}
                  node={new ViewNodeModel("new", " new", view)}
                  engine={props.app.getDiagramEngine()}
                />
              </CatalogBarItem>
            );
          })}
      </ViewsBar>

      <Box
        flexGrow={1}
        onDrop={props.project.onDropCanvas}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <ToolBar
          onZoomIn={props.project.zoomIn}
          onZoomOut={props.project.zoomOut}
          onZoomToFit={props.project.zoomToFit}
          onAddQr={props.project.addQr}
        />

        <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
          <Canvas>
            <CanvasWidget engine={props.app.getDiagramEngine()} />
          </Canvas>
        </DndContext>
      </Box>
    </Flex>
  );
};
