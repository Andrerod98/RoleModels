import { DeleteIcon } from "@chakra-ui/icons";
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Box,
  Flex,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { CrossDeviceApplication } from "../../../shared-application/CrossDeviceApplication";
import { IConfiguration } from "../../../shared-application/managers/ConfigurationsManager";

interface LayoutTableProps {
  readonly app: CrossDeviceApplication;
}

export function LayoutsTable(props: LayoutTableProps) {
  const sharedObject = props.app.getSharedObject();
  const configurations = Array.from(sharedObject.getConfigurations());
  const currentConfig = sharedObject.getCurrentConfigurationShared();

  return (
    <Box>
      <Flex>
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
      </Flex>

      <Table variant='simple'>
        <TableCaption>Workspace Manager</TableCaption>
        <Thead>
          <Tr>
            <Th>Workspace Name</Th>

            <Th>Load</Th>
            <Th></Th>
          </Tr>
        </Thead>

        <Tbody key={"table-body"}>
          {configurations.map((config: IConfiguration, index: number) => {
            const isActive =
              JSON.stringify(currentConfig) === JSON.stringify(config);
            return (
              <Tr key={"table-tr-" + index} bg={isActive ? "green.200" : ""}>
                <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                  <Editable
                    defaultValue={config.name}
                    onSubmit={(nextValue: string) => {
                      sharedObject.renameConfiguration(config.name, nextValue);
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
                        sharedObject.loadConfiguration(config.name);
                      }}
                    >
                      Load
                    </Button>
                  )}
                </Td>
                <Td>
                  <IconButton
                    onClick={() => {}}
                    aria-label='Delete Workspace'
                    icon={<DeleteIcon />}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}
