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
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CombinedTab } from "./components/combined-tab/CombinedTab";
import { ContextMenu } from "./components/ContextMenu";
import { Header } from "./components/Header";
import { SingleTab } from "./components/single-tab/SingleTab";
import { TemplateSelector } from "./components/TemplateSelector";
import React, { useEffect, useState } from "react";
import { ITemplate, Project } from "./Project";
import { TemplateEditor } from "./components/TemplateEditor";
import { LoggingWindow } from "./components/LoggingWindow";
import { View } from "../prototyping-tool/shared-object/views/View";
interface AppState {
  template: ITemplate;
  views: View[];
}
const project = new Project("untitled");
export const DesignTool = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const generateState = () => {
    console.log(project.getTemplate());
    return {
      template: project.getTemplate(),
      views: [],
    };
  };
  const [state, setState] = useState<AppState>(generateState());

  useEffect(() => {
    const onChange = () => {
      console.log("The state has changed...");
      setState(generateState());
    };
    project.on("change", onChange);

    onChange();
    return () => {
      project.off("change", onChange);
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
      <Router>
        <Switch>
          <Route path={"/project"}>
            <Box maxH={"100vh"}>
              <ContextMenu project={project}></ContextMenu>

              <Tabs isManual variant={"soft-rounded"}>
                <Header
                  onSaveProject={() => {
                    project.loadTemplate(value);
                    project.saveProject();
                  }}
                  onOpenProject={() => {
                    project.openProject();
                    setValue(value);
                  }}
                  onChangeTemplate={onOpen}
                  onPrototype={() => {
                    project.prototype();
                  }}
                  onLoggingOpen={() => {
                    setLoggingOpen(!loggingOpen);
                  }}
                />
                <TabPanels h={"100%"}>
                  <TabPanel p={0} h={"100%"}>
                    <SingleTab
                      project={project}
                      template={state.template}
                      onChange={(value) => setValue(value)}
                    />
                  </TabPanel>
                  <TabPanel height={"calc(100% - 15px)"} p={0}>
                    <CombinedTab app={project.getDiagram()} project={project} />
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
          </Route>

          <Route path={"/"}>
            <TemplateSelector project={project} />
          </Route>
        </Switch>
      </Router>
    </ChakraProvider>
  );
};
