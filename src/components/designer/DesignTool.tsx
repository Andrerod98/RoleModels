/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import "./styles/App.css";

import { Box } from "@chakra-ui/react";
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
    <Box h={"100%"}>
      <SingleTab app={props.app} />

      <LoggingWindow
        isOpen={loggingOpen}
        onClose={handleLoggingClose}
      ></LoggingWindow>
    </Box>
  );
};
