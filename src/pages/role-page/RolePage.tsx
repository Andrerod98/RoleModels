import React, { useContext, useMemo } from "react";

import { Box, Flex } from "@chakra-ui/react";
import { QRCodeController } from "../../shared-application/qrcode/QRCodeController";
import { ViewComponent } from "../../shared-application/views/ViewComponent";
import { ILayoutNode } from "../../shared-application/roles/ILayout";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";
interface RoleProps {}

export function RolePage(props: RoleProps) {
  const { app, role, layout, selectedNode, setSelectedNode, isLayoutOpen } =
    useContext<CrossAppState>(CrossAppContext);
  const model = app.getSharedObject();
  //const views = props.app.getViewsOrCombinedViews(props.role.getName());
  const qrs = app.getSharedObject().getMyQrCodes();

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
        const [view, combinedView] = app.getViewOrCombinedView(
          role.getName(),
          node.viewId
        );

        if (!view && !combinedView) {
          return <></>;
        }

        return (
          <Box
            w={"100%"}
            h={"100%"}
            maxW={"100%"}
            maxH={"100%"}
            position={"relative"}
            onClick={() => {
              setSelectedNode(node.viewId);
            }}
          >
            <ViewComponent
              key={model.getDeviceRole() + "_view_" + node.viewId}
              view={view}
              combinedView={combinedView}
              role={role}
            />
            );
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

      {qrs.map((qr: QRCodeController, index: number) => {
        return (
          <Box key={"new_qr" + index} p={5}>
            {qr.generate()}
          </Box>
        );
      })}
    </Box>
  );
}
