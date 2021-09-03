import React, { createContext, useEffect, useState } from "react";
import { CrossDeviceApplication } from "../shared-application/CrossDeviceApplication";
import { IDevice } from "../shared-application/devices/IDevice";
import { LayoutNode } from "../shared-application/roles/Layout";
import { Role } from "../shared-application/roles/Role";
import { PushInteraction } from "../shared-application/shared-object/IPushInteraction";
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
  isSelectMode: boolean;
  setSelectMode: any;
  selectedContainerPush: { view: string; from: string };
  setSelectedContainerPush: any;
  isCrossDeviceInteractionOpen: boolean;
  setCrossDeviceInteractionOpen: any;
  isQuickInteractionOpen: boolean;
  setQuickInteractionOpen: any;
  isHeaderOpen: boolean;
  setHeaderOpen: any;
  isQRMode: boolean;
  isPushInteractionOpen: boolean;
  setPushInteractionOpen: any;
  newViewId: string;
  setNewViewId: any;
  pushInteraction: PushInteraction;
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
  const [isSelectMode, setSelectMode] = useState(false);
  const [selectedContainerPush, setSelectedContainerPush] = useState({
    view: "",
    from: "",
  });
  const [newViewId, setNewViewId] = useState("");
  const [isPushInteractionOpen, setPushInteractionOpen] = useState(false);
  const [isQuickInteractionOpen, setQuickInteractionOpen] = useState(false);
  const [isCrossDeviceInteractionOpen, setCrossDeviceInteractionOpen] =
    useState(false);

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
      pushInteraction: model.getPushInteraction(),
      isQRMode: model.getQRMode(),
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
        const qi = model.getPushInteraction();

        if (qi && qi.from !== model.getMyRole().getId()) {
          setSelectedContainerPush({ view: qi.viewId, from: qi.from });
          setPushInteractionOpen(true);
        }
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
        pushInteraction: state.pushInteraction,
        isQRMode: state.isQRMode,
        selectedNode: selectedNode,
        setSelectedNode: setSelectedNode,
        selectedContainerPush: selectedContainerPush,
        setSelectedContainerPush: setSelectedContainerPush,
        isLoggingOpen: isLoggingOpen,
        setLoggingOpen: setLoggingOpen,
        isHeaderOpen: isHeaderOpen,
        setHeaderOpen: setHeaderOpen,
        isSelectMode: isSelectMode,
        setSelectMode: setSelectMode,
        isLayoutOpen: isLayoutOpen,
        setLayoutOpen: setLayoutOpen,
        isCrossDeviceInteractionOpen: isCrossDeviceInteractionOpen,
        setCrossDeviceInteractionOpen: setCrossDeviceInteractionOpen,
        isQuickInteractionOpen: isQuickInteractionOpen,
        setQuickInteractionOpen: setQuickInteractionOpen,
        isPushInteractionOpen: isPushInteractionOpen,
        setPushInteractionOpen: setPushInteractionOpen,
        newViewId: newViewId,
        setNewViewId: setNewViewId,
      }}
    >
      {children}
    </CrossAppContext.Provider>
  );
};
