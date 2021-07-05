import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { CrossDeviceApplication } from "../../../../shared-application/CrossDeviceApplication";
import { ILayoutNode } from "../../../../shared-application/roles/ILayout";
import { Role } from "../../../../shared-application/roles/Role";
import { ViewComponent } from "../../../../shared-application/views/ViewComponent";

interface PreviewProps {
  layout: ILayoutNode;
  width: string;
  height: string;
  app: CrossDeviceApplication;
  role: Role;
  selectedNode: string;
  isOpenLayoutModal: boolean;
  setSelected: (newSelected: string) => void;
}
export const Preview = (props: PreviewProps) => {
  const generateWidget = (node: ILayoutNode): JSX.Element => {
    switch (node.name) {
      case "div":
        return (
          <Flex
            maxW={"100%"}
            maxH={"100%"}
            w={"100%"}
            h={"100%"}
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
            grow={1}
            direction={"row"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "view":
        const [view, combinedView] = props.app.getViewOrCombinedView(
          props.role.getName(),
          node.viewId
        );

        if (!view && !combinedView) {
          return <></>;
        }

        return (
          <Box
            key={props.app.getMyRole().getName() + "_box_" + node.viewId}
            w={"100%"}
            h={"100%"}
            maxW={"100%"}
            maxH={"100%"}
            position={"relative"}
            onClick={() => {
              if (props.isOpenLayoutModal) {
                props.setSelected(node.viewId);
              }
            }}
          >
            <ViewComponent
              key={props.app.getMyRole().getName() + "_view_" + node.viewId}
              view={view}
              combinedView={combinedView}
              role={props.role}
            />
            <Box
              _hover={
                props.isOpenLayoutModal ? { bg: "rgba(17, 99, 245,0.4)" } : {}
              }
              bg={
                props.selectedNode === node.viewId && props.isOpenLayoutModal
                  ? "rgba(17, 99, 245,0.4)"
                  : "transparent"
              }
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
    <Box h={props.height} w={props.width} overflow={"hidden"}>
      {props.layout ? generateWidget(props.layout) : ""}
    </Box>
  );
};
