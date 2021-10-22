import {
  Icon,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useContext } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { QRCodeController } from "../shared-components/QRCode";

import { CustomQRReader } from "./CustomQRReader";

interface CrossDeviceInteractionModalProps {}
export const QRReaderModal: FC<CrossDeviceInteractionModalProps> = (
  props: CrossDeviceInteractionModalProps
) => {
  const { roleModels, mode, setLocalMode } =
    useContext<CrossAppState>(CrossAppContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCloseModal = () => {
    roleModels.setMode("");
    onClose();
  };

  const handleScan = (containerID: string, qr: string, from: string) => {
    if (containerID != "") {
      setLocalMode({
        mode: "ContainerTransfer",
        properties: { containerID: containerID, from: from },
      });
      onCloseModal();
    } else if (qr != "") {
      const qrController = roleModels.getComponentFromAllViews(
        qr
      ) as QRCodeController;
      if (qrController) {
        qrController.scan();
      }
      onCloseModal();
    }
  };

  return (
    <>
      <IconButton
        aria-label={"Focus"}
        size={"sm"}
        ml={"10px"}
        my={"5px"}
        color={"white"}
        _hover={{ color: "white", bg: "black" }}
        _focus={{ color: "white", bg: "black" }}
        borderRadius={"5px"}
        borderColor={"gray.600"}
        bg={mode.mode === "PULL" ? "black" : "transparent"}
        icon={<Icon as={AiOutlineExpand} />}
        onClick={() => {
          roleModels.setMode("PULL");
          onOpen();
        }}
      />
      <Modal isOpen={isOpen} onClose={onCloseModal} size={"full"}>
        <ModalOverlay />
        <ModalContent m={0} bg={"transparent"} position={"relative"} h={"100%"}>
          <CustomQRReader onClose={onCloseModal} onScan={handleScan} />
        </ModalContent>
      </Modal>
    </>
  );
};
