import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Editable,
  EditableInput,
  EditablePreview,
} from "@chakra-ui/react";
import React from "react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { IDevice } from "../../shared-object/devices/IDevice";

interface LayoutTableProps {
  devices: IDevice[];
  readonly app: CrossDeviceApplication;
}

export function LayoutsTable(props: LayoutTableProps) {
  const model = props.app.getSharedObject();
  const configurations = Array.from(model.getConfigurations());
  const currentConfig = model.getCurrentConfigurationShared();

  return (
    <Table variant='simple'>
      <TableCaption>Layout Manager</TableCaption>
      <Thead>
        <Tr>
          <Th>Layout Id</Th>

          <Th>Load</Th>
        </Tr>
      </Thead>

      <Tbody key={"table-body"}>
        {configurations.map((config, index) => {
          console.log({
            currentConfig: JSON.stringify(currentConfig),
            config: JSON.stringify(config),
          });

          const isActive =
            JSON.stringify(currentConfig) === JSON.stringify(config);
          return (
            <Tr key={"table-tr-" + index} bg={isActive ? "green.200" : "white"}>
              <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                <Editable
                  defaultValue={config.name}
                  onSubmit={(nextValue: string) => {
                    model.renameConfiguration(config.name, nextValue);
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
                      model.loadConfiguration(config.name);
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
