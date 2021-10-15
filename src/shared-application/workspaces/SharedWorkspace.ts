import { SharedCell } from "@fluidframework/cell";
import { ILayoutNode } from "./ILayoutNode";
import { IWorkspace } from "./IWorkspace";
import { IRoleLayout } from "./RoleLayout";
import { Workspace } from "./Workspace";

export class SharedWorkspace {
  workspace: Workspace;

  public constructor(
    private readonly sharedWorkspace: SharedCell,
    private emitChange: () => void
  ) {
    this.workspace = new Workspace(sharedWorkspace.get());
    this.setEventListeners();
  }

  private setEventListeners() {
    this.sharedWorkspace.on("valueChanged", () => {
      this.workspace.update(this.sharedWorkspace.get());
      this.emitChange();
    });

    const entries = this.workspace.getRoleLayouts().entries();

    for (const [role, layout] of entries) {
      layout.getLayout().on("change", (l) => {
        this.setLayout(role, l);
      });
    }
  }

  public set(value: IWorkspace) {
    this.sharedWorkspace.set(value);
  }

  public setLayout(roleID: string, value: ILayoutNode) {
    const iworkspace = this.workspace.toWorkspace();
    iworkspace.layouts[roleID] = {
      ...iworkspace.layouts[roleID],
      layout: value,
    } as IRoleLayout;
    this.sharedWorkspace.set(iworkspace);
  }

  public get(): Workspace {
    return this.workspace;
  }
}
