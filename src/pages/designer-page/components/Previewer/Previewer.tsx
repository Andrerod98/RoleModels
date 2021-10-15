/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Box, Spacer, IconButton, Flex, useColorMode } from "@chakra-ui/react";

import { IoRefresh } from "react-icons/io5";
import React, { useMemo } from "react";
import { Preview } from "./Preview";
import { HiViewGridAdd } from "react-icons/hi";
import { ILayoutNode } from "../../../../shared-application/workspaces/ILayoutNode";
interface PreviewerProps {
  layout: ILayoutNode;

  isOpenLayoutModal: boolean;
  handleClick: () => void;
  handleViewClick: () => void;
  selectedNode: string;
  setSelected: (newSelected: string) => void;
}

export const Previewer = (props: PreviewerProps) => {
  const { colorMode } = useColorMode();

  return (
    <Box w={"100%"} h={"100%"} m={2}>
      <Box position={"relative"} w={"100%"} h={"100%"} px={"15px"} py={"15px"}>
        <Flex>
          <IconButton
            aria-label={"Search database"}
            size={"sm"}
            onClick={props.handleViewClick}
            mb={2}
            icon={<HiViewGridAdd />}
          />
          <IconButton
            aria-label={"Search database"}
            size={"sm"}
            ml={2}
            onClick={props.handleClick}
            mb={2}
            icon={<IoRefresh />}
          />
          <Spacer></Spacer>
        </Flex>
        <Box
          w={"100%"}
          h={"90%"}
          boxShadow={"xs"}
          bg={colorMode === "light" ? "white" : "gray.700"}
          overflow={"hidden"}
          position={"relative"}
          zIndex={1000}
        >
          {useMemo(() => {
            return (
              <Preview
                width={"100%"}
                height={"100%"}
                layout={props.layout}
                selectedNode={props.selectedNode}
                isOpenLayoutModal={props.isOpenLayoutModal}
                setSelected={(newSelected: string) => {
                  props.setSelected(newSelected);
                }}
              />
            );
          }, [props.layout])}
        </Box>
      </Box>
    </Box>
  );
};
