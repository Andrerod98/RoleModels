import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useState } from "react";
import { CrossAppState, CrossAppContext } from "../context/AppContext";

export const WorkspaceCreationDialog = () => {
  const { roleModels, isOpen, setOpen } =
    useContext<CrossAppState>(CrossAppContext);

  if (!isOpen.saveWorkspaceModal) {
    return <></>;
  }

  const cancelRef = React.useRef();
  const toast = useToast();
  const [value, setValue] = useState("");
  const handleChange = (event) => setValue(event.target.value);

  const handleClose = () => {
    setOpen({ ...isOpen, saveWorkspaceModal: false });
  };
  return (
    <AlertDialog
      isOpen={true}
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Save Workspace
          </AlertDialogHeader>

          <AlertDialogBody>
            Choose a name for the workspace:
            <Input
              value={value}
              onChange={handleChange}
              placeholder='Workspace name'
            />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme='green'
              onClick={() => {
                toast({
                  title: "Workspace saved.",
                  position: "top",
                  description: "The workspace has been saved.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
                roleModels.saveWorkspace(value);
                handleClose();
              }}
              ml={3}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
