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
  const {
    app,
    setCrossDeviceInteractionOpen,
    setSelectedContainerPush,

    isQRMode,
  } = useContext<CrossAppState>(CrossAppContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleScan = (view: string, qr: string, from: string) => {
    if (view != "") {
      setSelectedContainerPush({ view: view, from: from });
      setCrossDeviceInteractionOpen(true);
      onClose();
    } else if (qr != "") {
      const qrController = app
        .getSharedObject()
        .getComponentFromAllViews(qr) as QRCodeController;
      if (qrController) {
        qrController.scan();
      }
      onClose();
    }
  };

  return (
    <>
      <IconButton
        aria-label={"Focus"}
        size={"sm"}
        ml={"10px"}
        my={"5px"}
        colorScheme={isQRMode ? undefined : "blue"}
        icon={<Icon as={AiOutlineExpand} />}
        onClick={() => {
          app.getSharedObject().setQRMode(true);
          onOpen();
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
        <ModalOverlay />
        <ModalContent m={0} bg={"transparent"} position={"relative"} h={"100%"}>
          <CustomQRReader onClose={onClose} onScan={handleScan} />
        </ModalContent>
      </Modal>
    </>
  );
};
