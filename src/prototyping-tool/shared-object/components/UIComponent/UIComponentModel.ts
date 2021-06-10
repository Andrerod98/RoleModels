import React from "react";
export interface IUIComponent {
  id: string;
  name: string;
  value?: string;
  style?: React.CSSProperties;
  children?: IUIComponent[];
}
