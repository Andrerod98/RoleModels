export interface ILayoutNode {
  id: string;
  name: "view" | "flex" | "div";
  flexGrow?: boolean;
  viewId?: string;
  children?: ILayoutNode[];
}
