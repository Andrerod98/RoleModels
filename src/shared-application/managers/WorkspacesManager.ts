import { SharedCell } from "@fluidframework/cell";
import { SharedMap } from "@fluidframework/map";
import EventEmitter from "events";
import { uuid } from "uuidv4";
import { LayoutNode } from "../workspaces/LayoutNode";
import { RoleModelsDataObject } from "../shared-object/RoleModelsDataObject";
import { IWorkspace } from "../workspaces/IWorkspace";
import { SharedWorkspaces } from "../workspaces/SharedWorkspaces";
import { SharedWorkspace } from "../workspaces/SharedWorkspace";
import { Workspace } from "../workspaces/Workspace";

enum ConfigurationsManagerEvents {
  ChangeState = "changeState",
}

/*
export interface Workspace {
  id: string;
  name: string;
  layouts: {
    [role: string]: { layout: LayoutNode; type: string; name: string };
  };
}
*/

/* This class is responsible for managing the combined views */
export class WorkspacesManager extends EventEmitter {
  current: SharedWorkspace;
  primary: SharedWorkspace;

  lastWorkspaces: SharedWorkspaces;
  allWorkspaces: SharedWorkspaces;

  public constructor(
    private readonly app: RoleModelsDataObject,
    private readonly workspacesSharedMap: SharedMap,
    private readonly primaryWorkspacesSharedMap: SharedMap,
    private readonly currentWorkspace: SharedCell,
    private readonly primaryWorkspace: SharedCell
  ) {
    super();

    this.lastWorkspaces = new SharedWorkspaces(
      primaryWorkspacesSharedMap,
      this.emitChange
    );
    this.allWorkspaces = new SharedWorkspaces(
      workspacesSharedMap,
      this.emitChange
    );

    this.current = new SharedWorkspace(currentWorkspace, this.emitChange);

    this.primary = new SharedWorkspace(this.primaryWorkspace, this.emitChange);
  }

  public getCurrentWorkspace(): SharedWorkspace {
    return this.current;
  }

  public getCurrentLayoutOfRole(roleID: string): LayoutNode {
    if (this.current.get().getRoleLayout(roleID)) {
      return this.current.get().getRoleLayout(roleID).getLayout();
    } else {
      return undefined;
    }
  }

  public getPrimaryWorkspace(nDevices: number) {
    if (nDevices === 1) return this.primary.get();
    else {
      const id = "" + nDevices;
      return this.lastWorkspaces.get(id);
    }
  }

  public saveLastWorkspace(nDevices: number) {
    if (nDevices > 1) {
      const id = "" + nDevices;
      const value = this.currentWorkspace.get();
      this.lastWorkspaces.set(id, value);
    }
  }

  public renameWorkspace(id: string, oldName: string, newName: string) {
    if (this.current.get().getName() === oldName) {
      const configValue = this.currentWorkspace.get();
      this.current.set({ ...configValue, name: newName });
    }

    this.allWorkspaces.set(id, {
      ...this.workspacesSharedMap.get(id),
      name: newName,
    });

    this.emitChange();
  }

  public removeContainerFromRole(roleId: string, viewId: string) {
    const containerId = this.current
      .get()
      .getRoleLayout(roleId)
      .getLayout()
      .getChildByViewId(viewId)
      .getId();

    let test = this.current.get().getRoleLayout(roleId).getLayout();
    test.removeChild(containerId);
    //this.current..updateCurrent(roleId, test.toLayout());
  }

  /* Returns all the workspaces */
  public getWorkspaces(): IterableIterator<Workspace> {
    return this.allWorkspaces.getWorkspaces().values();
  }

  public loadWorkspace(workspace: IWorkspace): void {
    this.app.setMode("setting-up");

    const newWorkspace = this.app.setRoles(workspace);

    this.current.set({ ...newWorkspace });

    setTimeout(() => {
      this.app.setMode("");
      this.app.assignRolesToDevices(newWorkspace);
    }, 5000);
  }

  public deleteWorkspace(workspaceID: string): void {
    this.allWorkspaces.deleteWorkspace(workspaceID);
  }

  public saveWorkspace(name: string) {
    const id = uuid();
    const value = Object.assign({}, this.currentWorkspace.get());
    this.current.set({
      ...value,
      id: id,
      name: name,
    });

    const layouts = {};
    for (const key of Object.keys(value.layouts)) {
      const roleId = this.app.getRole(key).getId();
      const roleName = this.app.getRole(key).getName();
      layouts[roleId] = {
        layout: value.layouts[key].layout,
        type: this.app.getDeviceTypeOfRole(roleId),
        name: roleName,
      };
    }

    this.workspacesSharedMap.set(id, {
      id,
      name: name,
      layouts: layouts,
    });
  }

  public getWorkspacesWithNDevices(quantity: number): Workspace[] {
    return this.allWorkspaces.getWorkspacesWithNDevices(quantity);
  }

  public resetWorkspace() {
    const layouts = {};

    const entries = this.current.get().getRoleLayouts().entries();
    console.log("Reseting");
    console.log(this.primary.get());
    console.log(this.current.get());
    let i = 0;
    for (const [key, value] of entries) {
      if (i === 0) {
        layouts[key] = { ...this.primary.get().getFirstLayout().toLayout() };
      } else {
        layouts[key] = {
          ...value,
          layout: {
            id: uuid(),
            name: "div",
          },
        };
      }

      i++;
    }

    console.log("Layouts");
    console.log(layouts);
    this.current.set({
      ...this.current.get().toWorkspace(),
      layouts: { ...layouts },
    });
  }

  /* Callback functions */

  private emitChange = (message?: string) => {
    this.emit(ConfigurationsManagerEvents.ChangeState, message);
  };
}

/*public loadObject() {
    const currentConfigValue = this.currentWorkspace.get();

    const currentConfigKeys = Object.keys(currentConfigValue.layouts);

    if (this.current) {
      const currentKeys = Object.keys(this.current.layouts);

      for (const key of currentKeys) {
        this.current.layouts[key].layout.removeAllListeners();
      }
    }

    this.current = {
      id: currentConfigValue.id,
      name: currentConfigValue.name,
      layouts: {},
    };

    for (const key of currentConfigKeys) {
      const layoutValue = currentConfigValue.layouts[key];
      this.current.layouts[key] = {
        layout: new LayoutNode(layoutValue.layout),
        type: layoutValue.type,
        name: layoutValue.name,
      };
      this.current.layouts[key].layout.getRoot().on("change", (l) => {
        this.updateCurrent(key, l);
      });
    }
  }
*/
