import { SharedCell } from "@fluidframework/cell";
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
      this.setLayoutsEventListeners();
      this.emitChange();
    });

    this.setLayoutsEventListeners();
  }

  private setLayoutsEventListeners() {
    const entries = this.workspace.getRoleLayouts().entries();

    const handleChange = (role, layout, l) => {
      this.setRoleLayout(role, {
        name: layout.getName(),
        type: layout.getType(),
        layout: l,
      });
    };

    for (const [role, layout] of entries) {
      layout.getLayout().off("change", (l) => handleChange(role, layout, l));
      layout.getLayout().on("change", (l) => handleChange(role, layout, l));
    }
  }

  public set(value: IWorkspace) {
    this.sharedWorkspace.set(value);
  }

  public setRoleLayout(roleID: string, value: IRoleLayout) {
    const iworkspace = this.workspace.toWorkspace();
    iworkspace.layouts[roleID] = {
      ...value,
    } as IRoleLayout;
    this.sharedWorkspace.set(iworkspace);
  }

  public get(): Workspace {
    return this.workspace;
  }
}
