/* eslint-disable no-unused-vars */
import React from "react";
import { FC } from "react";

import { Header } from "../header/Header";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { CombinedView } from "../../shared-object/combined-views/combined-view";
import { CombinedViewComponent } from ".";
import { CrossDeviceApplication } from "../../Application";
import { View } from "../../shared-object/views/View";
import { ViewComponent } from "../../shared-object/views/ViewComponent";
import { QRCodeController } from "../../shared-object/qrcode/QRCodeController";

interface RoleProps {
  readonly app: CrossDeviceApplication;
  readonly combinedViews: CombinedView[];
  readonly views: View[];
  readonly qrCodes: QRCodeController[];
}

// const UITEST = {};

export const RoleComponent: FC<RoleProps> = (props: RoleProps) => {
  // Center and insert width and height
  // Map elements to be rendered React.createElement()
  // const [ui, setUI] = useState(props.model.getCombinedUI());

  const model = props.app.getSharedObject();
  return (
    <Box h={"100%"} w={"100%"}>
      <Grid
        h={"100%"}
        w={"100%"}
        overflow={"hidden"}
        templateRows={"repeat(12, 1fr)"}
        templateColumns={"repeat(12, 1fr)"}
        gap={2}
      >
        {props.views.map((view: View, index: number) => {
          return (
            <GridItem
              key={"new_v" + index}
              rowSpan={view.getColumns()}
              colSpan={view.getRows()}
            >
              <ViewComponent
                key={model.getDeviceRole() + "_view_" + index}
                view={view}
                qrUrl={"view/" + view.getId()}
              />
            </GridItem>
          );
        })}
        {props.combinedViews.map((cvm: CombinedView, index: number) => {
          return (
            <CombinedViewComponent
              key={model.getDeviceRole() + "_combined_view_" + index}
              cvm={cvm}
              role={model.getDeviceRole()}
              onEdit={() => {}}
              qrUrl={"combined/view/" + cvm.getId()}
            />
          );
        })}
        {props.qrCodes.map((qr: QRCodeController, index: number) => {
          return (
            <Box key={"new_qr" + index} p={5}>
              {qr.generate()}
            </Box>
          );
        })}
      </Grid>
      <Box position={"absolute"} left={0} top={0}>
        <Header
          app={props.app}
          myRole={model.getDeviceRole()}
          roles={model.getRoles().map((role) => role.getName())}
          onManagerClick={async () => {
            model.promoteToManager();
          }}
          onRoleClick={(role: string) => {
            model.promoteToRole(role);
            // setUI(props.model.getCombinedUI());
          }}
          onDesignClick={() => {
            model.promoteToDesigner();
          }}
        />
      </Box>
    </Box>
  );
};

/*<CombinedViewEditor
        defaultUI={uiStr}
        defaultInteractions={interactions}
        onChangeUI={onChangeUI}
        onChangeInteractions={onChangeInteractions}
        onClose={onClose}
        show={isOpen}
        onSave={() => {
          // eval(interactions);
          // curCVM.defineInteractions(interactions);
          // curCVM.loadInteractions();
          curCVM.overrideAll(JSON.parse(uiStr), model.getRole().getName());

          onClose();
        }}
      ></CombinedViewEditor>

       <Card
          style={{
            width: props.model.getDevice().capabilities.width + "px",
            height: props.model.getDevice().capabilities.height + "px",
            margin: "auto",
            padding: "0px",
            float: "none",
          }}
        >*/
