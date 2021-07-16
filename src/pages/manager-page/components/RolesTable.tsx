import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  Box,
  Flex,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { CrossDeviceApplication } from "../../../shared-application/CrossDeviceApplication";
import { Role } from "../../../shared-application/roles/Role";

interface LayoutTableProps {
  readonly app: CrossDeviceApplication;
}

export function RolesTable(props: LayoutTableProps) {
  const sharedObject = props.app.getSharedObject();
  const roles = Array.from(sharedObject.getRoles());

  return (
    <Box>
      <Flex>
        <Spacer />

        <Button
          mr={"40px"}
          size={"sm"}
          onClick={() => props.app.getSharedObject().addRole("new")}
        >
          <AddIcon />
        </Button>
      </Flex>
      <Table variant='simple'>
        <TableCaption>Roles Manager</TableCaption>
        <Thead>
          <Tr>
            <Th>Role Name</Th>

            <Th>Load</Th>
          </Tr>
        </Thead>

        <Tbody key={"table-body"}>
          {roles.map((role: Role, index: number) => {
            return (
              <Tr
                key={"table-tr-" + index}
                bg={
                  role.getName() === "manager" || role.getName() === "designer"
                    ? "gray.400"
                    : ""
                }
              >
                <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                  <Editable
                    isDisabled={
                      role.getName() === "manager" ||
                      role.getName() === "designer"
                    }
                    defaultValue={role.getName()}
                    onSubmit={(nextValue: string) => {
                      sharedObject.renameRole(
                        role.getId(),
                        role.getName(),
                        nextValue
                      );
                    }}
                  >
                    <EditablePreview />
                    <EditableInput />
                  </Editable>
                </Td>

                <Td>
                  <IconButton
                    display={
                      role.getName() === "manager" ||
                      role.getName() === "designer"
                        ? "none"
                        : "block"
                    }
                    onClick={() => {
                      sharedObject.removeRole(role.getId());
                    }}
                    aria-label='Delete Role'
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
