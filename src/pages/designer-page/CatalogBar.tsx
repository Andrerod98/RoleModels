/* eslint-disable @typescript-eslint/no-empty-interface */
import { Box, Button, Heading, Spacer, VStack } from "@chakra-ui/react";
import React, { useContext } from "react";

import { CrossAppState, CrossAppContext } from "../../context/AppContext";

interface SingleTabCatalogBarProps {
  onClick: (element: string) => void;
}

export const SingleTabCatalogBar: React.FC<SingleTabCatalogBarProps> = (
  props: SingleTabCatalogBarProps
) => {
  /*const layout = [
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
  ];*/
  const { roleModels } = useContext<CrossAppState>(CrossAppContext);
  const factories = Array.from(roleModels.getFactories());
  return (
    <Box px={"10px"} py={3} h={"100%"} w={"200px"} overflowY={"scroll"}>
      <Heading as={"h5"} fontSize={"12px"} textAlign={"left"} mb={"5px"}>
        COMPONENTS
      </Heading>
      <VStack spacing={2}>
        {factories.map((factory, index) => {
          return (
            <Button
              key={"component-" + index}
              size={"xs"}
              isFullWidth
              onClick={() => props.onClick(factory.name)}
            >
              {factory.icon}
              <Box ml={4}>
                {factory.name.charAt(0).toUpperCase() + factory.name.slice(1)}
              </Box>
              <Spacer></Spacer>
            </Button>
          );
        })}
      </VStack>
      {/*<Accordion defaultIndex={[0]} allowMultiple>
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
            </Accordion>*/}
    </Box>
  );
};
