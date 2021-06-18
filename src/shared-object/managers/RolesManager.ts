/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */

import { Role } from "../roles/Role";
import { SharedMap } from "@fluidframework/map";
import { FactoriesManager } from "../FactoriesManager";
import { View } from "../views/View";
import { SharedCell } from "@fluidframework/cell";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import EventEmitter from "events";

/* This class is responsible for controlling assigning the roles to the devices */
export class RolesManager extends EventEmitter {
  private roles: Map<string, Role>;
  private lastCommit: number;

  constructor(
    readonly rolesMap: SharedMap,
    readonly factoriesManager: FactoriesManager
  ) {
    super();
    this.roles = new Map<string, Role>();
    this.setEventListener();
    this.lastCommit = 0;
  }

  public async loadRoles(commit: number) {
    const promises = [];
    for (const handle of this.rolesMap.values()) {
      promises.push(handle.get());
    }

    const roles = await Promise.all(promises);
    if (this.lastCommit > commit) {
      return;
    }
    const newRoles = new Map<string, Role>();
    console.log({
      roles: Array.from(this.rolesMap.entries()),
      size: this.rolesMap.size,
    });
    roles.forEach((role) => {
      if (role !== undefined) {
        const r = this.loadRole(role);
        newRoles.set(r.getName(), r);
      }
    });

    console.log(newRoles);
    this.roles = newRoles;
    console.log("" + this.rolesMap.size + " Roles loaded.");
  }

  private setEventListener() {
    this.rolesMap.on("valueChanged", async (e: any, ...args) => {
      this.lastCommit++;
      console.log("Loading role started");
      await this.loadRoles(this.lastCommit);
      this.emit("changeState");
      console.log("Loading role finished");
      /*const roleName = e.key;
      const sharedCell = await this.rolesMap
          .get<IFluidHandle<SharedCell>>(roleName)
          .get();
      if (e.previousValue === undefined) {
        // added
        
        //Set event listener
        sharedCell.on("valueChanged", () => {
          this.emit("changeState");
        });

        // Add the role to the map
        this.loadRole(sharedCell);
        //this.roles.set(roleName, new Role(sharedCell, this.factoriesManager));
        console.log("Adding " + roleName + " from map");
        this.emit("changeState");
      } else {
        const role = this.rolesMap.get(roleName);
        if (role) {
          // updated
          console.log("Updating " + roleName + " from map");
          this.roles.get(roleName).loadObject();
        } else {
          // removed
          this.roles.delete(roleName);
          console.log("Deleting " + roleName + " from map");
          this.emit("changeState");
        }
      }*/
    });
  }

  public async renameRole(role: string, nextValue: string) {
    if (role === nextValue) return;
    const cell = await this.rolesMap.get<IFluidHandle<SharedCell>>(role).get();

    this.rolesMap.set(nextValue, cell.handle);
    this.rolesMap.delete(role);
    cell.set({ ...cell.get(), name: nextValue });
  }

  public getRole(roleName: string): Role {
    return this.roles.get(roleName);
  }

  public hasRole(roleName: string): boolean {
    return this.roles.has(roleName);
  }

  public updateViews(roleName: string): void {
    if (!this.roles.has(roleName)) {
      return;
    }
    const role = this.roles.get(roleName);
    role.updateViews(role.views);
    // this.rolesMap.set(roleName, role.toRole());
  }

  public addView(roleName: string, view: View): void {
    if (!this.roles.has(roleName)) {
      return;
    }
    const role = this.roles.get(roleName);
    role.addView(view);
    // this.rolesMap.set(roleName, role.toRole());
  }

  /* public updateRole(roleName: string, role: Role) {
    role.update(role.toRole(), this.factoriesManager);
    // this.rolesMap.set(roleName, role.toRole());
  }*/

  public removeView(roleName: string, viewId: string): void {
    if (!this.roles.has(roleName)) {
      return;
    }
    const role = this.roles.get(roleName);
    role.removeView(viewId);
    // this.rolesMap.set(roleName, role.toRole());
  }

  public loadRole(sharedRole: SharedCell): Role {
    const role = sharedRole.get();
    let r: Role;
    if (this.roles.has(role.name)) {
      r = this.roles.get(role.name);
      r.loadObject();
    } else {
      r = new Role(sharedRole, this.factoriesManager);
      this.roles.set(r.getName(), r);
    }

    sharedRole.off("valueChanged", () => {
      this.emit(
        "changeState",
        "Role " + role.name + " changed so changing state"
      );
    });
    sharedRole.on("valueChanged", () => {
      this.emit(
        "changeState",
        "Role " + role.name + " changed so changing state"
      );
    });

    return r;
  }

  public addRole(sharedRole: SharedCell): Role {
    const role = sharedRole.get();

    if (this.rolesMap.has(role.name)) return;

    const r = new Role(sharedRole, this.factoriesManager);
    this.rolesMap.set(role.name, sharedRole.handle);
    this.roles.set(role.name, r);

    return r;
  }

  public removeRole(name: string): void {
    for (const key of this.rolesMap.keys()) {
      console.log(key);
    }

    for (const key of this.roles.keys()) {
      console.log(key);
    }
    this.rolesMap.delete(name);
    this.roles.delete(name);
    this.emit("changeState");
  }

  /* public loadRoles() {
    this.rolesMap.forEach((role: IRole) => {
      if (this.roles.has(role.name)) {
        const ro = this.roles.get(role.name);
        ro.update(role, this.factoriesManager);
        return;
      }

      const r = new Role(role.name);
      role.views.forEach((v: IView) => {
        r.addView(View.from(v, this.factoriesManager));
      });

      r.setCombinedViews(role.combinedViewsIds);
      this.roles.set(role.name, r);
    });
  }*/

  public getRoles = (): Role[] => Array.from(this.roles.values());

  public onRolesChange(listener: () => void) {
    return this;
  }
}
