/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { useColorMode } from "@chakra-ui/react";
import React from "react";

import AceEditor from "react-ace";
import "ace-builds";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/snippets/json";
import "ace-builds/src-noconflict/ext-language_tools";
import Beautify from "ace-builds/src-noconflict/ext-beautify";
import { config } from "ace-builds";
config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/"
);

config.setModuleUrl(
  "ace/mode/kson_worker",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-json.js"
);

interface CodeEditorProps {
  title: string;
  value: string;
  onChange: (value: string, event?: any) => void;
  onFocus: (value: any, event?: any) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = (
  props: CodeEditorProps
) => {
  const { colorMode } = useColorMode();
  return (
    <AceEditor
      mode={"json"}
      theme={colorMode === "light" ? "chrome" : "nord_dark"}
      enableSnippets={true}
      height={"95%"}
      fontSize={14}
      onChange={props.onChange}
      onCursorChange={props.onFocus}
      value={props.value}
      name={"new_ace"}
      width={"98%"}
      editorProps={{ $blockScrolling: true }}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      commands={Beautify.commands}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        useWorker: true,
      }}
    />
  );
};
