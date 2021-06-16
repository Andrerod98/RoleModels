/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import "./styles/App.css";

import {
  Box,
  ChakraProvider,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { CombinedTab } from "./components/combined-tab/CombinedTab";
import { ContextMenu } from "./components/ContextMenu";
import { Header } from "./components/Header";
import { SingleTab } from "./components/single-tab/SingleTab";
import React, { useEffect, useState } from "react";
import { ITemplate, Project } from "./Project";
import { TemplateEditor } from "./components/TemplateEditor";
import { LoggingWindow } from "./components/LoggingWindow";
import { View } from "../prototyping-tool/shared-object/views/View";
interface AppState {
  template: ITemplate;
  views: View[];
}

interface DesignToolProps {
  project: Project;
}
export const DesignTool = (props: DesignToolProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const generateState = () => {
    return {
      template: props.project.getTemplate(),
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
  }, []);

  const [value, setValue] = useState("");
  const [loggingOpen, setLoggingOpen] = useState(false);

  const handleLoggingClose = () => {
    console.log("Closing");
    setLoggingOpen(false);
  };
  return (
    <ChakraProvider resetCSS={true}>
      <Box maxH={"100vh"}>
        <ContextMenu project={props.project}></ContextMenu>

        <Tabs isManual variant={"soft-rounded"}>
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
        </Tabs>
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
