import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { CrossDeviceApplication } from "../../../../CrossDeviceApplication";
import { ILayoutNode } from "../../../../shared-object/roles/ILayout";
import { LayoutNode } from "../../../../shared-object/roles/Layout";
import { Role } from "../../../../shared-object/roles/Role";
import { View } from "../../../../shared-object/views/View";
import { ViewComponent } from "../../../view/ViewComponent";

interface ItemView {
  id: string;
  view: View;
}
interface PreviewProps {
  layout: LayoutNode;
  width: string;
  height: string;
  app: CrossDeviceApplication;
  role: Role;
  selectedNode: string;
  isOpenLayoutModal: boolean;
  setSelected: (newSelected: string) => void;
  onItemChange: (item: ItemView, rows: number, cols: number) => void;
  onItemDelete: (item: ItemView) => void;
  onItemMove: (fromId: number, toId: number) => void;
}
export const Preview = (props: PreviewProps) => {
  const generateWidget = (node: ILayoutNode): JSX.Element => {
    switch (node.name) {
      case "div":
        return (
          <Flex w={"100%"} h={"100%"} mx={"5px"} direction={"column"}>
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "flex":
        return (
          <Flex w={"100%"} h={"100%"} grow={1} my={"5px"} direction={"row"}>
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

        return (
          <Box
            w={"100%"}
            h={"100%"}
            m={"5px"}
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
                props.isOpenLayoutModal ? { bg: "rgba(0,0,255,0.1)" } : {}
              }
              bg={
                props.selectedNode === node.viewId && props.isOpenLayoutModal
                  ? "blue.400"
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
