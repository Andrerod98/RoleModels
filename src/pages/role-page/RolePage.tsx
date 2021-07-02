/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FC } from "react";

import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { CrossDeviceApplication } from "../../shared-application/CrossDeviceApplication";
import { QRCodeController } from "../../shared-application/qrcode/QRCodeController";
import { ViewComponent } from "../../shared-application/views/ViewComponent";
import { Role } from "../../shared-application/roles/Role";
import { ILayoutNode } from "../../shared-application/roles/ILayout";
import { LayoutModal } from "../../components/LayoutModal";
interface RoleProps {
  readonly app: CrossDeviceApplication;
  readonly role: Role;
}

export const RolePage: FC<RoleProps> = (props: RoleProps) => {
  const model = props.app.getSharedObject();
  //const views = props.app.getViewsOrCombinedViews(props.role.getName());
  const qrs = props.app.getSharedObject().getMyQrCodes();
  const layout = props.app
    .getSharedObject()
    .getCurrentConfigurationOfRole(props.role.getName());
  const [selectedNode, setSelectedNode] = useState("");
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
              role={props.role}
            />
            <Box
              _hover={{ bg: "rgba(17, 99, 245,0.4)" }}
              bg={
                selectedNode === node.viewId
                  ? "rgba(17, 99, 245,0.4)"
                  : "transparent"
              }
              display={isOpen ? "block" : "none"}
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newViewId, setNewViewId] = useState("");
  return (
    <Box h={"100%"} w={"100%"}>
      {generateWidget(layout.getSnapshot())}

      {qrs.map((qr: QRCodeController, index: number) => {
        return (
          <Box key={"new_qr" + index} p={5}>
            {qr.generate()}
          </Box>
        );
      })}
    </Box>
  );
};
