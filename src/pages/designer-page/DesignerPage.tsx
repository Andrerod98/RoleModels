/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-case-declarations */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Box, TabPanel, Tabs, TabPanels, TabList, Tab } from "@chakra-ui/react";
import React from "react";
import { InteractionsTab } from "./InteractionsTab";

import { RoleTab } from "./RoleTab";
interface SingleTabProps {}

export const DesignerPage = (props: SingleTabProps) => {
  return (
    <Box h={"100%"} overflow={"hidden"}>
      <Tabs size={"sm"} variant={"enclosed"} h={"100%"} mt={"5px"}>
        <Box>
          <TabList pl={10}>
            <Tab
              ml={"5px"}
              bg={"transparent"}
              _hover={{ bg: "blackAlpha.100" }}
            >
              Design
            </Tab>
            <Tab ml={"5px"} _hover={{ bg: "blackAlpha.100" }}>
              Interactions
            </Tab>
          </TabList>
        </Box>
        <TabPanels h={"calc(100vh - 40px)"}>
          <TabPanel key={"tab-panel-design"} p={0} h={"100%"}>
            <MemoizedRole />
          </TabPanel>

          <TabPanel
            key={"tab-panel-interactions"}
            p={0}
            h={"100%"}
            overflowY={"scroll"}
          >
            <InteractionsTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export const MemoizedRole = React.memo(RoleTab);
