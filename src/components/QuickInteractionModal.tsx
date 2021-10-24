import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { Mode } from "../context/Modes";
import { ViewComponent } from "./ViewComponent";

export const QuickInteractionModal = () => {
  const { roleModels, localMode, setLocalMode, role } =
    useContext<CrossAppState>(CrossAppContext);


  if (localMode.mode !== Mode.QuickInteraction) {
    return <></>;
  }

  const { containerID } = localMode.properties;
  const container = roleModels.getContainer(containerID);

  return (
    <Modal
      isOpen={true}
      size={"xl"}
      onClose={() => {
        setLocalMode({ mode: Mode.Default });
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Quick Interaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box h={"70vh"}>
            <ViewComponent view={container} role={role} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
