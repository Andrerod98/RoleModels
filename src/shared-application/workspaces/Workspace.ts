import { LayoutNode } from "./LayoutNode";
import { IWorkspace } from "./IWorkspace";
import { RoleLayout } from "./RoleLayout";

export class Workspace {
  rolesLayouts: Map<string, RoleLayout>;
  id: string;
  name: string;

  public constructor(workspace: IWorkspace) {
    this.rolesLayouts = new Map();
    this.update(workspace);
  }

  public getID() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getRoleLayout(role: string) {
    return this.rolesLayouts.get(role);
  }

  public getRoleLayouts() {
    return this.rolesLayouts;
  }

  public getLayoutWithContainer(containerID: string): LayoutNode {
    const keys = this.rolesLayouts.values();
    for (const layout of keys) {
      const child = layout.getLayout().getChildByViewId(containerID);
      if (child) return child;
    }

    return undefined;
  }

  public update(workspace: IWorkspace) {
    const tempRoleLayouts = new Map(this.rolesLayouts);
    const sharedLayouts = Object.keys(workspace.layouts);

    this.rolesLayouts.clear();

    this.id = workspace.id;
    this.name = workspace.name;

    console.log(workspace);

    for (const key of sharedLayouts) {
      let roleLayout = tempRoleLayouts.get(key);
      const value = workspace.layouts[key];
      if (roleLayout) {
        roleLayout.update(value);
      } else {
        roleLayout = new RoleLayout(value);
      }
      this.rolesLayouts.set(key, roleLayout);
    }
  }

  public getFirstLayout() {
    const keys = Array.from(this.rolesLayouts.keys());
    return this.rolesLayouts.get(keys[0]);
  }

  public toWorkspace() {
    const layouts = {};

    for (const [role, layout] of this.rolesLayouts.entries()) {
      layouts[role] = {
        name: layout.getName(),
        type: layout.getType(),
        layout: layout.toLayout(),
      };
    }

    return {
      id: this.id,
      name: this.name,
      layouts: layouts,
    };
  }
}
