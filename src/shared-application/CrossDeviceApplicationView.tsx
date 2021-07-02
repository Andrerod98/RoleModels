import React, { useState, useEffect } from "react";
import { RolePage } from "../pages/role-page/RolePage";

import "../styles/styles.scss";
import { Box } from "@chakra-ui/react";
import { CrossDeviceApplication } from "./CrossDeviceApplication";
import { IDevice } from "./devices/IDevice";
import { Role } from "./roles/Role";
import { DesignerPage } from "../pages/designer-page/DesignerPage";
import { ManagerPage } from "../pages/manager-page";
import { PageLayout } from "../layouts/PageLayout";

interface CrossDeviceApplicationViewProps {
  readonly app: CrossDeviceApplication;
}

interface MainComponentState {
  devices: IDevice[];
  role: Role;
}

export function CrossDeviceApplicationView(
  props: CrossDeviceApplicationViewProps
) {
  const model = props.app.getSharedObject();
  const generateState = () => {
    return {
      devices: Array.from(model.getDevices()),
      role: model.getMyRole(),
    };
  };
  const [state, setState] = useState<MainComponentState>(generateState());

  useEffect(() => {
    const onChange = () => {
      console.log("The state has changed...");
      setState(generateState());
    };
    model.on("change", (type) => {
      console.log(type);
      onChange();
    });

    onChange();

    return () => {
      model.off("change", onChange);
      model.deleteAllEventListeners();
    };
  }, []);

  return (
    <Box h={"100vh"} maxW={"100vw"} overflowX={"hidden"}>
      <PageLayout app={props.app}>
        {model.isManager() ? (
          <ManagerPage app={props.app} devices={state.devices} />
        ) : model.isDesigner() ? (
          <DesignerPage app={props.app} />
        ) : (
          <RolePage app={props.app} role={state.role} />
        )}
      </PageLayout>
    </Box>
  );
}
