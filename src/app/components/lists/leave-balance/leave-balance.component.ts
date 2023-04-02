import { Leave_balance, LeaveType } from './../../../interfaces/types';
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
import { Console } from 'console';

@Component({
  selector: 'leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss'],
})
export class LeaveBalanceComponent implements OnInit {
  @Input('employeeID') employeeID: number;
  @Input('isEdit') isEdit: boolean;
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
  LeaveBalance: Leave_balance[];

  constructor(public lang: LanguageService, public app: AppService, public modalCtrl: ModalController, public authz: AuthzService) { }

  async ngOnInit() {
    this.LeaveBalanceColumns = ['id', 'type', 'accual_days', 'balance', 'frequency', 'Action'];
    console.log(this.employeeID)
    this.LeaveBalance = await this.authz.getEmployeeBalance(this.employeeID)
    console.log('Balances', this.LeaveBalance)

    this.getDisplayedColumns();
    this.LeaveBalanceList = new MatTableDataSource(this.LeaveBalance);
    this.LeaveBalanceList.paginator = this.tablePaginator;
    if (this.selectedLeaveBalancee && this.showSelected) {
      let selectedIds = this.selectedLeaveBalancee.map(dt => dt.id);

    }

  }
  async add() {
    console.log(this.LeaveBalance)
    const modal = await this.modalCtrl.create({ component: AddBalance, cssClass: 'responsiveModal', componentProps: { employeeID: this.employeeID, LeaveBalance: this.LeaveBalance } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }
  async UpdateBalance(row) {
    console.log(this.LeaveBalance)
    const modal = await this.modalCtrl.create({ component: UpdateBalance, cssClass: 'responsiveModal', componentProps: { employeeID: this.employeeID, LeaveBalance: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.LeaveBalanceColumns :  this.LeaveBalanceColumns
  }
  applyFilter() {

  }




}

@Component({
  selector: 'add_balance',
  templateUrl: './add_balance.html',
})
export class AddBalance implements OnInit {
  @Input('employeeID') employeeID: Number;
  @Input('LeaveBalance') LeaveBalance: Leave_balance[]

  addForm: FormGroup;
  leaveTypes: LeaveType[]
  leaveTypes2: LeaveType[]
  validation_messages: any
  constructor(public lang: LanguageService, public fb: FormBuilder, public app: AppService, public modalCtrl: ModalController, public authz: AuthzService) {



    this.addForm = this.fb.group({
      employeeID: ['',],
      leaveTypeID: ['', [Validators.required]],
      accual_days: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      frequency: ['', [Validators.required]],


    });
  }

  async ngOnInit() {
    this.leaveTypes = await this.authz.getLeaveTypes()

    this.addForm = this.fb.group({
      employeeID: ['',],
      leaveTypeID: ['', [Validators.required]],
      accual_days: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      frequency: ['', [Validators.required]],


    });



    this.addForm.setValue({
      employeeID: Number(this.employeeID),
      leaveTypeID: "",
      accual_days: "",
      frequency: "",
      balance: ""
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
    if (this.addForm.valid) {
      let data = this.addForm.value;
      console.log(data)
      try {
        let balance = await this.authz.addLeaveBalance(data);
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



@Component({
  selector: 'update_balance',
  templateUrl: './update_balance.html',
})
export class UpdateBalance implements OnInit {
  @Input('employeeID') employeeID: Number;
  @Input('LeaveBalance') LeaveBalance: Leave_balance

  addForm: FormGroup;
  leaveTypes: LeaveType[]
  leaveTypes2: LeaveType[]
  validation_messages: any;
  constructor(public lang: LanguageService, public fb: FormBuilder, public app: AppService, public modalCtrl: ModalController, public authz: AuthzService) { 

    this.addForm = this.fb.group({
      id: ['',],
      employeeID: ['',],
      leaveTypeID: ['',],
      accual_days: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      frequency: ['', [Validators.required]],


    });
  }

  async ngOnInit() {
    this.leaveTypes = await this.authz.getLeaveTypes()


    this.addForm = this.fb.group({
      id: ['',],
      employeeID: ['',],
      leaveTypeID: ['',],
      accual_days: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      frequency: ['', [Validators.required]],


    });
    console.log("this.LeaveBalance")

console.log(this.LeaveBalance)
    this.addForm.setValue({
      id: 1,
      employeeID: this.LeaveBalance?.employeeID,
      leaveTypeID: this.LeaveBalance?.leaveTypeID,
      accual_days: this.LeaveBalance?.accual_days,
      frequency: this.LeaveBalance?.frequency,
      balance: this.LeaveBalance?.balance
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