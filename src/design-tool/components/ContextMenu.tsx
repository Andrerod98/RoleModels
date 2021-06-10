/* eslint-disable no-invalid-this */
import { Menu, MenuGroup, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Project } from "../Project";

export interface ContextMenuProps {
  project: Project;
}

export class ContextMenu extends React.Component<ContextMenuProps> {
  state = {
    visible: false,
    xPos: 0,
    yPos: 0,
  };

  componentDidMount() {
    document.addEventListener("contextmenu", this._handleContextMenu);
    document.addEventListener("click", this._handleClick);
    document.addEventListener("scroll", this._handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("contextmenu", this._handleContextMenu);
    document.removeEventListener("click", this._handleClick);
    document.removeEventListener("scroll", this._handleScroll);
  }

  _handleContextMenu = (event: any) => {
    event.preventDefault();

    this.setState({
      xPos: event.pageX,
      yPos: event.pageY,
      visible: true,
    });
  };

  _handleClick = (event: any) => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  _handleScroll = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  render() {
    const { visible, xPos, yPos } = this.state;
    return (
      (visible || null) && (
        <Menu isOpen={true}>
          <MenuList
            left={xPos + "px"}
            top={yPos + "px"}
            position={"absolute"}
            zIndex={3}
          >
            <MenuGroup title={"Cross-Device Patterns"}>
              <MenuItem
                onClick={() =>
                  this.props.project.onRightClickSelect("Mirrored")
                }
              >
                Mirror
              </MenuItem>
              <MenuItem
                onClick={() =>
                  this.props.project.onRightClickSelect("Stitched")
                }
              >
                Stitch
              </MenuItem>
              <MenuItem
                onClick={() =>
                  this.props.project.onRightClickSelect("Alternate")
                }
              >
                Alternate
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      )
    );
  }
}
