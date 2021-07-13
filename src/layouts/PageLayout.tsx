import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoggingWindow } from "../components/LoggingWindow";
import { Role } from "../shared-application/roles/Role";
import { Header } from "../components/header";
import { LayoutModal } from "../components/LayoutModal";
import { CrossAppState, CrossAppContext } from "../context/AppContext";
import { uuid } from "uuidv4";
import { ILayoutNode } from "../shared-application/roles/ILayout";

interface PageLayoutProps {
  readonly children: JSX.Element;
}

export function PageLayout(props: PageLayoutProps) {
  const {
    app,
    role,
    isLayoutOpen,
    setLayoutOpen,
    isLoggingOpen,
    setLoggingOpen,
    selectedNode,
    setSelectedNode,
    newViewId,
    setNewViewId,
  } = useContext<CrossAppState>(CrossAppContext);
  const model = app.getSharedObject();

  const handleLayoutOpen = () => {
    setLayoutOpen(true);
  };

  const handleLayoutClose = () => {
    console.log("Layout closing");
    setLayoutOpen(false);
  };

  const handleLoggingOpen = () => {
    setLoggingOpen(!isLoggingOpen);
  };

  const handleLoggingClose = () => {
    setLoggingOpen(false);
  };

  const handleButtonClick = (buttonName: string) => {
    switch (buttonName) {
      case "ET":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitTop(newViewId, true);
        currentLayout.splitTop(newViewId, true);
        break;
      case "T":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitTop(newViewId, false);
        currentLayout.splitTop(newViewId, false);
        break;
      case "EL":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitLeft(newViewId, true);
        currentLayout.splitLeft(newViewId, true);
        break;
      case "L":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitLeft(newViewId, false);
        currentLayout.splitLeft(newViewId, false);
        break;
      case "C":
        if (role.getName() === "designer")
          primaryLayout.update({
            id: uuid(),
            name: "view",
            viewId: newViewId,
          } as ILayoutNode);
        currentLayout.update({
          id: uuid(),
          name: "view",
          viewId: newViewId,
        } as ILayoutNode);
        break;
      case "R":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitRight(newViewId, false);
        currentLayout.splitRight(newViewId, false);
        break;
      case "ER":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitRight(newViewId, true);
        currentLayout.splitRight(newViewId, true);
        break;
      case "B":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitBottom(newViewId, false);
        currentLayout.splitBottom(newViewId, false);
        break;
      case "EB":
        if (role.getName() === "designer")
          primaryLayout
            .getChildByViewId(selectedNode)
            .splitBottom(newViewId, true);
        currentLayout.splitBottom(newViewId, true);
        break;
      default:
        break;
    }
    console.log("Selected node");
    setSelectedNode(newViewId);
    handleLayoutClose();
  };

  const primaryLayout = app.getSharedObject().getPrimaryConfiguration();
  let currentLayout = app
    .getSharedObject()
    .getCurrentConfigurationOfRole(role.getName());
  if (role.getName() === "designer") {
    currentLayout = app.getSharedObject().getLayoutWithView(selectedNode);
    if (!currentLayout) {
      currentLayout = app
        .getSharedObject()
        .getCurrentConfigurationOfRole("default");
    }
  }
  /*const layout = app
    .getSharedObject()
    .getCurrentConfigurationOfRole(role.getName());*/

  return (
    <Box position={"relative"} h={"100%"}>
      {props.children}
      <Box zIndex={1000} position={"absolute"} top={0} left={0} h={"100%"}>
        <Header
          app={app}
          myRole={model.getDeviceRole()}
          roles={Array.from(model.getRoles()).map((role: Role) =>
            role.getName()
          )}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
            setSelectedNode("");
            // setUI(props.model.getCombinedUI());
          }}
          onViewChange={(newViewId: string) => {
            setNewViewId(newViewId);
          }}
          onLoggingOpen={handleLoggingOpen}
        />
      </Box>
      <LayoutModal
        layout={currentLayout}
        newViewId={newViewId}
        isOpen={isLayoutOpen}
        onOpen={handleLayoutOpen}
        onClose={handleLayoutClose}
        setSelected={(newSelected: string) => {
          setSelectedNode(newSelected);
        }}
        onButtonClick={handleButtonClick}
        selectedNode={selectedNode}
      />
      <LoggingWindow isOpen={isLoggingOpen} onClose={handleLoggingClose} />
    </Box>
  );
}
