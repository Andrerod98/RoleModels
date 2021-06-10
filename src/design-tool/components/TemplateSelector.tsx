/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Text,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { TemplateEditor } from "./TemplateEditor";
import { TemplateItem } from "./TemplateItem";
import { Link as ReactLink } from "react-router-dom";
import { ITemplate, Project } from "../Project";

export interface TemplateSelectorProps {
  project: Project;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = (
  props: TemplateSelectorProps
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("untitled");
  const [templates, setTemplates] = useState(props.project.getTemplates());
  const handleChange = (event: any) => setName(event.target.value);
  const [selected, setSelected] = useState(0);

  return (
    <Container maxW={"container.xl"}>
      <TemplateEditor
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onCreate={(template: ITemplate) => {
          props.project.addTemplate(template);
          setTemplates(props.project.getTemplates());
          onClose();
        }}
      />
      <VStack spacing={4} align={"stretch"}>
        <Heading>Create a Project</Heading>
        <FormControl id={"project-name"}>
          <FormLabel>Project name</FormLabel>
          <Input type={"text"} onChange={handleChange} />
          <FormHelperText></FormHelperText>
        </FormControl>
        <Heading>Templates</Heading>
        <SimpleGrid columns={4} spacing={5}>
          <Box
            bg={"white"}
            height={"180px"}
            cursor={"pointer"}
            onClick={onOpen}
            boxShadow={"xs"}
          >
            <Center height={"180px"}>
              <Text color={"black"}>Create a new Template</Text>
            </Center>
          </Box>
          {templates.map((t, index) => (
            <TemplateItem
              key={"template-" + index}
              title={t.name}
              description={t.description}
              onClick={() => {
                setSelected(index);
              }}
              isSelected={index === selected}
            />
          ))}
        </SimpleGrid>
        <HStack spacing={"24px"}>
          <Spacer />
          <Button
            as={ReactLink}
            to={"/project"}
            onClick={() => {
              props.project.setName(name);
              props.project.setTemplate(templates[selected]);
            }}
          >
            Create Project
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};
