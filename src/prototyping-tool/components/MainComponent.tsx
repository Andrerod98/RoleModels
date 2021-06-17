/* eslint-disable no-constant-condition */
/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState, useEffect, FC } from "react";
import { RoleComponent } from "./role/RoleComponent";

import "./styles.scss";
import { IDevice } from "../shared-object/devices/IDevice";
import { ManagerComponent } from "./manager/ManagerComponent";
import { CombinedView } from "../shared-object/combined-views/combined-view/CombinedView";
import { Box } from "@chakra-ui/react";
import { CrossDeviceApplication } from "../Application";
import { View } from "../shared-object/views/View";
import { QRCodeController } from "../shared-object/qrcode/QRCodeController";
import { DesignerComponent } from "./designer";

interface MainComponentProps {
  readonly app: CrossDeviceApplication;
}

interface MainComponentState {
  devices: IDevice[];
  combinedViews: CombinedView[];
  views: View[];
  qrCodes: QRCodeController[];
}

export const MainComponent: FC<MainComponentProps> = (
  props: MainComponentProps
) => {
  const model = props.app.getSharedObject();
  const generateState = () => {
    return {
      devices: model.getDevices(),
      combinedViews: model.getMyCombinedViews(),
      views: model.getMyViews(),
      qrCodes: model.getMyQrCodes(),
    };
  };
  const [state, setState] = useState<MainComponentState>(generateState());

  // Setup a listener that
  useEffect(() => {
    const handleWindowBeforeUnload = (ev: BeforeUnloadEvent): any => {
      // props.model.deleteDevice();
      return undefined;
    };
    window.addEventListener("beforeunload", handleWindowBeforeUnload);

    const onChange = () => {
      console.log("The state has changed...");
      setState(generateState());
    };
    model.on("change", (type) => {
      console.log(type);
      onChange();
    });

    // useEffect runs after the first render so we will update the view again incase there
    // were changes that came into the model in between generating initialState and setting
    // the above event handler

    onChange();
    return () => {
      // When the view dismounts remove the listener to avoid memory leaks
      window.removeEventListener("beforeunload", handleWindowBeforeUnload);
      model.off("change", onChange);
      model.deleteAllEventListeners();
    };
  }, []);

  //  const cv = props.app.getCombinedView(props.app.getViewId());
  /* Choose roles */
  //   const view = props.app.getView(props.app.getViewId());
  /* Migrate, Deposit, Mirror, Stitch */
  return (
    <Box h={"100vh"} maxW={"100vw"} overflowX={"hidden"}>
      {model.isManager() ? (
        <ManagerComponent app={props.app} devices={state.devices} />
      ) : model.isDesigner() ? (
        <DesignerComponent app={props.app} />
      ) : (
        <RoleComponent
          app={props.app}
          combinedViews={state.combinedViews}
          views={state.views}
          qrCodes={state.qrCodes}
        ></RoleComponent>
      )}
    </Box>
  );
};
