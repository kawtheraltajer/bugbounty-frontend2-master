import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController } from '@ionic/angular';
import { Designation, Permission, Role, User } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { UserService } from 'src/app/services/user.service';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('users') users: User[];
  @Input('isAdd') isAdd: boolean = false;
  @Input('permission') permission: Permission;
  userColumns: string[];
  usersList = new MatTableDataSource([]);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('usersTablePaginator', { static: true }) tablePaginator: MatPaginator;

  isSearch = false;
  searchTerm = '';
  @Input('RoleID') RoleID: number

  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService) { }

  async ngOnInit() {
    this.userColumns = ['id', 'name', 'email', 'isActive', 'isLocked', 'createdAt'];
    if (this.RoleID) {
      this.usersList.data = await (await this.authz.getRole(this.RoleID)).users
    } else {
      this.usersList.data = await this.authz.getAllUsers()
    }

    this.getDisplayedColumns();
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async ngOnChanges() {
    if (this.RoleID) {
      this.usersList.data = await (await this.authz.getRole(this.RoleID)).users
    } else {
      this.usersList.data = await this.authz.getAllUsers()
    }
  }

  async ngAfterViewInit() {
    if (this.RoleID) {
      this.usersList.data = await (await this.authz.getRole(this.RoleID)).users
    } else {
      this.usersList.data = await this.authz.getAllUsers()
    }
    this.usersList = new MatTableDataSource(this.users);
    this.usersList.paginator = this.tablePaginator;
    this.usersList.sort = this.sort;
  }
  async add() {
    const modal = await this.modalController.create({ component: AddUserModal, cssClass: 'responsiveModal', componentProps: { RoleID: this.RoleID } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async details(row) {
    const modal = await this.modalController.create({ component: UserDetailsModal, cssClass: 'responsiveModal', componentProps: { id: row.id } });
    return await modal.present();
  }

  applyFilter() {
    this.usersList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    if (this.app.isSmallScreen) {
      return this.userColumns.filter(dt => dt !== 'createdAt');
    } else {
      return this.userColumns.filter(dt => {
        /*if (this.permission) {
                 if (dt == "name") {
                   return this.permission?.view_fields['first_name'] == true
                 }
                 return this.permission?.view_fields[dt] == true
               } else {
                 return true
               }
               return true*/
        return true;
      });
    }
  }
}

@Component({
  selector: 'user-details',
  templateUrl: './user-details.html',
})
export class UserDetailsModal implements OnInit {
  @Input('id') id: number;
  isLoading = true;
  data: User;
  constructor(public modalCtrl: ModalController, private app: AppService, private authz: AuthzService, private userService: UserService) { }

  async ngOnInit() {
    await this.app.presentLoading();
    this.authz.getUser(this.id).then(async x => {
      this.data = x;
      this.isLoading = false;
      await this.app.dismissLoading();
    });
  }
  async activate(isActive: boolean) {
    await this.app.presentLoading();
    await this.authz.activeteUser(this.data.id, isActive);
    await this.app.dismissLoading();

  }
  async lock(isLocked: boolean) {
    await this.app.presentLoading();
    await this.authz.lockUser(this.data.id, isLocked);
    await this.app.dismissLoading();
  }

  getURL(imgPath: string) {
    return this.userService.getProfilePicURL(imgPath);
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async changePassword() {
    const modal = await this.modalCtrl.create({ component: ChangePasswordModal, cssClass: 'passwordModal', componentProps: { id: this.id } })
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    })
    return await modal.present();
  }

  async updateRole() {
    const modal = await this.modalCtrl.create({ component: UpdateRoleModal, cssClass: 'passwordModal', componentProps: { id: this.id, RoleID: this.data.roleID } })
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    })
    return await modal.present();
  }
}

@Component({
  selector: 'add-user',
  templateUrl: 'add-user.html',
})
export class AddUserModal implements OnInit {
  validation_messages: any
  addForm: FormGroup;
  roles: Role[] = [];
  @Input('RoleID') RoleID: number
  designations: Designation[] = [];
  showRole: boolean = true;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService, private userService: UserService) {
    this.addForm = fb.group({
      roleID: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'), Validators.required])]],
      bio: [''],
      pictureURL: [''],
      type: ['emp'],
      designationID: [null,]
    });
  }

  async ngOnInit() {
    if (this.RoleID) {
      this.addForm.get('roleID').setValue(this.RoleID)
      this.showRole = false
    }
    this.roles = await this.authz.getAllRoles();
    this.validation_messages = {
      'first_name': [
        { type: 'required', message: 'System.Authorization.Users.messages.first_name.required' },
      ],
      'last_name': [
        { type: 'required', message: 'System.Authorization.Users.messages.last_name.required' },
      ],
      'email': [
        { type: 'required', message: 'System.Authorization.Users.messages.Email.required' },
        { type: 'pattern', message: 'System.Authorization.Users.messages.Email.pattern' }
      ],
      'roleID': [
        { type: 'required', message: 'System.Authorization.Users.messages.roleID.required' },
      ]
    }
    this.designations = await this.authz.getAlldesignation();
  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let { pictureURL, ...data } = this.addForm.value;
      let url = '';
      try {
        if (pictureURL) {
          let img = pictureURL.files[0];
          let uploaded;
          if (img) {
            uploaded = await this.userService.uploadPicture(img);
            if (uploaded?.filename) {
              url = uploaded.filename;
            }
          }
        }
        let user = await this.authz.addUser({
          user: {
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name
          },
          profile: {
            bio: data.bio,
            pictureURL: url
          },
          roleID: data.roleID,
          designationID: data.designationID,
          type: data.type
        });

        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  dismiss(data?: User) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }
}

@Component({
  selector: 'change-password',
  templateUrl: './change-password.html',
})
export class ChangePasswordModal implements OnInit {
  @Input('id') id: number;
  changePassForm: FormGroup;
  data: User;
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private app: AppService,
    public translate: TranslateService,
    public user: UserService) {
    this.changePassForm = fb.group({
      newPassword: ['', [Validators.required]],
      newPasswordCon: ['', [Validators.required]]
    });
  }

  async ngOnInit() { }

  async changePassword() {
    await this.app.presentLoading();
    if (this.changePassForm.valid) {
      let val = this.changePassForm.value;
      if (val.newPassword == val.newPasswordCon) {
        await this.user.changeUserPassword(this.id, val.newPassword);
        await this.app.presentAlert(this.translate.instant('Operations.Success'), this.translate.instant('MyAccount.Profile.messages.ChangeSuccess'), 'successAlert')
        this.dismiss()
      } else {
        await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('MyAccount.Profile.messages.DoesntMatch'), 'errorAlert')
      }
      await this.app.dismissLoading();

    } else {
      await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('MyAccount.Profile.messages.Fill'), 'errorAlert')
      await this.app.dismissLoading();

    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'update-role',
  templateUrl: './update-role.html',
})
export class UpdateRoleModal implements OnInit {
  @Input('id') id: number;
  @Input('RoleID') RoleID: number
  updateRoleForm: FormGroup;
  roles: Role[]
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private app: AppService,
    public translate: TranslateService,
    public user: UserService,
    private authz: AuthzService) {
    this.updateRoleForm = fb.group({
      roleID: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.roles = await this.authz.getAllRoles()
    this.updateRoleForm.get('roleID').setValue(this.RoleID)
  }

  async updateRole() {
    await this.app.presentLoading();
    if (this.updateRoleForm.valid) {
      let val = this.updateRoleForm.value;
      await this.authz.link({
        type: 'roleToUser',
        userID: this.id,
        roleID: val.roleID
      });
      this.dismiss()
      await this.app.dismissLoading();

    } else {
      await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('MyAccount.Profile.messages.Fill'), 'errorAlert')
      await this.app.dismissLoading();

    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}