import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Checkbox,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";
import { IInteraction } from "../../shared-application/managers/InteractionsManager";
import { CreateInteractionModal } from "./CreateInteractionModal";

export function InteractionsTab() {
  const { app } = useContext<CrossAppState>(CrossAppContext);
  const interactions = Array.from(app.getSharedObject().getInteractions());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [interaction, setInteraction] = useState(undefined);
  return (
    <Table variant='simple' mx={"10px"}>
      <TableCaption>Interactions</TableCaption>
      <Thead>
        <Tr>
          <Th w={"50%"}>Interaction Name</Th>

          <Th w={"15%"}>Active</Th>

          <Th w={"15%"}></Th>

          <CreateInteractionModal
            views={Array.from(app.getSharedObject().getAllViews())}
            app={app}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            interaction={interaction}
            onCreate={(
              viewId: string,
              componentIds: string[],
              eventName: string,
              code: string
            ) => {
              componentIds.forEach((cid) => {
                const name = viewId + "/" + cid + "/" + eventName;

                const object = {
                  name: name,
                  active: true,
                  code: code,
                } as IInteraction;
                app.getSharedObject().setInteraction(name, object);
              });
            }}
          />
        </Tr>
      </Thead>

      <Tbody key={"table-body"}>
        {interactions.map((inter: IInteraction, index: number) => {
          return (
            <Tr key={"table-tr-" + index} bg={"white"}>
              <Td fontSize={{ base: "10px", md: "16px", lg: "16px" }}>
                <Editable
                  defaultValue={inter.name}
                  onSubmit={(nextValue: string) => {}}
                >
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </Td>

              <Td>
                <Checkbox defaultIsChecked>Active</Checkbox>
              </Td>

              <Td>
                <IconButton
                  aria-label='Search database'
                  icon={<EditIcon />}
                  onClick={() => {
                    setInteraction(inter);
                    onOpen();
                  }}
                />
                <IconButton
                  onClick={() => {
                    app.getSharedObject().deleteInteraction(inter.name);
                  }}
                  aria-label='Search database'
                  icon={<DeleteIcon />}
                />
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
