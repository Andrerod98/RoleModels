import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoggingWindow } from "../components/LoggingWindow";
import { Role } from "../shared-application/roles/Role";
import { Header } from "../components/header";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { QuickInteractionModal } from "../components/QuickInteractionModal";
import { CrossDeviceInteractionModal } from "../components/CrossDeviceInteractionModal";

interface PageLayoutProps {
  readonly children: JSX.Element;
}

export function PageLayout(props: PageLayoutProps) {
  const {
    app,

    isLoggingOpen,
    setLoggingOpen,
    setSelectedNode,
    setNewViewId,
  } = useContext<CrossAppState>(CrossAppContext);
  const model = app.getSharedObject();

  const handleLoggingOpen = () => {
    setLoggingOpen(!isLoggingOpen);
  };

  const handleLoggingClose = () => {
    setLoggingOpen(false);
  };

  /*const layout = app
    .getSharedObject()
    .getCurrentConfigurationOfRole(role.getName());*/

  return (
    <>
      <Box zIndex={1000} w={"100%"}>
        <Header
          app={app}
          myRole={model.getDeviceRole()}
          roles={Array.from(model.getRoles()).map((role: Role) =>
            role.getName()
          )}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
            setSelectedNode("");
            // setUI(props.model.getCombinedUI());
          }}
          onLoggingOpen={handleLoggingOpen}
        />
      </Box>
      {props.children}

      <QuickInteractionModal />
      <CrossDeviceInteractionModal
        onViewChange={(newViewId: string) => {
          setNewViewId(newViewId);
        }}
      />
      <LoggingWindow isOpen={isLoggingOpen} onClose={handleLoggingClose} />
    </>
  );
}
