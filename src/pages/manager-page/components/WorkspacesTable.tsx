import {
  Button,
  Text,
  Editable,
  EditableInput,
  EditablePreview,
  Box,
  Grid,
  Center,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  AiOutlineLaptop,
  AiOutlineTablet,
  AiOutlinePhone,
  AiOutlineAlert,
} from "react-icons/ai";
import { CrossAppState, CrossAppContext } from "../../../context/AppContext";

export function WorkspacesTable() {
  const { roleModels } = useContext<CrossAppState>(CrossAppContext);
  const workspaces = [...Array.from(roleModels.getWorkspaces())];

  return (
    <Box>
      {/*<Flex>
        <Spacer />
        <Button
          mr={"10px"}
          size={"sm"}
          colorScheme={"red"}
          onClick={() => props.app.getSharedObject().resetConfiguration()}
        >
          Reset Workspace
        </Button>
        <Button
          mr={"40px"}
          size={"sm"}
          onClick={() => props.app.getSharedObject().saveConfiguration()}
        >
          Save Workspace
        </Button>
      </Flex> */}
      <Wrap mt={15} mx={15}>
        {workspaces.map((workspace) => {
          const roles = Array.from(workspace.getRoleLayouts().keys());
          /*const isActive =
            JSON.stringify(currentConfig) === JSON.stringify(workspace);*/
          return (
            <WrapItem w={"300px"} h={"250px"}>
              <Box w={"100%"} h={"100%"}>
                <Button
                  position={"relative"}
                  w={"300px"}
                  h={"200px"}
                  borderColor={"blackAlpha.400"}
                  borderWidth='2px'
                  //bg={"rgba(17, 99, 245,0.4)"}
                  p={3}
                  borderRadius={"20px"}
                  onClick={() => {
                    roleModels.loadWorkspace(workspace.toWorkspace());
                  }}
                >
                  <Grid
                    h='100%'
                    w={"100%"}
                    templateColumns={
                      "repeat(" + (roles.length === 1 ? 1 : 2) + ",1fr)"
                    }
                  >
                    {roles.map((roleID) => (
                      <Box
                        bg='blackAlpha.200'
                        borderWidth={"1px"}
                        _hover={{ bg: "green.400" }}
                        borderColor={"black"}
                        position={"relative"}
                      >
                        <Center w={"100%"} h={"100%"}>
                          <Box>
                            <Text fontSize={"15px"} textAlign={"center"}>
                              {workspace.getRoleLayout(roleID).getName()}
                            </Text>
                            <Center w={"100%"}>
                              {workspace.getRoleLayout(roleID).type ===
                              "desktop" ? (
                                <AiOutlineLaptop fontSize={"40px"} />
                              ) : workspace.getRoleLayout(roleID).type ===
                                "tablet" ? (
                                <AiOutlineTablet fontSize={"40px"} />
                              ) : workspace.getRoleLayout(roleID).type ===
                                "smartphone" ? (
                                <AiOutlinePhone fontSize={"40px"} />
                              ) : (
                                <AiOutlineAlert fontSize={"40px"} />
                              )}
                            </Center>
                          </Box>
                        </Center>
                      </Box>
                    ))}
                  </Grid>
                </Button>
                {workspace.name === "Empty" ? (
                  <Text textAlign={"center"} fontWeight={"bold"}>
                    {workspace.name}
                  </Text>
                ) : (
                  <Editable
                    defaultValue={workspace.name}
                    textAlign={"center"}
                    fontWeight={"bold"}
                    onSubmit={(nextValue: string) => {
                      if (nextValue === "") return;
                      roleModels.renameWorkspace(
                        workspace.id,
                        workspace.name,
                        nextValue
                      );
                    }}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                )}
              </Box>
            </WrapItem>
          );
        })}
      </Wrap>

      {/*configurations.map((config: IConfiguration, index: number) => {
          return <GridItem rowSpan={1} colSpan={1} bg='tomato' />;
        }) */}

      {/* <Table variant='simple'>
        <TableCaption>Workspace Manager</TableCaption>
        <Thead>
          <Tr>
            <Th>Workspace Name</Th>

            <Th>Load</Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody key={"table-body"}>
          {configurations.map((config: IWorkspace, index: number) => {
            
            return (
              <Tr key={"table-tr-" + index} bg={isActive ? "green.200" : ""}>
                <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                  <Editable
                    defaultValue={config.name}
                    onSubmit={(nextValue: string) => {
                      sharedObject.renameConfiguration(
                        config.id,
                        config.name,
                        nextValue
                      );
                    }}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Td>

                <Td>
                  {isActive ? (
                    "Active"
                  ) : (
                    <Button
                      as={Button}
                      fontSize={{ base: "10px", md: "16px", lg: "16px" }}
                      onClick={() => {
                        sharedObject.loadConfiguration(config.id);
                      }}
                    >
                      Load
                    </Button>
                  )}
                </Td>
                <Td>
                  <IconButton
                    onClick={() => {
                      sharedObject.deleteConfigurationWithId(config.id);
                    }}
                    aria-label='Delete Workspace'
                    icon={<DeleteIcon />}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        </Table> */}
    </Box>
  );
}
