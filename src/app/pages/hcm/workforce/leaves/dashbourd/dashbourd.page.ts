import { LeaveType, Leave, Employee } from './../../../../../interfaces/types';
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
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-dashbourd',
  templateUrl: './dashbourd.page.html',
  styleUrls: ['./dashbourd.page.scss'],
})
export class DashbourdPage implements OnInit {
  searchTerm = '';
  leave: Leave[];
  @Input('isAdd') isAdd: boolean = false;
  LeaveColumns: string[];
  @Input('selecteLeave') selecteLeave: Leave[];
  LeaveList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Leave>(true, []);
  @ViewChild('LeaveTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  approval: boolean
  updateForm: FormGroup;
  filter: {
    Table_name: string,
    Columnslist: [],
    filter: any
  }
  Columns: string[]
  LeaveType: LeaveType[];
  public EmployeeFilterCtrl: FormControl = new FormControl();
  public filteredEmployee: Employee[]
  Employee: Employee[];
  Columnslist: { name: string, isSelected: boolean, value: string }[]
  From_date: Date
  to_date: Date
  Filter_Colums: any
  current_date=new Date()
  constructor(public fb: FormBuilder, public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router, public user: UserService) {
    /*if (!(this.authz.canDo('READ', 'Leave', []) || this.authz.canDo('MANAGE', 'Leave', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.current_date.setHours(0, 0, 0, 0);
      //this.From_date=this.current_date
      //this.to_date=this.current_date
      this.From_date = new Date(this.current_date.getFullYear(), this.current_date.getMonth(), 1);
      this.to_date = new Date(this.current_date.getFullYear(), this.current_date.getMonth() + 1, 0);
   
   
    this.filter = {
      Table_name: "",
      Columnslist: [],
      filter: {}
    }
    this.filter.filter = {
      from_date: {
        gte: this.From_date,
      },
      to_date: {
        lte: this.to_date
      },
    }
    this.Columnslist = [];
    this.LeaveColumns = [];
    this.Columnslist = [
      {
        name: 'ID',
        value: 'id',
        isSelected: true,
      },
      {
        name: 'Name',
        value: 'name',
        isSelected: true,

      },
      {
        name: 'Leave_Type',
        value: 'type',
        isSelected: true,

      },
      {
        name: 'From_Date',
        value: 'from_date',
        isSelected: true,

      },
      {
        name: 'To_Date',
        value: 'to_date',
        isSelected: true,

      },
      {
        name: 'Days',
        value: 'total_days',
        isSelected: true,

      },
      {
        name: 'Action',
        value: 'Action',
        isSelected: true,

      },
      {
        name: 'Approval',
        value: 'Status',
        isSelected: true,

      },
      {
        name: 'documentURL',
        value: 'Decument',
        isSelected: true,

      }

    ]

  }
  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Leave', []) || this.authz.canDo('MANAGE', 'Leave', []))) {
      this.router.navigateByUrl(`/login`)
    }*/

    this.LeaveType = await this.authz.getLeaveTypes();
    this.Employee = await this.authz.getEmployees()
    this.filteredEmployee = this.Employee
    this.leave = await this.authz.getAllReportLeaves(this.filter);
    this.Filter_Colums = this.Columnslist.filter((list) => list.isSelected == true)
    this.LeaveColumns = [];
    for (let i = 0; i < this.Filter_Colums.length; i++) {

      this.LeaveColumns.push(this.Filter_Colums[i].value);

    }

    this.getDisplayedColumns();
    this.LeaveList = new MatTableDataSource(this.leave);
    this.LeaveList.paginator = this.tablePaginator;
    if (this.selecteLeave && this.showSelected) {
      let selectedIds = this.selecteLeave.map(dt => dt.id);

    }

    this.updateForm = this.fb.group({
      id: ['',],
      employeeID: ['',],
      leaveTypeID: ['', [Validators.required]],
      approval: ['',],
      to_date: ['', [Validators.required]],
      from_date: ['', [Validators.required]],
      total_days: ['', [Validators.required]],
      status: ['', [Validators.required]],
      documentURL: []
    });

  }
  FromDateChange(date) {
    this.filter.filter.from_date.gte = date;
    //console.log(this.filter);
  }

  ToDateChange(date) {
    this.filter.filter.to_date.lte = date;
    //console.log(this.filter);
  }

  async download(Decument) {


    if (Decument != '' && Decument != 'null' && Decument != null) {
      saveAs(`${environment.storageURL}/public/uploads/document/${Decument}`, Decument);

    } else {


      if (this.lang.selectedLang == 'en') {
        await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');
      }
      else {
        await this.app.presentAlert('خطأ ~', 'لا يوجد ملف لتحميله', 'errorAlert');
      }


    }
  }
  getDisplayedColumns(): string[] {
    return this.LeaveColumns
  }
  ngOnChanges() {
    this.LeaveList.data = this.leave
  }
  ngAfterViewInit() {
    this.LeaveList = new MatTableDataSource(this.leave);
    this.LeaveList.paginator = this.tablePaginator;
    this.LeaveList.sort = this.sort;
  }
  async approvals(element) {

    this.updateForm.setValue({
      id: element.id,
      employeeID: element.employeeID,
      leaveTypeID: element.leaveTypeID,
      approval: false,
      to_date: element.to_date,
      from_date: element.from_date,
      total_days: element.total_days,
      documentURL: "",
      status: element.status,



    })
    let data = this.updateForm.value;

    await this.authz.UpdateEmployeeLeave(data);

  }
  async getReportWithFilter() {

    this.ngOnInit()


  }

  async add() {
    const modal = await this.modalController.create({ component: AddLeavePage, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async update(row) {
    const modal = await this.modalController.create({ component: UpdateLeavePage, cssClass: 'responsiveModal', componentProps: { leave: row } });
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
  public printDiv() {
    let printContents, popupWin, alignment, dir;
    printContents = document.getElementById('table').innerHTML;
    if (this.lang.selectedLang == 'en')
    {
      alignment = "left"
      dir = "ltr"
    }  
    else
    {
      alignment = "right"
      dir = "rtl"
    }

    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 12px;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              font-size: 14px;
              background-color: #f2f2f2 !important;
              -webkit-print-color-adjust: exact;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
          @media screen
          {
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              background-color: #f2f2f2 !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
        </style>
        <head>
          <title>${this.filter.Table_name}</title>
        </head>
        <body>
          <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
              Print PDF
          </button>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
          <div style="padding-top:1rem;">
          <table class="table table-bordered" dir="${dir}">
            ${printContents}
          </table>
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }

  public filterEmployeelist(value) {
    return this.filteredEmployee = this.Employee.filter((val) => {
      let c = val.user?.first_name + " " + val.user?.last_name
      return c.toLowerCase().includes(this.EmployeeFilterCtrl.value);
    })
  }

  clearSelectionEmployee() {
    this.filteredEmployee = this.Employee
  }

}

@Component({
  selector: 'add-leave',
  templateUrl: './add-leave.html',
})
export class AddLeavePage implements OnInit {
  minDate = new Date();;
  approval: Boolean
  addForm: FormGroup;
  LeaveType: LeaveType[];
  Employee: Employee[];
  validation_messages: any;

  to_date: any
  constructor(public lang: LanguageService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.addForm = fb.group({
      employeeID: ['', [Validators.required]],
      leaveTypeID: ['', [Validators.required]],
      approval: ['',],
      to_date: ['',],
      from_date: ['',],
      total_days: ['',],
      documentURL: ['',],
      status: ['',]


    });
  }
  async ngOnInit() {
    this.LeaveType = await this.authz.getLeaveTypes();
    this.Employee = await this.authz.getEmployees()
    this.approval = false;
    this.addForm.setValue({
      employeeID: "",
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
          employeeID: data.employeeID,
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
          if (this.lang.selectedLang == 'en') {
            this.app.presentAlert("Error", leave.massages.en)
          }
          else {
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
  selector: 'update-leave',
  templateUrl: './update-leave.html',
})

export class UpdateLeavePage implements OnInit {
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
      status: ['', [Validators.required]],
      documentURL: []
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
      status: this.leave.status,
      documentURL: ""
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
        documentURL: "",
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

