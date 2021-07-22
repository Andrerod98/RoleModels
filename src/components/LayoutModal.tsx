import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import {
  BiDockTop,
  BiDockLeft,
  BiDockRight,
  BiDockBottom,
  BiRectangle,
  BiArrowToTop,
  BiArrowToLeft,
  BiArrowToRight,
  BiArrowToBottom,
} from "react-icons/bi";
import { LayoutNode } from "../shared-application/roles/Layout";
interface LayoutModalProps {
  layout: LayoutNode;
  selectedNode: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setSelected: (newSelected: string) => void;
  onButtonClick: (buttonName: string) => void;
  newViewId: string;
  isDesigner: boolean;
}
export function LayoutModal(props: LayoutModalProps) {
  
  return (
    <Box
      bg={"blackAlpha.600"}
      position={"absolute"}
      top={0}
      left={0}
      right={props.isDesigner ? undefined : 0}
      bottom={props.isDesigner ? undefined : 0}
      marginLeft={"auto"}
      marginRight={"auto"}
      marginTop={"auto"}
      marginBottom={"auto"}
      h={props.isDesigner ? "100vh" : "305px"}
      w={props.isDesigner ? "100vw" : "305px"}
      zIndex={500}
      display={props.isOpen ? "block" : "none"}
    >
      <Grid
        h={"300px"}
        w={"300px"}
        position={"absolute"}
        marginLeft={"auto"}
        marginRight={"auto"}
        marginTop={"auto"}
        marginBottom={"auto"}
        left={props.isDesigner ? undefined : "0"}
        right={props.isDesigner ? "10" : "0"}
        top={"0"}
        bottom={"0"}
        templateRows='repeat(5, 1fr)'
        templateColumns='repeat(5, 1fr)'
        gap={1}
      >
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("ET");
            }}
            my={"5px"}
            icon={<Icon fontSize={"30px"} as={BiArrowToTop} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("T");
            }}
            icon={<Icon fontSize={"30px"} as={BiDockTop} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("EL");
            }}
            icon={<Icon fontSize={"30px"} as={BiArrowToLeft} />}
          />{" "}
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("L");
            }}
            icon={<Icon fontSize={"30px"} as={BiDockLeft} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <Button
            aria-label={"Focus"}
            mx={"4px"}
            my={"5px"}
            fontSize={"10px"}
            width={"50px"}
            height={"50px"}
            onClick={() => {
              props.onButtonClick("C");
            }}
            icon={<Icon fontSize={"30px"} as={BiRectangle} />}
          >
            Replace
          </Button>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("R");
            }}
            icon={<Icon fontSize={"30px"} as={BiDockRight} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("ER");
            }}
            icon={<Icon fontSize={"30px"} as={BiArrowToRight} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("B");
            }}
            icon={<Icon fontSize={"30px"} as={BiDockBottom} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='gray.400'>
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode === ""}
            onClick={() => {
              props.onButtonClick("EB");
            }}
            icon={<Icon fontSize={"30px"} as={BiArrowToBottom} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
      </Grid>
    </Box>
  );
}
