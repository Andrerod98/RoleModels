import React, { createContext, useEffect, useState } from "react";
import { CrossDeviceApplication } from "../shared-application/CrossDeviceApplication";
import { IDevice } from "../shared-application/devices/IDevice";
import { LayoutNode } from "../shared-application/roles/Layout";
import { Role } from "../shared-application/roles/Role";
import { View } from "../shared-application/views/View";

export const CrossAppContext = createContext(undefined);

export interface CrossAppState {
  app: CrossDeviceApplication;
  devices: IDevice[];
  role: Role;
  views: View[];
  layout: LayoutNode;
  selectedNode: string;
  setSelectedNode: any;
  isLoggingOpen: boolean;
  setLoggingOpen: any;
  isLayoutOpen: boolean;
  setLayoutOpen: any;
  newViewId: string;
  setNewViewId: any;
}

export const CrossAppProvider = ({
  app,
  children,
}: {
  app: CrossDeviceApplication;
  children: JSX.Element;
}) => {
  const model = app.getSharedObject();
  const [selectedNode, setSelectedNode] = useState("");
  const [isLoggingOpen, setLoggingOpen] = useState(false);
  const [isLayoutOpen, setLayoutOpen] = useState(false);
  const [newViewId, setNewViewId] = useState("");
  const generateState = () => {
    let layoutNode;

    if (Array.from(model.getDevices()).length === 1) {
      layoutNode = app.getSharedObject().getPrimaryConfiguration();
    } else {
      layoutNode = model.getCurrentConfigurationOfRole(
        model.getMyRole().getName()
      );
    }

    if (
      layoutNode &&
      selectedNode != "" &&
      !layoutNode.getChildByViewId(selectedNode)
    ) {
      setSelectedNode("");
    }

    return {
      devices: Array.from(model.getDevices()),
      role: model.getMyRole(),
      views: model.getMyRole().getViews(),

      layout: layoutNode,
    };
  };
  const [state, setState] = useState(generateState());

  useEffect(() => {
    const onChange = () => {
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
    <CrossAppContext.Provider
      value={{
        app: app,
        devices: state.devices,
        role: state.role,
        layout: state.layout,
        views: state.views,
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,
        isLoggingOpen: isLoggingOpen,
        setLoggingOpen: setLoggingOpen,
        isLayoutOpen: isLayoutOpen,
        setLayoutOpen: setLayoutOpen,
        newViewId: newViewId,
        setNewViewId: setNewViewId,
      }}
    >
      {children}
    </CrossAppContext.Provider>
  );
};
