import {
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { BsArrowsFullscreen } from "react-icons/bs";

interface FullScreenPreviewProps {
  children: JSX.Element;
}

export const FullScreenWrapper = (props: FullScreenPreviewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label={"Search database"}
        size={"sm"}
        onClick={onOpen}
        icon={<BsArrowsFullscreen />}
      />
      <Modal onClose={onClose} size={"full"} isOpen={isOpen}>
        <ModalOverlay />

        <ModalContent m={0} w={"100%"} h={"100%"}>
          {props.children}
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </>
  );
};
