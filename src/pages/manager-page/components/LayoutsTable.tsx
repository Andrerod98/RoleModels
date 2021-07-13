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
    <Table variant='simple'>
      <TableCaption>Workspace Manager</TableCaption>
      <Thead>
        <Tr>
          <Th>Workspace Name</Th>

          <Th>Load</Th>
        </Tr>
      </Thead>

      <Tbody key={"table-body"}>
        {configurations.map((config: IConfiguration, index: number) => {
          const isActive =
            JSON.stringify(currentConfig) === JSON.stringify(config);
          return (
            <Tr key={"table-tr-" + index} bg={isActive ? "green.200" : "white"}>
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
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
