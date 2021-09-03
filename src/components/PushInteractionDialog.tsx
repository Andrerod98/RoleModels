import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React, { useContext, useRef } from "react";
import { CrossAppState, CrossAppContext } from "../context/AppContext";

export function PushInteractionDialog() {
  const {
    app,
    isPushInteractionOpen,
    setPushInteractionOpen,
    selectedContainerPush,
    setCrossDeviceInteractionOpen,
    role,
  } = useContext<CrossAppState>(CrossAppContext);

  const view = app.getSharedObject().getView(selectedContainerPush.view);
  const from = selectedContainerPush.from;
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={isPushInteractionOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setPushInteractionOpen(false);
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Push Interaction
            </AlertDialogHeader>

            <AlertDialogBody>
              There is a container being pushed coming from the role: {from} do
              you want to accept?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setPushInteractionOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme='green'
                onClick={() => {
                  setPushInteractionOpen(false);
                  setCrossDeviceInteractionOpen(true);
                }}
                ml={3}
              >
                Accept
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
