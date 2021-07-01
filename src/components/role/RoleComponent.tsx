/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FC } from "react";

import { Header } from "../header/Header";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { QRCodeController } from "../../shared-object/qrcode/QRCodeController";
import { ViewComponent } from "../view/ViewComponent";
import { Role } from "../../shared-object/roles/Role";
import { ILayoutNode } from "../../shared-object/roles/ILayout";
import { LayoutModal } from "../header/LayoutModal";
interface RoleProps {
  readonly app: CrossDeviceApplication;
  readonly role: Role;
}

export const RoleComponent: FC<RoleProps> = (props: RoleProps) => {
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
              setSelectedNode(node.viewId);
            }}
            _hover={{ bg: "rgba(0,0,255,0.1)" }}
            bg={selectedNode === node.viewId ? "blue.400" : "black"}
          >
            <ViewComponent
              key={model.getDeviceRole() + "_view_" + node.viewId}
              view={view}
              combinedView={combinedView}
              role={props.role}
            />
            <Box
              _hover={{ bg: "rgba(0,0,255,0.1)" }}
              display={isOpen ? "block" : "none"}
              w={"100%"}
              h={"100%"}
              position={"absolute"}
              top={0}
              left={0}
              zIndex={200}
              bg={"transparent"}
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

      <Box position={"absolute"} left={0} top={0}>
        <Header
          app={props.app}
          myRole={model.getDeviceRole()}
          roles={Array.from(model.getRoles()).map((role) => role.getName())}
          onManagerClick={async () => {
            model.promoteToManager();
          }}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
          }}
          onDesignClick={() => {
            model.promoteToDesigner();
          }}
          onViewChange={(nvid: string) => {
            setNewViewId(nvid);
            onOpen();
          }}
          onLoggingOpen={() => {}}
        />
      </Box>
      <LayoutModal
        layout={layout}
        newViewId={newViewId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setSelected={(newSelected: string) => {
          setSelectedNode(newSelected);
        }}
        selectedNode={selectedNode}
      />
    </Box>
  );
};
