/* eslint-disable no-undef */
import {
  Box,
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
import { StitchingCombinedView } from "../combined-views/stitching-combined-view/StitchingCombinedView";

const QRCode = require("qrcode.react");

interface ViewHeaderProps {
  qrURL: string;
  onUnlink?: () => void;
  stitchingCombinedView?: StitchingCombinedView;
}

export const ViewHeader = (props: ViewHeaderProps) => {
  return (
    <Flex position={"absolute"} top={"0px"} right={"0px"}>
      <IconButton
        w={"40px"}
        mx={"5px"}
        display={props.onUnlink === undefined ? "none" : "box"}
        aria-label={"QRCode"}
        onClick={props.onUnlink}
        icon={<Icon as={GrUnlink} />}
      />

      <Box display={props.stitchingCombinedView === undefined ? "none" : "box"}>
        {props.stitchingCombinedView === undefined ? <></> : <></>}
      </Box>

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
