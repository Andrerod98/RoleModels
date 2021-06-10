import React, { FC } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface CombinedViewEditorProps {
  onClose: () => void;
  onSave: () => void;
  onChangeUI: (value: string, event?: any) => void;
  onChangeInteractions: (value: string, event?: any) => void;
  show: boolean;
  defaultUI: string;
  defaultInteractions: string;
}

export const CombinedViewEditor: FC<CombinedViewEditorProps> = (
  props: CombinedViewEditorProps
) => {
  return (
    <>
      <Modal isOpen={props.show} onClose={props.onClose} size={"6xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Combined Views</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Box>
                UI
                <Box boxShadow={"xs"}>
                  <AceEditor
                    mode={"javascript"}
                    // width='700px'
                    // height='200px'
                    theme={"tomorrow"}
                    defaultValue={props.defaultUI}
                    onChange={props.onChangeUI}
                    name={"ui_div"}
                    editorProps={{ $blockScrolling: true }}
                  />
                </Box>
              </Box>
              <Center mx={"20px"}>
                <Divider orientation={"vertical"} />
              </Center>
              <Box>
                Interactions
                <Box boxShadow={"xs"}>
                  <AceEditor
                    mode={"javascript"}
                    // width='700px'
                    // height='200px'
                    theme={"tomorrow"}
                    defaultValue={props.defaultInteractions}
                    onChange={props.onChangeInteractions}
                    name={"interactions_div"}
                    editorProps={{ $blockScrolling: true }}
                  />
                </Box>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"blue"} mr={3} onClick={props.onSave}>
              Save
            </Button>
            <Button variant={"ghost"} onClick={props.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    /* return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      backdrop='static'
      keyboard={false}
      size='lg'
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Combined Views</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='exampleForm.ControlTextarea1'>
            <Form.Label>UI</Form.Label>
            <Card
              style={{
                width: "700px",
                height: "200px",
              }}
            >
              <AceEditor
                mode='javascript'
                width='700px'
                height='200px'
                theme='tomorrow'
                defaultValue={props.defaultUI}
                onChange={props.onChangeUI}
                name='UNIQUE_ID_OF_DIV'
                editorProps={{ $blockScrolling: true }}
              />
            </Card>
          </Form.Group>
          <Form.Group controlId='exampleForm.ControlTextarea2'>
            <Form.Label>Interactions</Form.Label>
            <Card
              style={{
                width: "700px",
                height: "200px",
              }}
            >
              <AceEditor
                mode='javascript'
                width='700px'
                height='200px'
                theme='tomorrow'
                defaultValue={props.defaultInteractions}
                onChange={props.onChangeInteractions}
                name='UNIQUE_ID_OF_DIV'
                editorProps={{ $blockScrolling: true }}
              />
            </Card>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={props.onClose}>
          Close
        </Button>
        <Button variant='primary' onClick={props.onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>*/
  );
};
