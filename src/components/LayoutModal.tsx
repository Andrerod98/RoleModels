import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Switch,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
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
import {
  RiLayoutBottomLine,
  RiLayoutLeftLine,
  RiLayoutRightLine,
  RiLayoutTopLine,
} from "react-icons/ri";
import { uuid } from "uuidv4";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { ILayoutNode } from "../shared-application/roles/ILayoutNode";
interface LayoutModalProps {
  isOpen: boolean;
  setSelected: (newSelected: string) => void;
  onButtonClick: (buttonName: string) => void;
}
export function LayoutModal(props: LayoutModalProps) {
  const {
    app,
    role,
    setLayoutOpen,
    selectedNode,
    isMaxFill,
    setMaxFill,
    setSelectedNode,
    newViewId,
  } = useContext<CrossAppState>(CrossAppContext);
  const primaryLayout = app.getSharedObject().getPrimaryConfiguration();
  let currentLayout = app
    .getSharedObject()
    .getCurrentConfigurationOfRole(role.getId());
  if (role.getName() === "designer") {
    currentLayout = app.getSharedObject().getLayoutWithView(selectedNode);
    if (!currentLayout) {
      const firstRole = Array.from(app.getSharedObject().getRoles())[2];

      currentLayout = app
        .getSharedObject()
        .getCurrentConfigurationOfRole(firstRole.getId());
    }
  }

  const onButtonClick = (buttonName: string) => {
    switch (buttonName) {
      case "ET":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitTop(newViewId, true, true);
        currentLayout.splitTop(newViewId, true, true);
        break;
      case "TMin":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitTop(newViewId, false, false);
        currentLayout.splitTop(newViewId, false, false);
        break;
      case "TMax":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitTop(newViewId, false, true);
        currentLayout.splitTop(newViewId, false, true);
        break;
      case "EL":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitLeft(newViewId, true, true);
        currentLayout.splitLeft(newViewId, true, true);
        break;
      case "LMax":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitLeft(newViewId, false, true);
        currentLayout.splitLeft(newViewId, false, true);
        break;
      case "LMin":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitLeft(newViewId, false, false);
        currentLayout.splitLeft(newViewId, false, false);
        break;
      case "C":
        if (role.getName() === "designer")
          primaryLayout.update({
            id: uuid(),
            name: "view",
            viewId: newViewId,
            flexGrow: true,
          } as ILayoutNode);
        currentLayout.update({
          id: uuid(),
          name: "view",
          viewId: newViewId,
          flexGrow: true,
        } as ILayoutNode);
        break;
      case "RMax":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitRight(newViewId, false, true);
        currentLayout.splitRight(newViewId, false, true);
        break;
      case "RMin":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitRight(newViewId, false, false);
        currentLayout.splitRight(newViewId, false, false);
        break;
      case "ER":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitRight(newViewId, true, true);
        currentLayout.splitRight(newViewId, true, true);
        break;
      case "BMax":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitBottom(newViewId, false, true);
        currentLayout.splitBottom(newViewId, false, true);
        break;
      case "BMin":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitBottom(newViewId, false, false);
        currentLayout.splitBottom(newViewId, false, false);
        break;
      case "EB":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitBottom(newViewId, true, true);
        currentLayout.splitBottom(newViewId, true, true);
        break;
      default:
        break;
    }
    setSelectedNode(newViewId);
    setLayoutOpen(false);
  };

  return (
    <Box
      bg={"transparent"}
      h={"120px"}
      w={"120px"}
      zIndex={300}
      display={props.isOpen ? "block" : "none"}
    >
      <Grid
        h={"120px"}
        w={"120px"}
        templateRows='repeat(3, 40px)'
        templateColumns='repeat(3, 40px)'
      >
        <GridItem rowSpan={1} colSpan={1} bg='transparent'></GridItem>
        {/*<GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            borderWidth={"1px"}
            borderColor={"black"}
            aria-label={"Focus"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("ET");
            }}
            icon={<Icon as={BiArrowToTop} />}
          />
          </GridItem>*/}
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick(isMaxFill ? "TMax" : "TMin");
            }}
            icon={<Icon as={isMaxFill ? RiLayoutBottomLine : BiDockTop} />}
          />
        </GridItem>
        {/*<GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("TMin");
            }}
            icon={<Icon as={BiDockTop} />}
          />
          </GridItem> */}
        <GridItem rowSpan={1} colSpan={1} bg='transparent'></GridItem>

        {/* <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("EL");
            }}
            icon={<Icon as={BiArrowToLeft} />}
          />{" "}
          </GridItem> */}
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick(isMaxFill ? "LMax" : "LMin");
            }}
            icon={<Icon as={isMaxFill ? RiLayoutRightLine : BiDockLeft} />}
          >
            <Text>Max</Text>
          </IconButton>
          {/* <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("LMin");
            }}
            icon={<Icon as={BiDockLeft} />}
          /> */}
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <Button
            aria-label={"Focus"}
            fontSize={"10px"}
            borderWidth={"1px"}
            borderColor={"black"}
            width={"40px"}
            height={"40px"}
            borderRadius={"0px"}
            onClick={() => {
              onButtonClick("C");
            }}
            icon={<Icon as={BiRectangle} />}
          >
            Replace
          </Button>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick(isMaxFill ? "RMax" : "RMin");
            }}
            icon={<Icon as={isMaxFill ? RiLayoutLeftLine : BiDockRight} />}
          />
          {/*<IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("RMin");
            }}
            icon={<Icon as={BiDockRight} />}
          /> */}
        </GridItem>
        {/*<GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("ER");
            }}
            icon={<Icon as={BiArrowToRight} />}
          />
          </GridItem> */}
        <GridItem rowSpan={1} colSpan={1} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick(isMaxFill ? "BMax" : "BMin");
            }}
            icon={<Icon as={isMaxFill ? RiLayoutTopLine : BiDockBottom} />}
          />
        </GridItem>
        {/*<GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("BMin");
            }}
            icon={<Icon as={BiDockBottom} />}
          />
          </GridItem> */}
        <GridItem rowSpan={1} colSpan={1} bg='transparent' />
        {/*<GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("EB");
            }}
            icon={<Icon as={BiArrowToBottom} />}
          />
        </GridItem>
          <GridItem rowSpan={1} colSpan={2} bg='transparent' />*/}
      </Grid>
    </Box>
  );
}
