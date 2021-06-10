/* eslint-disable @typescript-eslint/no-empty-interface */
import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { CgSmartphone, CgLaptop, CgRatio } from "react-icons/cg";

export interface TemplateItemProps {
  title: string;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}

export const TemplateItem = (props: TemplateItemProps) => {
  return (
    <Box
      bg={"white"}
      height={"180px"}
      boxShadow={"xs"}
      cursor={"pointer"}
      onClick={props.onClick}
    >
      <Box bg={"white"} h={"40px"} boxShadow={"xs"}>
        <HStack
          h={"40px"}
          spacing={2}
          align={"stretch"}
          alignItems={"center"}
          px={"15px"}
        >
          <Icon color={"black "} w={5} h={5} as={CgSmartphone} />
          <Icon color={"black "} w={5} h={5} as={CgLaptop} />
          <Icon color={"black "} w={5} h={5} as={CgRatio} />
          <Spacer></Spacer>
          {props.isSelected ? <CheckIcon w={3} h={3} /> : <></>}
        </HStack>
      </Box>
      <Container my={5}>
        <VStack spacing={4} align={"stretch"}>
          <Center>
            <Heading as={"h5"} size={"sm"} color={"gray.800"}>
              {props.title}
            </Heading>
          </Center>

          <Text color={"black"}>{props.description}</Text>
        </VStack>
      </Container>
    </Box>
  );
};
