import React from "react";
export interface IUIComponent {
  id: string;
  name: string;
  value?: any;
  style?: React.CSSProperties;
  children?: IUIComponent[];
}
