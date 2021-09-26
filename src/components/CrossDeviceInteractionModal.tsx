import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FC, useContext } from "react";
import { uuid } from "uuidv4";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { ILayoutNode } from "../shared-application/roles/ILayoutNode";

import { CrossDeviceInteractionChooser } from "./CrossDeviceInteractionChooser";

interface CrossDeviceInteractionModalProps {
  onViewChange: (nvid: string) => void;
}
export const CrossDeviceInteractionModal: FC<CrossDeviceInteractionModalProps> =
  (props: CrossDeviceInteractionModalProps) => {
    const {
      app,
      setLayoutOpen,
      setCrossDeviceInteractionOpen,
      isCrossDeviceInteractionOpen,
      selectedContainerPush,
      setQuickInteractionOpen,
      role,
      setNewViewId,
      setSelectedNode,
      setHeaderOpen,
    } = useContext<CrossAppState>(CrossAppContext);

    const view = app.getSharedObject().getView(selectedContainerPush.view);
    const from = selectedContainerPush.from;

    const primaryLayout = app.getSharedObject().getPrimaryConfiguration();
    const currentLayout = app
      .getSharedObject()
      .getCurrentConfigurationOfRole(role.getId());

    console.log({ currentLayoutTest: currentLayout });

    const handleMigrate = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      const view = app.getSharedObject().getView(selectedContainerPush.view);
      const from = selectedContainerPush.from;
      app.getSharedObject().migrateView(view, from);

      console.log(app.getSharedObject().getMyViews());
      const length = app.getSharedObject().getMyViews().length;
      if (length === 0) {
        if (role.getName() === "designer") {
          primaryLayout.update({
            id: uuid(),
            name: "view",
            viewId: view.getId(),
            flexGrow: true,
          } as ILayoutNode);
          setSelectedNode(view.getId());
        } else {
          app
            .getSharedObject()
            .getCurrentConfigurationOfRole(role.getId())
            .update({
              id: uuid(),
              name: "view",
              viewId: view.getId(),
              flexGrow: true,
            } as ILayoutNode);
        }
        setSelectedNode(view.getId());
        console.log(
          app.getSharedObject().getCurrentConfigurationOfRole(role.getId())
        );
      } else {
        setNewViewId(view.getId());
        setLayoutOpen(true);
      }

      props.onViewChange(view.getId());
      setHeaderOpen(false);
      app.getSharedObject().setQRMode(false);
      setCrossDeviceInteractionOpen(false);
    };

    const handleMirror = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      //app.mirrorViews(view, view);

      const length = app.getSharedObject().getMyViews().length;
      if (length === 0) {
        if (role.getName() === "designer") {
          primaryLayout.update({
            id: uuid(),
            name: "view",
            viewId: view.getId(),
            flexGrow: true,
          } as ILayoutNode);
          setSelectedNode(view.getId());
        } else {
          currentLayout.update({
            id: uuid(),
            name: "view",
            viewId: view.getId(),
            flexGrow: true,
          } as ILayoutNode);
          setSelectedNode(view.getId());
        }
      } else {
        setNewViewId(view.getId());
        setLayoutOpen(true);
        setSelectedNode(view.getId());
      }
      props.onViewChange(view.getId());
      setHeaderOpen(false);
      app.getSharedObject().setQRMode(false);
      setCrossDeviceInteractionOpen(false);
    };

    const handleStitch = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      //const stitchingCV = app.stitchViews(view.view, view.view);

      //stitchingCV.stitchBottom(app.getMyRole().getName(), view.from);
      app.getSharedObject().setQRMode(false);
      setCrossDeviceInteractionOpen(false);
    };

    const handleQuickInteraction = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      setQuickInteractionOpen(true);
      setCrossDeviceInteractionOpen(false);
    };

    const handleClose = () => {
      setCrossDeviceInteractionOpen(false);
      app.getSharedObject().setQRMode(false);
    };

    return (
      <Modal
        isOpen={isCrossDeviceInteractionOpen}
        onClose={handleClose}
        size={"full"}
      >
        <ModalOverlay />
        <ModalContent m={0} bg={"transparent"} position={"relative"} h={"100%"}>
          <>
            <CrossDeviceInteractionChooser
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
