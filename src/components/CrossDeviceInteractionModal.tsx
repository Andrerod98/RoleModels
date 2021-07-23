import {
  Icon,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useContext, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { QRCodeController } from "../shared-application/components/QRCode";

import { CrossDeviceInteractionChooser } from "./CrossDeviceInteractionChooser";
import { CustomQRReader } from "./CustomQRReader";

interface CrossDeviceInteractionModalProps {
  onViewChange: (nvid: string) => void;
}
export const CrossDeviceInteractionModal: FC<CrossDeviceInteractionModalProps> =
  (props: CrossDeviceInteractionModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { app, setLayoutOpen, setNewViewId, setHeaderOpen } =
      useContext<CrossAppState>(CrossAppContext);

    const [{ view, from }, setState] = useState({
      view: undefined,
      qr: undefined,
      from: "",
    });

    const handleScan = (view: string, qr: string, from: string) => {
      const state = {
        view: undefined,
        qr: undefined,
        from: from,
      };
      if (view != "") {
        state.view = app.getSharedObject().getView(view);
      } else if (qr != "") {
        const qrController = app
          .getSharedObject()
          .getComponentFromAllViews(qr) as QRCodeController;
        if (qrController) {
          qrController.scan();
        }
        onClose();
      }

      setState(state);
    };

    const handleMigrate = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      app.getSharedObject().migrateView(view, from);
      setNewViewId(view.id);
      setLayoutOpen(true);

      props.onViewChange(view.id);
      setHeaderOpen(false);
      onClose();
    };

    const handleMirror = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      //app.mirrorViews(view, view);

      setNewViewId(view.id);
      setLayoutOpen(true);
      props.onViewChange(view.id);
      setHeaderOpen(false);
      onClose();
    };

    const handleStitch = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      //const stitchingCV = app.stitchViews(view.view, view.view);

      //stitchingCV.stitchBottom(app.getMyRole().getName(), view.from);
      onClose();
    };

    return (
      <>
        <IconButton
          aria-label={"Focus"}
          size={"sm"}
          ml={"10px"}
          my={"5px"}
          icon={<Icon as={AiOutlineExpand} />}
          onClick={() => {
            onOpen();
            setState({
              view: undefined,
              qr: undefined,
              from: "",
            });
          }}
        />
        <Modal isOpen={isOpen} onClose={onClose} size={"full"}>
          <ModalOverlay />
          <ModalContent
            m={0}
            bg={"transparent"}
            position={"relative"}
            h={"100%"}
          >
            {view ? (
              <>
                <CrossDeviceInteractionChooser
                  onClose={onClose}
                  onMigrate={handleMigrate}
                  onMirror={handleMirror}
                  onStitch={handleStitch}
                />
                <ModalCloseButton />
              </>
            ) : (
              <CustomQRReader onClose={onClose} onScan={handleScan} />
            )}
          </ModalContent>
        </Modal>
      </>
    );
  };
