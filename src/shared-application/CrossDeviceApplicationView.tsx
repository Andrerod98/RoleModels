import React, { useContext } from "react";
import { RolePage } from "../pages/role-page/RolePage";

import "../styles/styles.scss";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { CrossDeviceApplication } from "./CrossDeviceApplication";

import { DesignerPage } from "../pages/designer-page/DesignerPage";
import { ManagerPage } from "../pages/manager-page";
import { PageLayout } from "../layouts/PageLayout";
import {
  CrossAppContext,
  CrossAppProvider,
  CrossAppState,
} from "../context/AppContext";

interface CrossDeviceApplicationViewProps {
  readonly app: CrossDeviceApplication;
}

export function CrossDeviceApplicationView(
  props: CrossDeviceApplicationViewProps
) {
  return (
    <ChakraProvider>
      <Box h={"100vh"} maxW={"100vw"} overflowX={"hidden"}>
        <CrossAppProvider app={props.app}>
          <Pages />
        </CrossAppProvider>
      </Box>
    </ChakraProvider>
  );
}

function Pages() {
  const { roleModels } = useContext<CrossAppState>(CrossAppContext);
  return (
    <PageLayout>
      {roleModels.isManager() ? (
        <ManagerPage />
      ) : roleModels.isDesigner() ? (
        <DesignerPage />
      ) : (
        <RolePage />
      )}
    </PageLayout>
  );
}
