/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ITemplate } from "../Project";
import { CodeEditor } from "./single-tab/CodeEditor";

export interface TemplateEditorProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreate: (template: ITemplate) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = (
  props: TemplateEditorProps
) => {
  const getDefaultValue = (): string => {
    return `{\n\t"name": "", \n\t"description": "", \n\t"devices":["smartphone", "tablet"],\n\t"roles":{\n\t\t"capturer":{\n\t\t\t"description":"This is a description"\n\t\t},\n\t\t"viewer":{\n\t\t\t"description":"This is a description"\n\t\t}\n\t}\n}`;
  };

  const [value, setValue] = useState(getDefaultValue());

  const handleFocus = (e: any) => {};

  const handleChange = (newValue: string, e: any) => {
    setValue(newValue);
  };

  const onCreate = () => {
    const obj = JSON.parse(value);
    const template = {
      name: obj.name,
      description: obj.description,
      roles: [],
      devices: obj.devices,
      views: [],
    } as ITemplate;
    props.onCreate(template);
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Template Editor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CodeEditor
              title={"Template"}
              value={value}
              onFocus={handleFocus}
              onChange={handleChange}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"blue"} mr={3} onClick={onCreate}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
