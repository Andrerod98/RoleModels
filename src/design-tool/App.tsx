/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import "./styles/App.css";

import { Box, ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { SingleTab } from "./components/single-tab/SingleTab";
import React, { useState } from "react";
import { TemplateEditor } from "./components/TemplateEditor";
import { LoggingWindow } from "./components/LoggingWindow";
import { CrossDeviceApplication } from "../prototyping-tool/Application";

interface DesignToolProps {
  app: CrossDeviceApplication;
}
export const DesignTool = (props: DesignToolProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  /*const generateState = () => {
    return {
      views: [],
    };
  };
  const [state, setState] = useState<AppState>(generateState());

  useEffect(() => {
    const onChange = () => {
      console.log("The state has changed...");
      setState(generateState());
    };
    props.project.on("change", onChange);

    onChange();
    return () => {
      props.project.off("change", onChange);
    };
  }, []);*/

  const [loggingOpen, setLoggingOpen] = useState(false);

  const handleLoggingClose = () => {
    console.log("Closing");
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
        <SingleTab app={props.app} onChange={(value) => {}} />
        <TemplateEditor
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          onCreate={() => {
            console.log();
          }}
        />
        <LoggingWindow
          isOpen={loggingOpen}
          onClose={handleLoggingClose}
        ></LoggingWindow>
      </Box>
    </ChakraProvider>
  );
};
