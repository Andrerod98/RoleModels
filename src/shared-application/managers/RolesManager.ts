/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */

import { Role } from "../roles/Role";
import { SharedMap } from "@fluidframework/map";
import { FactoriesManager } from "./FactoriesManager";
import { SharedCell } from "@fluidframework/cell";
import EventEmitter from "events";
import { Logger } from "../Logger";

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
    this.lastCommit = 0;
    this.setEventListener();
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
        if (r) {
          newRoles.set(r.getId(), r);
        }
      }
    });

    this.roles = newRoles;
    Logger.getInstance().success("" + this.roles.size + " Roles loaded.");
  }

  /*
   * Loads a role from a shared role, if it exists it updates , otherwise
   * creates a new role
   */
  public loadRole(sharedRole: SharedCell): Role {
    const sharedRoleValue = sharedRole.get();
    let role: Role;
    if (this.roles.has(sharedRoleValue.id)) {
      role = this.roles.get(sharedRoleValue.id);
      role.loadObject();
    } else {
      role = new Role(sharedRole, this.factoriesManager);
      this.roles.set(role.getId(), role);
    }

    function change() {
      this.emitChange(
        "Role " + sharedRoleValue.name + " changed so changing state"
      );
    }

    sharedRole.off("valueChanged", change);
    sharedRole.on("valueChanged", change);

    return role;
  }

  /* GETTERS */
  /*
   * Gets a role by the id
   */
  public getRole(roleId: string): Role {
    const role = this.roles.get(roleId);
    if (!role)
      Logger.getInstance().error(`The role with id ${roleId} was not found.`);
    return role;
  }

  /*
   * Gets a role by the name
   */
  public getRoleByName(roleName: string): Role {
    const role = Array.from(this.roles.values()).find(
      (role) => role.getName() === roleName
    );
    if (!role)
      Logger.getInstance().error(
        `The role with name ${roleName} was not found.`
      );

    return role;
  }

  /*
   * Gets a roles
   */
  public getRoles = (): IterableIterator<Role> => this.roles.values();

  /*
   * Check if the role exists
   */
  public hasRole(roleId: string): boolean {
    return this.roles.has(roleId);
  }

  /*
   * Renames a role
   */
  public renameRole(id: string, oldRoleName: string, newRoleName: string) {
    if (oldRoleName === newRoleName) return;
    const role = this.roles.get(id);
    if (!role) {
      Logger.getInstance().error(
        `The role with id ${id} could not be renamed because it was not found.`
      );
      return;
    }
    const cell = role.getSharedObject();
    cell.set({ ...cell.get(), name: newRoleName });
  }

  /*
   * Adds a role to the roles map and roles shared map
   */
  public addRole(sharedRole: SharedCell): Role {
    const sharedRoleValue = sharedRole.get();

    if (this.rolesMap.has(sharedRoleValue.id)) {
      Logger.getInstance().error(
        `The role with id ${sharedRoleValue.id} already exists.`
      );
      return;
    }
    this.rolesMap.set(sharedRoleValue.id, sharedRole.handle);
    const role = new Role(sharedRole, this.factoriesManager);
    this.roles.set(sharedRoleValue.id, role);

    return role;
  }

  public deleteRolesEventListener() {
    this.rolesMap.removeAllListeners();
  }

  /*
   * Removes a role to the roles map and roles shared map
   */
  public removeRole(roleId: string): void {
    if (!(this.roles.delete(roleId) && this.rolesMap.delete(roleId))) {
      Logger.getInstance().error(
        `The role with id ${roleId} does not exist so it was not removed.`
      );
    }
  }

  /* Callback functions */
  private emitChange(message?: string) {
    this.emit(RolesManagerEvents.ChangeState, message);
  }
}
