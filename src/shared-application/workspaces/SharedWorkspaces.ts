import { SharedMap } from "@fluidframework/map";
import { IWorkspace } from "./IWorkspace";
import { Workspace } from "./Workspace";

export class SharedWorkspaces {
  workspaces: Map<string, Workspace>;

  public constructor(
    private readonly sharedWorkspaces: SharedMap,
    private changeHandler: () => void
  ) {
    this.workspaces = new Map();
    this.load();
    this.setEventListeners();
  }

  private setEventListeners() {
    this.sharedWorkspaces.on("valueChanged", () => {
      this.load();
      this.changeHandler();
    });
  }

  //Function called when shared object is updated
  public load() {
    const tempWorkspaces = new Map(this.workspaces);

    const sharedWorkspacesEntries = this.sharedWorkspaces.entries();

    this.workspaces.clear();

    for (const [key, value] of sharedWorkspacesEntries) {
      let workspace = tempWorkspaces.get(key);
      if (workspace) {
        workspace.update(value);
      } else {
        workspace = new Workspace(value);
        this.workspaces.set(key, workspace);
      }
    }
  }

  public getWorkspaces() {
    return this.workspaces;
  }

  public set(id: string, workspace: IWorkspace) {
    this.sharedWorkspaces.set(id, workspace);
  }

  public deleteWorkspace(key: string) {
    this.workspaces.delete(key);
    this.sharedWorkspaces.delete(key);
  }

  public values() {
    return this.workspaces.values();
  }

  public remove(key: string) {}

  public get(key: string) {
    return this.workspaces.get(key);
  }

  public getWorkspacesWithNDevices(quantity: number): Workspace[] {
    const resultWorkspaces = [];
    const values = this.workspaces.values();
    for (const workspace of values) {
      if (workspace.getRoleLayouts().size === quantity) {
        resultWorkspaces.push(workspace);
      }
    }

    return resultWorkspaces;
  }
}
