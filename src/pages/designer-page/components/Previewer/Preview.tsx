import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { CrossDeviceApplication } from "../../../../shared-application/CrossDeviceApplication";
import { ILayoutNode } from "../../../../shared-application/roles/ILayoutNode";
import { ViewComponent } from "../../../../shared-application/views/ViewComponent";

interface PreviewProps {
  layout: ILayoutNode;
  width: string;
  height: string;
  app: CrossDeviceApplication;

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
            overflow={"hidden"}
            key={
              props.app.getSharedObject().getMyRole().getName() +
              "-div-" +
              node.id
            }
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
            grow={1}
            key={
              props.app.getSharedObject().getMyRole().getName() +
              "-flex-" +
              node.id
            }
            direction={"row"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "view":
        const view = props.app.getSharedObject().getView(node.viewId);

        if (!view) {
          return <></>;
        }

        return (
          <Box
            key={
              props.app.getSharedObject().getMyRole().getName() +
              "-box-" +
              node.viewId
            }
            w={"100%"}
            h={"100%"}
            maxW={"100%"}
            maxH={"100%"}
            overflow={"hidden"}
            position={"relative"}
            onClick={() => {
              if (props.isOpenLayoutModal) {
                props.setSelected(node.viewId);
              }
            }}
          >
            <ViewComponent
              key={
                props.app.getSharedObject().getMyRole().getName() +
                "-preview-view-" +
                node.viewId
              }
              view={view}
              role={props.app.getSharedObject().getMyRole()}
            />
            <Box
              _hover={
                props.isOpenLayoutModal ? { bg: "rgba(17, 99, 245,0.4)" } : {}
              }
              display={
                props.isOpenLayoutModal && props.selectedNode !== node.viewId
                  ? "block"
                  : "none"
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
