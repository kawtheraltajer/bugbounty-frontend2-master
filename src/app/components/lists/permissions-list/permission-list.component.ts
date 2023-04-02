import { SelectionModel } from '@angular/cdk/collections';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController } from '@ionic/angular';
import { Permission, Role, Subject } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'permissions-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('permissions') permissions: Permission[];
  @Input('FromRole') FromRole: boolean;
  @Input('RoleID') RoleID: number;
  @Input('selectedPermissions') selectedPermissions: Permission[];
  @Input('showSelected') showSelected: boolean;
  @Input('isAdd') isAdd: boolean = false;
  selection = new SelectionModel<Permission>(true, []);
  permissionColumns: string[];
  permissionsList = new MatTableDataSource([]);
  @ViewChild('permissionsTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService) { }

  async ngOnInit() {
    this.permissionColumns = ['select', 'id', 'name', 'subject', 'action', 'description'];
    this.getDisplayedColumns();

    if (this.RoleID) {
      this.permissions = await (await (await this.authz.getRole(this.RoleID)).permissions)
    } else {
      this.permissions = (await this.authz.getAllPermissions());


    }
    this.permissionsList = new MatTableDataSource(this.permissions);
    this.permissionsList.paginator = this.tablePaginator;
    if (this.selectedPermissions && this.showSelected) {
      let selectedIds = this.selectedPermissions.map(dt => dt.id);
      this.selection = new SelectionModel<Permission>(true, [
        ...this.permissionsList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
    this.getDisplayedColumns();
  }

  async tableInit() {

    if (this.RoleID) {
      this.permissions = await (await (await this.authz.getRole(this.RoleID)).permissions)
    } else {
      this.permissions = (await this.authz.getAllPermissions());


    } 
    this.permissionsList = new MatTableDataSource(this.permissions);
    this.permissionsList.paginator = this.tablePaginator;
  }
  ngAfterViewInit() {
    this.permissionsList.sort = this.sort;
  } 
    async  ngOnChanges() {
    if (this.RoleID) {
      this.permissions = await (await (await this.authz.getRole(this.RoleID)).permissions)
    } else {
      this.permissions = (await this.authz.getAllPermissions());


    }
    this.permissionsList.data = this.permissions
  }

  async add() {

    const modal = await this.modalController.create({ component: AddPermissionModal, cssClass: 'responsiveModal', componentProps: { RoleID: this.RoleID } });
    modal.onWillDismiss().then(data => {
      console.log(data);
      this.ngOnInit()
    });
    return await modal.present();
  }
  async details(row) {
    // const modal = await this.modalController.create({ component: methodDetailsModal, cssClass: 'responsiveModal', componentProps: { id: row.id } });
    // return await modal.present();
  }

  applyFilter() {
    this.permissionsList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    if (!this.showSelected) {
      return this.app.isDesktop ? this.permissionColumns.filter(dt => dt !== 'select') : this.permissionColumns.filter(dt => dt !== 'module' && dt !== 'select');
    } else {
      return this.app.isDesktop ? this.permissionColumns : this.permissionColumns.filter(dt => dt !== 'module');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.permissionsList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.permissionsList.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}

@Component({
  selector: 'add-permission',
  templateUrl: 'add-permission.html',
})
export class AddPermissionModal implements OnInit {
  @Input('RoleID') RoleID: number
  validation_messages: any;
  permissionForm: FormGroup;
  view_fields: { field: string, selected: boolean }[] = [];
  allFieldsSelected: boolean = false;
  constructor(public modalCtrl: ModalController, public app: AppService, fb: FormBuilder, private authz: AuthzService) {
    this.permissionForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      auth_field: ['', []],
      subject: ['User', [Validators.required]],
      action: ['', [Validators.required]],
      RoleID: ['',],

      // module: ['']
    });

  }

  ngOnInit() {

    this.permissionForm.get('RoleID').setValue(this.RoleID)
    this.subChanged();
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'System.Authorization.Permissions.messages.name.required' },
      ],
      'description': [
        { type: 'required', message: 'System.Authorization.Permissions.messages.description.required' },
      ],
      'subject': [
        { type: 'required', message: 'System.Authorization.Permissions.messages.subject.required' },
      ],
      'action': [
        { type: 'required', message: 'System.Authorization.Permissions.messages.action.required' },
      ],




    }
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

  async add() {
    await this.app.presentLoading();
    if (this.permissionForm.valid) {
      let data = {
        view_fields: {},
        ...this.permissionForm.value
      };
      /*this.view_fields.forEach(fi => {
        data.view_fields[fi.field] = fi.selected;
      });*/
      try {
        console.log(data)
        const res = await this.authz.addPermission(data);
        this.dismiss(res);
      } catch (e) {
        console.log(e);
      }
    } else {
      this.permissionForm.markAllAsTouched();
      // await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
    await this.app.dismissLoading();
  }

  async dismiss(data?: Permission) {
    await this.modalCtrl.dismiss({

      'dismissed': true,
      data
    });
  }
}