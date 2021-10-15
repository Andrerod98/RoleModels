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
import React, { useContext } from "react";
import { CrossAppState, CrossAppContext } from "../../../context/AppContext";
import { Role } from "../../../shared-application/roles/Role";

export function RolesTable() {
  const { roleModels } = useContext<CrossAppState>(CrossAppContext);
  const roles = Array.from(roleModels.getRoles());

  return (
    <Box>
      <Flex>
        <Spacer />

        <Button
          mr={"40px"}
          size={"sm"}
          onClick={() => roleModels.addRole("role" + roles.length)}
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
                      roleModels.renameRole(
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
                      roleModels.removeRole(role.getId());
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
