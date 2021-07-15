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
import { ILayoutNode } from "../../shared-application/roles/ILayout";
import Utils from "../../utils/Utils";
import { SingleTabCatalogBar } from "./CatalogBar";
import { CodeEditor } from "./components/CodeEditor";
import { Previewer } from "./components/Previewer/Previewer";
import { ComponentsExamples } from "./ComponentsExamples";

interface RoleTabProps {}

export function RoleTab(props: RoleTabProps) {
  const {
    app,
    selectedNode,
    setSelectedNode,
    setNewViewId,
    isLayoutOpen,
    setLayoutOpen,
  } = useContext<CrossAppState>(CrossAppContext);
  const views = Array.from(app.getSharedObject().getAllViews());
  const layout = app.getSharedObject().getPrimaryConfiguration();

  const [codeState, setCodeState] = useState({
    value: Utils.jsonToString(views.map((v) => v.toView())),
    position: { row: 0, column: 0 },
  });

  const [alert, setAlert] = useState(false);

  const [layoutSnapshot, setLayoutSnapshot] = useState(
    layout
      ? layout.toLayout()
      : ({ id: uuid(), name: "div", viewId: "", children: [] } as ILayoutNode)
  );

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
    app.getSharedObject().updateIViews(iviews);

    setLayoutSnapshot({ ...layout.toLayout() });
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
    setNewViewId(newView.id);
    setLayoutOpen(true);
  };

  const addUIComponent = (name: string) => {
    setAlert(false);
    let object;

    switch (name) {
      case "view":
        addViewToEditor();

        return;
      case "image":
        object = ComponentsExamples.getImage();
        break;
      case "spacer":
        object = ComponentsExamples.getSpacer();
        break;
      case "input":
        object = ComponentsExamples.getInput();
        break;
      case "list":
        object = ComponentsExamples.getList();
        break;
      case "link":
        object = ComponentsExamples.getLink();
        break;
      case "label":
        object = ComponentsExamples.getText();
        break;
      case "map":
        object = ComponentsExamples.getMap();
        break;
      case "radio":
        object = ComponentsExamples.getRadio();
        break;
      case "ink":
        object = ComponentsExamples.getInk();
        break;
      case "stack":
        object = ComponentsExamples.getStack();
        break;
      case "editable":
        object = ComponentsExamples.getEditable();
        break;
      case "slider":
        object = ComponentsExamples.getSlider();
        break;
      case "flex":
        object = ComponentsExamples.getFlex();
        break;
      case "center":
        object = ComponentsExamples.getCenter();
        break;
      case "checkbox":
        object = ComponentsExamples.getCheckbox();
        break;
      case "box":
        object = ComponentsExamples.getBox();
        break;
      case "grid":
        object = ComponentsExamples.getGrid();
        break;

      default:
        object = ComponentsExamples.getBasic();
        break;
    }

    addUIComponentToEditor(Utils.jsonToString(object));
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
    <Box h={"100%"} bg={"gray.100"}>
      <Flex h={"100%"} bg={"gray.100"}>
        <SingleTabCatalogBar onClick={(element) => addUIComponent(element)} />

        <Box flex={"1"} py={3} overflow={"hidden"} bg={"gray.100"} mb={"30px"}>
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
                layout
                  ? layout.getRoot().toLayout()
                  : ({
                      id: uuid(),
                      name: "div",
                      viewId: "",
                      children: [],
                    } as ILayoutNode)
              }
              app={app}
              isOpenLayoutModal={isLayoutOpen}
              handleClick={() => {
                preview();
              }}
              setSelected={(newSelected: string) => {
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
          <Box h={"100%"} py={3} width={"400px"} bg={"gray.100"} mb={"20px"}>
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
