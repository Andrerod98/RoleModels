import { Box, Button, Text, Center } from "@chakra-ui/react";
import React, { useContext, useMemo } from "react";
import { FC } from "react";
// import { UIComponentFactory } from "../components/UIComponentFactory";
import { Role } from "../shared-application/roles/Role";
import { Container } from "../shared-application/containers/Container";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { IoPushOutline } from "react-icons/io5";
import { ContainerPositionModal } from "./ContainerPositionModal";
const QRCode = require("qrcode.react");

interface ViewComponentProps {
  view: Container;
  role: Role;
}

export const ViewComponent: FC<ViewComponentProps> = (
  props: ViewComponentProps
) => {
  let qrUrl = "view/" + props.view.getId() + "#from=" + props.role.getId();
  const {
    selectedNode,
    setSelectedNode,
    roleModels,
    mode,
    localMode,
    setLocalMode,
  } = useContext<CrossAppState>(CrossAppContext);

  const isPullMode = mode.mode === "PULL";
  const isLayoutOpen = localMode.mode === "ContainerPosition";
  const isPushMode = localMode.mode === "PUSH";
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
          : isLayoutOpen && selectedNode === props.view.getId()
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
      ) : isLayoutOpen && selectedNode === props.view.getId() ? (
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
              roleModels.setMode("PUSH", {
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
                mode: "PUSH",
                properties: {
                  containerID: props.view.getId(),
                  from: props.role.getId(),
                },
              });
            }}
          ></Box>
        </Box>
      ) : (
        useMemo(() => {
          return props.view.getRoot().generateWidget();
        }, [JSON.stringify(props.view.getRoot().getSnapshot())])
      )}
      <Box
        _hover={isLayoutOpen ? { bg: "rgba(17, 99, 245,0.4)" } : {}}
        display={
          isLayoutOpen && selectedNode !== props.view.getId() ? "block" : "none"
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
