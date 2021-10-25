import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Text,
  Box,
  Heading,
  Center,
  Flex,
  Divider,
  CloseButton,
  Spacer,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { MdRestore } from "react-icons/md";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { Mode } from "../context/Modes";
import { Workspace } from "../shared-application/workspaces/Workspace";

export const SuggestionModalNew = () => {
  const { mode, roleModels, localMode, setLocalMode, devices } =
    useContext<CrossAppState>(CrossAppContext);

  if (mode.mode !== Mode.Suggest && localMode.mode !== Mode.Suggest) {
    return <></>;
  }
  let saved = [];
  let deviceAction = "";

  if (mode.mode === Mode.Suggest) {
    saved = mode.properties.saved;
    deviceAction = mode.properties.type;
  }
  if (localMode.mode === Mode.Suggest) {
    saved = localMode.properties.saved;
    deviceAction = localMode.properties.type;
  }
  const connectedDevices = devices.length;

  const hasExtend = deviceAction === "added";

  const primaryWorkspace = roleModels.getPrimaryWorkspace(connectedDevices);

  const hasRestore = primaryWorkspace !== undefined;

  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      bg={"rgba(0,0,0, 0.75)"}
      position={"absolute"}
      left={0}
      top={0}
    >
      <Center h={"100%"} w={"100%"}>
        <Box>
          <Flex
            flexWrap={"wrap"}
            alignItems={"center"}
            justifyContent={"center"}
            flex={"0 1 30vw"}
            my={"20px"}
            w={"70vw"}
          >
            <Flex width={"70vw"} mb={"20px"}>
              <Spacer />
              <Heading
                color={"white"}
                textAlign={"center"}
                fontSize={["20px", "30px"]}
              >
                A device was {deviceAction}. {connectedDevices} connected
                devices.
              </Heading>
              <Spacer />
              <CloseButton
                aria-label='Close'
                icon={<CloseIcon />}
                color={"white"}
                size={"xl"}
                onClick={() => {
                  roleModels.setMode(Mode.Default);
                  setLocalMode({ mode: Mode.Default });
                }}
              />
            </Flex>
            <Button
              position={"relative"}
              h={"200px"}
              bg={"white"}
              display={hasRestore ? "flex" : "none"}
              borderRadius={"40px"}
              alignContent={"center"}
              flexDirection={"column"}
              m={2}
              flex={"1 1 35%"}
              onClick={() => {
                setLocalMode({ mode: Mode.Default });
                roleModels.restoreLastWorkspace();
              }}
            >
              <Text fontSize={["20px", "30px"]}>Restore last</Text>

              <MdRestore fontSize={"80px"} />
            </Button>
            <Button
              position={"relative"}
              h={"200px"}
              bg={"white"}
              m={2}
              borderRadius={"40px"}
              display={hasExtend ? "flex" : "none"}
              alignContent={"center"}
              flexDirection={"column"}
              flex={"1 1 35%"}
              onClick={() => {
                setLocalMode({ mode: Mode.Default });
                roleModels.setMode(Mode.Default);
                roleModels.extendWorkspace();
              }}
            >
              <Text fontSize={["20px", "30px"]}>Extend</Text>

              <AiOutlineAppstoreAdd fontSize={"80px"} />
            </Button>
            <Divider
              borderWidth={"2px"}
              orientation='horizontal'
              color={"white"}
              width={"70vw"}
              m={5}
            />
            <Text
              color={"white"}
              w={"100%"}
              textAlign={"center"}
              fontSize={["20px", "30px"]}
              fontWeight={"bold"}
              m={2}
            >
              Saved Workspaces
            </Text>
            {saved.length === 0 ? (
              <Text
                color={"white"}
                w={"100%"}
                textAlign={"center"}
                fontSize={["12px", "18px"]}
                fontWeight={"bold"}
                m={2}
              >
                There are no saved workspaces with {connectedDevices} roles.
              </Text>
            ) : (
              <Box overflowY={"scroll"} h={"120px"}>
                {saved.map((workspace: Workspace) => {
                  return (
                    <Button
                      position={"relative"}
                      w={"70vw"}
                      m={2}
                      h={"50px"}
                      bg={"white"}
                      borderRadius={"40px"}
                      onClick={() => {
                        setLocalMode({ mode: Mode.Default });
                        roleModels.loadWorkspace(workspace.toWorkspace());
                      }}
                    >
                      {workspace.name}
                    </Button>
                  );
                })}
              </Box>
            )}
          </Flex>
        </Box>
      </Center>
    </Box>
  );
};
