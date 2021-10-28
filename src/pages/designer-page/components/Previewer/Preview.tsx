import {
  Box,
  Center,
  Flex,
  Icon,
  IconButton,
  Switch,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useRef } from "react";
import {
  BiDockBottom,
  BiDockLeft,
  BiDockRight,
  BiDockTop,
} from "react-icons/bi";
import {
  RiLayoutBottomLine,
  RiLayoutLeftLine,
  RiLayoutRightLine,
  RiLayoutTopLine,
} from "react-icons/ri";
import { CrossAppState, CrossAppContext } from "../../../../context/AppContext";
import { ViewComponent } from "../../../../components/ViewComponent";
import { ILayoutNode } from "../../../../shared-application/workspaces/ILayoutNode";
import { Mode } from "../../../../context/Modes";
import { useDrag } from "@use-gesture/react";

interface PreviewProps {
  layout: ILayoutNode;
  width: string;
  height: string;

  selectedNode: string;
  isOpenLayoutModal: boolean;

  setSelected: (newSelected: string) => void;
}
export const Preview = (props: PreviewProps) => {
  const {
    roleModels,
    setMaxFill,
    isMaxFill,
    selectedNode,
    mode,
    setSelectedNode,
    primaryWorkspace,
    localMode,
    setLocalMode,
  } = useContext<CrossAppState>(CrossAppContext);

  let currentLayout = primaryWorkspace.getFirstLayout().getLayout();

  const isOpenLayoutModal = localMode.mode === Mode.ContainerPosition;
  let containerID = "";
  if (isOpenLayoutModal) {
    containerID = localMode.properties.containerID;
  }

  /*currentLayout = roleModels.getLayoutWithContainer(selectedNode);
  if (!currentLayout) {
    const firstRole = Array.from(roleModels.getRoles())[2] as any;

    currentLayout = roleModels.getCurrentConfigurationOfRole(firstRole.getId());
  }*/

  const generateWidget = (node: ILayoutNode): JSX.Element => {
    switch (node.name) {
      case "div":
        return (
          <Flex
            maxW={"100%"}
            maxH={"100%"}
            minH={"40px"}
            minW={"40px"}
            h={node.flexGrow ? "100%" : undefined}
            w={node.flexGrow ? "100%" : undefined}
            flex={(node.flexGrow ? "1 1" : "0 0") + " auto"}
            overflow={"hidden"}
            key={roleModels.getMyRole().getName() + "-div-" + node.id}
            direction={"column"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "flex":
        return (
          <Flex
            maxW={"100%"}
            maxH={"100%"}
            minH={"40px"}
            minW={"40px"}
            h={node.flexGrow ? "100%" : undefined}
            w={node.flexGrow ? "100%" : undefined}
            flex={(node.flexGrow ? "1 1" : "0 0") + " auto"}
            overflow={"hidden"}
            key={roleModels.getMyRole().getName() + "-flex-" + node.id}
            direction={"row"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "view":
        const view = roleModels.getContainer(node.viewId);

        if (!view) {
          return <></>;
        }

        return (
          <Box
            key={roleModels.getMyRole().getName() + "-box-" + node.viewId}
            h={node.flexGrow ? "100%" : undefined}
            w={node.flexGrow ? "100%" : undefined}
            flex={(node.flexGrow ? "1 1" : "0 0") + " auto"}
            borderWidth={"3px"}
            borderColor={"blackAlpha.200"}
            bg={"white"}
            minH={"40px"}
            minW={"40px"}
            overflow={"hidden"}
            position={"relative"}
            onClick={() => {
              if (props.isOpenLayoutModal) {
                props.setSelected(node.viewId);
              }
            }}
          >
            <ViewComponent
              key={
                roleModels.getMyRole().getName() +
                "-preview-view-" +
                node.viewId
              }
              view={view}
              role={roleModels.getMyRole()}
            />
          </Box>
        );
      default:
        return <></>;
    }
  };
  return (
    <Box h={props.height} w={props.width} overflow={"hidden"} bg={"gray"}>
      {props.layout ? generateWidget(props.layout) : ""}

      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={props.isOpenLayoutModal ? "block" : "none"}
        left={"0"}
        right={"0"}
        top={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitTop(containerID, false, isMaxFill);
          currentLayout.splitTop(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: Mode.Default });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutBottomLine : BiDockTop} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={props.isOpenLayoutModal ? "block" : "none"}
        left={"0"}
        right={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitBottom(containerID, false, isMaxFill);
          currentLayout.splitBottom(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: Mode.Default });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutTopLine : BiDockBottom} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={props.isOpenLayoutModal ? "block" : "none"}
        left={"0"}
        top={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitLeft(containerID, false, isMaxFill);
          currentLayout.splitLeft(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: Mode.Default });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutRightLine : BiDockLeft} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={props.isOpenLayoutModal ? "block" : "none"}
        right={"0"}
        top={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitRight(containerID, false, isMaxFill);
          currentLayout.splitRight(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: Mode.Default });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutLeftLine : BiDockRight} />}
      />

      <Flex
        position={"absolute"}
        margin={"auto"}
        display={props.isOpenLayoutModal ? "block" : "none"}
        right={"0"}
        top={"50"}
        left={"0"}
        w={"300px"}
        h={"70px"}
        zIndex={3000}
        bg={"#53565B"}
      >
        <Box w={"100%"} h={"100%"}>
          <Center w={"100%"} h={"50%"}>
            <Text color={"white"}>
              Filling the {isMaxFill ? "maximum" : "minimum"} space.
            </Text>
            <Switch
              pl={"5px"}
              size='md'
              onChange={() => {
                setMaxFill(!isMaxFill);
              }}
            />{" "}
          </Center>
          <Center w={"100%"} h={"50%"}>
            <Text color={"white"}>Select a container to position it.</Text>
          </Center>
        </Box>
      </Flex>
    </Box>
  );
};
