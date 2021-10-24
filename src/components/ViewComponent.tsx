import { Box, Button, Text, Center } from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { FC } from "react";
// import { UIComponentFactory } from "../components/UIComponentFactory";
import { Role } from "../shared-application/roles/Role";
import { Container } from "../shared-application/containers/Container";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { IoPushOutline } from "react-icons/io5";
import { ContainerPositionModal } from "./ContainerPositionModal";
import { Mode } from "../context/Modes";
import { useGesture } from "@use-gesture/react";
const QRCode = require("qrcode.react");

interface ViewComponentProps {
  view: Container;
  role: Role;
  onDoubleClick?: () => void;
}

export const ViewComponent: FC<ViewComponentProps> = (
  props: ViewComponentProps
) => {
  let qrUrl = "view/" + props.view.getId() + "#from=" + props.role.getId();
  // const toast = useToast();\

  const {
    selectedNode,
    setSelectedNode,
    roleModels,
    mode,

    localMode,
    setLocalMode,
  } = useContext<CrossAppState>(CrossAppContext);

  {
    /*const ref = React.useRef(null);

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({
        swipe: [swipeX, swipeY],
        velocity: [vx],
        last,
        tap,
        first,
        elapsedTime,
        distance: [dx, dy],
      }) => {
        if (elapsedTime > 1000 && dx + dy < 3)
          console.log("THIS IS A LONG PRESS");

        if (last) {
          if (swipeX === 1) {
            console.log("swipe right");
          } else if (swipeX === -1) {
            console.log("swipe left");
          }
        }
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s, a],
        memo,
      }) => {
        alert("PINCH");
        return memo;
      },
    },
    {
      target: ref,

      delay: 3000,
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
    }
  );*/
  }

  const isPullMode = mode.mode === Mode.Pull;
  const isContainerPositionMode = localMode.mode === Mode.ContainerPosition;
  const isPushMode = localMode.mode === Mode.Push;
  const isCopyPasteMode = localMode.mode === Mode.CopyPaste;

  let containerID = "";
  if (isPushMode) {
    containerID = localMode.properties.containerID;
  }

  return (
    <Box
      w={"100%"}
      h={"100%"}
      borderWidth={"2px"}
      borderColor={"black"}
      position={"relative"}
      key={"view-" + props.view.getId()}
      bg={
        isPullMode
          ? "blackAlpha.400"
          : isContainerPositionMode && selectedNode === props.view.getId()
          ? "rgba(17, 99, 245,0.4)"
          : "white"
      }
    >
      {isPullMode ? (
        <Center h={"100%"} w={"100%"}>
          <Box h={"138px"} w={"138px"} p={"5px"} bg={"white"}>
            <QRCode value={qrUrl} />
          </Box>
        </Center>
      ) : isContainerPositionMode && selectedNode === props.view.getId() ? (
        <Center h={"100%"} w={"100%"}>
          <ContainerPositionModal
            setSelected={(newSelected: string) => {
              setSelectedNode(newSelected);
            }}
            onButtonClick={(name: string) => {}}
          />
        </Center>
      ) : isPushMode && containerID === props.view.getId() ? (
        <Center h={"100%"} w={"100%"}>
          <Button
            m={"auto"}
            w={["70%", "40%"]}
            h={["30%", "40%"]}
            onClick={() => {
              roleModels.setMode(Mode.Push, {
                containerID: props.view.getId(),
                from: props.role.getId(),
              });
            }}
          >
            <Box align={"center"}>
              <Text fontSize={"40px"}>Push</Text>

              <IoPushOutline fontSize={"60px"} />
            </Box>
          </Button>
        </Center>
      ) : isPushMode ? (
        <Box w={"100%"} h={"100%"} position={"relative"}>
          {useMemo(() => {
            return props.view.getRoot().generateWidget();
          }, [JSON.stringify(props.view.getRoot().getSnapshot())])}
          <Box
            w={"100%"}
            h={"100%"}
            position={"absolute"}
            left={0}
            top={0}
            _hover={{ bg: "rgba(17, 99, 245,0.4)" }}
            onClick={() => {
              setLocalMode({
                mode: Mode.Push,
                properties: {
                  containerID: props.view.getId(),
                  from: props.role.getId(),
                },
              });
            }}
          ></Box>
        </Box>
      ) : isCopyPasteMode ? (
        <Box w={"100%"} h={"100%"} position={"relative"}>
          {useMemo(() => {
            return props.view.getRoot().generateWidget();
          }, [JSON.stringify(props.view.getRoot().getSnapshot())])}
          <Box
            w={"100%"}
            h={"100%"}
            position={"absolute"}
            left={0}
            top={0}
            _hover={{ bg: "rgba(17, 99, 245,0.4)" }}
          ></Box>
        </Box>
      ) : (
        useMemo(() => {
          return props.view.getRoot().generateWidget();
        }, [JSON.stringify(props.view.getRoot().getSnapshot())])
      )}
      <Box
        _hover={isContainerPositionMode ? { bg: "rgba(17, 99, 245,0.4)" } : {}}
        display={
          isContainerPositionMode && selectedNode !== props.view.getId()
            ? "block"
            : "none"
        }
        w={"100%"}
        h={"100%"}
        position={"absolute"}
        top={0}
        left={0}
        zIndex={200}
      />
    </Box>
  );
};
