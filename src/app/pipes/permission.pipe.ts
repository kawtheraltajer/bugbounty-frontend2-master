import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Action, Permission, Subject } from '../interfaces/types';
import { AuthzService } from '../services/authz.service';

@Pipe({
  name: 'permission',
  pure: true,
})

export class PermissionPipe implements PipeTransform {
  constructor(private auth: AuthService, private authz: AuthzService) { }
  transform(value: string, data?: any) {
    if (value) {
      if (data) {
        let command = value.split(':');
        let au = this.canDo(command[1] as Action, command[0] as Subject, data);
        return au;
      } else {
        const arg = value.split(',');
        for (const perm of arg) {
          let subAct = perm.split(':');
          if (this.authz.userAuthz[subAct[0]]?.actions.includes(subAct[1]) || this.authz.userAuthz[subAct[0]]?.actions.includes('MANAGE')) {
            return true;
          }
        }
        return false;
      }
    } else {
      return true;
    }
  }
  canDo(action: Action, subject: Subject, data?: any) {
    const jwt = this.auth.userJWT.value;
    let sub = this.authz.userAuthz[subject] as { actions: string[], permissions: Permission[] };
    let permission: Permission;
    if (!sub) return false;
    if (sub.actions.includes('MANAGE')) {
      permission = sub.permissions.find(v => v.action == 'MANAGE');
    } else {
      permission = sub.permissions.find(v => v.action == action);
    }

    // ! If user doesn't have any permission related dont pass
    if (!permission) return false;


    let auth_field = permission.auth_field ? permission.auth_field : null;
    // ! If manage and auth_field is null directly pass
    if (permission.action == 'MANAGE' && auth_field == null) return true;

    // ! If auth field not specified pass
    if (!auth_field) return true;

    if (subject == 'Appraisal') {
      return data['appraiserID'] == jwt.employeeID
    }

    // ! If auth field is depends on a single field
    if (auth_field == 'employeeID') {
      return data[auth_field] == jwt[auth_field] || jwt.supervise.includes(data[auth_field])
    }

    if (auth_field == 'clientID') {
      return data['clientID'] == jwt['clientID'];
    }

    if (auth_field == 'groupID') {
      return jwt.groupIDs.includes(data['groupID']);
    }
    if (auth_field == 'userID') {
      return jwt.userID == data['userID'];
    }
  }
}
