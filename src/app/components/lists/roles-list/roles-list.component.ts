import { PermisstionPickerComponent } from './../../pickers/permisstion-picker/permisstion-picker.component';
import { AddPermissionModal } from './../permissions-list/permission-list.component';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController } from '@ionic/angular';
import { Permission, Role } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LinkModalComponent } from '../../link-modal/link-modal.component';
import { LanguageService } from 'src/app/services/language.service';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('roles') roles: Role[];
  @Input('isAdd') isAdd: boolean = false;
  roleColumns: string[];
  rolesList = new MatTableDataSource([]);
  @ViewChild('rolesTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';

  constructor(public lang: LanguageService,public popoverController: PopoverController, public modalController: ModalController, private app: AppService, fb: FormBuilder, private authz: AuthzService, private alertCtrl: AlertController) {
  }
  async ngOnInit() {
    this.roleColumns = ['id', 'name', 'description'];
    this.roles=await this.authz.getAllRoles()
    this.rolesList.data = this.roles;
    this.getDisplayedColumns();
  }
  async  ngOnChanges() {
  
    this.roles=await this.authz.getAllRoles()
    this.rolesList.data = this.roles;
  }
  async  ngAfterViewInit() {
    this.roles=await this.authz.getAllRoles()
    this.rolesList.data = this.roles;
    this.rolesList = new MatTableDataSource(this.roles);
    this.rolesList.paginator = this.tablePaginator;
    this.rolesList.sort = this.sort;
  }
  async addRole() {
    const modal = await this.modalController.create({
      component: AddRoleModal,

    });
    modal.onWillDismiss().then(data => {
      console.log(data);
      this.ngOnInit()
    });
    return await modal.present();
  }
arrr(){
 
}

  async details(row) {
    const modal = await this.modalController.create({ component: RoleDetailsModal, cssClass: 'modal100', componentProps: { id: row.id } });
    return await modal.present();
  }

  applyFilter() {
    this.rolesList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.roleColumns : this.roleColumns.filter(dt => dt !== 'createdAt');
  }
}

@Component({
  selector: 'role-details',
  templateUrl: './role-details.html',
  styleUrls: ['./roles-list.component.scss']
})
export class RoleDetailsModal implements OnInit {
  @Input() id: number;
  segment = 0;
  isLoading = true;
  data: any;
  permissions: Permission[] = []
  constructor(public modalCtrl: ModalController, private app: AppService, private authz: AuthzService) { }

  async ngOnInit() {
    await this.authz.getAll();
    await this.app.presentLoading();
    this.permissions = await this.authz.getAllPermissions();
    this.authz.getRole(this.id).then(async x => {
      this.data = x;
      this.isLoading = false;
      await this.app.dismissLoading();
    });
  }

  async link() {
    const modal = await this.modalCtrl.create({ component: LinkModalComponent, cssClass: 'responsiveModal', componentProps: { role: this.data } });
    modal.onWillDismiss().then(data => {
      console.log('link Will Dismiss');
    });
    return await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'add-role',
  templateUrl: 'add-role.html',
})
export class AddRoleModal {
  roleForm: FormGroup;
  permissions: Permission[] = []
  roleId:number
  validation_messages:any;
  ShowRole:Boolean=true
  constructor(public lang: LanguageService,public popoverController: PopoverController, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, private authz: AuthzService, private alertCtrl: AlertController) {
  
    this.roleForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
  async ngOnInit() {


  this.validation_messages = {
    'name': [
      { type: 'required', message: 'System.Authorization.Permissions.messages.name.required' },
    ],
    'description': [
      { type: 'required', message: 'System.Authorization.Permissions.messages.description.required' },
    ],

  }

  }

  permissionType() {
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
     // await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
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

  dismiss(data?: Role) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }
}