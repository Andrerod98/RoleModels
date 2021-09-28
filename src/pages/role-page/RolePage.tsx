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
import { ViewComponent } from "../../shared-application/views/ViewComponent";
import { ILayoutNode } from "../../shared-application/roles/ILayoutNode";
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
interface RoleProps {}

export function RolePage(props: RoleProps) {
  const {
    app,
    role,
    layout,
    isMaxFill,
    newViewId,
    setLayoutOpen,
    setMaxFill,
    selectedNode,
    setSelectedNode,
    isLayoutOpen,
  } = useContext<CrossAppState>(CrossAppContext);
  const model = app.getSharedObject();
  //const views = props.app.getViewsOrCombinedViews(props.role.getName());
  const primaryLayout = app.getSharedObject().getPrimaryConfiguration();
  let currentLayout = app
    .getSharedObject()
    .getCurrentConfigurationOfRole(role.getId());

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
            key={model.getDeviceRole() + "-div-" + node.id}
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
            key={model.getDeviceRole() + "-flex-" + node.id}
            direction={"row"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "view":
        const view = app.getSharedObject().getView(node.viewId);

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
            key={model.getDeviceRole() + "-box-view-" + node.viewId}
            onClick={() => {
              setSelectedNode(node.viewId);
            }}
          >
            <ViewComponent
              key={model.getDeviceRole() + "-view-" + node.viewId}
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
              display={isLayoutOpen ? "block" : "none"}
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
      {generateWidget(layout.toLayout())}

      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isLayoutOpen ? "block" : "none"}
        left={"0"}
        right={"0"}
        top={"0"}
        zIndex={"2000"}
        onClick={() => {
          primaryLayout.splitTop(newViewId, false, isMaxFill);
          currentLayout.splitTop(newViewId, false, isMaxFill);
          setSelectedNode(newViewId);
          setLayoutOpen(false);
        }}
        icon={<Icon as={isMaxFill ? RiLayoutBottomLine : BiDockTop} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isLayoutOpen ? "block" : "none"}
        left={"0"}
        right={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          primaryLayout.splitBottom(newViewId, false, isMaxFill);
          currentLayout.splitBottom(newViewId, false, isMaxFill);
          setSelectedNode(newViewId);
          setLayoutOpen(false);
        }}
        icon={<Icon as={isMaxFill ? RiLayoutTopLine : BiDockBottom} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isLayoutOpen ? "block" : "none"}
        left={"0"}
        top={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          primaryLayout.splitLeft(newViewId, false, isMaxFill);
          currentLayout.splitLeft(newViewId, false, isMaxFill);
          setSelectedNode(newViewId);
          setLayoutOpen(false);
        }}
        icon={<Icon as={isMaxFill ? RiLayoutRightLine : BiDockLeft} />}
      />
      <IconButton
        borderWidth={"1px"}
        borderColor={"black"}
        aria-label={"Focus"}
        position={"absolute"}
        margin={"auto"}
        display={isLayoutOpen ? "block" : "none"}
        right={"0"}
        top={"0"}
        bottom={"0"}
        zIndex={"2000"}
        onClick={() => {
          primaryLayout.splitRight(newViewId, false, isMaxFill);
          currentLayout.splitRight(newViewId, false, isMaxFill);
          setSelectedNode(newViewId);
          setLayoutOpen(false);
        }}
        icon={<Icon as={isMaxFill ? RiLayoutLeftLine : BiDockRight} />}
      />

      <Flex
        position={"absolute"}
        margin={"auto"}
        display={isLayoutOpen ? "block" : "none"}
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
}
