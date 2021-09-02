import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import React, { useContext } from "react";
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
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { ILayoutNode } from "../shared-application/roles/ILayoutNode";
interface LayoutModalProps {
  isOpen: boolean;
  setSelected: (newSelected: string) => void;
  onButtonClick: (buttonName: string) => void;
}
export function LayoutModal(props: LayoutModalProps) {
  const { app, role, setLayoutOpen, selectedNode, setSelectedNode, newViewId } =
    useContext<CrossAppState>(CrossAppContext);
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
            .splitTop(newViewId, true);
        currentLayout.splitTop(newViewId, true);
        break;
      case "T":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitTop(newViewId, false);
        currentLayout.splitTop(newViewId, false);
        break;
      case "EL":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitLeft(newViewId, true);
        currentLayout.splitLeft(newViewId, true);
        break;
      case "L":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitLeft(newViewId, false);
        currentLayout.splitLeft(newViewId, false);
        break;
      case "C":
        if (role.getName() === "designer")
          primaryLayout.update({
            id: uuid(),
            name: "view",
            viewId: newViewId,
          } as ILayoutNode);
        currentLayout.update({
          id: uuid(),
          name: "view",
          viewId: newViewId,
        } as ILayoutNode);
        break;
      case "R":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitRight(newViewId, false);
        currentLayout.splitRight(newViewId, false);
        break;
      case "ER":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitRight(newViewId, true);
        currentLayout.splitRight(newViewId, true);
        break;
      case "B":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitBottom(newViewId, false);
        currentLayout.splitBottom(newViewId, false);
        break;
      case "EB":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitBottom(newViewId, true);
        currentLayout.splitBottom(newViewId, true);
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
      h={"200px"}
      w={"200px"}
      zIndex={300}
      display={props.isOpen ? "block" : "none"}
    >
      <Grid
        h={"200px"}
        w={"200px"}
        templateRows='repeat(5, 40px)'
        templateColumns='repeat(5, 40px)'
      >
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
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
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("T");
            }}
            icon={<Icon as={BiDockTop} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
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
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("L");
            }}
            icon={<Icon as={BiDockLeft} />}
          />
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
              onButtonClick("R");
            }}
            icon={<Icon as={BiDockRight} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
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
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={1} bg='transparent'>
          <IconButton
            aria-label={"Focus"}
            borderWidth={"1px"}
            borderColor={"black"}
            isDisabled={selectedNode === ""}
            onClick={() => {
              onButtonClick("B");
            }}
            icon={<Icon as={BiDockBottom} />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
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
        <GridItem rowSpan={1} colSpan={2} bg='transparent' />
      </Grid>
    </Box>
  );
}
