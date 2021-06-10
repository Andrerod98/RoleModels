import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Popover,
  PopoverTrigger,
  IconButton,
  Icon,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Center,
} from "@chakra-ui/react";
import React from "react";
import { ImQrcode } from "react-icons/im";
import { StitchingCombinedView } from "./StitchingCombinedView";
const QRCode = require("qrcode.react");
interface StitchingCombinedViewComponentProps {
  cvm: StitchingCombinedView;
  role: string;
  qrCode: string;
}

export class StitchingCombinedViewComponent extends React.Component<
  StitchingCombinedViewComponentProps,
  {}
> {
  render() {
    const cv = this.props.cvm.getCombinedView();
    const ui = this.props.cvm.getUI();

    if (cv === undefined || ui === undefined) return <div></div>;

    // const uiComponentFactory = new UIComponentFactory();
    /* const { startingX, startingY } = this.props.cvm.getStartingPositionFrom(
      this.props.role
    );
     ui.getComponents().forEach((component) => {
      component.setX(component.component.x - startingX);
      component.setY(component.component.y - startingY);
    });*/
    return (
      <Box
        key={cv.id}
        border={"1px"}
        borderColor={cv.color}
        w={this.props.cvm.calculateGridItemWidth() + "px"}
        h={this.props.cvm.calculateGridItemHeight() + "px"}
        position={"relative"}
        overflow={"hidden"}
      >
        {ui.getRoot().generateWidget()}
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
                    <QRCode value={this.props.qrCode} />
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
  }
}
