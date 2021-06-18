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
} from "@chakra-ui/react";
import React, { useState } from "react";
import { TemplateItem } from "./components/designer/TemplateItem";
export interface TemplateSelectorProps {
  onCreate: (name: string) => void;
  ip: string;
}

/*var context = require.context(
  "/var/tmp/tinylicious/tinylicious/.git/refs/heads",
  false
);
var filesnames = context.keys().map((k) => k.substr(2));*/

export const LandingPage: React.FC<TemplateSelectorProps> = (
  props: TemplateSelectorProps
) => {
  const [name, setName] = useState("untitled");
  const [templates] = useState([]);
  const handleChange = (event: any) => setName(event.target.value);
  const [selected, setSelected] = useState(0);

  return (
    <Container maxW={"container.xl"}>
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
            onClick={() => {}}
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
              props.onCreate(name);
            }}
          >
            Create Project
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};
