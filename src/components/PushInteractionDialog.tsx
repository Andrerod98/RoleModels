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
import { Mode } from "../context/Modes";

export function PushInteractionDialog() {
  const cancelRef = useRef();
  const { roleModels, mode, role, setLocalMode } =
    useContext<CrossAppState>(CrossAppContext);

  if (mode.mode !== Mode.Push) {
    return <></>;
  }

  const { containerID, from } = mode.properties;

  if (from === role.getId()) {
    return <></>;
  }
  //const container = app.getSharedObject().getContainer(containerID);

  const onClose = () => {
    roleModels.setMode(Mode.Default);
  };

  const roleName = roleModels.getRole(from).getName();

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
              There is a container being pushed coming from the {roleName} do
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
                  roleModels.setMode(Mode.Default);
                  setLocalMode({
                    mode: Mode.ContainerTransfer,
                    properties: { containerID, from },
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
