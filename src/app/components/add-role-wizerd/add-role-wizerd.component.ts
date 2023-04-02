import { PermissionPipe } from './../../pipes/permission.pipe';
import { AddPermissionModal } from './../lists/permissions-list/permission-list.component';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Permission, Role, Subject } from 'src/app/interfaces/types';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PermisstionPickerComponent } from '../pickers/permisstion-picker/permisstion-picker.component';
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'app-add-role-wizerd',
  templateUrl: './add-role-wizerd.component.html',
  styleUrls: ['./add-role-wizerd.component.scss'],
})
export class AddRoleWizerdComponent implements OnInit {
  roleForm: FormGroup;
  permissionForm: FormGroup;
  @Input('role') role: Role;
  type: 'permissionToRole' | 'roleToGroup' | 'roleToUser' = 'permissionToRole';
  toID: number
  roleId: number;
  selection = new SelectionModel<Permission>(true, []);
  permissionColumns: string[];
  searchTerm = '';
  view_fields: { field: string, selected: boolean }[] = [];
  allFieldsSelected: boolean = false;

  permissionsList = new MatTableDataSource([]);
  // @Input('permissions') permissions: Permission[];

  @Input('selectedPermissions') selectedPermissions: Permission[];
  @Input('showSelected') showSelected: boolean;
  @ViewChild('permissionsTablePaginator', { static: true }) tablePaginator: MatPaginator;

  permissions: Permission[] = [];

  constructor(public lang: LanguageService,public popoverController: PopoverController, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, private authz: AuthzService, private alertCtrl: AlertController) {
    this.roleForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],

    });
    this.permissionForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      auth_field: ['', []],
      subject: ['User', [Validators.required]],
      action: ['', [Validators.required]],
      // module: ['']
    });
  }

  ParmitiionType() {
    this.alertCtrl.create({
      header: 'Permisstion',
      message: 'You want add New permission? or exit permission?',
      buttons: [
        {
          text: 'New',
          handler: () => {
            this.openPermisstion();
          }
        },
        {
          text: 'exit',
          handler: () => {
            this.selectPermisstion()
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }



  async selectPermisstion() {
    await this.authz.getAllPermissions();
    console.log(this.authz.permissions.value)


    const popover = await this.popoverController.create({

      component: PermisstionPickerComponent,
      // event: ev,
      cssClass: 'popover-height',
      translucent: false,
      componentProps: {
        isMulti: false,
        permissionList: this.authz.permissions.value
      }
    });

    await popover.present();
    popover.onWillDismiss().then(dt => {
      if (!dt.data?.isCancel) {

        for(let Permission of dt.data.Permission) {
          this.permissions.push(Permission)
        }
    
 
   
        
      }
    });
  }



    /*   this.permissions.push(dt.data.data)  */


  ExitPermisstion() {

  }



  updateAllFields() {
    this.allFieldsSelected = this.view_fields != null && this.view_fields.every(t => t.selected);
  }
  someComplete(): boolean {
    if (this.view_fields == null) {
      return false;
    }
    return this.view_fields.filter(t => t.selected).length > 0 && !this.allFieldsSelected;
  }

  setAll(selected: boolean) {
    this.allFieldsSelected = selected;
    if (this.view_fields == null) {
      return;
    }
    this.view_fields.forEach(t => t.field != 'id' ? t.selected = selected : null);
  }
  subChanged() {
    this.view_fields = Object.keys(this.app.fields[this.permissionForm.value.subject]).map(k => {
      if (k == 'id') {
        return { field: k, selected: true }
      } else {
        return { field: k, selected: false }
      }
    });
    this.allFieldsSelected = false;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.permissionsList.data.length;
    return numSelected === numRows;
  }

  async ngOnInit() {
    this.permissionColumns = ['select', 'id', 'name', 'subject', 'action', 'description'];
    //this.getDisplayedColumns();
    this.permissionsList = new MatTableDataSource(this.permissions);
    this.permissionsList.paginator = this.tablePaginator;
    if (this.selectedPermissions && this.showSelected) {
      let selectedIds = this.selectedPermissions.map(dt => dt.id);
      this.selection = new SelectionModel<Permission>(true, [
        ...this.permissionsList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  async addRole() {
    console.log(this.roleForm.value)
    await this.app.presentLoading();
    if (this.roleForm.valid) {
      let data = this.roleForm.value;
      try {
        let role = await this.authz.addRole(data);
        console.log("---- Role Data ----- ");
        console.log(role.id);

        this.roleId = role.id;

        for (const perm of this.permissions) {
          await this.authz.link({
            type: "permissionToRole",
            roleID: role.id,
            permissionID: perm.id
          })
        }
        await this.app.dismissLoading();
        this.dismiss(role);
        // this.addparmation();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.roleForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }


  async openPermisstion() {
    console.log("Init Compo");

    const modal = await this.modalCtrl.create({
      component: AddPermissionModal,
      cssClass: 'responsiveModal'
    });
    modal.onWillDismiss().then(res => {
      // this.permissionsList.data = this.permissions
      console.log(res);
      if (res.data.data) {
        this.permissions.push(res.data.data)
      }
    });
    return await modal.present();
  }
  async link() {
    let res = await this.authz.link({
      type: this.type,
      roleID: this.roleId,
      permissionID: this.toID,
      userID: this.toID,
      groupID: this.toID
    });
    console.log("!--link-->");

    console.log(res);

  }


  async addparmation() {
    await this.app.presentLoading();
    if (this.permissionForm.valid) {
      let data = {
        view_fields: {},
        ...this.permissionForm.value
      };
      this.view_fields.forEach(fi => {
        data.view_fields[fi.field] = fi.selected;
      });
      try {
        const res = await this.authz.addPermission(data);
        console.log("---- permissin Data ----- ");
        console.log(res.id);
        this.toID = res.id;
        this.link()
      } catch (e) {
        console.log(e);
      }
    } else {
      this.permissionForm.markAllAsTouched();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
    await this.app.dismissLoading();
  }


  dismiss(data?: Role) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  async details(row) {
    // const modal = await this.modalController.create({ component: methodDetailsModal, cssClass: 'responsiveModal', componentProps: { id: row.id } });
    // return await modal.present();
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.permissionsList.data.forEach(row => this.selection.select(row));
  }

  getDisplayedColumns(): string[] {
    if (!this.showSelected) {
      return this.app.isDesktop ? this.permissionColumns.filter(dt => dt !== 'select') : this.permissionColumns.filter(dt => dt !== 'module' && dt !== 'select');
    } else {
      return this.app.isDesktop ? this.permissionColumns : this.permissionColumns.filter(dt => dt !== 'module');
    }
  }

}

