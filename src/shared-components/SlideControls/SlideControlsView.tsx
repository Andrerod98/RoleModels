import React from "react";
import { SlideControlsModel } from ".";
import { Flex, IconButton, Spacer } from "@chakra-ui/react";
import { SlideControlsController } from "./SlideControlsController";
import { BsFullscreen } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export function SlideControlsView({
  controller,
}: {
  controller: SlideControlsController;
}) {
  const component = controller.get() as SlideControlsModel;

  return (
    <Flex {...component}>
      <Spacer />
      <IconButton
        aria-label='Search database'
        borderRadius={0}
        colorScheme={"blue"}
        m={2}
        variant='outline'
        size={"sm"}
        icon={<IoChevronBack />}
      />
      <IconButton
        aria-label='Search database'
        borderRadius={0}
        colorScheme={"blue"}
        variant='outline'
        m={2}
        size={"sm"}
        icon={<IoChevronForward />}
      />
      <Spacer />
      <IconButton
        aria-label='Search database'
        borderRadius={0}
        colorScheme={"blue"}
        variant='outline'
        size={"sm"}
        mt={2}
        icon={<BsFullscreen />}
      />
    </Flex>
  );
}
