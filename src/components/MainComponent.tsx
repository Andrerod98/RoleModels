/* eslint-disable no-constant-condition */
/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState, useEffect, FC } from "react";
import { RoleComponent } from "./role/RoleComponent";

import "./styles.scss";
import { ManagerComponent } from "./manager/ManagerComponent";
import { Box } from "@chakra-ui/react";
import { CrossDeviceApplication } from "../CrossDeviceApplication";
import { DesignerComponent } from "./designer";
import { IDevice } from "../shared-object/devices/IDevice";
import { Role } from "../shared-object/roles/Role";

interface MainComponentProps {
  readonly app: CrossDeviceApplication;
}

interface MainComponentState {
  devices: IDevice[];
  role: Role;
}

export const MainComponent: FC<MainComponentProps> = (
  props: MainComponentProps
) => {
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
      {model.isManager() ? (
        <ManagerComponent app={props.app} devices={state.devices} />
      ) : model.isDesigner() ? (
        <DesignerComponent app={props.app} />
      ) : (
        <RoleComponent app={props.app} role={state.role} />
      )}
    </Box>
  );
};
