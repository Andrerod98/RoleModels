/* eslint-disable prettier/prettier */
/* eslint-disable no-unreachable */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { FC } from "react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { Header } from "../header/Header";
import { DesignTool } from "./DesignTool";

interface ManagerComponentProps {
  readonly app: CrossDeviceApplication;
}

export const DesignerComponent: FC<ManagerComponentProps> = (props) => {
  const model = props.app.getSharedObject();
  return (
    <div>
      <div>
        <Header
          app={props.app}
          myRole={model.getDeviceRole()}
          roles={model.getRoles().map((role) => role.getName())}
          onManagerClick={() => {
            model.promoteToManager();
          }}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
            // setUI(props.model.getCombinedUI());
          }}
          onDesignClick={() => {
            model.promoteToDesigner();
          }}
          onLoggingOpen={() => {
           
          }}
        />
        <DesignTool app={props.app} />
      </div>
    </div>
  );
};
