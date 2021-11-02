import React from "react";
import { RemoteControlModel } from ".";
import { Flex, Grid, GridItem, IconButton } from "@chakra-ui/react";
import { RemoteControlController } from "./RemoteControlController";
import {
  AiOutlineUp,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineDown,
} from "react-icons/ai";
import {
  BiArrowBack,
  BiHome,
  BiTargetLock,
  BiMicrophone,
} from "react-icons/bi";
import { BsPower } from "react-icons/bs";
import { HiRewind, HiPlay, HiFastForward } from "react-icons/hi";
import { MdRadioButtonChecked } from "react-icons/md";

export function RemoteControlView({
  controller,
}: {
  controller: RemoteControlController;
}) {
  const component = controller.get() as RemoteControlModel;

  return (
    <Flex
      {...component}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      bg={"gray.900"}
      h={"100%"}
      borderRadius={"10px"}
    >
      <IconButton
        aria-label='Search database'
        borderRadius={40}
        colorScheme={"red"}
        m={2}
        icon={<BsPower />}
      />

      <Flex>
        {" "}
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          m={2}
          icon={<BiArrowBack />}
        />{" "}
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          m={2}
          icon={<BiHome />}
        />
      </Flex>
      <Grid
        h='100px'
        templateRows='repeat(3, 1fr)'
        templateColumns='repeat(3, 1fr)'
        m={2}
      >
        <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='white'>
          <IconButton
            aria-label='Search database'
            borderRadius={0}
            colorScheme={"purple"}
            icon={<AiOutlineUp />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='white'>
          <IconButton
            aria-label='Search database'
            borderRadius={0}
            colorScheme={"purple"}
            icon={<AiOutlineLeft />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='white'>
          <IconButton
            aria-label='Search database'
            borderRadius={0}
            colorScheme={"purple"}
            icon={<MdRadioButtonChecked />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='white'>
          <IconButton
            aria-label='Search database'
            borderRadius={0}
            colorScheme={"purple"}
            icon={<AiOutlineRight />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
        <GridItem rowSpan={1} colSpan={1} bg='white'>
          <IconButton
            aria-label='Search database'
            borderRadius={0}
            colorScheme={"purple"}
            icon={<AiOutlineDown />}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} bg=''></GridItem>
      </Grid>
      <Flex mx={2} mt={8}>
        {" "}
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          icon={<BiTargetLock />}
        />{" "}
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          icon={<BiMicrophone />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          icon={<BiHome />}
        />
      </Flex>
      <Flex m={2}>
        {" "}
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          icon={<HiRewind />}
        />{" "}
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          icon={<HiPlay />}
        />
        <IconButton
          aria-label='Search database'
          borderRadius={0}
          bg={"black"}
          color={"white"}
          icon={<HiFastForward />}
        />
      </Flex>
    </Flex>
  );
}
