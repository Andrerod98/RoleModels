import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Center,
  CloseButton,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LayoutModal } from "../../components/LayoutModal";
import { CrossDeviceApplication } from "../../shared-application/CrossDeviceApplication";
import { ILayoutNode } from "../../shared-application/roles/ILayout";
import { Role } from "../../shared-application/roles/Role";
import { View } from "../../shared-application/views/View";
import Utils from "../../utils/Utils";
import { SingleTabCatalogBar } from "./CatalogBar";
import { CodeEditor } from "./components/CodeEditor";
import { Previewer } from "./components/Previewer/Previewer";
import { ComponentsExamples } from "./ComponentsExamples";

interface RoleTabProps {
  role: Role;
  app: CrossDeviceApplication;
}

export function RoleTab(props: RoleTabProps) {
  const views = props.role.getViews();
  const [value, setValue] = useState(
    Utils.jsonToString(views.map((v) => v.toView()))
  );
  const [cursorPosition, setCursorPosition] = useState({ row: 0, column: 0 });
  const [alert, setAlert] = useState(false);
  const [newViewId, setNewViewId] = useState("");
  const [selectedNode, setSelectedNode] = useState("");

  const layout = props.app
    .getSharedObject()
    .getCurrentConfigurationOfRole(props.role.getName());

  const [layoutSnapshot, setLayoutSnapshot] = useState(
    layout
      ? layout.getSnapshot()
      : ({ name: "div", viewId: "", children: [] } as ILayoutNode)
  );

  const { isOpen, onClose, onOpen } = useDisclosure();

  const preview = (newValue?: string, nvid?: string) => {
    //props.project.stringToViews(value)

    props.role.updateIViews(
      Utils.stringToJson(newValue === undefined ? value : newValue)
    );
    setValue(newValue === undefined ? value : newValue);
    setLayoutSnapshot({ ...layout.getSnapshot() });
  };

  const addUIComponent = (name: string) => {
    setAlert(false);
    let object;
    let json = Utils.stringToJson(value);
    if (json === undefined) {
      setAlert(true);
      return;
    }
    switch (name) {
      case "view":
        const newView = ComponentsExamples.getView();
        if (Utils.jsonToString(json) === "{}") {
          json = [newView];
        } else {
          json = [...json, newView];
        }
        //Open layout modal

        setValue(Utils.jsonToString(json));
        preview(Utils.jsonToString(json));
        setNewViewId(newView.id);
        onOpen();

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
    const oldValue = value;
    const rows = oldValue.split("\n");
    const row = cursorPosition.row;
    const column = cursorPosition.column;
    const line = rows[row];
    let previous = line.substring(0, column);
    previous = previous.trim();
    if (previous.endsWith("}")) previous += ",";

    rows[row] = previous + str + line.substring(column);
    const newValue = rows.join("\n");

    const newFormattedValue = Utils.stringToJson(newValue);
    if (newFormattedValue === undefined) {
      setAlert(true);
    } else {
      setValue(Utils.jsonToString(newFormattedValue));

      preview(Utils.jsonToString(newFormattedValue));
    }
  };

  const handleFocus = (value: any) => {
    setCursorPosition(value.cursor);
  };

  const handleChange = (value: any, event?: any) => {
    setValue(value);
    setCursorPosition(event.end);
  };

  const handleChangeView = (newView: View) => {
    props.role.updateView(newView);
    setValue(Utils.jsonToString(props.role.getViews().map((v) => v.toView())));
  };

  const handleChangeViews = (newViews: View[]) => {
    props.role.updateViews(newViews);

    setValue(Utils.jsonToString(props.role.getViews().map((v) => v.toView())));
  };
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
              onChangeView={handleChangeView}
              onChangeViews={handleChangeViews}
              layout={layoutSnapshot}
              role={props.role}
              app={props.app}
              isOpenLayoutModal={isOpen}
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
                The Json is incorrect fix it to add new components
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
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </Box>
        </Box>
      </Flex>
      <LayoutModal
        layout={layout}
        newViewId={newViewId}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        setSelected={(newSelected: string) => {
          setSelectedNode(newSelected);
          preview();
        }}
        selectedNode={selectedNode}
      />
    </Box>
  );
}