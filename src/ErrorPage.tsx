import React from "react";
import { Box, Center, Heading, Spinner, Text } from "@chakra-ui/react";
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
      </Box>
    </Center>
  );
}
