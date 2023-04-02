import { element } from 'protractor';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { LanguageService } from 'src/app/services/language.service';
import { PaySlip, Employee, EmployeeContract, Leave } from '../../../interfaces/types';
import { AuthzService } from 'src/app/services/authz.service';
import { AppService } from 'src/app/services/app.service';
import { ModalController } from '@ionic/angular';
import { untilDestroyed } from '@ngneat/until-destroy';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'payroll-list',
  templateUrl: './payroll-list.component.html',
  styleUrls: ['./payroll-list.component.scss'],
})
export class PayrollListComponent implements OnInit {
  //PaySlips: PaySlip[];
  @Input('PaySlips') PaySlips: any;

  isLoading = false;
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  selectedDate = new FormControl(new Date());
  today = new Date()
  PayslipColumns: string[];
  isSearch = false;
  searchTerm = '';
  employeeList: Employee[]
  payslipStatusForm: FormGroup;
  Employees: Employee[];
  filter: {
    Table_name: string,
    Columnslist: [],
    filter: any
  }
  PaySlipsList = new MatTableDataSource<any>([]);

  // PaySlipsList = new MatTableDataSource([]);
  @ViewChild('PaySlipTablePaginator', { static: true }) tablePaginator: MatPaginator;
  constructor(public print: PrintService,
    public employee: EmployeeService, public lang: LanguageService, public authz: AuthzService, public fb: FormBuilder, public app: AppService, public modalController: ModalController) {
    this.filter = {
      Table_name: "",
      Columnslist: [],
      filter: {
        month: this.selectedMonth + 1,
        year: this.selectedYear
      }
    }
    this.payslipStatusForm = fb.group({
      id: [''],
      status: [''],
      payment_status: [''],
      paidAt: ['']
    });
  }

  async generatepayslip() {
    this.filter.filter.month = this.selectedMonth + 1
    this.filter.filter.year = this.selectedYear
    this.PaySlips = await this.authz.getPaySlip(this.filter)
    this.getDisplayedColumns();
    this.PaySlipsList = new MatTableDataSource(this.PaySlips);
    this.PaySlipsList.paginator = this.tablePaginator


  }

  count_totaldeduction(row) {

  }

  async ngOnInit() {
    this.employeeList = await this.authz.getEmployees()
    this.PayslipColumns = ['name', 'month', 'year', 'allowed_leaves', 'taken_leaves', 'working_days', 'basic_salary',   'total_allowences_fixed','total_allowences','total_deductions_fixed', 'total_deductions','total_bonuses','net_amount', 'status', 'Action', 'payment_status', 'print'];
    this.filter = {
      Table_name: "",
      Columnslist: [],
      filter: {
        month: this.selectedMonth + 1,
        year: this.selectedYear
      }
    }
    this.PaySlips = await this.authz.getPaySlip(this.filter)
    this.PaySlipsList = new MatTableDataSource(this.PaySlips);
    this.PaySlipsList.paginator = this.tablePaginator
    this.getDisplayedColumns();
  }

  calculatetotal_allowences(row){
    console.log(row)
    var total_Allownces=0
    for (let i= 0; i < row?.contract?.allowances?.length; i++) {
      let qty = 1

       total_Allownces = total_Allownces + row?.contract?.allowances[i]?.CalculationType == 'Flat' ? row?.contract?.allowances[i]?.amount.toFixed(2) : (row?.contract?.allowances[i]?.amount / 100 * row?.contract?.basic_salary).toFixed(2)

  }
  for (let i= 0; i < row?.contract?.bonuses?.length; i++) {
    let qty = 1

     total_Allownces = total_Allownces + Number(row?.contract?.bonuses[i]?.amount.toFixed(2))

}


return total_Allownces
  }

  calculatetotal_deduction(row){
    console.log(row)
    var total_deductions=0
    for (let i= 0; i < row?.contract?.deductions?.length; i++) {
      let qty = 1

       total_deductions = total_deductions + row?.contract?.deductions[i]?.CalculationType == 'Flat' ? row?.contract?.deductions[i]?.amount.toFixed(2) : (row?.contract?.deductions[i]?.amount / 100 * row?.contract?.basic_salary).toFixed(2)

  }



return total_deductions
  }


  public printpayslip(row) {
    //this.print.printPayslip(row)
    this.print.printPayslip(row)

    console.log(row)
  }
  public printDiv() {
    let printContents, popupWin, alignment, dir;
    printContents = document.getElementById('table').innerHTML;
    if (this.lang.selectedLang == 'en') {
      alignment = "left"
      dir = "ltr"
    }
    else {
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



  async statusChanges(id, payment_status, status) {
    this.payslipStatusForm.setValue({
      id: id,
      status: status,
      payment_status: payment_status,
      paidAt: null

    });
    if (payment_status == "Paid") {
      this.payslipStatusForm.get('paidAt').setValue(this.today)
    }
    await this.authz.updatePayslip(this.payslipStatusForm.value)
    this.ngOnInit()
  }
  chosenYearHandler(normalizedYear) {
    this.selectedYear = new Date(normalizedYear).getFullYear();;
  }

  async chosenMonthHandler(normalizedMonth, datepicker: MatDatepicker<Date>) {
    this.selectedMonth = new Date(normalizedMonth).getMonth();
    datepicker.select(new Date(this.selectedYear, this.selectedMonth, 1));
    datepicker.close();
  }

  getDisplayedColumns() {
    return this.PayslipColumns
  }
  async applyFilter() {
    this.PaySlipsList.filter = this.searchTerm.trim().toLowerCase();
    //this.PaySlips.filter = await this.searchTerm.trim().toLowerCase();


    this.PaySlipsList.filterPredicate = (data, filter) => {
      //console.log(data)
      let c = data.contract?.employee?.user?.first_name + " " + data.contract?.employee?.user?.last_name;
      return c.toLocaleLowerCase().includes(filter) ||

        data.status?.toLocaleLowerCase().includes(filter)

    }
    this.PaySlipsList.filter = this.searchTerm.trim().toLowerCase();

  }
  async processPayroll() {
    const modal = await this.modalController.create({ component: ProcessPayrollModal, cssClass: 'responsiveModal', });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }
  async ProcessforOne() {
    const modal = await this.modalController.create({ component: ProcessPayrollModal, cssClass: 'responsiveModal', componentProps: { ProcessforOne: true } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }


  async update(row) {

    const modal = await this.modalController.create({ component: PayrollDetailModal, cssClass: 'responsiveModal', componentProps: { PaySlip: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit();
    });
    return await modal.present();
  }

}

@Component({
  selector: 'process-payroll',
  templateUrl: './process-payroll.html',
})
export class ProcessPayrollModal implements OnInit {

  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  selectedDate = new FormControl(new Date());
  addForm: FormGroup;
  PaySlips: any;
  status: string;
  payment_status: string;
  Employees: Employee[];
  contract: EmployeeContract[];
  filter: {
    Table_name: string,
    Columnslist: [],
    filter: any
  }
  validation_messages: any;
  @Input('ProcessforOne') ProcessforOne: boolean;

  constructor(public EmployeeService: EmployeeService, public modalCtrl: ModalController, public lang: LanguageService, fb: FormBuilder, public authz: AuthzService, private app: AppService) {

    this.addForm = fb.group({
      month: [''],
      year: [''],
      employeeID: ['', []],
      selectedDate: ['', [Validators.required]],
      status: ['', [Validators.required]],
      payment_status: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    if (this.ProcessforOne) {
      this.addForm.get('employeeID').setValidators([Validators.required])
      this.Employees = await this.authz.getEmployees();

    }
    this.validation_messages = {
      'selectedDate': [
        { type: 'required', message: 'HCM.Payroll.massages.selectedDate.required' },
      ],
      'status': [
        { type: 'required', message: 'HCM.Payroll.massages.status.required' },
      ],
      'payment_status': [
        { type: 'required', message: 'HCM.Payroll.massages.payment_status.required' },
      ],
      'employeeID': [
        { type: 'required', message: 'HCM.Payroll.massages.payment_status.required' },
      ],
    }
    this.filter = {
      Table_name: "",
      Columnslist: [],
      filter: {
        month: this.selectedMonth + 1,
        year: this.selectedYear
      }
    }
  }

  chosenYearHandler(normalizedYear) {
    this.selectedYear = new Date(normalizedYear).getFullYear();;
  }

  async chosenMonthHandler(normalizedMonth, datepicker: MatDatepicker<Date>) {
    this.selectedMonth = new Date(normalizedMonth).getMonth();
    datepicker.select(new Date(this.selectedYear, this.selectedMonth, 1));
    datepicker.close();
  }

  async add() {
    try {
      if (this.addForm.valid == true) {
        this.filter.filter.month = this.selectedMonth + 1
        this.filter.filter.year = this.selectedYear
        this.addForm.get('month').setValue(this.selectedMonth + 1)
        this.addForm.get('year').setValue(this.selectedYear)
        this.PaySlips = await this.authz.getPaySlip(this.filter)
        let SHow_massage_for_one = false
        if (this.ProcessforOne) {
          this.PaySlips.forEach(element => {
            if (element.employeeID == this.addForm.value.employeeID)
              SHow_massage_for_one = true

          });
          if (SHow_massage_for_one) {
            let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "HCM.Payroll.Errors.already_add_employee", "Operations.Cancel", "Operations.Confirm", true)
            if (confirm) {
              await this.authz.updateaLLPayroll(this.addForm.value)
            }
          } else {
            await this.authz.CreatePayslipForOneUser(this.addForm.value)
          }

        } else {
          if (this.PaySlips != null && this.PaySlips.length > 0) {
            let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "HCM.Payroll.Errors.already_add", "Operations.Cancel", "Operations.Confirm", true)
            if (confirm) {
              await this.authz.updateaLLPayroll(this.addForm.value)
            }
          }
          else {
            this.authz.createPayslip(this.addForm.value);
          }
        }

        await this.dismiss();
      }
      else {
        this.addForm.markAllAsTouched();
      }
    } catch (e) {
      console.log(e);
    }
  }




  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'payroll-detail',
  templateUrl: './payroll-detail.html',
})
export class PayrollDetailModal implements OnInit {
  @Input('PaySlip') PaySlip: PaySlip;
  payslip: PaySlip
  payslipForm: FormGroup;
  validation_messages: any
  constructor(public modalCtrl: ModalController, public lang: LanguageService, fb: FormBuilder, public authz: AuthzService, private app: AppService) {
    this.payslipForm = fb.group({
      id: [''],
      contractID: [''],
      month: [''],
      year: [''],
      allowed_leaves: [''],
      taken_leaves: [''],
      working_days: [''],
      payslip_details: [''],
      total_allowences: [''],
      gosi_contribution: [''],
      total_deductions: [''],
      total_bonuses: [''],
      total_gross: [''],
      net_amount: [''],
      status: [''],
      payment_status: ['', [Validators.required]],
      payment_type: [''],
      paidAt: [''],
      generatedAt: ['']
    });
  }


  async ngOnInit() {
    console.log('this.PaySlip');
    console.log(this.PaySlip);
    this.validation_messages = {
      'selectedDate': [
        { type: 'required', message: 'HCM.Payroll.massages.selectedDate.required' },
      ],
      'status': [
        { type: 'required', message: 'HCM.Payroll.massages.status.required' },
      ],
      'payment_status': [
        { type: 'required', message: 'HCM.Payroll.massages.payment_status.required' },
      ],
    }
    this.payslip = await this.authz.getpayslipForId(this.PaySlip.id);
    this.payslipForm.setValue({
      id: this.payslip.id,
      contractID: this.payslip.contractID,
      month: this.payslip.month,
      year: this.payslip.year,
      allowed_leaves: this.payslip.allowed_leaves,
      taken_leaves: this.payslip.taken_leaves,
      working_days: this.payslip.working_days,
      payslip_details: this.payslip.payslip_details,
      total_allowences: this.payslip.total_allowences,
      gosi_contribution: this.payslip.gosi_contribution,
      total_deductions: this.payslip.total_deductions,
      total_bonuses: this.payslip.total_bonuses,
      total_gross: this.payslip.total_gross,
      net_amount: this.payslip.net_amount,
      status: this.payslip.status,
      payment_status: this.payslip.payment_status,
      payment_type: this.payslip.payment_type,
      paidAt: this.payslip.paidAt,
      generatedAt: this.payslip.generatedAt
    });
    console.log("this.payslipForm.value");

    console.log(this.payslipForm.value);

  }

  async add() {
    console.log(this.payslipForm.value);
    let payslipdetail = this.payslipForm.get('payslip_details').value;
    let total_allowences = this.payslipForm.get('total_allowences').value;
    let total_deductions = this.payslipForm.get('total_deductions').value;
    let total_bonuses = this.payslipForm.get('total_bonuses').value;
    let gorssSalary = this.payslipForm.get('total_gross').value;
    let net_salary = (total_allowences + total_bonuses + gorssSalary) - total_deductions;
    if (payslipdetail == null) {
      this.payslipForm.get('payslip_details').setValue(undefined)
    }
    this.payslipForm.get('net_amount').setValue(net_salary)
    if (this.payslipForm.valid == true) {
      try {
        console.log(this.payslipForm.value);
        let data = await this.authz.updatePayslip(this.payslipForm.value)
        console.log(data);
        await this.dismiss();
      } catch (e) {
        console.log(e);
      }
    }
    else {
      this.payslipForm.markAllAsTouched();
      //await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
