import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Center,
  CloseButton,
  Flex,
  Heading,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { uuid } from "uuidv4";
import { CrossAppState, CrossAppContext } from "../../context/AppContext";
import { ILayoutNode } from "../../shared-application/workspaces/ILayoutNode";
import Utils from "../../utils/Utils";
import { SingleTabCatalogBar } from "./CatalogBar";
import { CodeEditor } from "./components/CodeEditor";
import { Previewer } from "./components/Previewer/Previewer";
import { ComponentsExamples } from "./ComponentsExamples";

interface RoleTabProps {}

export function RoleTab(props: RoleTabProps) {
  const {
    roleModels,
    selectedNode,
    setSelectedNode,
    containers,
    setLocalMode,
    localMode,
    primaryWorkspace,
  } = useContext<CrossAppState>(CrossAppContext);

  let currentLayout = primaryWorkspace.getFirstLayout().getLayout();

  const [codeState, setCodeState] = useState({
    value: Utils.jsonToString(containers.map((c) => c.toView())),
    position: { row: 0, column: 0 },
  });

  const [alert, setAlert] = useState(false);

  /* const [layoutSnapshot, setLayoutSnapshot] = useState(
    layout
      ? layout.toLayout()
      : ({ id: uuid(), name: "div", viewId: "", children: [] } as ILayoutNode)
  );*/

  const preview = (newValue?: string, nvid?: string) => {
    //props.project.stringToViews(value)
    const iviews = Utils.stringToJson(
      newValue === undefined ? codeState.value : newValue
    );

    if (iviews) {
      const newFormattedValue = Utils.jsonToString(iviews);
      setCodeState({ ...codeState, value: newFormattedValue });
      setAlert(false);
    } else {
      setCodeState({ ...codeState, value: newValue });
    }

    //props.role.updateIViews(iviews);
    roleModels.updateIViews(iviews);

    //setLayoutSnapshot({ ...layout.toLayout() });
  };

  const addViewToEditor = () => {
    const newView = ComponentsExamples.getView();
    const valueAsString = codeState.value;
    let valueAsJson = Utils.stringToJson(codeState.value);
    if (
      valueAsString === "{}" ||
      valueAsString === "" ||
      valueAsString === "[]"
    ) {
      valueAsJson = [newView];
    } else {
      valueAsJson = [...valueAsJson, newView];
    }
    const newValueAsString = Utils.jsonToString(valueAsJson);
    setCodeState({ ...codeState, value: newValueAsString });
    preview(newValueAsString);

    const length = containers.length;
    const id = uuid();
    if (length === 0) {
      currentLayout.update({
        id: id,
        name: "view",
        viewId: newView.id,
        flexGrow: true,
      } as ILayoutNode);
      setSelectedNode(newView.id);
    } else {
      setLocalMode({
        mode: "ContainerPosition",
        properties: { containerID: newView.id },
      });
    }
  };

  const addUIComponent = (name: string) => {
    setAlert(false);
    const factory = roleModels.getFactory(name);

    addUIComponentToEditor(Utils.jsonToString(factory.example));
  };

  const addUIComponentToEditor = (str: string) => {
    const oldValue = codeState.value;
    const rows = oldValue.split("\n");
    const row = codeState.position.row;
    const column = codeState.position.column;
    const line = rows[row];

    rows[row] = line.substring(0, column) + str + line.substring(column);

    const newValue = rows.join("\n");

    const newJson = Utils.stringToJson(newValue);
    const newFormattedValue = Utils.jsonToString(newJson);

    if (newJson) {
      setAlert(false);
      preview(newFormattedValue);
      setCodeState({
        ...codeState,
        value: newFormattedValue,
      });
    } else {
      setAlert(true);
      setCodeState({
        ...codeState,
        value: newValue,
      });
    }
  };

  const handleFocus = (value: any) => {
    setCodeState({ ...codeState, position: value.cursor });
  };

  const handleChange = (value: any, event?: any) => {
    setCodeState({ value: value, position: event.end });
  };

  /*const handleChangeView = (newView: View) => {
    app.getSharedObject().updateView(newView);

    setCodeState({
      ...codeState,
      value: Utils.jsonToString(
        Array.from(app.getSharedObject().getAllViews()).map((v) => v.toView())
      ),
    });
  };*/

  /*const handleChangeViews = (newViews: View[]) => {
    //props.role.updateViews(newViews.map((nv) => nv.getId()));
    app.getSharedObject().updateViews(newViews);
    setCodeState({
      ...codeState,
      value: Utils.jsonToString(
        Array.from(app.getSharedObject().getAllViews()).map((v) => v.toView())
      ),
    });
  };*/
  return (
    <Box h={"100%"}>
      <Flex h={"100%"}>
        <SingleTabCatalogBar onClick={(element) => addUIComponent(element)} />

        <Box flex={"1"} py={3} overflow={"hidden"} mb={"30px"}>
          <Heading
            as={"h5"}
            px={5}
            fontSize={"12px"}
            textAlign={"left"}
            mb={"5px"}
          >
            PREVIEW
          </Heading>
          <Center h={"100%"} bg={"gray.700"} w={"100%"}>
            <Previewer
              layout={
                currentLayout
                  ? currentLayout.getRoot().toLayout()
                  : ({
                      id: uuid(),
                      name: "div",
                      viewId: "",
                      children: [],
                    } as ILayoutNode)
              }
              isOpenLayoutModal={localMode.mode === "ContainerPosition"}
              handleViewClick={() => {
                addViewToEditor();
              }}
              handleClick={() => {
                preview();
              }}
              setSelected={(newSelected: string) => {
                console.log("SELECTED:" + newSelected);
                setSelectedNode(newSelected);
              }}
              selectedNode={selectedNode}
            />
            {}
          </Center>
        </Box>
        <Box>
          {alert ? (
            <Alert status={"error"}>
              <AlertIcon />
              <AlertDescription>
                The Json is incorrect fix it to be able to preview
              </AlertDescription>
              <CloseButton
                position={"absolute"}
                right={"8px"}
                top={"8px"}
                onClick={() => {
                  setAlert(false);
                }}
              />
            </Alert>
          ) : (
            <></>
          )}
          <Box h={"100%"} py={3} width={"400px"} mb={"20px"}>
            <Heading
              as={"h5"}
              px={5}
              fontSize={"12px"}
              textAlign={"left"}
              mb={"5px"}
            >
              SOURCE
            </Heading>
            <CodeEditor
              title={"UI"}
              mode={"json"}
              value={codeState.value}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
