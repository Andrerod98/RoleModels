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
} from "@chakra-ui/react";
import React from "react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { IDevice } from "../../shared-object/devices/IDevice";

interface RolesTableProps {
  devices: IDevice[];
  readonly app: CrossDeviceApplication;
}

export function RolesTable(props: RolesTableProps) {
  const model = props.app.getSharedObject();
  return (
    <Table variant='simple'>
      <TableCaption>Roles - Devices Mapping</TableCaption>
      <Thead>
        <Tr>
          <Th>Device Id</Th>
          <Th>Device Type</Th>
          <Th>Role</Th>
        </Tr>
      </Thead>

      <Tbody key={"table-body"}>
        {props.devices.map((device, index) => {
          return (
            <Tr key={"table-tr-" + index}>
              <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                {device.id}
              </Td>
              <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                {device.type}
              </Td>
              <Td>
                <Menu key={"menu-" + index}>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    fontSize={{ base: "10px", md: "16px", lg: "16px" }}
                  >
                    {device.role}
                  </MenuButton>
                  <MenuList key={"menu-list-" + index}>
                    {Array.from(model.getRoles()).map((role, index2) => (
                      <MenuItem
                        key={"menu-item-" + index2}
                        onClick={(srole) =>
                          model.promoteToRole(role.getName(), device.id)
                        }
                      >
                        {role.getName()}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
