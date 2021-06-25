import { Icon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import React from "react";
import { FC } from "react";
// import { UIComponentFactory } from "../components/UIComponentFactory";
import { ImQrcode } from "react-icons/im";
import { CombinedView } from "../../shared-object/combined-views/combined-view";
import { Role } from "../../shared-object/roles/Role";
import { View } from "../../shared-object/views/View";
const QRCode = require("qrcode.react");

interface ViewComponentProps {
  view: View;
  combinedView: CombinedView;
  role: Role;
}

export const ViewComponent: FC<ViewComponentProps> = (
  props: ViewComponentProps
) => {
  let qrUrl = "";
  if (props.view.isCombined() && props.combinedView !== null) {
    // Get combined view of view
    qrUrl = "combined/view/" + props.combinedView.getId();
  } else {
    qrUrl = "view/" + props.view.getId() + "#from=" + props.role.getName();
  }

  return (
    <Box
      w={"100%"}
      h={"100%"}
      boxShadow={"xl"}
      bg={"white"}
      position={"relative"}
    >
      {props.view.getRoot().generateWidget()}
      <Box position={"absolute"} top={"0px"} right={"0px"}>
        <Popover>
          <PopoverTrigger>
            <IconButton
              mx={"5px"}
              size={"sm"}
              aria-label={"QRCode"}
              icon={<Icon as={ImQrcode} />}
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>QRCode</PopoverHeader>
              <PopoverBody>
                <Center>
                  <QRCode value={qrUrl} />
                </Center>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>
    </Box>
  );
};
