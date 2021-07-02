import {
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { Flex, Button, Box, Text } from "@chakra-ui/react";
import React from "react";
import { CgArrowsExpandDownRight, CgScreenMirror } from "react-icons/cg";

interface CrossDeviceInteractionChooserProps {
  onMirror: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onStitch: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    side: string
  ) => void;
  onClose: () => void;
  onMigrate: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
export function CrossDeviceInteractionChooser({
  onMirror,
  onStitch,
  onClose,
  onMigrate,
}: CrossDeviceInteractionChooserProps) {
  return (
    <Box>
      <Flex
        position={"absolute"}
        bottom={0}
        left={0}
        right={0}
        top={0}
        m={30}
        onClick={onClose}
        justifyContent={"space-around"}
      >
        <Button m={"auto"} w={"40%"} h={"40%"} onClick={onMigrate}>
          <Box align={"center"}>
            <Text fontSize={"40px"}> Migrate</Text>

            <CgArrowsExpandDownRight fontSize={"60px"} />
          </Box>
        </Button>
        <Button m={"auto"} w={"40%"} h={"40%"} onClick={onMirror}>
          <Box align={"center"}>
            <Text fontSize={"40px"}> Mirror</Text>

            <CgScreenMirror fontSize={"60px"} />
          </Box>
        </Button>
      </Flex>
      <Button
        position={"absolute"}
        top={0}
        left={"0"}
        right={"0"}
        m={"auto"}
        w={"90%"}
        h={"40px"}
        borderTopRadius={"0"}
        borderBottomRadius={"50px"}
        onClick={(e) => {
          onStitch(e, "top");
        }}
      >
        <ChevronUpIcon></ChevronUpIcon>
      </Button>
      <Flex
        direction={"column"}
        position={"absolute"}
        left={"0"}
        h={"100%"}
        justifyContent={"center"}
      >
        <Button
          w={"20px"}
          h={"95%"}
          borderLeftRadius={"0"}
          borderRightRadius={"50px"}
          onClick={(e) => {
            onStitch(e, "left");
          }}
        >
          <ChevronLeftIcon />
        </Button>
      </Flex>
      <Flex
        direction={"column"}
        position={"absolute"}
        right={"0"}
        h={"100%"}
        justifyContent={"center"}
      >
        <Button
          position={"absolute"}
          right={0}
          w={"40px"}
          h={"95%"}
          borderLeftRadius={"50px"}
          borderRightRadius={"0"}
          onClick={(e) => {
            onStitch(e, "right");
          }}
        >
          <ChevronRightIcon />
        </Button>
      </Flex>
      <Button
        position={"absolute"}
        bottom={0}
        left={0}
        right={0}
        w={"90%"}
        h={"40px"}
        m={"auto"}
        borderTopRadius={"50px"}
        borderBottomRadius={"0"}
        onClick={(e) => {
          onStitch(e, "bottom");
        }}
      >
        <ChevronDownIcon />
      </Button>
    </Box>
  );
}
