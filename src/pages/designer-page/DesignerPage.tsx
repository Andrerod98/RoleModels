/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-case-declarations */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AddIcon } from "@chakra-ui/icons";
import { Box, TabPanel, Tabs, TabPanels, TabList, Tab } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";
import { EditableTab } from "./components/EditableTab";
import { InteractionsTab } from "./InteractionsTab";

import { RoleTab } from "./RoleTab";
interface SingleTabProps {}

export const DesignerPage = (props: SingleTabProps) => {
  const { app } = useContext<CrossAppState>(CrossAppContext);
  const [curTab, setCurTab] = useState("default");

  const tabs = Array.from(app.getSharedObject().getRoles());

  const curIndex = tabs.findIndex((tab) => tab.getName() === curTab);

  /*const refresh = ()=>{
    props.project.getLayoutManager().setLayout(value);
  }*/

  const loadRole = (role: string) => {
    setCurTab(role);

    const r = app.getRole(curTab);

    if (r === undefined) {
      console.warn("The layout manager of " + role + " was not found.");
      console.table(Array.from(app.getSharedObject().getRoles()));
      return;
    }

    //Load role
    /* setValue(
      Utils.jsonToString(
        props.app
          .getRole(curTab)
          .getViews()
          .map((v) => v.toView())
      )
    );

    setCursorPosition({ row: 0, column: 0 });
    setAlert(false);*/
  };
  const handleTabClick = (role: string) => {
    loadRole(role);
  };

  const handleTabClose = (role: string) => {
    app.getSharedObject().removeRole(role);
    loadRole("default");
  };

  const handleTabSubmit = async (role: string, e: any) => {
    const nextValue = e;
    if (nextValue === "") {
      return;
    }

    await app.getSharedObject().renameRole(role, nextValue);
    loadRole(nextValue);
  };

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
