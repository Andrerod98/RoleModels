import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { CrossDeviceApplication } from "../shared-application/CrossDeviceApplication";
import { LoggingWindow } from "../components/LoggingWindow";
import { Role } from "../shared-application/roles/Role";
import { Header } from "../components/header";

interface ManagerComponentProps {
  readonly app: CrossDeviceApplication;
  readonly children: JSX.Element;
}

export function PageLayout(props: ManagerComponentProps) {
  const model = props.app.getSharedObject();
  const [loggingOpen, setLoggingOpen] = useState(false);

  const handleLoggingClose = () => {
    setLoggingOpen(false);
  };
  return (
    <Box position={"relative"} h={"100%"}>
      {props.children}
      <Box zIndex={1000} position={"absolute"} top={0} left={0} h={"100%"}>
        <Header
          app={props.app}
          myRole={model.getDeviceRole()}
          roles={Array.from(model.getRoles()).map((role: Role) =>
            role.getName()
          )}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
            // setUI(props.model.getCombinedUI());
          }}
          onViewChange={(newViewId: string) => {
            console.log(newViewId);
            //TODO
          }}
          onLoggingOpen={() => {}}
        />
      </Box>
      <LayoutModal
        layout={layout}
        newViewId={newViewId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setSelected={(newSelected: string) => {
          setSelectedNode(newSelected);
        }}
        selectedNode={selectedNode}
      />
      <LoggingWindow isOpen={loggingOpen} onClose={handleLoggingClose} />
    </Box>
  );
}
