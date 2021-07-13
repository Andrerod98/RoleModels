/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Box, Spacer, IconButton, Flex, useColorMode } from "@chakra-ui/react";

import { IoRefresh } from "react-icons/io5";
import { FullScreenWrapper } from "./FullScreenWrapper";
import React, { useMemo } from "react";
import { View } from "../../../../shared-application/views/View";
import { Preview } from "./Preview";
import { CrossDeviceApplication } from "../../../../shared-application/CrossDeviceApplication";
import { Role } from "../../../../shared-application/roles/Role";
import { ILayoutNode } from "../../../../shared-application/roles/ILayout";
interface PreviewerProps {
  layout: ILayoutNode;
  app: CrossDeviceApplication;

  isOpenLayoutModal: boolean;
  handleClick: () => void;
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
            onClick={props.handleClick}
            mb={2}
            icon={<IoRefresh></IoRefresh>}
          />
          <Spacer></Spacer>
        </Flex>
        <Box
          w={"100%"}
          h={"500px"}
          boxShadow={"xs"}
          bg={colorMode === "light" ? "white" : "gray.700"}
          overflow={"hidden"}
          position={"relative"}
        >
          {useMemo(() => {
            return (
              <Preview
                width={"100%"}
                height={"500px"}
                layout={props.layout}
                app={props.app}
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
