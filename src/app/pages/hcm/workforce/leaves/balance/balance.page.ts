import { Leave_balance, LeaveType, Employee } from 'src/app/interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/services/app.service';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss'],
})
export class BalancePage implements OnInit {
  @Input('isEdit') isEdit: boolean;
  @Input('employeeID') employeeID: Number;

  @Input('isAdd') isAdd: boolean = false;
  LeaveBalanceColumns: string[];
  @Input('selectedLeaveBalance') selectedLeaveBalancee: Leave_balance[];
  LeaveBalanceList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Leave_balance>(true, []);
  @ViewChild('LeaveTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  @Input('LeaveBalance') LeaveBalance: Leave_balance[]

  constructor(public lang: LanguageService, public app: AppService, public modalCtrl: ModalController, public authz: AuthzService, private router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Leave_balance', []) || this.authz.canDo('MANAGE', 'Leave_balance', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }
  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Leave_balance', []) || this.authz.canDo('MANAGE', 'Leave_balance', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.LeaveBalanceColumns = ['id', 'type', 'name', 'accual_days', 'balance', 'frequency', 'Action'];
    this.LeaveBalance = await this.authz.getAllLeaveBalance()
    console.log(this.LeaveBalance)
    this.getDisplayedColumns();
    this.LeaveBalanceList = new MatTableDataSource(this.LeaveBalance);
    console.log(this.LeaveBalanceList)
    this.LeaveBalanceList.paginator = this.tablePaginator;
    if (this.selectedLeaveBalancee && this.showSelected) {
      let selectedIds = this.selectedLeaveBalancee.map(dt => dt.id);

    }

  }
  async add() {
    console.log(this.LeaveBalance)
    const modal = await this.modalCtrl.create({ component: AddEmployeeBalance, cssClass: 'responsiveModal', componentProps: { employeeID: this.employeeID, LeaveBalance: this.LeaveBalance } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }
  async UpdateBalance(row) {
    console.log(this.LeaveBalance)
    const modal = await this.modalCtrl.create({ component: UpdateEmployeeBalance, cssClass: 'responsiveModal', componentProps: { employeeID: this.employeeID, LeaveBalance: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }

  getDisplayedColumns(): string[] {
    return this.LeaveBalanceColumns
  }
  applyFilter() {

  }
  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "HCM.Workforce.leaves.balance.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);

    if (confirm) {
      this.authz.deleteLeaveBalance(row.id)
      this.ngOnInit()
    }
  }



}



@Component({
  selector: 'add_employee_balance',
  templateUrl: './add_employee_balance.html',
})
export class AddEmployeeBalance implements OnInit {
  @Input('employeeID') employeeID: Number;
  @Input('LeaveBalance') LeaveBalance: Leave_balance[]

  addForm: FormGroup;
  leaveTypes: LeaveType[]
  leaveTypes2: LeaveType[]
  validation_messages: any
  Employee: Employee[]
  constructor(public lang: LanguageService, public fb: FormBuilder, public app: AppService, public modalCtrl: ModalController, public authz: AuthzService) {

    this.addForm = this.fb.group({
      employeeID: ['', [Validators.required]],
      leaveTypeID: ['', [Validators.required]],
      accual_days: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
    });

  }

  async ngOnInit() {

    this.Employee = await this.authz.getEmployees()

    this.leaveTypes = await this.authz.getLeaveTypes()


    this.addForm = this.fb.group({
      employeeID: ['', [Validators.required]],
      leaveTypeID: ['', [Validators.required]],
      accual_days: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      frequency: ['', [Validators.required]],


    });


    this.validation_messages = {
      'Leave_Type': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.Leave_Type.required' },
      ],
      'Employee': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.Employee.required' },
      ],
      'accual_days': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.accual_days.required' },
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.accual_days.pattern' },

      ],
      'frequency': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.pattern.required' },

      ],
      'balance': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.balance.required' },
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.balance.pattern' },


      ],

    }

  }




  async add() {

    await this.app.presentLoading();

    console.log(this.addForm.value)
    if (this.addForm.valid) {
      let data = this.addForm.value;

      console.log("data")
      console.log(data)
      try {
        let balance = await this.authz.addLeaveBalance(data);
        await this.app.dismissLoading();
        console.log(balance)
        if (balance.case != 'sucess') {

          console.log(balance.massages.en)
          if (this.lang.selectedLang == 'en') {
            this.app.presentAlert("Error", balance.massages.en)
          }

          else {

            this.app.presentAlert("خطأ", balance.massages.ar)

          }
        }


        this.dismiss()

      } catch (e) {
        console.log(e);
        this.dismiss()
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
  selector: 'update_employee_balance.html',
  templateUrl: './update_employee_balance.html',
})
export class UpdateEmployeeBalance implements OnInit {
  @Input('employeeID') employeeID: Number;
  @Input('LeaveBalance') LeaveBalance: Leave_balance

  addForm: FormGroup;
  leaveTypes: LeaveType[]
  leaveTypes2: LeaveType[]
  validation_messages: any;
  Employee: Employee[]

  constructor(public lang: LanguageService, public fb: FormBuilder, public app: AppService, public modalCtrl: ModalController, public authz: AuthzService) { }

  async ngOnInit() {

    this.Employee = await this.authz.getEmployees()
    this.leaveTypes = await this.authz.getLeaveTypes()
    this.addForm = this.fb.group({
      id: ['',],
      employeeID: ['',],
      leaveTypeID: ['',],
      accual_days: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      frequency: ['', [Validators.required]],


    });


    this.addForm.setValue({
      id: this.LeaveBalance.id,
      employeeID: this.LeaveBalance.employeeID,
      leaveTypeID: this.LeaveBalance.leaveTypeID,
      accual_days: this.LeaveBalance.accual_days,
      frequency: this.LeaveBalance.frequency,
      balance: this.LeaveBalance.balance
    })


    this.validation_messages = {

      'Leave_Type': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.Leave_Type.required' },
      ],

      'Employee': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.Employee.required' },
      ],

      'accual_days': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.accual_days.required' },
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.pattern' },

      ],
      'frequency': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.pattern.required' },

      ],
      'balance': [
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.balance.required' },
        { type: 'required', message: 'HCM.Workforce.leaves.balance.massages.pattern' },


      ],






    }

  }




  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      console.log(data)
      try {
        let balance = await this.authz.updateLeaveBalance(data);
        await this.app.dismissLoading();

        console.log('here')

        console.log('api responce')

        console.log(balance)
        if (balance.case != 'sucess') {

          console.log(balance.massages.en)
          if (this.lang.selectedLang == 'en') {
            this.app.presentAlert("Error", balance.massages.en)
          }

          else {

            this.app.presentAlert("خطأ", balance.massages.ar)

          }
        }


        this.dismiss()

      } catch (e) {
        console.log(e);
        this.dismiss()
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