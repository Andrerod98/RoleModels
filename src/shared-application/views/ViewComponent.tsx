import { Box, Button, Text, Center } from "@chakra-ui/react";
import React, { useContext, useMemo } from "react";
import { FC } from "react";
// import { UIComponentFactory } from "../components/UIComponentFactory";
import { Role } from "../roles/Role";
import { View } from "./View";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";
import { IoPushOutline } from "react-icons/io5";
import { LayoutModal } from "../../components/LayoutModal";
const QRCode = require("qrcode.react");

interface ViewComponentProps {
  view: View;
  role: Role;
}

export const ViewComponent: FC<ViewComponentProps> = (
  props: ViewComponentProps
) => {
  let qrUrl = "view/" + props.view.getId() + "#from=" + props.role.getId();
  const {
    isQRMode,
    selectedNode,
    isLayoutOpen,
    setSelectedNode,
    isSelectMode,
    setSelectedContainerPush,
    app,
    selectedContainerPush,
  } = useContext<CrossAppState>(CrossAppContext);
  console.log(isQRMode);
  return (
    <Box
      w={"100%"}
      h={"100%"}
      borderWidth={"10px"}
      borderColor={"blackAlpha.400"}
      bg={
        isQRMode
          ? "blackAlpha.400"
          : isLayoutOpen && selectedNode === props.view.getId()
          ? "rgba(17, 99, 245,0.4)"
          : undefined
      }
      position={"relative"}
      key={"view-" + props.view.getId()}
    >
      {isQRMode ? (
        <Center h={"100%"} w={"100%"}>
          <Box h={"138px"} w={"138px"} p={"5px"} bg={"white"}>
            <QRCode value={qrUrl} />
          </Box>
        </Center>
      ) : isLayoutOpen && selectedNode === props.view.getId() ? (
        <Center h={"100%"} w={"100%"}>
          <LayoutModal
            isOpen={isLayoutOpen}
            setSelected={(newSelected: string) => {
              setSelectedNode(newSelected);
            }}
            onButtonClick={(name: string) => {}}
          />
        </Center>
      ) : isSelectMode && selectedContainerPush.view === props.view.getId() ? (
        <Center h={"100%"} w={"100%"}>
          <Button
            m={"auto"}
            w={["70%", "40%"]}
            h={["30%", "40%"]}
            onClick={() => {
              app
                .getSharedObject()
                .setQuickInteraction(props.view.getId(), props.role.getName());
            }}
          >
            <Box align={"center"}>
              <Text fontSize={"40px"}>Push</Text>

              <IoPushOutline fontSize={"60px"} />
            </Box>
          </Button>
        </Center>
      ) : isSelectMode ? (
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
              setSelectedContainerPush({
                view: props.view.getId(),
                from: props.role.getName(),
              });
            }}
          ></Box>
        </Box>
      ) : (
        useMemo(() => {
          return props.view.getRoot().generateWidget();
        }, [JSON.stringify(props.view.getRoot().getSnapshot())])
      )}
    </Box>
  );
};
