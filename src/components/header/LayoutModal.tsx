import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineExpand } from "react-icons/ai";
import {
  BiDockTop,
  BiDockLeft,
  BiDockRight,
  BiDockBottom,
  BiSquareRounded,
  BiRectangle,
  BiArrowToTop,
  BiArrowToLeft,
  BiArrowToRight,
  BiArrowToBottom,
} from "react-icons/bi";
import { ILayoutNode } from "../../shared-object/roles/ILayout";
import { uuid } from "uuidv4";
import { LayoutNode } from "../../shared-object/roles/Layout";
interface LayoutModalProps {
  layout: LayoutNode;
  selectedNode: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setSelected: (newSelected: string) => void;
  newViewId: string;
}
export function LayoutModal(props: LayoutModalProps) {
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
              props.layout
                .getChildByID(props.selectedNode)
                .splitExtremeTop(props.newViewId);
              props.setSelected(props.newViewId);
              props.onClose();
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
              props.layout
                .getChildByID(props.selectedNode)
                .splitTop(props.newViewId);
              props.setSelected(props.newViewId);
              props.onClose();
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
              props.layout
                .getChildByID(props.selectedNode)
                .splitExtremeLeft(props.newViewId);
              props.setSelected(props.newViewId);
              props.onClose();
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
              props.layout
                .getChildByID(props.selectedNode)
                .splitLeft(props.newViewId);
              props.setSelected(props.newViewId);
              props.onClose();
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
              props.layout.update({
                name: "view",
                viewId: props.newViewId,
              });
              props.setSelected(props.newViewId);
              props.onClose();
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
              props.layout
                .getChildByID(props.selectedNode)
                .splitRight(props.newViewId);
              props.setSelected(props.newViewId);
              props.onClose();
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
              const id = uuid();
              props.layout
                .getChildByID(props.selectedNode)
                .splitExtremeRight(id);
              props.setSelected(id);
              props.onClose();
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
              props.layout
                .getChildByID(props.selectedNode)
                .splitBottom(props.newViewId);
              props.setSelected(props.newViewId);
              props.onClose();
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
              props.layout
                .getChildByID(props.selectedNode)
                .splitExtremeBottom(props.newViewId);
              props.setSelected(props.newViewId);
              props.onClose();
            }}
            icon={<Icon fontSize={"30px"} as={BiArrowToBottom} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
      </Grid>
    </Box>
  );
}
