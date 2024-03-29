import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Heading,
  VStack,
  Divider,
  Flex,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { IInteraction } from "../../shared-application/managers/InteractionsManager";
import { Container } from "../../shared-application/containers/Container";
import { CodeEditor } from "./components/CodeEditor";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";

interface CreateInteractionModalProps {
  views: Container[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  interaction: IInteraction;
  onCreate: (
    viewId: string,
    componentIds: string[],
    eventName: string,
    code: string
  ) => void;
}

export function CreateInteractionModal(props: CreateInteractionModalProps) {
  const { roleModels } = useContext<CrossAppState>(CrossAppContext);
  useEffect(() => {
    if (props.interaction) {
      const { name, code } = props.interaction;
      if (value !== code) {
        setValue(code);
      }

      const defaultValues = name.split("/");
      if (defaultValues.length > 0) {
        setSelectedViewId(defaultValues[0]);
        setSelectedComponentsIds([defaultValues[1]]);
        setSelectedEvent(defaultValues[2]);
      }
    }
  }, [props.interaction]);
  const [value, setValue] = useState(
    props.interaction ? props.interaction.code : ""
  );

  const [selectedViewId, setSelectedViewId] = useState(
    props.views.length > 0 ? props.views[0].getId() : ""
  );

  const [selectedComponentsIds, setSelectedComponentsIds] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("onClick");

  const selectedView = roleModels.getContainer(selectedViewId);
  let components = [];
  if (selectedView) components = selectedView.getRoot().toComponentsString();

  return (
    <>
      <Button onClick={props.onOpen}>Add Interaction</Button>

      <Modal isOpen={props.isOpen} onClose={props.onClose} size={"4xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create an interaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align='stretch'>
              <Flex ml={"50px"}>
                <Box flex={1}>
                  <Heading size={"sm"}>View</Heading>
                  <Menu>
                    <MenuButton as={Button}>Select a view</MenuButton>
                    <MenuList minWidth='240px'>
                      <MenuOptionGroup
                        value={selectedViewId}
                        title='Views'
                        type='radio'
                        onChange={(value: string) => {
                          setSelectedViewId(value);
                        }}
                      >
                        {props.views.map((v, index) => (
                          <MenuItemOption
                            key={"view-menu-item-" + index}
                            value={v.getId()}
                          >
                            {v.getId()}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Box>
                <Box flex={1}>
                  <Heading size={"sm"}>Components</Heading>
                  <Menu closeOnSelect={false}>
                    <MenuButton as={Button}>Select a component</MenuButton>
                    <MenuList minWidth='240px'>
                      <MenuOptionGroup
                        defaultValue={selectedComponentsIds}
                        title='Components'
                        type='checkbox'
                        onChange={(value: string | string[]) => {
                          if (typeof value === "string") {
                            setSelectedComponentsIds([value]);
                          } else {
                            setSelectedComponentsIds(value);
                          }
                        }}
                      >
                        {components.map((c, index) => (
                          <MenuItemOption
                            key={"component-menu-item-" + index}
                            value={c}
                          >
                            {c}
                          </MenuItemOption>
                        ))}
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Box>
                <Box flex={1}>
                  <Heading size={"sm"}>Event</Heading>
                  <Menu>
                    <MenuButton as={Button}>Select a event</MenuButton>
                    <MenuList minWidth='240px'>
                      <MenuOptionGroup
                        defaultValue={selectedEvent}
                        title='Event'
                        type='radio'
                        onChange={(value: string) => {
                          setSelectedEvent(value);
                        }}
                      >
                        <MenuItemOption value='onClick'>onClick</MenuItemOption>
                        <MenuItemOption value='onChange'>
                          onChange
                        </MenuItemOption>
                        <MenuItemOption value='onScan'>onScan</MenuItemOption>
                        <MenuItemOption value='onPlayCard'>
                          onPlayCard
                        </MenuItemOption>
                        <MenuItemOption value='onWithdraw'>
                          onWithdraw
                        </MenuItemOption>
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Box>
              </Flex>
              <Divider />
              <Box w={"90%"} h={"400px"}>
                <Heading size={"sm"}>Interaction</Heading>
                <CodeEditor
                  mode={"javascript"}
                  title={"Interactions"}
                  value={value}
                  onChange={(value: string) => {
                    setValue(value);
                  }}
                />
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={() => {
                props.onCreate(
                  selectedViewId,
                  selectedComponentsIds,
                  selectedEvent,
                  value
                );
                props.onClose();
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
