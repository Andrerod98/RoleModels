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
  const { roleModels, localMode, setLocalMode } =
    useContext<CrossAppState>(CrossAppContext);

  if (localMode.mode !== "IncomingContainer") {
    return <></>;
  }

  const { containerID, from } = localMode.properties;
  //const container = app.getSharedObject().getContainer(containerID);
  const cancelRef = useRef();

  const onClose = () => {
    setLocalMode({ mode: "" });
  };

  return (
    <>
      <AlertDialog
        isOpen={true}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
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
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='green'
                onClick={() => {
                  onClose();
                  roleModels.setMode("");
                  setLocalMode("ContainerTransfer", {
                    containerID: containerID,
                    from: from,
                  });
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
