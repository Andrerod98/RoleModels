/* eslint-disable no-unused-vars */
import React from "react";
import { FC } from "react";

import { Header } from "../header/Header";
import {
  Box,
  Center,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { CrossDeviceApplication } from "../../CrossDeviceApplication";
import { CombinedView } from "../../shared-object/combined-views/combined-view";
import { QRCodeController } from "../../shared-object/qrcode/QRCodeController";
import { View } from "../../shared-object/views/View";
import { ViewComponent } from "../../shared-object/views/ViewComponent";
import { Role } from "../../shared-object/roles/Role";
import { StitchingCombinedView } from "../../shared-object/combined-views/stitching-combined-view/StitchingCombinedView";
import { Stitching } from "../../Stitching";
import { ImQrcode } from "react-icons/im";
const QRCode = require("qrcode.react");
interface RoleProps {
  readonly app: CrossDeviceApplication;
  readonly role: Role;
}

export const RoleComponent: FC<RoleProps> = (props: RoleProps) => {
  const model = props.app.getSharedObject();
  const views = props.app.getViewsOrCombinedViews(props.role.getName());
  const qrs = props.app.getSharedObject().getMyQrCodes();
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
        {views.map(
          ([view, combinedView]: [View, CombinedView], index: number) => {
            console.log(combinedView instanceof StitchingCombinedView);
            if (combinedView instanceof StitchingCombinedView) {
              return (
                <GridItem
                  key={"new_v" + index}
                  rowSpan={view.getColumns()}
                  colSpan={view.getRows()}
                  overflow={"hidden"}
                >
                  <Stitching
                    key={model.getDeviceRole() + "_view_" + index}
                    view={view}
                    combinedView={combinedView}
                    role={props.role.getName()}
                  />
                  <Box position={"absolute"} top={"0px"} right={"0px"}>
                    <Popover>
                      <PopoverTrigger>
                        <IconButton
                          mx={"5px"}
                          size={"sm"}
                          aria-label={"QRCode"}
                          icon={<Icon as={ImQrcode} />}
                        />
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>QRCode</PopoverHeader>
                          <PopoverBody>
                            <Center>
                              <QRCode
                                value={"combined/view/" + combinedView.getId()}
                              />
                            </Center>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </Box>
                </GridItem>
              );
            }
            return (
              <GridItem
                key={"new_v" + index}
                rowSpan={view.getColumns()}
                colSpan={view.getRows()}
              >
                <ViewComponent
                  key={model.getDeviceRole() + "_view_" + index}
                  view={view}
                  combinedView={combinedView}
                  role={props.role}
                />
              </GridItem>
            );
          }
        )}
        {qrs.map((qr: QRCodeController, index: number) => {
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
          }}
          onDesignClick={() => {
            model.promoteToDesigner();
          }}
          onLoggingOpen={() => {}}
        />
      </Box>
    </Box>
  );
};
