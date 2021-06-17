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
import React, { useEffect } from "react";
import { FC } from "react";
// import { UIComponentFactory } from "../components/UIComponentFactory";
import { ImQrcode } from "react-icons/im";
import { View } from "./View";
const QRCode = require("qrcode.react");

interface ViewComponentProps {
  qrUrl: string;
  view: View;
  x?: number;
  y?: number;
}

export const ViewComponent: FC<ViewComponentProps> = (
  props: ViewComponentProps
) => {
  // if (cv === undefined || ui === undefined) return <div></div>;

  useEffect(() => {
    // Add event listeners
    // props.cvm.removeEventListeners();
    //   props.view.addEventListeners();
  }, []);
  // const uiComponentFactory = new UIComponentFactory();
  console.log(props.view.getRoot());
  return (
    <Box
      // ref={drop}
      // key={props.view.g}
      w={"100%"}
      h={"100%"}
      boxShadow={"xl"}
      bg={"white"}
      position={"relative"}

      // top={y + "px"}
      // left={x + "px"}

      /* style={{
        width: cv.width + "px",
        height: cv.height + "px",
         position: "absolute",
         padding: "0px",
        overflow: "hidden",
        top: cv.y + "px",
        left: cv.x + "px",
      }}*/
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
                  <QRCode value={props.qrUrl} />
                </Center>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>
    </Box>
  );
};
