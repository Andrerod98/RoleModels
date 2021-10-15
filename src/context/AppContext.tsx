import React, { createContext, useEffect, useState } from "react";
import { CrossDeviceApplication } from "../shared-application/CrossDeviceApplication";
import { IDevice } from "../shared-application/devices/IDevice";
import { IInteraction } from "../shared-application/managers/InteractionsManager";
import { IRole } from "../shared-application/roles/IRole";
import { LayoutNode } from "../shared-application/workspaces/LayoutNode";
import { Role } from "../shared-application/roles/Role";
import { Container } from "../shared-application/containers/Container";
import { RoleModelsDataObject } from "../shared-application/shared-object/RoleModelsDataObject";
import { Workspace } from "../shared-application/workspaces/Workspace";

export const CrossAppContext = createContext(undefined);

export interface CrossAppState {
  app: CrossDeviceApplication;
  roleModels: RoleModelsDataObject;
  devices: IDevice[];
  roles: IRole[];
  containers: Container[];
  interactions: IInteraction[];
  currentWorkspace: Workspace;
  primaryWorkspace: Workspace;
  mode: { mode: string; properties?: any };
  localMode: {
    mode: string;
    properties?: any;
  };
  setLocalMode: any;
  role: Role;
  views: Container[];
  isOpen: {
    header: boolean;
    logging: boolean;
    saveWorkspaceModal: boolean;
  };
  setOpen: any;
  isMaxFill: boolean;
  setMaxFill: any;
  selectedNode: string;
  setSelectedNode: any;
}

export const CrossAppProvider = ({
  app,
  children,
}: {
  app: CrossDeviceApplication;
  children: JSX.Element;
}) => {
  const roleModels = app.getSharedObject();
  const [isOpen, setOpen] = useState({
    header: false,
    logging: false,
    layout: false,
    saveWorkspaceModal: false,
  });

  // local modes: Push, QuickInteraction, ContainerTransfer
  /* Mode: Push  
     Properties: {view: string, from: string}
     Mode: Quick Interaction
     Properties: {view: string, from: string}
     Mode: ContainerTransfer
     Properties: {view: string, from: string}
     Mode: ContainerSelection
     Properties: {container: string}
     Mode: ContainerPosition
     Properties: {container: string, from:string}
  */
  const [localMode, setLocalMode] = useState({
    mode: "",
    properties: {},
  });

  const [selectedNode, setSelectedNode] = useState("");

  const [isMaxFill, setMaxFill] = useState(false);

  const generateState = () => {
    return {
      devices: Array.from(roleModels.getDevices()),
      roles: Array.from(roleModels.getRoles()),
      containers: Array.from(roleModels.getContainers()),
      interactions: Array.from(roleModels.getInteractions()),

      currentWorkspace: roleModels.getCurrentConfiguration().get(),

      primaryWorkspace: roleModels.getPrimaryWorkspace(1),

      role: roleModels.getMyRole(),
      mode: roleModels.getMode(),
    };
  };
  const [state, setState] = useState(generateState());

  /*if (layout && selectedNode != "" && !layout.getChildByViewId(selectedNode)) {
    setSelectedNode("");
  }*/

  const debug = false;
  useEffect(() => {
    const onChange = () => {
      setState(generateState());
    };

    roleModels.on("deviceRemoved", () => {
      const nDevices = Array.from(roleModels.getDevices()).length;
      const workspaces = roleModels.getWorkspacesWithNDevices(nDevices);
      if (nDevices + 1 > 1) roleModels.savePrimaryWorkspace(nDevices + 1);

      if (nDevices > 1) {
        roleModels.setMode("SUGGEST", { saved: workspaces, type: "removed" });
      } else {
        roleModels.loadConfiguration(
          roleModels.getPrimaryWorkspace(1).toWorkspace()
        );
      }
    });

    roleModels.on("deviceConnected", () => {
      const nDevices = Array.from(roleModels.getDevices()).length;
      const workspaces = roleModels.getWorkspacesWithNDevices(nDevices);
      if (nDevices - 1 > 1) roleModels.savePrimaryWorkspace(nDevices - 1);

      if (nDevices > 1)
        setLocalMode({
          mode: "SUGGEST",
          properties: { saved: workspaces, type: "added" },
        });
    });

    roleModels.on("change", (sharedObjectName, sharedObjectValue?) => {
      //If device is added
      //Save the primary workspace if nDevices > 1

      //If device is removed
      //Save the primary workspace if nDevices > 1

      if (debug) console.log(sharedObjectName);

      if (sharedObjectName === "qi") {
        const qi = roleModels.getMode();

        if (qi && qi.from !== roleModels.getMyRole().getId()) {
          //setSelectedContainerPush({ view: qi.viewId, from: qi.from });
          //setPushInteractionOpen(true);
        }
      }

      onChange();
    });

    onChange();

    return () => {
      roleModels.off("change", onChange);
      roleModels.deleteAllEventListeners();
    };
  }, []);

  return (
    <CrossAppContext.Provider
      value={{
        app: app,
        roleModels: roleModels,
        devices: state.devices,
        roles: state.roles,
        containers: state.containers,
        interactions: state.interactions,

        currentWorkspace: state.currentWorkspace,
        primaryWorkspace: state.primaryWorkspace,
        role: state.role,
        mode: state.mode,

        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,

        localMode: localMode,
        setLocalMode: setLocalMode,

        isMaxFill: isMaxFill,
        setMaxFill: setMaxFill,
        isOpen: isOpen,
        setOpen: setOpen,
      }}
    >
      {children}
    </CrossAppContext.Provider>
  );
};
