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
import { Mode } from "../../context/Modes";

import "../../styles/styles.scss";

interface RoleProps {}

export function RolePage(props: RoleProps) {
  const {
    roleModels,
    role,
    isMaxFill,

    setMaxFill,
    selectedNode,
    setSelectedNode,
    mode,
    localMode,
    setLocalMode,
    currentWorkspace,
  } = useContext<CrossAppState>(CrossAppContext);

  let currentLayout = undefined;

  /*if ("deposit" === originalIndex) {
        if (mode.mode === Mode.CopyPaste) {
          const { containerID, from } = mode.properties;
          const container = roleModels.getContainer(containerID);
          const currentLayout = roleModels.getCurrentLayoutOfRole(role.getId());
          if (last && tap && !canceled) {
            toast({
              title: "Container was mirrored.",

              status: "success",
              position: "top",
              duration: 9000,
              isClosable: true,
            });
            const length = roleModels.getMyContainers().length;
            if (length === 0) {
              currentLayout.replace({
                id: uuid(),
                name: "view",
                viewId: container.getId(),
                flexGrow: true,
              } as ILayoutNode);
              setSelectedNode(container.getId());
              setLocalMode({ mode: Mode.Default });
            } else {
              setLocalMode({
                mode: Mode.ContainerPosition,
                properties: { containerID: container.getId() },
              });
            }

            roleModels.setMode(Mode.Default);
            cancel();
          } else if (first && down && !canceled && dx + dy < 3) {
            toast({
              title: "Container was migrated.",

              status: "success",
              position: "top",
              duration: 9000,
              isClosable: true,
            });
            roleModels.removeContainerFromRole(container, from);

            const length = roleModels.getMyContainers().length;
            if (length === 0) {
              roleModels.getCurrentLayoutOfRole(role.getId()).replace({
                id: uuid(),
                name: "view",
                viewId: container.getId(),
                flexGrow: true,
              } as ILayoutNode);

              setSelectedNode(container.getId());
              setLocalMode({ mode: Mode.Default });
            } else {
              setLocalMode({
                mode: Mode.ContainerPosition,
                properties: { containerID: container.getId() },
              });
            }

            roleModels.setMode(Mode.Default);
            cancel();
          } else if (last && !canceled && swipeX === 1) {
            setLocalMode({
              mode: Mode.QuickInteraction,
              properties: { containerID: container.getId(), from },
            });
            roleModels.setMode(Mode.Default);
            cancel();
          }
        }
      }
      console.log(originalIndex);

      if (localMode.mode === Mode.CopyPaste && first && dx + dy < 3) {
        toast({
          title: "Container was copied.",
          description:
            "The container has been copied you can paste in another device.",
          status: "success",
          position: "top",
          duration: 9000,
          isClosable: true,
        });
        roleModels.setMode(Mode.CopyPaste, {
          containerID: originalIndex,
          from: role.getId(),
        });
      }*/

  if (currentWorkspace.getRoleLayout(role.getId())) {
    currentLayout = currentWorkspace.getRoleLayout(role.getId()).getLayout();
  }

  const isContainerPosition = localMode.mode === Mode.ContainerPosition;
  let containerID = "";
  if (isContainerPosition) {
    containerID = localMode.properties.containerID;
  }

  /* useEffect(() => {
    if (mode.mode === Mode.CopyPaste && localMode.mode !== Mode.CopyPaste) {
      const { containerID, from } = mode.properties;
      const container = roleModels.getContainer(containerID);
      const currentLayout = roleModels.getCurrentLayoutOfRole(role.getId());

      hammertime = new Hammer(ref.current);

      hammertime.on("tap", (e) => {
        toast({
          title: "Container was mirrored.",

          status: "success",
          position: "top",
          duration: 9000,
          isClosable: true,
        });
        const length = roleModels.getMyContainers().length;
        if (length === 0) {
          currentLayout.replace({
            id: uuid(),
            name: "view",
            viewId: container.getId(),
            flexGrow: true,
          } as ILayoutNode);
          setSelectedNode(container.getId());
        } else {
          setLocalMode({
            mode: Mode.ContainerPosition,
            properties: { containerID: container.getId() },
          });
        }

        setLocalMode({ mode: Mode.Default });
        roleModels.setMode(Mode.Default);
      });

      hammertime.on("press", (e) => {
        toast({
          title: "Container was migrated.",

          status: "success",
          position: "top",
          duration: 9000,
          isClosable: true,
        });
        roleModels.removeContainerFromRole(container, from);

        const length = roleModels.getMyContainers().length;
        if (length === 0) {
          roleModels.getCurrentLayoutOfRole(role.getId()).replace({
            id: uuid(),
            name: "view",
            viewId: container.getId(),
            flexGrow: true,
          } as ILayoutNode);

          setSelectedNode(container.getId());
        } else {
          setLocalMode({
            mode: Mode.ContainerPosition,
            properties: { containerID: container.getId() },
          });
        }

        setLocalMode({ mode: Mode.Default });
        roleModels.setMode(Mode.Default);
      });
      hammertime.get("pan").set({ direction: Hammer.DIRECTION_UP });
      hammertime.on("panup", (e) => {
        setLocalMode({
          mode: Mode.QuickInteraction,
          properties: { containerID: container.getId(), from },
        });
        roleModels.setMode(Mode.Default);
      });
    }

    return () => {
      if (hammertime) hammertime.destroy();
    };
  }, [mode.mode, localMode.mode]);*/

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
            minH={"40px"}
            minW={"40px"}
            h={node.flexGrow ? "100%" : undefined}
            w={node.flexGrow ? "100%" : undefined}
            flex={(node.flexGrow ? "1 1" : "0 0") + " auto"}
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
            onMouseDown={() => {
              if (localMode.mode === Mode.CopyPaste) {
                setSelectedNode(view.getId());
                roleModels.setMode(Mode.CopyPaste, {
                  containerID: view.getId(),
                  from: role.getId(),
                });
              }
            }}
            onMouseUp={() => {
              if (localMode.mode === Mode.CopyPaste) {
                setSelectedNode("");
                roleModels.setMode(Mode.Default);
              }
            }}
            onTouchStart={() => {
              if (localMode.mode === Mode.CopyPaste) {
                setSelectedNode(view.getId());
                roleModels.setMode(Mode.CopyPaste, {
                  containerID: view.getId(),
                  from: role.getId(),
                });
              }
            }}
            onTouchEnd={() => {
              if (localMode.mode === Mode.CopyPaste) {
                setSelectedNode("");
                roleModels.setMode(Mode.Default);
              }
            }}
            userSelect={"none"}
            key={roleModels.getDeviceRole() + "-box-view-" + node.viewId}
          >
            <ViewComponent
              key={roleModels.getDeviceRole() + "-view-" + node.viewId}
              view={view}
              role={role}
              onDoubleClick={() => {}}
            />

            <Box
              _hover={{ bg: "rgba(17, 99, 245,0.4)" }}
              bg={
                selectedNode === node.viewId
                  ? "rgba(17, 99, 245,0.4)"
                  : "transparent"
              }
              display={
                isContainerPosition || localMode.mode === Mode.CopyPaste
                  ? "block"
                  : "none"
              }
              w={"100%"}
              h={"100%"}
              userSelect={"none"}
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
    <Box
      style={{
        height: "100%",
        width: "100%",
      }}
    >
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
        width={"25px"}
        height={"25px"}
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
        display={isContainerPosition ? "block" : "none"}
        left={"0"}
        right={"0"}
        bottom={"0"}
        width={"25px"}
        height={"25px"}
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
        display={isContainerPosition ? "block" : "none"}
        left={"0"}
        top={"0"}
        bottom={"0"}
        width={"25px"}
        height={"25px"}
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
        display={isContainerPosition ? "block" : "none"}
        right={"0"}
        top={"0"}
        bottom={"0"}
        width={"25px"}
        height={"25px"}
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
      <Box
        w={"100%"}
        h={"100%"}
        position={"absolute"}
        top={"0"}
        left={"0"}
        display={
          mode.mode === Mode.CopyPaste && localMode.mode !== Mode.CopyPaste
            ? "block"
            : "none"
        }
        bg={"blackAlpha.800"}
      >
        {/* <Flex
          w={"100%"}
          h={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
        >
          <Text
            width={"100%"}
            color={"white"}
            textAlign={"center"}
            fontSize={"20px"}
            m={2}
          >
            Mirror - Double tap
          </Text>

          <Text
            width={"100%"}
            fontSize={"20px"}
            color={"white"}
            textAlign={"center"}
            m={2}
          >
            Migrate - Long press
          </Text>

          <Text
            width={"100%"}
            fontSize={"20px"}
            color={"white"}
            textAlign={"center"}
            m={2}
          >
            Quick Interaction - Swipe up
          </Text>
        </Flex>
        {/*<Flex
          position={"absolute"}
          margin={"auto"}
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
                A container was copied on another device. Mirror - Double tap
                Migrate - Long press Quick Interaction - Swipe up
              </Text>
            </Center>
          </Box>
        </Flex>*/}
      </Box>
    </Box>
  );
}
