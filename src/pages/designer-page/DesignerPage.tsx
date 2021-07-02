/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-case-declarations */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AddIcon } from "@chakra-ui/icons";
import { Box, TabPanel, Tabs, TabPanels, TabList, Tab } from "@chakra-ui/react";
import React, { useState } from "react";
import { CrossDeviceApplication } from "../../shared-application/CrossDeviceApplication";
import { EditableTab } from "./components/EditableTab";

import { InteractionsTab } from "./InteractionsTab";
import { RoleTab } from "./RoleTab";
interface SingleTabProps {
  app: CrossDeviceApplication;
}

export const DesignerPage = (props: SingleTabProps) => {
  const [curTab, setCurTab] = useState("default");

  const tabs = Array.from(props.app.getSharedObject().getRoles());

  const curIndex = tabs.findIndex((tab) => tab.getName() === curTab);

  /*const refresh = ()=>{
    props.project.getLayoutManager().setLayout(value);
  }*/

  const loadRole = (role: string) => {
    setCurTab(role);

    const r = props.app.getRole(curTab);

    if (r === undefined) {
      console.warn("The layout manager of " + role + " was not found.");
      console.table(Array.from(props.app.getSharedObject().getRoles()));
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
    props.app.getSharedObject().removeRole(role);
    loadRole("default");
  };

  const handleTabSubmit = async (role: string, e: any) => {
    const nextValue = e;
    if (nextValue === "") {
      return;
    }

    await props.app.getSharedObject().renameRole(role, nextValue);
    loadRole(nextValue);
  };

  return (
    <Box h={"100%"} overflow={"hidden"}>
      <Tabs
        size={"sm"}
        variant={"enclosed"}
        h={"100%"}
        mt={"5px"}
        isManual
        onChange={() => {}}
        index={
          curIndex === -1
            ? curTab === "interactions"
              ? tabs.length + 1
              : 0
            : curIndex
        }
      >
        <Box>
          <TabList pl={10}>
            {tabs.map((tab, index) => (
              <EditableTab
                key={"tab-" + index}
                title={tab.getName()}
                onClick={() => {
                  handleTabClick(tab.getName());
                }}
                onClose={() => {
                  handleTabClose(tab.getName());
                }}
                onSubmit={(e) => {
                  handleTabSubmit(tab.getName(), e);
                }}
              />
            ))}

            <Tab
              ml={"5px"}
              bg={"transparent"}
              _hover={{ bg: "blackAlpha.100" }}
              onClick={() => {
                props.app.addRole("new");
              }}
            >
              <AddIcon />
            </Tab>
            <Tab
              ml={"5px"}
              colorScheme={"blue"}
              _hover={{ bg: "blackAlpha.100" }}
              onClick={() => {
                setCurTab("interactions");
              }}
            >
              Interactions
            </Tab>
          </TabList>
        </Box>
        <TabPanels h={"calc(100vh - 40px)"}>
          {tabs.map((tab, index) => (
            <TabPanel key={"tab-panel-" + index} p={0} h={"100%"}>
              <MemoizedRole role={tab} app={props.app} />
            </TabPanel>
          ))}
          <TabPanel key={"tab-panel-add"} p={0} h={"100%"}></TabPanel>
          <TabPanel key={"tab-panel-interactions"} p={0} h={"100%"}>
            <InteractionsTab application={props.app} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export const MemoizedRole = React.memo(RoleTab);
