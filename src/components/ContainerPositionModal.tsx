import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  BiDockTop,
  BiDockLeft,
  BiDockRight,
  BiDockBottom,
  BiRectangle,
} from "react-icons/bi";
import {
  RiLayoutBottomLine,
  RiLayoutLeftLine,
  RiLayoutRightLine,
  RiLayoutTopLine,
} from "react-icons/ri";
import { uuid } from "uuidv4";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { Mode } from "../context/Modes";
import { ILayoutNode } from "../shared-application/workspaces/ILayoutNode";
interface ContainerPositionModal {
  setSelected: (newSelected: string) => void;
  onButtonClick: (buttonName: string) => void;
}
export function ContainerPositionModal(props: ContainerPositionModal) {
  const {
    role,
    selectedNode,
    isMaxFill,
    setSelectedNode,
    primaryWorkspace,
    currentWorkspace,
    localMode,
    setLocalMode,
  } = useContext<CrossAppState>(CrossAppContext);

  if (localMode.mode !== Mode.ContainerPosition) {
    return <></>;
  }

  const { containerID } = localMode.properties;

  let currentLayout;

  if (role.getName() === "designer") {
    currentLayout = primaryWorkspace.getFirstLayout().getLayout();
  } else {
    currentLayout = currentWorkspace.getRoleLayout(role.getId()).getLayout();
  }

  const onButtonClick = (buttonName: string) => {
    switch (buttonName) {
      case "ET":
        currentLayout.splitTop(containerID, true, true);
        break;
      case "TMin":
        currentLayout.splitTop(containerID, false, false);
        break;
      case "TMax":
        currentLayout.splitTop(containerID, false, true);
        break;
      case "EL":
        currentLayout.splitLeft(containerID, true, true);
        break;
      case "LMax":
        currentLayout.splitLeft(containerID, false, true);
        break;
      case "LMin":
        currentLayout.splitLeft(containerID, false, false);
        break;
      case "C":
        currentLayout.update({
          id: uuid(),
          name: "view",
          viewId: containerID,
          flexGrow: true,
        } as ILayoutNode);
        break;
      case "RMax":
        currentLayout.splitRight(containerID, false, true);
        break;
      case "RMin":
        currentLayout.splitRight(containerID, false, false);
        break;
      case "ER":
        currentLayout.splitRight(containerID, true, true);
        break;
      case "BMax":
        currentLayout.splitBottom(containerID, false, true);
        break;
      case "BMin":
        currentLayout.splitBottom(containerID, false, false);
        break;
      case "EB":
        currentLayout.splitBottom(containerID, true, true);
        break;
      default:
        break;
    }
    setSelectedNode(containerID);
    setLocalMode({ mode: Mode.Default });
  };

  return (
    <Box bg={"transparent"} h={"120px"} w={"120px"} zIndex={300}>
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
