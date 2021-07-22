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
import React, { useMemo } from "react";
import { FC } from "react";
// import { UIComponentFactory } from "../components/UIComponentFactory";
import { ImAccessibility, ImQrcode } from "react-icons/im";
import { GiFastArrow } from "react-icons/gi";
import { Role } from "../roles/Role";
import { View } from "./View";
const QRCode = require("qrcode.react");

interface ViewComponentProps {
  view: View;
  role: Role;
  onBroadcast?: (viewId: string, from: string) => void;
}

export const ViewComponent: FC<ViewComponentProps> = (
  props: ViewComponentProps
) => {
  let qrUrl = "view/" + props.view.getId() + "#from=" + props.role.getId();

  return (
    <Box
      w={"100%"}
      h={"100%"}
      borderWidth={"2px"}
      borderColor={"black"}
      position={"relative"}
      key={"view-" + props.view.getId()}
    >
      {useMemo(() => {
        return props.view.getRoot().generateWidget();
      }, [JSON.stringify(props.view.getRoot().getSnapshot())])}
      <Box position={"absolute"} top={"0px"} right={"0px"}>
        <IconButton
          size={"sm"}
          aria-label={"QRCode"}
          onClick={() => {
            props.onBroadcast(props.view.getId(), props.role.getName());
          }}
          icon={<Icon as={GiFastArrow} />}
        />
        <Popover>
          <PopoverTrigger>
            <IconButton
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
