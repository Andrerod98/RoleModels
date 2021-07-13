import { Box, Grid, GridItem, Icon, IconButton } from "@chakra-ui/react";
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
import { uuid } from "uuidv4";
import { ILayoutNode } from "../shared-application/roles/ILayout";
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
}
export function LayoutModal(props: LayoutModalProps) {
  console.log(
    props.layout ? props.layout.getChildByViewId(props.selectedNode) : ""
  );
  return (
    <Box
      m={0}
      bg={"transparent"}
      position={"absolute"}
      top={0}
      left={20}
      h={"100vh"}
      w={"20vw"}
      zIndex={1000}
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
        left={"0"}
        right={"0"}
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
          <IconButton
            aria-label={"Focus"}
            size={"lg"}
            mx={"5px"}
            my={"5px"}
            isDisabled={props.selectedNode !== ""}
            onClick={() => {
              props.onButtonClick("C");
            }}
            icon={<Icon fontSize={"30px"} as={BiRectangle} />}
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
