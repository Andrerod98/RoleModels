import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { uuid } from "uuidv4";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { Mode } from "../context/Modes";
import { ILayoutNode } from "../shared-application/workspaces/ILayoutNode";

import { ContainerTransferActionChooser } from "./ContainerTransferActionChooser";

export const ContainerTransferActionModal = () => {
  const { roleModels, role, localMode, setLocalMode, mode, setSelectedNode } =
    useContext<CrossAppState>(CrossAppContext);

  let containerID = "";
  let from = "";

  if (
    (localMode.mode !== Mode.ContainerTransfer &&
      mode.mode !== Mode.CopyPaste) ||
    localMode.mode === Mode.CopyPaste
  ) {
    return <></>;
  } else {
    if (localMode.mode === Mode.ContainerTransfer) {
      containerID = localMode.properties.containerID;
      from = localMode.properties.from;
    } else {
      containerID = mode.properties.containerID;
      from = mode.properties.from;
    }
  }

  const container = roleModels.getContainer(containerID);
  const currentLayout = roleModels.getCurrentLayoutOfRole(role.getId());

  const handleMigrate = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    roleModels.removeContainerFromRole(container, from);

    const length = roleModels.getMyContainers().length;
    if (length === 0) {
      roleModels.getCurrentLayoutOfRole(role.getId()).replace({
        id: uuid(),
        name: "view",
        viewId: container.getId(),
        flexGrow: true,
      } as ILayoutNode);

      setSelectedNode(container.getId());
      roleModels.setMode(Mode.Default);
      setLocalMode({ mode: Mode.Default });
    } else {
      roleModels.setMode(Mode.Default);
      setLocalMode({
        mode: Mode.ContainerPosition,
        properties: { containerID: container.getId() },
      });
    }
  };

  const handleMirror = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    //app.mirrorViews(view, view);

    const length = roleModels.getMyContainers().length;
    if (length === 0) {
      currentLayout.replace({
        id: uuid(),
        name: "view",
        viewId: container.getId(),
        flexGrow: true,
      } as ILayoutNode);
      setSelectedNode(container.getId());
      roleModels.setMode(Mode.Default);
      setLocalMode({ mode: Mode.Default });
    } else {
      roleModels.setMode(Mode.Default);
      setLocalMode({
        mode: Mode.ContainerPosition,
        properties: { containerID: container.getId() },
      });
    }
  };

  const handleStitch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    //const stitchingCV = app.stitchViews(view.view, view.view);

    //stitchingCV.stitchBottom(app.getMyRole().getName(), view.from);
    roleModels.setMode(Mode.Default);
  };

  const handleQuickInteraction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    roleModels.setMode(Mode.Default);
    setLocalMode({
      mode: Mode.QuickInteraction,
      properties: { containerID: container.getId(), from },
    });

    e.stopPropagation();
    //setOpen({ ...isOpen, q: true });
  };

  const handleClose = () => {
    roleModels.setMode(Mode.Default);
    setLocalMode({ mode: Mode.Default });
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
