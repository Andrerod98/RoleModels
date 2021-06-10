/* eslint-disable react/prop-types */
import * as React from "react";
import { Box, Heading, Divider, VStack } from "@chakra-ui/react";

export const ViewsBar = (props: any) => {
  return (
    <Box w={250} p={5} boxShadow={"xs"} h={"100%"}>
      <Heading as={"h3"} size={"md"} textAlign={"center"} mb={"10px"}>
        Views
      </Heading>
      <Divider mb={5} />
      <VStack spacing={5}>{props.children}</VStack>
    </Box>
  );
};
