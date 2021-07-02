import React from "react";
import { Box, Button, Center, Heading, Spinner, Text } from "@chakra-ui/react";
interface ErrorPageProps {
  message?: string;
}

export function ErrorPage(props: ErrorPageProps) {
  return (
    <Center h={"100vh"}>
      <Box>
        <Heading>Error</Heading>
        <Spinner></Spinner>
        <Text fontSize={"20px"}>{props.message}</Text>
        <Text fontSize={"20px"}>
          Ensure you are running the Tinylicious Fluid Server\nUse:`npm run
          start:server`
        </Text>
        <Button
          onClick={() => {
            const element = document.createElement("a");
            element.setAttribute("href", "../certificates/host.crt");
            element.setAttribute("download", "host.crt");

            element.style.display = "none";
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
          }}
        >
          Download Certificate
        </Button>
      </Box>
    </Center>
  );
}
