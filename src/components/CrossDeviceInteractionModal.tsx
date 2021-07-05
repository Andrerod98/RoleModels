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

import { CrossDeviceInteractionChooser } from "./CrossDeviceInteractionChooser";
import { CustomQRReader } from "./CustomQRReader";

interface CrossDeviceInteractionModalProps {
  onViewChange: (nvid: string) => void;
}
export const CrossDeviceInteractionModal: FC<CrossDeviceInteractionModalProps> =
  (props: CrossDeviceInteractionModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { app, setLayoutOpen, setNewViewId } =
      useContext<CrossAppState>(CrossAppContext);

    const [{ view }, setState] = useState({
      view: undefined,
      combinedView: undefined,
      qr: undefined,
      from: "",
    });

    const handleScan = (
      view: string,
      combinedView: string,
      qr: string,
      from: string
    ) => {
      const state = {
        view: undefined,
        combinedView: undefined,
        qr: undefined,
        from: from,
      };
      if (view != "") {
        console.log(from);
        state.view = app.getRole(from).getView(view);
      } else if (combinedView != "") {
        state.combinedView = app.getCombinedViewWithId(combinedView);
      } else if (qr != "") {
        state.qr = app.getQRCode(qr);
      }

      setState(state);
    };

    const handleMigrate = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      app.grabView(view);
      setNewViewId(view.id);
      setLayoutOpen(true);
      props.onViewChange(view.id);
      onClose();
    };

    const handleMirror = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      app.getMyRole().addView(view);
      app.mirrorViews(view, view);
      setNewViewId(view.id);
      setLayoutOpen(true);
      props.onViewChange(view.id);
      onClose();
    };

    const handleStitch = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      app.getMyRole().addView(view.view);
      const stitchingCV = app.stitchViews(view.view, view.view);

      stitchingCV.stitchBottom(app.getMyRole().getName(), view.from);
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
              combinedView: undefined,
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
