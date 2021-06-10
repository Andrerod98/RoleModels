import { StackDirection, SystemProps } from "@chakra-ui/react";
import { IUIComponent } from "../UIComponent/UIComponentModel";
import React from "react";
interface StackOptions {
  /**
   * Shorthand for `alignItems` style prop
   * @type SystemProps["alignItems"]
   */
  align?: SystemProps["alignItems"];
  /**
   * Shorthand for `justifyContent` style prop
   * @type SystemProps["justifyContent"]
   */
  justify?: SystemProps["justifyContent"];
  /**
   * Shorthand for `flexWrap` style prop
   * @type SystemProps["flexWrap"]
   */
  wrap?: SystemProps["flexWrap"];
  /**
   * The space between each stack item
   * @type SystemProps["margin"]
   */
  spacing?: SystemProps["margin"];
  /**
   * The direction to stack the items.
   */
  direction?: StackDirection;
  /**
   * If `true`, each stack item will show a divider
   * @type React.ReactElement
   */
  divider?: React.ReactElement;
  /**
   * If `true`, the children will be wrapped in a `Box` with
   * `display: inline-block`, and the `Box` will take the spacing props
   */
  shouldWrapChildren?: boolean;
  /**
   * If `true` the items will be stacked horizontally.
   */
  isInline?: boolean;
}
export interface StackUI extends IUIComponent, StackOptions {}
