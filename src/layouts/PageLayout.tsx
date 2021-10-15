import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoggingWindow } from "../components/LoggingWindow";
import { Header } from "../components/header";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { QuickInteractionModal } from "../components/QuickInteractionModal";
import { ContainerTransferActionModal } from "../components/ContainerTransferActionModal";
import { PushInteractionDialog } from "../components/PushInteractionDialog";
import { RecoveringModal } from "../components/RecoveringModal";
import { WorkspaceCreationDialog } from "../components/WorkspaceCreationDialog";
import { IRole } from "../shared-application/roles/IRole";
import { SuggestionModalNew } from "../components/SuggestionModalNew";

interface PageLayoutProps {
  readonly children: JSX.Element;
}

export function PageLayout(props: PageLayoutProps) {
  const { roleModels, roles, setSelectedNode, isOpen, setOpen } =
    useContext<CrossAppState>(CrossAppContext);

  return (
    <>
      <Box zIndex={1000} w={"100%"}>
        <Header
          myRole={roleModels.getDeviceRole()}
          roles={roles.map((role: IRole) => role.name)}
          onRoleClick={(role: string) => {
            roleModels.promoteToRole(role);
            setSelectedNode("");
          }}
          onLoggingOpen={() => {
            setOpen({ ...isOpen, logging: true });
          }}
        />
      </Box>
      {props.children}

      <PushInteractionDialog />
      <QuickInteractionModal />
      <ContainerTransferActionModal />
      <SuggestionModalNew />
      <RecoveringModal />
      <WorkspaceCreationDialog />
      <LoggingWindow />
    </>
  );
}
