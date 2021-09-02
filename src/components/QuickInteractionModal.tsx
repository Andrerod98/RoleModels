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
      {/* <AlertDialog
        isOpen={isQuickInteractionOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setQuickInteractionOpen(false);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Quick Interaction
            </AlertDialogHeader>

            <AlertDialogBody>
              There is an interaction request coming from the role X do you want
              to accept?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setQuickInteractionOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme='green'
                onClick={() => {
                  setQuickInteractionOpen(false);
                  setCrossDeviceInteractionOpen(true);
                }}
                ml={3}
              >
                Accept
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
              </AlertDialog> */}
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
