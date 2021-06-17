import { EditIcon, Icon } from "@chakra-ui/icons";
import {
  Box,
  Center,
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
import React from "react";
import { FC } from "react";
import { IUIComponent } from "../../../shared-object/components/UIComponent/UIComponentModel";
// import { UIComponentFactory } from "../components/UIComponentFactory";
import { ImQrcode } from "react-icons/im";
import { CombinedView } from "../../../shared-object/combined-views/combined-view";
import { SingleCombinedView } from "../../../shared-object/combined-views/single-combined-view";
import { StitchingCombinedView } from "../../../shared-object/combined-views/stitching-combined-view/StitchingCombinedView";
import { StitchingCombinedViewComponent } from "../../../shared-object/combined-views/stitching-combined-view/StitchingCombinedViewComponent";
import { MultiCombinedView } from "../../../shared-object/combined-views/multi-combined-view";
const QRCode = require("qrcode.react");

interface CombinedViewComponentProps {
  qrUrl: string;
  cvm: CombinedView;
  role: string;
  onEdit: (cvm: CombinedView, ui: IUIComponent[]) => void;
}

export const CombinedViewComponent: FC<CombinedViewComponentProps> = (
  props: CombinedViewComponentProps
) => {
  if (props.cvm instanceof StitchingCombinedView) {
    return (
      <StitchingCombinedViewComponent
        cvm={props.cvm}
        role={props.role}
        qrCode={props.qrUrl}
      ></StitchingCombinedViewComponent>
    );
  }
  const cv = props.cvm.getCombinedView();
  let ui;
  if (props.cvm.isSingleView()) {
    ui = (props.cvm as SingleCombinedView).getUI();
  } else if (props.cvm.isMultiView()) {
    ui = ((props.cvm as unknown) as MultiCombinedView).getUIFrom(props.role);
  } else {
    return <></>;
  }

  if (cv === undefined || ui === undefined) return <div></div>;

  // const uiComponentFactory = new UIComponentFactory();
  return (
    <Box
      // ref={drop}
      key={cv.id}
      border={"1px"}
      borderColor={cv.color}
      maxW={ui.getWidth() + "px"}
      // maxW={ui.getWidth()}
      h={ui.getHeight() + "px"}
      position={"relative"}
      overflow={"hidden"}
      // top={ui.getY() + "px"}
      // left={ui.getX() + "px"}

      /* style={{
        width: cv.width + "px",
        height: cv.height + "px",
         position: "absolute",
         padding: "0px",
        overflow: "hidden",
        top: cv.y + "px",
        left: cv.x + "px",
      }}*/
    >
      {ui.getComponents().map((component) => {
        return component.generateWidget();
        // return uiComponentFactory.getUIComponent(component).generateWidget();
      })}
      <Box position={"absolute"} top={"0px"} right={"0px"}>
        <Popover>
          <PopoverTrigger>
            <IconButton
              w={"40px"}
              mx={"5px"}
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
                  <QRCode value={props.qrUrl} />
                </Center>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        <IconButton
          w={"40px"}
          aria-label={"Edit Combined View"}
          // onClick={() => props.onEdit(props.cvm, ui.components)}
          icon={<EditIcon />}
        />
      </Box>
    </Box>
  );
};
