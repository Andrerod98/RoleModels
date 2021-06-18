/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import "./styles/App.css";

import { Box, ChakraProvider } from "@chakra-ui/react";
import React, { useState } from "react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { LoggingWindow } from "../../LoggingWindow";
import { SingleTab } from "./single-tab/SingleTab";

interface DesignToolProps {
  app: CrossDeviceApplication;
}
export const DesignTool = (props: DesignToolProps) => {
  const [loggingOpen, setLoggingOpen] = useState(false);

  const handleLoggingClose = () => {
    setLoggingOpen(false);
  };
  return (
    <ChakraProvider resetCSS={true}>
      <Box maxH={"100vh"}>
        {/* <ContextMenu project={props.app}></ContextMenu> */}

        {/*<Tabs isManual variant={"soft-rounded"}>
         <Header
            onSaveProject={() => {
              props.project.loadTemplate(value);
              props.project.saveProject();
            }}
            onOpenProject={() => {
              props.project.openProject();
              setValue(value);
            }}
            onChangeTemplate={onOpen}
            onPrototype={() => {
              props.project.prototype();
            }}
            onLoggingOpen={() => {
              setLoggingOpen(!loggingOpen);
            }}
          />
          <TabPanels h={"100%"}>
            <TabPanel p={0} h={"100%"}>
              <SingleTab
                project={props.project}
                template={state.template}
                onChange={(value) => setValue(value)}
              />
            </TabPanel>
            <TabPanel height={"calc(100% - 15px)"} p={0}>
              <CombinedTab
                app={props.project.getDiagram()}
                project={props.project}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>*/}
        <SingleTab app={props.app} />

        <LoggingWindow
          isOpen={loggingOpen}
          onClose={handleLoggingClose}
        ></LoggingWindow>
      </Box>
    </ChakraProvider>
  );
};
