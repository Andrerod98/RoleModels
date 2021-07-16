export interface ILayoutNode {
  id: string;
  name: "view" | "flex" | "div";
  viewId?: string;
  children?: ILayoutNode[];
}
