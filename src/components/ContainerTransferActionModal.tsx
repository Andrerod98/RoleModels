import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { uuid } from "uuidv4";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { ILayoutNode } from "../shared-application/workspaces/ILayoutNode";

import { ContainerTransferActionChooser } from "./ContainerTransferActionChooser";

export const ContainerTransferActionModal = () => {
  const {
    roleModels,
    role,
    localMode,
    setLocalMode,
    setOpen,
    isOpen,
    setSelectedNode,
  } = useContext<CrossAppState>(CrossAppContext);

  if (localMode.mode !== "ContainerTransfer") {
    return <></>;
  }

  const { containerID, from } = localMode.properties;
  const container = roleModels.getContainer(containerID);
  const currentLayout = roleModels.getCurrentConfigurationOfRole(role.getId());

  const handleMigrate = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    roleModels.migrateView(container, from);

    const length = roleModels.getMyContainers().length;
    if (length === 0) {
      roleModels.getCurrentConfigurationOfRole(role.getId()).update({
        id: uuid(),
        name: "view",
        viewId: container.getId(),
        flexGrow: true,
      } as ILayoutNode);

      setSelectedNode(container.getId());
    } else {
      setLocalMode({
        mode: "ContainerPosition",
        properties: { containerID: container.getId() },
      });
    }

    roleModels.setMode("");
  };

  const handleMirror = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    //app.mirrorViews(view, view);

    const length = roleModels.getMyContainers().length;
    if (length === 0) {
      currentLayout.update({
        id: uuid(),
        name: "view",
        viewId: container.getId(),
        flexGrow: true,
      } as ILayoutNode);
      setSelectedNode(container.getId());
    } else {
      setLocalMode({
        mode: "ContainerPosition",
        properties: { containerID: container.getId() },
      });
    }

    roleModels.setMode("");
  };

  const handleStitch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    //const stitchingCV = app.stitchViews(view.view, view.view);

    //stitchingCV.stitchBottom(app.getMyRole().getName(), view.from);
    roleModels.setMode("");
  };

  const handleQuickInteraction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpen({ ...isOpen, q: true });
    setLocalMode({ mode: "QuickInteraction" });
  };

  const handleClose = () => {
    roleModels.setMode("");
    setLocalMode({ mode: "" });
  };

  return (
    <Modal isOpen={true} onClose={handleClose} size={"full"}>
      <ModalOverlay />
      <ModalContent m={0} bg={"transparent"} position={"relative"} h={"100%"}>
        <>
          <ContainerTransferActionChooser
            onClose={handleClose}
            onMigrate={handleMigrate}
            onMirror={handleMirror}
            onStitch={handleStitch}
            onQuickInteraction={handleQuickInteraction}
          />
          <ModalCloseButton />
        </>
      </ModalContent>
    </Modal>
  );
};
