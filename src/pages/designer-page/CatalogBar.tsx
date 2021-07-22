/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  BiImage,
  BiLink,
  BiListUl,
  BiMapAlt,
  BiRectangle,
  BiRadioCircleMarked,
  BiCheckboxChecked,
  BiSliderAlt,
} from "react-icons/bi";
import { CgDisplaySpacing } from "react-icons/cg";
import { HiViewGridAdd, HiPencilAlt } from "react-icons/hi";
import {
  RiInputMethodLine,
  RiLayoutColumnLine,
  RiLayoutRowLine,
  RiStackFill,
} from "react-icons/ri";

import { BsArrowsAngleContract, BsFillGrid3X3GapFill } from "react-icons/bs";
import { IoTextOutline } from "react-icons/io5";
import { ImQrcode } from "react-icons/im";

interface SingleTabCatalogBarProps {
  onClick: (element: string) => void;
}

export const SingleTabCatalogBar: React.FC<SingleTabCatalogBarProps> = (
  props: SingleTabCatalogBarProps
) => {
  const layout = [

    { title: "Box", value: "box", icon: <BiRectangle /> },
    { title: "Flex", value: "flex", icon: <RiLayoutRowLine /> },
    { title: "Column", value: "column", icon: <RiLayoutColumnLine /> },
    { title: "Center", value: "center", icon: <BsArrowsAngleContract /> },
    { title: "Stack", value: "stack", icon: <RiStackFill /> },
    { title: "Grid", value: "grid", icon: <BsFillGrid3X3GapFill /> },
    { title: "Spacer", value: "spacer", icon: <CgDisplaySpacing /> },
  ];

  const components = [
    { title: "Button", value: "button", icon: <BiRectangle /> },
    { title: "Checkbox", value: "checkbox", icon: <BiCheckboxChecked /> },
    { title: "Slider", value: "slider", icon: <BiSliderAlt /> },
    { title: "Editable", value: "editable", icon: <RiInputMethodLine /> },
    { title: "Label", value: "label", icon: <IoTextOutline /> },
    { title: "Image", value: "image", icon: <BiImage /> },
    { title: "Input", value: "input", icon: <RiInputMethodLine /> },
    { title: "List", value: "list", icon: <BiListUl /> },
    { title: "Link", value: "link", icon: <BiLink /> },
    { title: "Map", value: "map", icon: <BiMapAlt /> },
    { title: "Radio", value: "radio", icon: <BiRadioCircleMarked /> },
    { title: "Ink canvas", value: "ink", icon: <HiPencilAlt /> },
    { title: "QR Code", value: "qrcode", icon: <ImQrcode /> },
  ];
  return (
    <Box px={"10px"} py={8} h={"100%"} w={"200px"} overflowY={"scroll"}>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <AccordionButton>
            <Heading as={"h5"} fontSize={"12px"} textAlign={"left"} mb={"5px"}>
              LAYOUT
            </Heading>
            <Spacer />
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <VStack spacing={2}>
              {layout.map((c, index) => {
                return (
                  <Button
                    key={"component-" + index}
                    size={"xs"}
                    isFullWidth
                    onClick={() => props.onClick(c.value)}
                  >
                    {c.icon}
                    <Box ml={4}>{c.title}</Box>
                    <Spacer></Spacer>
                  </Button>
                );
              })}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Heading as={"h5"} fontSize={"12px"} textAlign={"left"} mb={"5px"}>
              UI COMPONENTS
            </Heading>
            <Spacer />
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <VStack spacing={2}>
              {components.map((c, index) => {
                return (
                  <Button
                    key={"component-" + index}
                    size={"xs"}
                    isFullWidth
                    onClick={() => props.onClick(c.value)}
                  >
                    {c.icon}
                    <Box ml={4}>{c.title}</Box>
                    <Spacer></Spacer>
                  </Button>
                );
              })}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
