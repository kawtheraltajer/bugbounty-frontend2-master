import { AuthzService } from 'src/app/services/authz.service';
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Permission } from 'src/app/interfaces/types';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-permisstion-picker',
  templateUrl: './permisstion-picker.component.html',
  styleUrls: ['./permisstion-picker.component.scss'],
})

export class PermisstionPickerComponent implements OnInit {
  @Input('isMulti') isMulti=true;
  @Input('isCustomList') isCustomList: boolean;
  @Input('isGroupPermission') isGroupPermission: boolean;
  @Input('permissionList') permissionList: Permission[];
  @Input('selectedPermission') selectedPermissions: Permission[];
  selectedPermission: Permission
  permissions:any;;

  firstTime = true;
  constructor(private popoverController: PopoverController, public user: UserService, public groupService: GroupService, public authz: AuthzService) { }

  async ngOnInit() {
    this.permissions = this.permissionList;

    console.log("permissionList");

    console.log("list" + this.permissions);

  }

  getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.permissions = this.permissionList.filter((item) => {
        item.action + ':' + item.subject + ' - ' + item.description
        let name = item.action + ':' + item.subject + ' - ' + item.description;
        return (name.toLowerCase().includes(val.toLowerCase())
        );
      });
    }
  }



  selectperm(perm: Permission, itemIndex: number) {
    let index = this.permissions.findIndex(val => val.id == perm.id);
    this.permissions[itemIndex].selected = !perm.selected
    this.permissions[index].selected = !perm.selected;
    console.log("\dgd\mhgsa"); 

    console.log(this.permissions[index]); 
  }



  async close(isCancel: boolean) {
    console.log("this.permissions")

console.log(this.permissions)

    if (this.isMulti) {
      await this.popoverController.dismiss({ isCancel, Permission: this.permissions.filter(val => val.selected == true) });
    } else {
      await this.popoverController.dismiss({ isCancel, Permission: this.permissions.filter(val => val.selected == true) });
    }
  }

}
