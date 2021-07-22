import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { ViewComponent } from "../shared-application/views/ViewComponent";

export function QuickInteractionModal() {
  const cancelRef = React.useRef();

  const [isAccepted, setAccepted] = React.useState(false);

  const {
    app,
    isQuickInteractionOpen,
    setQuickInteractionOpen,
    quickInteraction,
  } = useContext<CrossAppState>(CrossAppContext);
  const model = app.getSharedObject();

  const view = model.getView(quickInteraction.viewId);
  const role = model.getRoleByName(quickInteraction.from);
  return (
    <>
      <AlertDialog
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
                  setAccepted(true);
                }}
                ml={3}
              >
                Accept
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal
        isOpen={isAccepted}
        onClose={() => {
          setAccepted(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quick Interaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ViewComponent view={view} role={role} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => {
                setAccepted(false);
              }}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
