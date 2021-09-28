import {
  Box,
  Center,
  Flex,
  Icon,
  IconButton,
  Switch,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  BiArrowToBottom,
  BiArrowToLeft,
  BiArrowToRight,
  BiArrowToTop,
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
import { CrossDeviceApplication } from "../../../../shared-application/CrossDeviceApplication";
import { ILayoutNode } from "../../../../shared-application/roles/ILayoutNode";
import { ViewComponent } from "../../../../shared-application/views/ViewComponent";

interface PreviewProps {
  layout: ILayoutNode;
  width: string;
  height: string;
  app: CrossDeviceApplication;

  selectedNode: string;
  isOpenLayoutModal: boolean;

  setSelected: (newSelected: string) => void;
}
export const Preview = (props: PreviewProps) => {
  const {
    app,
    setMaxFill,
    isMaxFill,
    role,
    selectedNode,
    newViewId,
    setSelectedNode,
    setLayoutOpen,
  } = useContext<CrossAppState>(CrossAppContext);
  const primaryLayout = app.getSharedObject().getPrimaryConfiguration();
  let currentLayout = app
    .getSharedObject()
    .getCurrentConfigurationOfRole(role.getId());
  if (role.getName() === "designer") {
    currentLayout = app.getSharedObject().getLayoutWithView(selectedNode);
    if (!currentLayout) {
      const firstRole = Array.from(app.getSharedObject().getRoles())[2] as any;

      currentLayout = app
        .getSharedObject()
        .getCurrentConfigurationOfRole(firstRole.getId());
    }
  }

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
            key={
              props.app.getSharedObject().getMyRole().getName() +
              "-div-" +
              node.id
            }
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
            key={
              props.app.getSharedObject().getMyRole().getName() +
              "-flex-" +
              node.id
            }
            direction={"row"}
          >
            {node.children.map((child) => {
              return generateWidget(child);
            })}
          </Flex>
        );
      case "view":
        const view = props.app.getSharedObject().getView(node.viewId);

        if (!view) {
          return <></>;
        }

        return (
          <Box
            key={
              props.app.getSharedObject().getMyRole().getName() +
              "-box-" +
              node.viewId
            }
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
                props.app.getSharedObject().getMyRole().getName() +
                "-preview-view-" +
                node.viewId
              }
              view={view}
              role={props.app.getSharedObject().getMyRole()}
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
        display={props.isOpenLayoutModal ? "block" : "none"}
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
        display={props.isOpenLayoutModal ? "block" : "none"}
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
        display={props.isOpenLayoutModal ? "block" : "none"}
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
