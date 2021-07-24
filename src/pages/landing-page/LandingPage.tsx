/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  VStack,
  Link,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import Utils from "../../utils/Utils";
export interface TemplateSelectorProps {
  onCreate: (name: string) => void;
  ip: string;
}

let fs;
let pathModule;
if (Utils.isElectron()) {
  fs = window.require("fs");
  pathModule = window.require("path");
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
  const handleChange = (event: any) => setName(event.target.value);

  const [path] = useState("/var/tmp/tinylicious/tinylicious/.git/refs/heads");
  let files = [];
  if (Utils.isElectron()) {
    files = useMemo(
      () =>
        fs
          .readdirSync(path)
          .map((file) => {
            const stats = fs.statSync(pathModule.join(path, file));
            return {
              name: file,
              directory: stats.isDirectory(),
            };
          })
          .sort((a, b) => {
            if (a.directory === b.directory) {
              return a.name.localeCompare(b.name);
            }
            return a.directory ? -1 : 1;
          })
          .filter((file) => !file.name.startsWith(".")),
      [path]
    );
  }

  return (
    <Container maxW={"container.xl"}>
      <VStack spacing={4} align={"stretch"} flex={1}>
        <Heading>Create a Project</Heading>
        <FormControl id={"project-name"}>
          <FormLabel>Project name</FormLabel>
          <Input type={"text"} onChange={handleChange} />
          <FormHelperText></FormHelperText>
        </FormControl>
        <Heading>Projects</Heading>

        <VStack overflowY={"scroll"} height={"450px"} alignItems={"left"}>
          {files.map((t, index) => (
            <Link
              color='teal.500'
              href={"#"}
              onClick={() => {
                window.location.href =
                  "https://" + props.ip + ":8080/#project=" + t.name;
                window.location.reload();
              }}
            >
              {t.name}
            </Link>
          ))}
        </VStack>

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
