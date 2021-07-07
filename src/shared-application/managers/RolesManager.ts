/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */

import { Role } from "../roles/Role";
import { SharedMap } from "@fluidframework/map";
import { FactoriesManager } from "./FactoriesManager";
import { SharedCell } from "@fluidframework/cell";
import EventEmitter from "events";

enum RolesManagerEvents {
  ChangeState = "changeState",
}
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

  /* Defines the event listeners needed */
  private setEventListener() {
    this.rolesMap.on("valueChanged", async () => {
      this.lastCommit++;
      await this.loadRoles(this.lastCommit);
      this.emitChange();
    });
  }

  /*
   * Loads all the roles from the shares roles map
   */
  public async loadRoles(commit: number) {
    const promises = [];
    for (const handle of this.rolesMap.values()) {
      promises.push(handle.get());
    }

    const roles = await Promise.all(promises);

    if (this.lastCommit > commit) return;

    const newRoles = new Map<string, Role>();

    roles.forEach((role) => {
      if (role) {
        const r = this.loadRole(role);
        newRoles.set(r.getName(), r);
      }
    });

    this.roles = newRoles;
    console.log("" + this.roles.size + " Roles loaded.");
  }

  /*
   * Loads a role from a shared role, if it exists it updates , otherwise
   * creates a new role
   */
  public loadRole(sharedRole: SharedCell): Role {
    const sharedRoleValue = sharedRole.get();
    let role: Role;
    if (this.roles.has(sharedRoleValue.name)) {
      role = this.roles.get(sharedRoleValue.name);
      role.loadObject();
    } else {
      role = new Role(sharedRole, this.factoriesManager);
      this.roles.set(role.getName(), role);
    }

    sharedRole.off("valueChanged", () => {
      this.emitChange(
        "Role " + sharedRoleValue.name + " changed so changing state"
      );
    });
    sharedRole.on("valueChanged", () => {
      this.emitChange(
        "Role " + sharedRoleValue.name + " changed so changing state"
      );
    });

    return role;
  }

  /* GETTERS */
  /*
   * Gets a role by the name
   */
  public getRole(roleName: string): Role {
    return this.roles.get(roleName);
  }

  /*
   * Gets a roles
   */
  public getRoles = (): IterableIterator<Role> => this.roles.values();

  /*
   * Check if the role exists
   */
  public hasRole(roleName: string): boolean {
    return this.roles.has(roleName);
  }

  /*
   * Renames a role
   */
  public renameRole(oldRoleName: string, newRoleName: string) {
    if (oldRoleName === newRoleName) return;
    const role = this.roles.get(oldRoleName);
    if (!role) return;
    const cell = role.getSharedObject();
    this.rolesMap.set(newRoleName, cell.handle);
    this.rolesMap.delete(oldRoleName);
    // TODO:Set all the stitching position to new value
    cell.set({ ...cell.get(), name: newRoleName });
  }

  /*
   * Adds a role to the roles map and roles shared map
   */
  public addRole(sharedRole: SharedCell): Role {
    const sharedRoleValue = sharedRole.get();

    if (this.rolesMap.has(sharedRoleValue.name)) {
      console.error("The role " + sharedRoleValue.name + " already exists.");
      return;
    }

    this.rolesMap.set(sharedRoleValue.name, sharedRole.handle);

    const role = new Role(sharedRole, this.factoriesManager);
    this.roles.set(sharedRoleValue.name, role);

    return role;
  }

  public deleteRolesEventListener() {
    const values = this.roles.values();
    for (const v of values) {
      //v.deleteAllViewsListeners();
    }
  }

  /*
   * Removes a role to the roles map and roles shared map
   */
  public removeRole(roleName: string): void {
    this.roles.delete(roleName);
    this.rolesMap.delete(roleName);
  }

  /* Callback functions */

  private emitChange(message?: string) {
    this.emit(RolesManagerEvents.ChangeState, message);
  }
}
