import React, { useContext } from "react";

import { Box, Flex } from "@chakra-ui/react";
import { ViewComponent } from "../../shared-application/views/ViewComponent";
import { ILayoutNode } from "../../shared-application/roles/ILayoutNode";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";
interface RoleProps {}

export function RolePage(props: RoleProps) {
  const { app, role, layout, selectedNode, setSelectedNode, isLayoutOpen } =
    useContext<CrossAppState>(CrossAppContext);
  const model = app.getSharedObject();
  //const views = props.app.getViewsOrCombinedViews(props.role.getName());

  const generateWidget = (node: ILayoutNode): JSX.Element => {
    switch (node.name) {
      case "div":
        return (
          <Flex
            maxW={"100%"}
            maxH={"100%"}
            w={"100%"}
            h={"100%"}
            flexWrap={"wrap"}
            overflow={"hidden"}
            key={model.getDeviceRole() + "-div-" + node.id}
            direction={"column"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "flex":
        return (
          <Flex
            maxW={"100%"}
            maxH={"100%"}
            w={"100%"}
            h={"100%"}
            overflow={"hidden"}
            key={model.getDeviceRole() + "-flex-" + node.id}
            flexWrap={"wrap"}
            direction={"row"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "view":
        const view = app.getSharedObject().getView(node.viewId);

        if (!view) {
          return <></>;
        }

        return (
          <Box
            w={"100%"}
            h={"100%"}
            maxW={"100%"}
            maxH={"100%"}
            flexGrow={node.flexGrow ? 1 : 0}
            overflow={"hidden"}
            key={model.getDeviceRole() + "-box-view-" + node.viewId}
            position={"relative"}
            onClick={() => {
              setSelectedNode(node.viewId);
            }}
          >
            <ViewComponent
              key={model.getDeviceRole() + "-view-" + node.viewId}
              view={view}
              role={role}
            />

            <Box
              _hover={{ bg: "rgba(17, 99, 245,0.4)" }}
              bg={
                selectedNode === node.viewId
                  ? "rgba(17, 99, 245,0.4)"
                  : "transparent"
              }
              display={isLayoutOpen ? "block" : "none"}
              w={"100%"}
              h={"100%"}
              position={"absolute"}
              top={0}
              left={0}
              zIndex={200}
            />
          </Box>
        );
      default:
        return <></>;
    }
  };

  return (
    <Box h={"100%"} w={"100%"}>
      {generateWidget(layout.toLayout())}
    </Box>
  );
}
