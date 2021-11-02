/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Spacer,
  VStack,
  Link,
  Box,
  Flex,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { GrCertificate } from "react-icons/gr";
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

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
    <Box w={"100vw"} h={"100vh"}>
      <Flex bg={"#272B35"} w={"100%"} py={10} px={20}>
        <Heading color={"white"}>RoleModels</Heading>
        <Spacer />

        <IconButton
          ml={"10px"}
          size={"md"}
          borderRadius={"5px"}
          aria-label={"Search database"}
          onClick={() => {
            const element = document.createElement("a");
            element.setAttribute("href", "../certificates/host.crt");
            element.setAttribute("download", "host.crt");

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
          }}
          icon={<GrCertificate />}
        />
      </Flex>
      <Box mx={20}>
        <Box>
          <Box w={"100%"}>
            <Heading my={5}>Create a project</Heading>
            <Box
              mr={2}
              p={3}
              h={"150px"}
              borderRadius={20}
              boxShadow={"xs"}
              borderWidth={"2px"}
            >
              <FormControl id={"project-name"}>
                <FormLabel>Project name</FormLabel>
                <Input type={"text"} onChange={handleChange} />
                <FormHelperText></FormHelperText>
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
              </FormControl>
            </Box>
          </Box>

          <Box w={"100%"}>
            <Heading my={5}>Projects</Heading>
            <VStack
              overflowY={"scroll"}
              height={"450px"}
              alignItems={"left"}
              borderRadius={20}
              boxShadow={"xs"}
              borderWidth={"2px"}
            >
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
