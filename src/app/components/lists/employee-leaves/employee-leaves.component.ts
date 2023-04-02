import { LeaveType, Leave, Employee } from 'src/app/interfaces/types';;
import { Input, OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';
@Component({
  selector: 'employee-leaves',
  templateUrl: './employee-leaves.component.html',
  styleUrls: ['./employee-leaves.component.scss'],
})
export class EmployeeLeavesComponent implements OnInit {
  searchTerm = '';
  leave: Leave[];
  @Input('isAdd') isAdd: boolean = false;
  LeaveColumns: string[];
  @Input('employeeID') employeeID: number;
  @Input('selecteLeave') selecteLeave: Leave[];
  LeaveList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Leave>(true, []);
  @ViewChild('LeaveTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  approval: boolean
  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router, public user: UserService) { }
  async ngOnInit() {
    this.leave = await this.authz.getEmployeeLeave(this.employeeID);
    this.LeaveColumns = ['id', 'name', 'type', 'from_date', 'to_date', 'total_days', 'Action', 'Status',"Decument"];
    this.getDisplayedColumns();
    this.LeaveList = new MatTableDataSource(this.leave);
    this.LeaveList.paginator = this.tablePaginator;
    if (this.selecteLeave && this.showSelected) {
      let selectedIds = this.selecteLeave.map(dt => dt.id);

    }

  }
  async download(Decument) {


    if (Decument!= '' && Decument != 'null' && Decument != null   ) {
      saveAs(`http://localhost:3000/public/uploads/document/${Decument}`, Decument);

    } else {

      if (this.lang.selectedLang == 'en') 
      {
        await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');
      }
      else
       {
      await this.app.presentAlert('خطأ ~', 'لا يوجد ملف لتحميله', 'errorAlert');
       }

    

    }
  }
  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.LeaveColumns : this.LeaveColumns.filter(dt => dt !== 'Action');
  }
  ngOnChanges() {
    this.LeaveList.data = this.leave
  }
  ngAfterViewInit() {
    this.LeaveList = new MatTableDataSource(this.leave);
    this.LeaveList.paginator = this.tablePaginator;
    this.LeaveList.sort = this.sort;
  }
  async approvals(id, approval) {
    let data = {
      id: id,
      approval: approval
    }
    this.authz.UpdateEmployeeLeaveStatus(id, approval)
    this.ngOnInit()

  }

  async add() {
    const modal = await this.modalController.create({ component: AddEmployeeLeave, cssClass: 'responsiveModal', componentProps: { employeeID: this.employeeID } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async update(row) {
    const modal = await this.modalController.create({ component: UpdateEmployeeLeave, cssClass: 'responsiveModal', componentProps: { leave: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }
  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "HCM.Workforce.leaves.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.authz.deleteEmployeeLeave(row.id)
      this.ngOnInit()
    }
  }
  tURL(imgPath: string) {
    return this.user.getProfilePicURL(imgPath);
  }
  applyFilter() {
    //this.employeeList.filter = this.searchTerm.trim().toLowerCase();
  }


}



@Component({
  selector: 'add-employee-leave',
  templateUrl: './add-employee-leave.html',
})
export class AddEmployeeLeave implements OnInit {
  @Input('employeeID') employeeID: number;

  minDate = new Date();;
  approval: Boolean
  addForm: FormGroup;
  LeaveType: LeaveType[];
  Employee: Employee[];
  validation_messages: any;
  to_date: any
  constructor(public lang: LanguageService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.addForm = fb.group({
      employeeID: ['',],
      leaveTypeID: ['', [Validators.required]],
      approval: ['',],
      to_date: ['',],
      from_date: ['', [Validators.required]],
      total_days: ['', [Validators.required]],
      documentURL: ['',],
      status: ['',]

    });
  }
  async ngOnInit() {
    this.LeaveType = await this.authz.getLeaveTypes();
    this.Employee = await this.authz.getEmployees()
    this.approval = false;
    this.addForm.setValue({
      employeeID: Number(this.employeeID),
      leaveTypeID: "",
      approval: false,
      to_date: "",
      from_date: "",
      total_days: "",
      documentURL: "",
      status: "Pendding"
    })

    this.validation_messages = {

      'days': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.days.required' },
        { type: 'pattern', message: 'HCM.Workforce.leaves.massages.days.pattern' },

      ],
      'Leave_Type': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Leave_Type.required' },
      ],

      'Employee': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Employee.required' },
      ],

      'documentURL': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.documentURL.required' },
      ],
      'From_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.From_Date.required' },
        { type: 'date', message: 'Vacancy.massages.From_Date.date' },

      ],
      'To_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.To_Date.required' },
        { type: 'date', message: 'Vacancy.massages.To_Date.date' },

      ],






    }

  }

  set_to_date() {
    this.addForm.value.total_days

    this.to_date = moment(this.addForm.value.from_date, "DD-MM-YYYY").add(this.addForm.value.total_days - 1, 'days');


  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let { documentURL, ...data } = this.addForm.value;
      let url = '';
      try {
        if (documentURL) {
          let doc = documentURL.files[0];
          let uploaded;
          if (doc) {
            uploaded = await this.authz.uploadFile(doc);
            if (uploaded?.file.filename) {
              url = uploaded?.file.filename;
            }
          }          
        }

        this.addForm.setValue({
          employeeID: Number(this.employeeID),
          leaveTypeID: data.leaveTypeID,
          approval: data.approval,
          to_date: this.to_date,
          from_date: data.from_date,
          total_days: data.total_days,
          documentURL: url ? url : "",
          status: data.status
        })

        let forming = this.addForm.value
        let leave = await this.authz.AddEmployeeLeaves(forming);
        if (leave.case != 'sucess') {
          if (this.lang.selectedLang == 'en') 
          {
            this.app.presentAlert("Error", leave.massages.en)
          }
          else
           {
            this.app.presentAlert("خطأ", leave.massages.ar)
           }

        }
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
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
  selector: 'update-employee-leave',
  templateUrl: './update-employee-leave.html',
})

export class UpdateEmployeeLeave implements OnInit {
  minDate = new Date();;
  updateForm: FormGroup;
  @Input('leave') leave: Leave
  LeaveType: LeaveType[];
  Employee: Employee[];
  validation_messages: any;
  to_date: any

  constructor(public lang: LanguageService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.updateForm = fb.group({
      id: ['',],
      employeeID: ['',],
      leaveTypeID: ['', [Validators.required]],
      approval: ['',],
      to_date: ['', [Validators.required]],
      from_date: ['', [Validators.required]],
      total_days: ['', [Validators.required]],
      status: ['',],
      douumentUrl: ['',],


    });
  }
  async ngOnInit() {
    this.LeaveType = await this.authz.getLeaveTypes();
    this.Employee = await this.authz.getEmployees()
    this.updateForm.setValue({
      id: this.leave.id,
      employeeID: this.leave.employeeID,
      leaveTypeID: this.leave.leaveTypeID,
      approval: this.leave.approval,
      to_date: this.leave.to_date,
      from_date: this.leave.from_date,
      total_days: this.leave.total_days,
      status: "Pendding",
      douumentUrl: ""

    })
    this.to_date = this.leave.to_date
    this.validation_messages = {
      'days': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.days.required' },
        { type: 'pattern', message: 'HCM.Workforce.leaves.massages.days.pattern' },

      ],
      'Leave_Type': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Leave_Type.required' },
      ],

      'Employee': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Employee.required' },
      ],

      'documentURL': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.documentURL.required' },
      ],
      'From_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.From_Date.required' },
        { type: 'date', message: 'Vacancy.massages.From_Date.date' },

      ],
      'To_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.To_Date.required' },
        { type: 'date', message: 'Vacancy.massages.To_Date.date' },

      ],






    }

  }

  set_to_date() {
    this.to_date = moment(this.updateForm.value.from_date, "DD-MM-YYYY").add('days', this.updateForm.value.total_days);
  }
  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      this.updateForm.setValue({
        id: this.leave.id,

        employeeID: this.leave.employeeID,
        leaveTypeID: this.updateForm.value.leaveTypeID,
        approval: false,
        to_date: this.to_date,
        from_date: this.updateForm.value.from_date,
        total_days: this.updateForm.value.total_days,
        douumentUrl: "",
        status: this.updateForm.value.status,



      })
      let data = this.updateForm.value;
      try {

        let leave = await this.authz.UpdateEmployeeLeave(data);
        await this.app.dismissLoading();

        if (leave.case != 'sucess') {

          if (this.lang.selectedLang == 'en') {
            this.app.presentAlert("No Balance", leave.massages.en)
          }

          else {

            this.app.presentAlert("لا يوجد رصيد كافي", leave.massages.ar)

          }

        }
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}




