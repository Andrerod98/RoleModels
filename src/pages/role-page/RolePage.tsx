import React, { useContext } from "react";

import {
  Box,
  Center,
  Flex,
  Icon,
  IconButton,
  Switch,
  Text,
} from "@chakra-ui/react";
import { ViewComponent } from "../../components/ViewComponent";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";
import {
  BiDockTop,
  BiDockBottom,
  BiDockLeft,
  BiDockRight,
} from "react-icons/bi";
import {
  RiLayoutBottomLine,
  RiLayoutTopLine,
  RiLayoutRightLine,
  RiLayoutLeftLine,
} from "react-icons/ri";
import { ILayoutNode } from "../../shared-application/workspaces/ILayoutNode";
interface RoleProps {}

export function RolePage(props: RoleProps) {
  const {
    roleModels,
    role,
    isMaxFill,

    setMaxFill,
    selectedNode,
    setSelectedNode,
    primaryWorkspace,
    localMode,
    setLocalMode,
    currentWorkspace,
  } = useContext<CrossAppState>(CrossAppContext);

  let currentLayout = undefined;

  if (currentWorkspace.getRoleLayout(role.getId())) {
    currentLayout = currentWorkspace.getRoleLayout(role.getId()).getLayout();
  }

  const isContainerPosition = localMode.mode === "ContainerPosition";
  let containerID = "";
  if (isContainerPosition) {
    containerID = localMode.properties.containerID;
  }

  const isPUSH = false;
  const generateWidget = (node: ILayoutNode): JSX.Element => {
    switch (node.name) {
      case "div":
        return (
          <Flex
            maxW={"100%"}
            maxH={"100%"}
            w={"100%"}
            h={"100%"}
            overflow={"hidden"}
            key={roleModels.getDeviceRole() + "-div-" + node.id}
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
            w={"100%"}
            h={"100%"}
            overflow={"hidden"}
            key={roleModels.getDeviceRole() + "-flex-" + node.id}
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
            key={roleModels.getDeviceRole() + "-box-view-" + node.viewId}
            onClick={() => {
              setSelectedNode(node.viewId);
            }}
          >
            <ViewComponent
              key={roleModels.getDeviceRole() + "-view-" + node.viewId}
              view={view}
              role={role}
            />

            <Box
              _hover={{ bg: "rgba(17, 99, 245,0.4)" }}
              bg={
                selectedNode === node.viewId
                  ? "rgba(17, 99, 245,0.4)"
                  : "transparent"
              }
              display={isContainerPosition ? "block" : "none"}
              w={"100%"}
              h={"100%"}
              position={"absolute"}
              top={0}
              left={0}
              zIndex={200}
            />
          </Box>
        );
      default:
        return <></>;
    }
  };

  return (
    <Box h={"100%"} w={"100%"}>
      {currentLayout ? generateWidget(currentLayout.toLayout()) : <></>}

      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isContainerPosition ? "block" : "none"}
        left={"0"}
        right={"0"}
        top={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitTop(containerID, false, isMaxFill);
          currentLayout.splitTop(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: "" });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutBottomLine : BiDockTop} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isContainerPosition ? "block" : "none"}
        left={"0"}
        right={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitBottom(containerID, false, isMaxFill);
          currentLayout.splitBottom(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: "" });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutTopLine : BiDockBottom} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isContainerPosition ? "block" : "none"}
        left={"0"}
        top={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitLeft(containerID, false, isMaxFill);
          currentLayout.splitLeft(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: "" });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutRightLine : BiDockLeft} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isContainerPosition ? "block" : "none"}
        right={"0"}
        top={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          //primaryWorkspace.splitRight(containerID, false, isMaxFill);
          currentLayout.splitRight(containerID, false, isMaxFill);
          setSelectedNode(containerID);
          setLocalMode({ mode: "" });
        }}
        icon={<Icon as={isMaxFill ? RiLayoutLeftLine : BiDockRight} />}
      />

      <Flex
        position={"absolute"}
        margin={"auto"}
        display={isContainerPosition ? "block" : "none"}
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
      <Flex
        position={"absolute"}
        margin={"auto"}
        display={isPUSH ? "block" : "none"}
        right={"0"}
        top={"50"}
        left={"0"}
        w={"300px"}
        h={"70px"}
        zIndex={3000}
        bg={"#53565B"}
      >
        <Box w={"100%"} h={"100%"}>
          <Center w={"100%"} h={"100%"}>
            <Text color={"white"} textAlign={"center"}>
              Pushing mode is activated on another device.
            </Text>
          </Center>
        </Box>
      </Flex>
    </Box>
  );
}
