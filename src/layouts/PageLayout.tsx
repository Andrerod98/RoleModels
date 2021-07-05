import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoggingWindow } from "../components/LoggingWindow";
import { Role } from "../shared-application/roles/Role";
import { Header } from "../components/header";
import { LayoutModal } from "../components/LayoutModal";
import { CrossAppState, CrossAppContext } from "../context/AppContext";

interface PageLayoutProps {
  readonly children: JSX.Element;
}

export function PageLayout(props: PageLayoutProps) {
  const {
    app,
    role,
    isLayoutOpen,
    setLayoutOpen,
    isLoggingOpen,
    setLoggingOpen,
    selectedNode,
    setSelectedNode,
    newViewId,
    setNewViewId,
  } = useContext<CrossAppState>(CrossAppContext);
  const model = app.getSharedObject();

  const handleLayoutOpen = () => {
    setLayoutOpen(true);
  };

  const handleLayoutClose = () => {
    setLayoutOpen(false);
  };

  const handleLoggingOpen = () => {
    setLoggingOpen(!isLoggingOpen);
  };

  const handleLoggingClose = () => {
    setLoggingOpen(false);
  };

  const layout = app
    .getSharedObject()
    .getCurrentConfigurationOfRole(role.getName());

  return (
    <Box position={"relative"} h={"100%"}>
      {props.children}
      <Box zIndex={1000} position={"absolute"} top={0} left={0} h={"100%"}>
        <Header
          app={app}
          myRole={model.getDeviceRole()}
          roles={Array.from(model.getRoles()).map((role: Role) =>
            role.getName()
          )}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
            // setUI(props.model.getCombinedUI());
          }}
          onViewChange={(newViewId: string) => {
            setNewViewId(newViewId);
          }}
          onLoggingOpen={handleLoggingOpen}
        />
      </Box>
      <LayoutModal
        layout={layout}
        newViewId={newViewId}
        isOpen={isLayoutOpen}
        onOpen={handleLayoutOpen}
        onClose={handleLayoutClose}
        setSelected={(newSelected: string) => {
          setSelectedNode(newSelected);
        }}
        selectedNode={selectedNode}
      />
      <LoggingWindow isOpen={isLoggingOpen} onClose={handleLoggingClose} />
    </Box>
  );
}
