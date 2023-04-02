import { AddExpenseDetailModal } from './../expense-list/expense-list.component';
import { Allowance, Deduction, Bonus } from './../../../interfaces/types';
import { data } from 'autoprefixer';
import { SelectionModel } from '@angular/cdk/collections';
import { Employee, Address } from 'src/app/interfaces/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { Certificate, EmployeeContract } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
@Component({
  selector: 'contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss'],
})

export class ContractsListComponent implements OnInit {
  EmployeeContracts: EmployeeContract[];
  @Input('isAdd') isAdd: boolean = false;
  @Input('employeeID') employeeID: number
  ContractsColumns: string[];
  @Input('selectedcontracts') selectedcontracts: EmployeeContract[];
  contractsList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<EmployeeContract>(true, []);
  @ViewChild('CertificateTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) { }
  async ngOnInit() {

    this.EmployeeContracts = await this.authz.getEmployeeContracts(this.employeeID)
    console.log(this.EmployeeContracts)
    this.ContractsColumns = ['id', 'title', 'jobType', 'Action'];
    this.getDisplayedColumns();
    this.contractsList = new MatTableDataSource(this.EmployeeContracts);
    this.contractsList.paginator = this.tablePaginator;
    if (this.selectedcontracts && this.showSelected) {
      let selectedIds = this.selectedcontracts.map(dt => dt.id);
      this.selection = new SelectionModel<EmployeeContract>(true, [
        ...this.contractsList.data.filter(row => selectedIds.includes(row.id))
      ]);
      this.contractsList.data = this.EmployeeContracts

    }
    await this.app.dismissLoading();


  }
  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.ContractsColumns : this.ContractsColumns
  }
  async ngOnChanges() {
    this.EmployeeContracts = await this.authz.getEmployeeContracts(this.employeeID)

    this.contractsList.data = this.EmployeeContracts
  }
  ngAfterViewInit() {
    this.contractsList = new MatTableDataSource(this.EmployeeContracts);
    this.contractsList.paginator = this.tablePaginator;
    this.contractsList.sort = this.sort;
  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  async add() {
    const modal = await this.modalCtrl.create({ component: AddContractModal, cssClass: 'responsiveModal', componentProps: { employeeID: this.employeeID } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }

  /*async update(row) {
    console.log("update address")
    const modal = await this.modalCtrl.create({ component: UpdateContractModal, cssClass: 'responsiveModal', componentProps: { contract: row } });
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
    return await modal.present();
  }*/

  async details(row) {
    console.log("update address")
    const modal = await this.modalCtrl.create({ component: ContractDetails, cssClass: 'responsiveModal', componentProps: { contract: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }
  async delete(row) {
    if (row.isCurrent) {
      let confirm = await this.app.presentConfirmAlert("Operations.Warning", "Employee_managment.Employee-contracts.Errors.main", "Operations.Cancel", "Operations.main", true)
      console.log(confirm);
      if (confirm) {
        this.dismiss();
      }
    } else {
      console.log('delete' + row.id)
      let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Employee-contracts.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
      console.log(confirm);

      if (confirm) {
        await this.authz.deleteEmployeeContract(row.id)
        await this.app.dismissLoading();
        this.dismiss();

      }
    }
  }

  applyFilter() {

  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}




@Component({
  selector: 'add-contract',
  templateUrl: './add-contract.html',
})

export class AddContractModal implements OnInit {
  @Input('employeeID') employeeID: number;
  isAdd: boolean
  isAddDeductions: boolean;
  isAddbouncess: boolean;
  isallowances: boolean;
  isLoading = true;
  addForm: FormGroup;
  deductionForm: FormGroup
  bouncesForm: FormGroup
  allowancesForm: FormGroup
  isCurrent: false;
  validation_messages: any;
  public test: string = new Date().toISOString();
  deduction_data: any = [];
  bounces_data: any = [];
  allowances_data: any = [];
  segment = 0;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.addForm = fb.group({
      isCurrent: ['',],
      employeeID: ['',],
      title_ar: ['', [Validators.required]],
      title_en: ['', [Validators.required]],
      basic_salary: ['', [Validators.required]],
      jobType: ['', [Validators.required]],
      salary: ['',],
      payroll_group: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],


    });

    this.bouncesForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['',],
      //description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      employeeContractId: ['',],


    });
    this.allowancesForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['',],
      //description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      employeeContractId: ['',],


    });


    this.deductionForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['',],
      //description: ['', [Validators.required]],
      calculationType: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      employeeContractId: ['',],


    });

  }
  async ngOnInit() {

    this.deduction_data = [];
    this.bounces_data = [];
    this.allowances_data = [];
    this.isAddDeductions = false,
      this.isAddbouncess = false
    this.isAdd = false
    this.validation_messages = {
      'title_ar': [

        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.title_ar.required' },
      ],
      'title_en': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.title_en.required' },

      ],
      'basic_salary': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.basic_salary.required' },
        { type: 'pattren', message: 'Employee_managment.Employee-contracts.massages.basic_salary.required' },

      ],
      'jobType': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.jobType.required' },
      ],
      'payroll_group': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.payroll_group.required' },
      ],
      'startDate': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.startDate.required' },

      ],
      'endDate': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.endDate.required' },

      ],
      'amount': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.amount.required' },
      ],
      'calculationType': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.calculationType.required' },
      ]


    }

    this.addForm.setValue({
      isCurrent: "",
      employeeID: Number(this.employeeID),
      title_ar: "",
      title_en: "",
      basic_salary: "",
      jobType: "",
      salary: "",
      payroll_group: "",
      startDate: "",
      endDate: "",
    })


  }

  IsAddDeductions() {
    this.isAddDeductions = !this.isAddDeductions
  }
  IsAddallowances() {
    this.isallowances = !this.isallowances
  }
  IsAddbonuses() {
    this.isAddbouncess = !this.isAddbouncess
  }
  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      console.log(data)
      try {

        await this.authz.AddEmployeeContracts(data, this.deduction_data, this.bounces_data, this.allowances_data);
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

  async addbounce() {
    if (this.bouncesForm.valid) {
      this.bounces_data.push(this.bouncesForm.value);
      this.isAddbouncess = false
      this.bouncesForm.reset()
    }
    else {
      this.bouncesForm.markAllAsTouched();
    }
  }

  deleteBonus(index) {
    this.bounces_data.splice(index,1)
  }

  clearbounce() {
    this.isAddbouncess = false
    this.bouncesForm.reset()

  }

  async addallowance() {
    if (this.allowancesForm.valid) {
      this.allowances_data.push(this.allowancesForm.value);
      this.isallowances = false
      this.allowancesForm.reset()
    }
    else {
      this.allowancesForm.markAllAsTouched();
    }
  }

  deleteAllowance(index) {
    this.allowances_data.splice(index,1)
  }

  clearallowance() {
    this.isallowances = false
    this.allowancesForm.reset()

  }

  async addDeduction() {
    if (this.deductionForm.valid) {
      this.deduction_data.push(this.deductionForm.value);
      this.isAddDeductions = false
      this.deductionForm.reset()
    }
    else {
      this.deductionForm.markAllAsTouched();
    }
  }

  deleteDeduction(index) {
    this.deduction_data.splice(index,1)
  }

  clear() {

  }
  clearDeduction() {
    this.isAddDeductions = false
    this.deductionForm.reset()
  }
}


@Component({
  selector: 'update-contract',
  templateUrl: './update-contract.html',
})

export class UpdateContractModal implements OnInit {
  @Input('contract') contract: EmployeeContract;
  isLoading = true;
  updateForm: FormGroup;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.updateForm = fb.group({
      id: ['', [Validators.required]],
      isCurrent: ['', [Validators.required]],
      employeeID: ['',],
      title_ar: ['', [Validators.required]],
      title_en: ['', [Validators.required]],
      basic_salary: ['', [Validators.required]],
      jobType: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      payroll_group: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],


    });
  }
  async ngOnInit() {
    this.updateForm.setValue({
      id: this.contract.id,
      isCurrent: "",
      employeeID: this.contract.employeeID,
      title_ar: this.contract.title_ar,
      title_en: this.contract.title_en,
      basic_salary: this.contract.basic_salary,
      jobType: this.contract.jobType,
      salary: this.contract.salary,
      payroll_group: this.contract.payroll_group,
      startDate: this.contract.startDate,
      endDate: this.contract.endDate,
    })


  }
  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      console.log('updated form ')
      console.log(data)

      try {
        //await this.authz.UpdateEmployeeContract(data);
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }
  async activate(isActive: boolean) {

  }



  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}


@Component({
  selector: 'contact-details',
  templateUrl: './contract_details.html',



})
export class ContractDetails implements OnInit {
  @Input('contract') contract: EmployeeContract;
  isAdd: boolean
  isAddDeductions: boolean;
  isAddbouncess: boolean;
  isallowances: boolean;
  updateForm: FormGroup;
  deductionForm: FormGroup
  bouncesForm: FormGroup
  allowancesForm: FormGroup
  isCurrent: false;
  validation_messages: any;
  public test: string = new Date().toISOString();
  segment: number
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) { 
    this.updateForm = fb.group({
      id: ['',],
      isCurrent: ['',],
      employeeID: ['',],
      title_ar: ['', [Validators.required]],
      title_en: ['', [Validators.required]],
      basic_salary: ['', [Validators.required]],
      jobType: ['', [Validators.required]],
      salary: ['',],
      payroll_group: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });

    this.bouncesForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['',],
      amount: ['', [Validators.required]],
      employeeContractId: ['',],
    });
    this.allowancesForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['',],
      amount: ['', [Validators.required]],
      employeeContractId: ['',],
    });


    this.deductionForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['',],
      calculationType: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      employeeContractId: ['',],
    });
  }

  async ngOnInit() {

    this.segment = 0;
    this.isAddDeductions = false
    this.isAddbouncess = false
    this.isAdd = false

    this.updateForm.setValue({
      id: this.contract.id,
      isCurrent: this.contract.isCurrent,
      employeeID: this.contract.employeeID,
      title_ar: this.contract.title_ar,
      title_en: this.contract.title_en,
      basic_salary: this.contract.basic_salary,
      jobType: this.contract.jobType,
      salary: this.contract.salary,
      payroll_group: this.contract.payroll_group,
      startDate: this.contract.startDate,
      endDate: this.contract.endDate,
    })

    this.validation_messages = {
      'title_ar': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.title_ar.required' },
      ],
      'title_en': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.title_en.required' },
      ],
      'basic_salary': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.basic_salary.required' },
        { type: 'pattren', message: 'Employee_managment.Employee-contracts.massages.basic_salary.required' },
      ],
      'jobType': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.jobType.required' },
      ],
      'payroll_group': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.payroll_group.required' },
      ],
      'startDate': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.startDate.required' },
      ],
      'endDate': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.endDate.required' },
      ],
      'amount': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.amount.required' },
      ],
      'calculationType': [
        { type: 'required', message: 'Employee_managment.Employee-contracts.massages.calculationType.required' },
      ]
    }
  }

  IsAddDeductions() {
    this.isAddDeductions = !this.isAddDeductions
  }
  IsAddallowances() {
    this.isallowances = !this.isallowances
  }
  IsAddbonuses() {
    this.isAddbouncess = !this.isAddbouncess
  }

  async addbounce() {
    if (this.bouncesForm.valid) {
      this.contract.bonuses.push(this.bouncesForm.value);
      this.isAddbouncess = false
      this.bouncesForm.reset()
    }
    else {
      this.bouncesForm.markAllAsTouched();
    }
  }

  deleteBonus(index) {
    this.contract.bonuses.splice(index,1)
  }

  clearbounce() {
    this.isAddbouncess = false
    this.bouncesForm.reset()
  }

  async addallowance() {
    if (this.allowancesForm.valid) {
      this.contract.allowances.push(this.allowancesForm.value);
      this.isallowances = false
      this.allowancesForm.reset()
    }
    else {
      this.allowancesForm.markAllAsTouched();
    }
  }

  deleteAllowance(index) {
    this.contract.allowances.splice(index,1)
  }

  clearallowance() {
    this.isallowances = false
    this.allowancesForm.reset()
  }

  async addDeduction() {
    if (this.deductionForm.valid) {
      this.contract.deductions.push(this.deductionForm.value);
      this.isAddDeductions = false
      this.deductionForm.reset()
    }
    else {
      this.deductionForm.markAllAsTouched();
    }
  }

  deleteDeduction(index) {
    this.contract.deductions.splice(index,1)
  }

  clearDeduction() {
    this.isAddDeductions = false
    this.deductionForm.reset()
  }

  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      console.log(data)
      try {
        await this.authz.UpdateEmployeeContract(data, this.contract.deductions, this.contract.bonuses, this.contract.allowances);
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  async ngOnChanges() {


  }
  ngAfterViewInit() {

  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  /*async addDeduction() {
    this.Deduction_data.employeeContractId = this.contract.id;
    await this.authz.AddDeduction(this.Deduction_data);
    this.Deduction_data.title_en = '';
    this.Deduction_data.title_ar = '';
    this.Deduction_data.description = '';
    this.Deduction_data.calculationType = 'Flat';
    this.ngOnInit()
    this.isAdd = false;

  }


  async addallowance() {
    this.Allowance_data.employeeContractId = this.contract.id;
    await this.authz.AddAllowance(this.Allowance_data);
    this.Allowance_data.title_en = '';
    this.Allowance_data.title_ar = '';
    this.Allowance_data.description = '';
    this.isAdd = false;

  }
  async addbounce() {
    this.bounce_data.employeeContractId = this.contract.id;
    await this.authz.AddBonus(this.bounce_data);
    this.bounce_data.title_en = '';
    this.bounce_data.title_ar = '';
    this.bounce_data.description = '';
    this.isAdd = false;

  }
  clear() {
    this.Deduction_data.title_en = '';
    this.Deduction_data.title_ar = '';
    this.Deduction_data.description = '';
    this.Deduction_data.calculationType = 'Flat';
    this.isAdd = false;


  }*/

  applyFilter() {

  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
