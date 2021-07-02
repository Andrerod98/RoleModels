/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Box, Spacer, IconButton, Flex, useColorMode } from "@chakra-ui/react";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

import { IoRefresh } from "react-icons/io5";
import { FullScreenWrapper } from "./FullScreenWrapper";
import React from "react";
import { View } from "../../../../shared-application/views/View";
import { Preview } from "./Preview";
import { LayoutNode } from "../../../../shared-application/roles/Layout";
import { CrossDeviceApplication } from "../../../../shared-application/CrossDeviceApplication";
import { Role } from "../../../../shared-application/roles/Role";
import { ILayoutNode } from "../../../../shared-application/roles/ILayout";
interface PreviewerProps {
  layout: ILayoutNode;
  app: CrossDeviceApplication;
  role: Role;
  isOpenLayoutModal: boolean;
  handleClick: () => void;
  onChangeView: (newView: View) => void;
  onChangeViews: (newViews: View[]) => void;
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

          <FullScreenWrapper>
            <Preview
              width={"100%"}
              height={"100%"}
              layout={props.layout}
              selectedNode={props.selectedNode}
              setSelected={props.setSelected}
              isOpenLayoutModal={props.isOpenLayoutModal}
              app={props.app}
              role={props.role}
            />
          </FullScreenWrapper>
        </Flex>
        <Box
          w={"100%"}
          h={"500px"}
          boxShadow={"xs"}
          bg={colorMode === "light" ? "white" : "gray.700"}
          overflow={"hidden"}
          position={"relative"}
        >
          <Preview
            width={"100%"}
            height={"500px"}
            layout={props.layout}
            app={props.app}
            role={props.role}
            selectedNode={props.selectedNode}
            isOpenLayoutModal={props.isOpenLayoutModal}
            setSelected={(newSelected: string) => {
              props.setSelected(newSelected);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
