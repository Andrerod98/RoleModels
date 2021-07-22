import React, { createContext, useEffect, useState } from "react";
import { CrossDeviceApplication } from "../shared-application/CrossDeviceApplication";
import { IDevice } from "../shared-application/devices/IDevice";
import { LayoutNode } from "../shared-application/roles/Layout";
import { Role } from "../shared-application/roles/Role";
import { QuickInteraction } from "../shared-application/shared-object/IQuickInteraction";
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
  isHeaderOpen: boolean;
  setHeaderOpen: any;
  isQuickInteractionOpen: boolean;
  setQuickInteractionOpen: any;
  newViewId: string;
  setNewViewId: any;
  quickInteraction: QuickInteraction;
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
  const [isHeaderOpen, setHeaderOpen] = useState(false);
  const [newViewId, setNewViewId] = useState("");
  const [isQuickInteractionOpen, setQuickInteractionOpen] = useState(false);
  const generateState = () => {
    let layoutNode;

    if (Array.from(model.getDevices()).length === 1) {
      layoutNode = app.getSharedObject().getPrimaryConfiguration();
    } else {
      layoutNode = model.getCurrentConfigurationOfRole(
        model.getMyRole().getId()
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
      quickInteraction: model.getQuickInteraction(),
      layout: layoutNode,
    };
  };
  const [state, setState] = useState(generateState());
  const debug = false;
  useEffect(() => {
    const onChange = () => {
      setState(generateState());
    };
    model.on("change", (type) => {
      if (debug) console.log(type);

      if (type === "qi") {
        const qi = model.getQuickInteraction();
        if (qi && qi.from !== model.getMyRole().getName())
          setQuickInteractionOpen(true);
      }

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
        quickInteraction: state.quickInteraction,
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,
        isLoggingOpen: isLoggingOpen,
        setLoggingOpen: setLoggingOpen,
        isHeaderOpen: isHeaderOpen,
        setHeaderOpen: setHeaderOpen,
        isLayoutOpen: isLayoutOpen,
        setLayoutOpen: setLayoutOpen,
        isQuickInteractionOpen: isQuickInteractionOpen,
        setQuickInteractionOpen: setQuickInteractionOpen,
        newViewId: newViewId,
        setNewViewId: setNewViewId,
      }}
    >
      {children}
    </CrossAppContext.Provider>
  );
};
