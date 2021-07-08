import { Box, Flex, Heading, Button, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CrossDeviceApplication } from "../../shared-application/CrossDeviceApplication";
import { CodeEditor } from "./components/CodeEditor";

export function InteractionsTabOld(props: {
  application: CrossDeviceApplication;
}) {
  const [value, setValue] = useState(
    props.application.getSharedObject().getInteractions()
  );

  const handleLoad = () => {
    props.application.getSharedObject().setInteractions(value);
  };
  return (
    <Box h={"100%"} bg={"gray.100"}>
      <Flex h={"100%"} bg={"gray.100"}>
        <Box h={"100%"} py={3} width={"70%"} bg={"gray.100"} mb={"20px"}>
          <Heading
            as={"h5"}
            px={5}
            fontSize={"12px"}
            textAlign={"left"}
            mb={"5px"}
          >
            INTERACTIONS
          </Heading>
          <CodeEditor
            mode={"javascript"}
            title={"Interactions"}
            value={value}
            onChange={(value: string) => {
              setValue(value);
            }}
          />
        </Box>
        <Box h={"100%"} py={3} width={"30%"} bg={"gray.100"} mb={"20px"}>
          <Heading
            as={"h5"}
            px={5}
            fontSize={"12px"}
            textAlign={"left"}
            mb={"5px"}
          >
            AVAILABLE COMMANDS
          </Heading>
          <Button onClick={handleLoad}>Load</Button>
          <VStack></VStack>
        </Box>
      </Flex>
    </Box>
  );
}
