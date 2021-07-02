import {
  Icon,
  IconButton,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import { CrossDeviceApplication } from "../shared-application/CrossDeviceApplication";

import { CrossDeviceInteractionChooser } from "./CrossDeviceInteractionChooser";
import { CustomQRReader } from "./CustomQRReader";

interface CrossDeviceInteractionModalProps {
  app: CrossDeviceApplication;
  onViewChange: (nvid: string) => void;
}
export const CrossDeviceInteractionModal: FC<CrossDeviceInteractionModalProps> =
  (props: CrossDeviceInteractionModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [{ view, combinedView, qr, from }, setState] = useState({
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
        state.view = props.app.getRole(from).getView(view);
      } else if (combinedView != "") {
        state.combinedView = props.app.getCombinedViewWithId(combinedView);
      } else if (qr != "") {
        state.qr = props.app.getQRCode(qr);
      }

      setState(state);
    };

    const handleMigrate = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      props.app.grabView(view);
      props.onViewChange(view.id);
      onClose();
    };

    const handleMirror = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      props.app.getMyRole().addView(view);
      props.app.mirrorViews(view, view);
      props.onViewChange(view.id);
      onClose();
    };

    const handleStitch = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      side: string
    ) => {
      e.stopPropagation();
      props.app.getMyRole().addView(view.view);
      const stitchingCV = props.app.stitchViews(view.view, view.view);

      stitchingCV.stitchBottom(props.app.getMyRole().getName(), view.from);
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
