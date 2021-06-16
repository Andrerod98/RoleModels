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
  Flex,
  ListItem,
  UnorderedList,
  Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { TemplateEditor } from "./TemplateEditor";
import { TemplateItem } from "./TemplateItem";
import { ITemplate } from "../Project";
export interface TemplateSelectorProps {
  onCreate: (name: string) => void;
  ip: string;
}

var context = require.context(
  "/var/tmp/tinylicious/tinylicious/.git/refs/heads",
  true
);
var filesnames = context.keys().map((k) => k.substr(2));

export const LandingPage: React.FC<TemplateSelectorProps> = (
  props: TemplateSelectorProps
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("untitled");
  const [templates] = useState([]);
  const handleChange = (event: any) => setName(event.target.value);
  const [selected, setSelected] = useState(0);

  return (
    <Container maxW={"container.xl"}>
      <TemplateEditor
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onCreate={(template: ITemplate) => {
          //props.project.addTemplate(template);
          //setTemplates(props.project.getTemplates());
          onClose();
        }}
      />
      <Flex h={"100%"} w={"100%"}>
        <VStack spacing={4} align={"stretch"} flex={1}>
          <Heading>Projects</Heading>
          <UnorderedList>
            {filesnames.map((f) => {
              return (
                <ListItem>
                  <Link
                    onClick={() => {
                      window.location.href =
                        "https://" + props.ip + ":8080/#project=" + f;
                      window.location.reload();
                    }}
                    href={"https://" + props.ip + ":8080/#project=" + f}
                  >
                    {f}
                  </Link>
                </ListItem>
              );
            })}
          </UnorderedList>
        </VStack>
        <VStack spacing={4} align={"stretch"} flex={1}>
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
              onClick={() => {
                setTimeout(() => {
                  window.location.reload();
                }, 5000);

                props.onCreate(name);
              }}
            >
              Create Project
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </Container>
  );
};
