import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { ViewComponent } from "../shared-application/views/ViewComponent";

export function QuickInteractionModal() {
  const {
    app,
    isQuickInteractionOpen,
    setQuickInteractionOpen,
    selectedContainerPush,
    role,
  } = useContext<CrossAppState>(CrossAppContext);

  const view = app.getSharedObject().getView(selectedContainerPush.view);

  return (
    <>
  
      <Modal
        isOpen={isQuickInteractionOpen}
        onClose={() => {
          setQuickInteractionOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quick Interaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ViewComponent view={view} role={role} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
