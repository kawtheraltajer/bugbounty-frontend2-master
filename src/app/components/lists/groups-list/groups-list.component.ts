import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController, PopoverController } from '@ionic/angular';
import { data } from 'autoprefixer';
import { User, Role, Group, Employee } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
import { EmployeePickerComponent } from '../../pickers/employee-picker/employee-picker.component';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('groups') groups: Group[];
  @Input('isAdd') isAdd: boolean = false;
  groupColumns: string[];
  groupsList = new MatTableDataSource([]);
  @ViewChild('groupsTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  constructor(public authz: AuthzService, public modalController: ModalController, public app: AppService,) { }

  async ngOnInit() {
    this.groupColumns = ['id', 'name', 'description'];
    this.groups = (await this.authz.getAllGroups());

    this.groupsList = new MatTableDataSource(this.groups);
    this.getDisplayedColumns();
  }
   async  ngOnChanges() {
    this.groups = (await this.authz.getAllGroups());
    this.groupsList.data = this.groups
  }
  async ngAfterViewInit() {
    this.groups = (await this.authz.getAllGroups());

    this.groupsList = new MatTableDataSource(this.groups);
    this.groupsList.paginator = this.tablePaginator;
    this.groupsList.sort = this.sort;
  }
  async add() {
    const modal = await this.modalController.create({ component: AddGroupModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()  
  });
    return await modal.present();
  }

  async details(row) {
    const modal = await this.modalController.create({ component: GroupDetailsModal, cssClass: 'responsiveModal', componentProps: { id: row.id } });
    return await modal.present();
  }

  applyFilter() {
    this.groupsList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return !this.app.isSmallScreen ? this.groupColumns : this.groupColumns.filter(dt => dt !== 'createdAt');
  }
}

@Component({
  selector: 'group-details',
  templateUrl: './group-details.html',
})
export class GroupDetailsModal implements OnInit {
  @Input() id: number;
  isLoading = true;
  data: any;
  members: any;
  ListOfMemberId: [];
  leader: Employee
  UpdateForm: FormGroup;
  validation_messages:any;
  constructor(private group: GroupService,
    fb: FormBuilder,


    public modalCtrl: ModalController, private app: AppService, private authz: AuthzService, public popoverController: PopoverController,
  ) {


    this.UpdateForm = fb.group({
      group_name: ['', [Validators.required]],
      group_description: ['', [Validators.required]],

    });
  }  


  async selectLeader(ev: any) {
    const mdl = await this.modalCtrl.create({
      component: EmployeePickerComponent,
      // event: ev,
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      console.log(dt.data);
      if (!dt.data?.isCancel) {
        if (dt.data.employee) {
          // this.addForm.get('leaderID').setValue(dt.data.employee.id);
          this.leader = dt.data.employee
          console.log(dt.data.employee.id)

          this.group.changeLeader(
            {

              groupID: this.id,
              employeeID: dt.data.employee.id
            }

          )
          console.log()
        }
      }
    });
  }

  async selectMembers(ev: any) {
    const mdl = await this.modalCtrl.create({
      component: EmployeePickerComponent,
      componentProps: {
        isMulti: true,
        selectedEmployees: this.members
      }
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      if (!dt.data?.isCancel) {
        this.members = dt.data.employees
        this.group.addMembersToGroup(
          {
            groupID: this.id,
            members: this.members.map(dt => dt.id)
          }
        )
      }
    });
  }
  updateGroup() {

    this.group.updateGroup({
      name: this.UpdateForm.value.group_name,
      description: this.UpdateForm.value.group_description

    })

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



    await this.app.presentLoading();
    this.authz.getGroup(this.id).then(async x => {
      this.data = x;
      console.log(x);

      this.UpdateForm.setValue({
        group_name: x.name,
        group_description: x.description

      });
      this.isLoading = false;
      await this.app.dismissLoading();
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'add-group',
  templateUrl: 'add-group.html',
})
export class AddGroupModal implements OnInit {
  addForm: FormGroup;
  members: Employee[] = [];
  leader: Employee
  validation_messages:any;
  constructor(
    public modalCtrl: ModalController,
    private app: AppService,
    fb: FormBuilder,
    private group: GroupService,
    public popoverController: PopoverController,
    public user: UserService) {
    this.addForm = fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      leaderID: [''],
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

  async add() {
    if (this.addForm.valid && this.leader?.id) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      try {
        await this.group.createGroup({
          name: data.name,
          description: data.description,
          members: this.members.map(val => val.id),
          leaderID: this.leader.id
        });
        await this.app.dismissLoading();
        this.dismiss(data);
      } catch (e) {
        await this.app.dismissLoading();
        console.log(e);
        await this.app.presentAlert('Sorry ~', 'Somthing Went Wrong, Please try again.', 'errorAlert');
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  async selectMembers(ev: any) {
    const mdl = await this.modalCtrl.create({
      component: EmployeePickerComponent,
      componentProps: {
        isMulti: true,
        selectedEmployees: this.members
      }
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      if (!dt.data?.isCancel) {
        this.members = dt.data.employees
      }
    });
  }

  removeMember(index: number) {
    this.members.splice(index, 1);
  }

  removeLeader() {
    this.leader = null;
  }

  async selectLeader(ev: any) {
    const mdl = await this.modalCtrl.create({
      component: EmployeePickerComponent,
      // event: ev,
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      console.log(dt.data);
      if (!dt.data?.isCancel) {
        if (dt.data.employee) {
          this.addForm.get('leaderID').setValue(dt.data.employee.id);
          this.leader = dt.data.employee
        }
      }
    });
  }

  dismiss(data?: User) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }
}