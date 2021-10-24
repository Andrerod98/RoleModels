import { Flex, Button, Box, Text } from "@chakra-ui/react";
import React from "react";
import { CgArrowsExpandDownRight, CgEye, CgScreenMirror } from "react-icons/cg";

interface ContainerTransferActionChooserProps {
  onMirror: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onStitch: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    side: string
  ) => void;
  onClose: () => void;

  onQuickInteraction: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onMigrate: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
export function ContainerTransferActionChooser({
  onMirror,
  onStitch,
  onQuickInteraction,
  onClose,
  onMigrate,
}: ContainerTransferActionChooserProps) {
  return (
    <Box>
      <Flex
        position={"absolute"}
        bottom={0}
        left={0}
        right={0}
        top={0}
        m={0}
        onClick={onClose}
        direction={["column", "row"]}
        justifyContent={["center", "space-evenly"]}
        alignItems={"center"}
      >
        <Button
          w={["70%", "30%"]}
          h={["auto", "40%"]}
          my={["5px", "0"]}
          onClick={onMigrate}
        >
          <Box align={"center"}>
            <Text fontSize={["20px", "40px"]}> Migrate</Text>

            <CgArrowsExpandDownRight fontSize={"60px"} />
          </Box>
        </Button>
        <Button
          w={["70%", "30%"]}
          h={["auto", "40%"]}
          my={["5px", "0"]}
          onClick={onMirror}
        >
          <Box align={"center"}>
            <Text fontSize={["20px", "40px"]}>Mirror</Text>

            <CgScreenMirror fontSize={"60px"} />
          </Box>
        </Button>
        <Button
          w={["70%", "30%"]}
          h={["auto", "40%"]}
          my={["5px", "0"]}
          onClick={onQuickInteraction}
        >
          <Box align={"center"}>
            <Text fontSize={["20px", "40px"]}>Quick Interaction</Text>

            <CgEye fontSize={"60px"} />
          </Box>
        </Button>
      </Flex>
    </Box>
  );
}
