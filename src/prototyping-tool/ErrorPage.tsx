import React from "react";
import { Box, Center, Heading, Text } from "@chakra-ui/react";
interface ErrorPageProps {
  error?: Error;
}

export function ErrorPage(props: ErrorPageProps) {
  return (
    <Center h={"100vh"}>
      <Box>
        <Heading>Error</Heading>
        <Text fontSize={"20px"}>{props.error.message}</Text>
        <Text fontSize={"20px"}>
          Ensure you are running the Tinylicious Fluid Server\nUse:`npm run
          start:server`
        </Text>
      </Box>
    </Center>
  );
}
