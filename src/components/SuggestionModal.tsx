import {
  Button,
  Text,
  Box,
  Heading,
  SimpleGrid,
  Center,
  Flex,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  AiOutlineAlert,
  AiOutlineLaptop,
  AiOutlinePhone,
  AiOutlineTablet,
} from "react-icons/ai";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { Mode } from "../context/Modes";

export const SuggestionModal = () => {
  const { mode, roleModels } = useContext<CrossAppState>(CrossAppContext);

  if (mode.mode !== Mode.Suggest) {
    return <></>;
  }

  const { suggestions } = mode.properties;

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
          <Heading color={"white"} w={"100%"} textAlign={"center"}>
            Suggested Workspaces
          </Heading>

          <Flex
            flexWrap={"wrap"}
            alignItems={"center"}
            flex={"0 1 30vw"}
            my={"20px"}
            mx={"10px"}
            h='300px'
          >
            {suggestions.map((workspace) => {
              const roles = Object.keys(workspace.layouts);
              return (
                <Box>
                  <Button
                    position={"relative"}
                    w={"30vw"}
                    borderColor={"blackAlpha.400"}
                    borderWidth='2px'
                    bg={"white"}
                    h='300px'
                    borderRadius={"20px"}
                    onClick={() => {
                      roleModels.loadWorkspace(workspace);
                      roleModels.setMode(Mode.Default);
                    }}
                  >
                    <SimpleGrid
                      columns={2}
                      h='300px'
                      w={"30vw"}
                      p={4}
                      //bg={"rgba(17, 99, 245,0.4)"}
                    >
                      {roles.map((role) => {
                        return (
                          <Box
                            bg='blackAlpha.200'
                            borderWidth={"1px"}
                            _hover={{ bg: "green.400" }}
                            borderColor={"black"}
                            position={"relative"}
                          >
                            <Box
                              position={"absolute"}
                              top={"50%"}
                              left={"50%"}
                              w={"100%"}
                              h={"65px"}
                              transform={"translate(-50%, -50%)"}
                            >
                              <Text fontSize={"20px"} textAlign={"center"}>
                                {role}
                              </Text>
                              <Center w={"100%"}>
                                {workspace.layouts[role].type === "desktop" ? (
                                  <AiOutlineLaptop fontSize={"50px"} />
                                ) : workspace.layouts[role].type ===
                                  "tablet" ? (
                                  <AiOutlineTablet fontSize={"50px"} />
                                ) : workspace.layouts[role].type ===
                                  "smartphone" ? (
                                  <AiOutlinePhone fontSize={"50px"} />
                                ) : (
                                  <AiOutlineAlert fontSize={"50px"} />
                                )}
                              </Center>
                            </Box>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </Button>
                  <Text
                    w={"100%"}
                    textAlign={"center"}
                    mb={"10px"}
                    fontWeight={"bold"}
                  >
                    {workspace.name}
                  </Text>
                </Box>
              );
            })}
          </Flex>
        </Box>
      </Center>
    </Box>
  );
};
