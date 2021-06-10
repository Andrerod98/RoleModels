import { Center, Divider, HStack, Icon, IconButton } from "@chakra-ui/react";
import React from "react";
import { BiZoomIn, BiZoomOut, BiWindow } from "react-icons/bi";
import { ImQrcode } from "react-icons/im";

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onAddQr: () => void;
}

export const ToolBar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
  return (
    <HStack spacing={"5px"} w={"100%"} h={"40px"} px={"20px"}>
      <IconButton
        size={"sm"}
        onClick={props.onZoomIn}
        aria-label={"Zoom In"}
        icon={<Icon as={BiZoomIn} />}
      />
      <IconButton
        size={"sm"}
        onClick={props.onZoomOut}
        aria-label={"Zoom Out"}
        icon={<Icon as={BiZoomOut} />}
      />
      <IconButton
        size={"sm"}
        onClick={props.onZoomToFit}
        aria-label={"Zoom To Fit"}
        icon={<Icon as={BiWindow} />}
      />
      <Center height={"20px"}>
        <Divider color={"black"} orientation={"vertical"} />
      </Center>
      <IconButton
        size={"sm"}
        onClick={props.onAddQr}
        aria-label={"Zoom To Fit"}
        icon={<Icon as={ImQrcode} />}
      />
    </HStack>
  );
};
