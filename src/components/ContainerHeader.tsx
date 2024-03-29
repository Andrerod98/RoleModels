/* eslint-disable no-undef */
import {
  Center,
  Flex,
  Icon,
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
import { GrUnlink } from "react-icons/gr";
import { ImQrcode } from "react-icons/im";

const QRCode = require("qrcode.react");

interface ViewHeaderProps {
  qrURL: string;
  onBroadcast?: () => void;
}

export const ContainerHeader = (props: ViewHeaderProps) => {
  return (
    <Flex position={"absolute"} top={"0px"} right={"0px"}>
      <IconButton
        w={"40px"}
        mx={"5px"}
        aria-label={"QRCode"}
        onClick={props.onBroadcast}
        icon={<Icon as={GrUnlink} />}
      />

      <Popover>
        <PopoverTrigger>
          <IconButton
            w={"40px"}
            mx={"5px"}
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
                <QRCode value={props.qrURL} />
              </Center>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};
