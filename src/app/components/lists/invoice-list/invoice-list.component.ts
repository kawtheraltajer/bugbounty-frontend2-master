import { Company } from './../../../interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { CourtService } from 'src/app/services/court.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { Client, Invoice, InvoiceDetail, Item, Case } from '../../../interfaces/types';
import { PrintService } from 'src/app/services/print.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

export const APP_DATE_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric'}},
  display: {
      dateInput: {month: 'short', year: 'numeric'},
      monthYearLabel: {year: 'numeric'}
  }
};
@Component({
  selector: 'invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [{
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
 }]
})
export class InvoiceListComponent implements OnInit {
  
  @Input('admindashboard') admindashboard:any;
  @Input('Invoices') Invoices: Invoice[];
  @Input('isAdd') isAdd: boolean = false;
  InvoiceColumns: string[];
  selectedDate = new FormControl(new Date());
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  @Input('selectedInvoice') selectedInvoice: Invoice[];
  invoiceList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Invoice>(true, []);
  @ViewChild('InvoiceTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  InvoiceTotal: any
  totalVatPaid = 0
  status: string;
  getall = false
  constructor(
    public modalController: ModalController,
    public app: AppService,
    public finance: FinanceService,
    public authz: AuthzService,
    private router: Router,
    public print: PrintService
  ) { }

  async ngOnInit() {

    this.InvoiceColumns = ['id', 'invoice_no', 'recipient_name', 'invoice_date', 'invoice_status', 'net_amount', 'tax_amount', 'Paid_amount', 'Vat_Paid_amount', 'pending_amount', 'Action'];
    this.getDisplayedColumns();

    if(this.admindashboard == true){
      
      this.InvoiceColumns = ['id', 'invoice_no', 'recipient_name', 'invoice_date','Due_date', 'invoice_status', 'net_amount', 'tax_amount', 'Paid_amount', 'Vat_Paid_amount', 'pending_amount', 'Action'];
      this.InvoiceTotal = await this.finance.getDueInvoiceTotal()
       this.Invoices=null
       if(this.getall){
        this.Invoices = await this.finance.getAllIDueInvoiceWithRange({
          start: null,
          end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('day').toJSDate()
        }, this.getall)
 
       }else{
        this.Invoices = await this.finance.getAllIDueInvoiceWithRange({
          start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).startOf('year').toJSDate(),
          end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('day').toJSDate()
        }, this.getall)
       }
   
      console.log("this.Invoices" )
      console.log(this.Invoices )
    }

    else
    {

      this.InvoiceTotal = await this.finance.getInvoiceTotal({
        start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).startOf('month').toJSDate(),
        end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('month').toJSDate()
      })
          this.Invoices = await this.finance.getAllInvoicesWithRange({
      start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).startOf('month').toJSDate(),
      end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('month').toJSDate()
    }, this.getall)
    }


    this.invoiceList = new MatTableDataSource(this.Invoices);
    this.invoiceList.paginator = this.tablePaginator;
  }

  ngOnChanges() {
    this.invoiceList.data = this.Invoices
  }

  async add() {
    const modal = await this.modalController.create({ component: AddInvoiceModal, cssClass: 'responsiveModal', });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }


  async details(row) {
    this.router.navigate(['/finance/invoice-detail', row.id])
    /*const modal = await this.modalController.create({ component: InvoiceDetailModal, cssClass: 'InvoiceDetailsModal', componentProps: { InvoiceId: row.id } });
    modal.onWillDismiss().then(res => {
      this.ngOnInit()
    });
    return await modal.present();*/
  }

  getDisplayedColumns() {
    return this.InvoiceColumns
  }

  applyFilter() {
    this.invoiceList.filterPredicate = (data, filter) => {
      return data.recipient_name?.toLocaleLowerCase().includes(filter) ||
        data?.client?.full_name.toLocaleLowerCase().includes(filter) ||
        data?.company?.full_name.toLocaleLowerCase().includes(filter) ||
        data?.invoice_no.toLocaleLowerCase().includes(filter)
    }
    this.invoiceList.filter = this.searchTerm.trim().toLowerCase();
  }

  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Invoice.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.finance.deleteInvoice(row.id)
      this.ngOnInit()
    }
  }

  printInvoice(row) {
    this.print.printInvoice(row)
  }

  chosenYearHandler(normalizedYear) {
    this.selectedYear = new Date(normalizedYear).getFullYear();;
  }

  async chosenMonthHandler(normalizedMonth, datepicker: MatDatepicker<Date>) {
    this.selectedMonth = new Date(normalizedMonth).getMonth();
    datepicker.select(new Date(this.selectedYear, this.selectedMonth, 1));
    this.getall = false
    this.ngOnInit()
    datepicker.close();
  }

  async getalldata() {
    this.getall = true
    this.ngOnInit()
  }
}

@Component({
  selector: 'add-invoice',
  templateUrl: './add-invoice.html',
})
export class AddInvoiceModal implements OnInit {
  @Input('caseID') caseID: number;
  @Input('clientID') clientID: number;
  @Input('companyID') companyID: number;
  FromCase: boolean = false;
  isLoading = true;
  addForm: FormGroup;
  addDetailForm: FormGroup;
  transectionForm: FormGroup;
  transectionDetailForm: FormGroup;
  invoiceDetails: InvoiceDetail[];
  clients: Client[];
  filteredClients: Client[]
  companies: Company[];
  filteredCompanies: Company[]
  cases: Case[];
  isInstallment = false;
  isCheque = false;
  today = new Date()
  ItemForm: FormGroup;
  InvoiceItems: any;
  items: any;
  validation_messages: any
  public ClientFilterCtrl: FormControl = new FormControl();
  constructor(private dateAdapter: DateAdapter<Date>, public modalCtrl: ModalController, private router: Router, public modalController: ModalController, private app: AppService, public court: CourtService, fb: FormBuilder, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.addForm = fb.group({
      invoice_date: ['', [Validators.required]],
      clientID: ['', [Validators.required]],
      type: ['', []],
      companyID: ['',],
      recipient_name: ['',],
      caseID: [''],
      gross_amount: ['',],
      tax_amount: ['',],
      net_amount: ['',],
      no_of_month: [''],
      start_date: [''],
      due_date: ['', [Validators.required]],
      next_payment_date: [''],
      paid_amount: ['', [Validators.required]],
      pending_amount: [''],
      is_instalment: [''],
      cheque_date: [''],
      drawn_on: [''],
      cheque_number: [''],
      invoice_status: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
      comments: ['']
    });

    this.addDetailForm = fb.group({
      invoiceID: ['', [Validators.required]],
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      description: [''],
    });

    this.ItemForm = fb.group({
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      item_name: ['', [Validators.nullValidator]],
      description: [''],
    });

  }


  async ngOnInit() {


    this.validation_messages = {
      'clientID': [
        { type: 'required', message: 'Finance.Invoice.messages.Client.required' },
      ],
      'CompanyID': [
        { type: 'required', message: 'Finance.Invoice.messages.Company.required' },
      ],
      'recipient_name': [
        { type: 'required', message: 'Finance.Invoice.messages.Recepient.required' },
      ],
      'invoice_status': [
        { type: 'required', message: 'Finance.Invoice.messages.invoice_status.required' },
      ],
      'due_date': [
        { type: 'required', message: 'Finance.Invoice.messages.due_date.required' },
      ],
      'payment_method': [
        { type: 'required', message: 'Finance.Invoice.messages.payment_method.required' },
      ],
      'cheque_date': [
        { type: 'required', message: 'Finance.Invoice.messages.cheque_date.required' },
      ],
      'drawn_on': [
        { type: 'required', message: 'Finance.Invoice.messages.drawn_on.required' },
      ],
      'cheque_number': [
        { type: 'required', message: 'Finance.Invoice.messages.cheque_number.required' },
      ],
      'paid_amount': [
        { type: 'required', message: 'Finance.Invoice.messages.cheque_number.required' },
      ]

    }
    if (this.caseID) {
      this.FromCase = true;
      this.cases = await this.court.getCaseForClient(Number(this.clientID))
      this.addForm.controls['type'].disable()   
      this.addForm.controls['clientID'].disable() 
      this.addForm.controls['companyID'].disable() 

    }
    console.log("this.caseID")

    console.log(this.caseID)
    this.items = await this.finance.getAllItems()
    this.clients = await this.court.getClientForList()
    this.filteredClients = this.clients
    this.cases = [];
    this.addForm.setValue({
      invoice_date: this.today,
      type:'Client',
      clientID: this.clientID ?  Number(this.clientID) : null,
      companyID: "",
      recipient_name: "",
      caseID: this.caseID ? Number(this.caseID) : null,
      is_instalment: false,
      no_of_month: "",
      start_date: "",
      next_payment_date: "",
      gross_amount: "",
      tax_amount: "",
      net_amount: "",
      due_date: this.today,
      cheque_date: null,
      drawn_on: "",
      cheque_number: "",
      pending_amount: 0,
      payment_method: "BankTransfer",
      invoice_status: "Pending",
      comments: "",
      paid_amount: 0
    })
    this.invoiceDetails = [];
    this.isLoading = false;
    this.addForm.controls['pending_amount'].disable()


  }
  change_paid_amount() {
    this.addForm.get('paid_amount').setValue(this.addForm.get('net_amount').value);


  }

  change_pennding_amount() {
    this.addForm.get('pending_amount').setValue(Number((this.addForm.get('net_amount').value - this.addForm.get('paid_amount').value).toFixed(2)));
  }

  async addOrEditDetails(itemIndex, itemId) {
    const modal = await this.modalController.create({ component: AddInvoiceDetailModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(res => {
      if (res.data.data.invoice_details) {
        this.invoiceDetails.push({
          ...res.data.data.invoice_details
        })
        this.calculate();
      }
      if (this.invoiceDetails.length > 1)
        this.addForm.controls['paid_amount'].disable()
      else
        this.addForm.controls['paid_amount'].enable()

    });
    return await modal.present();
  }

  async edit(row, index) {

    const modal = await this.modalController.create({ component: UpdateInvoiceDetailModal, cssClass: 'responsiveModal', componentProps: { InvoiceDetail: row } });
    await modal.present();
    modal.onDidDismiss().then(async res => {
      // this.invoiceDetails = await this.finance.getAllInvoiceDetails(this.id);
      if (res.data.InvoiceDetail) {
        this.invoiceDetails[index] = res.data.InvoiceDetail
        this.calculate();

      }
    })
  }
  addItem(event) {

    this.ItemForm.get('item_name').setValue(this.items[event.value].name);
    this.ItemForm.get('gross_amount').setValue(this.items[event.value].rate);
    this.ItemForm.get('tax_amount').setValue((this.items[event.value].taxcode.percentage / 100) * this.items[event.value].rate);
    this.ItemForm.get('net_amount').setValue(((this.items[event.value].taxcode.percentage / 100) * this.items[event.value].rate) + this.items[event.value].rate);
    this.invoiceDetails.push({
      ...this.ItemForm.value
    })
    // this. calculate()
  }

  //Calculate for add
  calculate() {
    let gross_amount = 0;
    let tax_amount = 0;
    let net_amount = 0;
    this.invoiceDetails.forEach((val) => {
      gross_amount += val.gross_amount;
      tax_amount += val.tax_amount;
      net_amount += val.net_amount;
    });

    this.addForm.get('gross_amount').setValue(gross_amount);
    this.addForm.get('tax_amount').setValue(tax_amount);
    this.addForm.get('net_amount').setValue(net_amount);
    this.addForm.get('paid_amount').setValue(net_amount);
    this.addForm.get('pending_amount').setValue((this.addForm.get('net_amount').value - this.addForm.get('paid_amount').value).toFixed(2));
  }
  async getItemForCases() {
    this.invoiceDetails = []
    let CaseItems = await this.finance.getItemByCaseType(this.addForm.value.caseID)
    this.invoiceDetails.push({
      itemID: CaseItems.id,
      gross_amount: CaseItems.rate,
      tax_amount: (CaseItems.taxcode.percentage / 100) * CaseItems.rate,
      net_amount: (CaseItems.taxcode.percentage / 100) * CaseItems.rate + CaseItems.rate,
      item_name: CaseItems.name,
      description: null

    })
    this.calculate();


  }

  checkCheque(event) {
    if (event.value == 'Cheque') {
      this.isCheque = true;
      this.addForm.get('cheque_date').setValidators([Validators.required])
      this.addForm.get('drawn_on').setValidators([Validators.required])
      this.addForm.get('cheque_number').setValidators([Validators.required])
    }
    else {
      this.isCheque = false;
      this.addForm.get('cheque_date').setValidators([])
      this.addForm.get('drawn_on').setValidators([])
      this.addForm.get('cheque_number').setValidators([])
      this.addForm.get('cheque_date').setValue(null);
      this.addForm.get('drawn_on').setValue('');
      this.addForm.get('cheque_number').setValue('');
    }
  }

  async getCasesForClient(event) {
    if (event.value == 0) {
      this.cases = [];
    }
    else {
      this.cases = await this.court.getCaseForClient(event.value)
    }
  }

  async getCasesForCompany(event) {
    if (event.value == 0) {
      this.cases = [];
    }
    else {
      this.cases = await this.court.getCaseForCompanyList(event.value)
    }
  }

  async typechanged(event) {
    this.cases = []
    if (event.value == 'Company' && !this.companies) {
      this.companies = await this.court.getCompanyForList()
      this.filteredCompanies = this.companies
    }
  }

  instalmentChange(ev) {
    if (ev.checked) {
      this.isInstallment = true;
      this.addForm.get('no_of_month').setValidators([Validators.required])
      this.addForm.get('start_date').setValidators([Validators.required])
      this.addForm.get('next_payment_date').setValidators([Validators.required])
    }
    else {
      this.isInstallment = false;
      this.addForm.get('no_of_month').setValidators([])
      this.addForm.get('start_date').setValidators([])
      this.addForm.get('next_payment_date').setValidators([])
    }
  }



  public findInvalidControls() {
    const invalid = [];
    const controls = this.addForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  async add() {

    if (this.addForm.valid && this.invoiceDetails.length > 0) {

      let { ...data } = this.addForm.value;
      if (data.paid_amount > data.net_amount) {
        let confirm = await this.app.presentConfirmAlert("Operations.Sorry", "Finance.Receipt.Errors.over", "Operations.Cancel", "Operations.Ok", true)
      } else {
        if (this.invoiceDetails.length > 1) {
          this.addForm.controls['paid_amount'].enable()
          this.addForm.get('invoice_date').setValue(data.net_amount);
          this.addForm.get('pending_amount').setValue(0);

        }
        if (this.caseID) {
          this.addForm.controls['clientID'].enable() 
          this.addForm.controls['companyID'].enable() 
          this.addForm.get('clientID').setValue(Number(this.clientID));
          this.addForm.get('companyID').setValue(Number(this.companyID));

    
        }
 
        this.addForm.get('invoice_date').setValue(DateTime.fromJSDate(data.invoice_date).toISO());
        this.addForm.get('next_payment_date').setValue(DateTime.fromJSDate(data.next_payment_date).toISO());
        this.addForm.get('due_date').setValue(DateTime.fromJSDate(data.due_date).toISO());
        this.addForm.get('start_date').setValue(DateTime.fromJSDate(data.start_date).toISO());


        await this.app.presentLoading();
        /*  await this.addForm.setValue({
            invoice_date: DateTime.fromJSDate(data.invoice_date).toISO(),
            clientID: parseInt(data.clientID),
            caseID: parseInt(data.caseID),
            companyID: parseInt(data.companyID),
            recipient_name: data.recipient_name,
            gross_amount: data.gross_amount ? data.gross_amount : 0,
            tax_amount: data.tax_amount ? data.tax_amount : 0,
            net_amount: data.net_amount ? data.net_amount : 0,
            no_of_month: parseInt(data.no_of_month),
            start_date: DateTime.fromJSDate(data.start_date).toISO(),
            next_payment_date: DateTime.fromJSDate(data.next_payment_date).toISO(),
            pending_amount: data.net_amount - data.paid_amount,
            due_date: DateTime.fromJSDate(data.due_date).toISO(),
            paid_amount: data.paid_amount,
            cheque_date: data.cheque_date,
            drawn_on: data.drawn_on,
            cheque_number: data.cheque_number,
            is_instalment: data.is_instalment,
            payment_method: data.payment_method,
            invoice_status: data.invoice_status,
            comments: data.comments
          })*/
        try {
          let forming = this.addForm.value
          let InvoiceObject = {
            data: forming, items: this.invoiceDetails

          }
          await this.finance.AddInvoice(InvoiceObject)
          await this.app.dismissLoading();
          // this.router.navigate(['finance/invoice'])
          this.dismiss();
        } catch (e) {
          this.addForm.controls['paid_amount'].disable()
          console.log(e);
        }
      }

    } else {
      this.addForm.controls['paid_amount'].disable()
      if (this.invoiceDetails.length == 0) {
        let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Invoice.Errors.Add_item", "Operations.Cancel", "Operations.Ok", true)
      }
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }


  async delete(index) {
    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete the Item ?", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.invoiceDetails.splice(index, 1);
      if (this.invoiceDetails.length > 1)
        this.addForm.controls['paid_amount'].disable()
      else
        this.addForm.controls['paid_amount'].enable()
      this.calculate()
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,

    });
  }

  public filterClientlist(value) {
    return this.filteredClients = this.clients.filter((val) => {
      return val.full_name?.toLowerCase().includes(this.ClientFilterCtrl.value);
    })
  }

  clearSelectionClient() {
    this.filteredClients = this.clients
  }

  public filterCompanylist(value) {
    return this.filteredCompanies = this.companies.filter((val) => {
      return val.full_name?.toLowerCase().includes(this.ClientFilterCtrl.value);
    })
  }

  clearSelectionCompany() {
    this.filteredCompanies = this.companies
  }

  valueChanged(event) {
    if (event.value == 'Client') {
      this.addForm.controls['clientID'].setValidators([Validators.required]);
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('companyID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else if (event.value == 'Company') {
      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([Validators.required]);
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('clientID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else {
      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([Validators.required]);
      this.addForm.get('clientID').setValue('')
      this.addForm.get('companyID').setValue('')
    }
  }
}



@Component({
  selector: 'add-invoice-detail',
  templateUrl: './add-invoice-detail.html',
})
export class AddInvoiceDetailModal implements OnInit {
  isLoading = true;
  addForm: FormGroup;
  items: Item[];
  validation_messages: any
  SelectedItem: any
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {
    this.addForm = fb.group({
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      item_name: ['', [Validators.nullValidator]],
      description: ['']
    });
  }

  async ngOnInit() {
    this.validation_messages = {
      'itemID': [
        { type: 'required', message: 'Finance.Invoice.messages.Item.required' },
      ],
      'gross_amount': [
        { type: 'required', message: 'Finance.Invoice.messages.gross_amount.required' },
      ]

    }
    this.items = await this.finance.getIncomeItems()

    this.addForm.setValue({
      itemID: "",
      gross_amount: "",
      tax_amount: "",
      net_amount: "",
      item_name: "",
      description: ""
    })
    this.isLoading = false;
  }

  updatePrice(event) {
    this.SelectedItem = this.items[event.value]
    this.addForm.get('item_name').setValue(this.items[event.value].name);
    this.addForm.get('gross_amount').setValue(this.items[event.value].rate);
    this.addForm.get('tax_amount').setValue((this.items[event.value].taxcode.percentage / 100) * this.addForm.get('gross_amount').value);
    this.addForm.get('net_amount').setValue(((this.items[event.value].taxcode.percentage / 100) * this.items[event.value].rate) + this.addForm.get('gross_amount').value);

  }

  updateTextBox() {
    this.addForm.get('tax_amount').setValue((this.SelectedItem.taxcode.percentage / 100) * this.addForm.get('gross_amount').value);
    this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"].value + this.addForm.controls["gross_amount"].value);
  }

  update_net_amount() {
    this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"].value + this.addForm.controls["gross_amount"].value);
  }
  async add() {

    if (this.addForm.valid) {
      let data = this.addForm.value;
      data.itemID = this.items[data.itemID].id;
      this.modalCtrl.dismiss({
        'dismissed': true,
        data: {
          invoice_details: data
        }
      });
    } else {
      this.addForm.markAllAsTouched();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data: {
        invoice_details: null
      }
    });
  }
}


@Component({
  selector: 'invoice-detail',
  templateUrl: './invoice-detail.html',
})
export class InvoiceDetailModal implements OnInit {
  Invoice: any;
  InvoiceDetail: any[];
  id: number;
  Description: any
  @Input('isAdd') isAdd: boolean = false;
  InvoiceColumns: string[];
  @Input('InvoiceId') InvoiceId: number

  @ViewChild(MatSort) sort: MatSort;
  isLoading = true;
  isSearch = false;
  searchTerm = '';
  isEditMode = false;
  isHidden = true;
  showComments = false;
  showCommentsHandle = true;
  sideHasBackdrop = true;
  sideMode: 'over' | 'push' | 'side' = 'over';
  onSave = () => {
    console.log('save');
  }

  previewConfig = {
    readonly: true,
    mode: "readonly",
    menubar: false,
    toolbar: false,
    plugins: ['autoresize'],
    statusbar: false,
    branding: false,
    autoresize_bottom_margin: 20,
    directionality: 'rtl',
  }
  validation_messages: any

  SelectedItem: any
  is_Edit: false;
  constructor(public print: PrintService,
    private act: ActivatedRoute,
    private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService,
  ) { }


  printInvoice() {
    this.print.printInvoice(this.Invoice)
  }

  async ngOnInit() {
    this.id = this.act.snapshot.params.id;
    // this.id = this.InvoiceId;
    if (this.id) {
      this.Invoice = await this.finance.getInvoice(this.id);
      this.InvoiceDetail = await this.finance.getAllInvoiceDetails(this.id);
      this.isLoading = false;

    } else {
      console.log("There is no ID");
      this.router.navigateByUrl("finance/invoice")
    }
  }


  async ngOnChanges() {
    //this.id = this.act.snapshot.params.id;
    this.id = this.InvoiceId;
    this.InvoiceDetail = await this.finance.getAllInvoiceDetails(this.id);
  }



  async activate(id, ev) {
    console.log(id);
    console.log(ev);
  }

  async update() {
    this.router.navigate(['/finance/update-invoice', this.id])
  }

  dismiss() {
    this.router.navigate(['finance/invoice'])
    /* this.modalCtrl.dismiss({
       'dismissed': true,
 
     });*/
  }
}

@Component({
  selector: 'update-invoice',
  templateUrl: './update-invoice.html',
})
export class UpdateInvoiceModal implements OnInit {
  Invoice: Invoice;
  InvoiceDetails;
  clients: Client[];
  id: number;
  isLoading = true;
  isInstallment = false;
  cases: Case[];
  isCheque = false;
  segment: number;
  addForm: FormGroup;
  addDetailForm: FormGroup;
  addReceiptForm: FormGroup;
  addReceiptDetailForm: FormGroup;
  tags: any;
  selectedItem
  validation_messages: any;
  public ClientFilterCtrl: FormControl = new FormControl();
  transectionForm: FormGroup;
  transectionDetailForm: FormGroup;
  invoiceDetails: any;
  filteredClients: Client[]
  companies: Company[];
  filteredCompanies: Company[]
  today = new Date()
  ItemForm: FormGroup;
  InvoiceItems: any;
  items: any;
  typeofinvoice: any
  constructor(private dateAdapter: DateAdapter<Date>, public modalController: ModalController, public authz: AuthzService, public court: CourtService, private route: ActivatedRoute, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService, private router: Router) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.addForm = fb.group({
      id: ['',],
      invoice_no: ['',],
      paid_amount: ['',],
      invoice_date: ['', [Validators.required]],
      clientID: ['', []],
      companyID: ['',],
      recipient_name: ['',],
      caseID: [''],
      gross_amount: ['',],
      tax_amount: ['',],
      net_amount: ['',],
      no_of_month: [''],
      start_date: [''],
      due_date: ['', [Validators.required]],
      next_payment_date: [''],
      pending_amount: [''],
      is_instalment: [''],
      cheque_date: [''],
      drawn_on: [''],
      cheque_number: [''],
      invoice_status: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
      comments: ['']
    });

    this.addDetailForm = fb.group({
      invoiceID: ['', [Validators.required]],
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      description: [''],
    });
  }

  change_pennding_amount() {
    this.addForm.get('pending_amount').setValue(Number((this.addForm.get('net_amount').value - this.addForm.get('paid_amount').value).toFixed(3)));
    this.addForm.controls['pending_amount'].disable()
  }
  async typechanged(event) {
    this.cases = []
    if (event.value == 'Company' && !this.companies) {
      this.companies = await this.court.getCompanyForList()
      this.filteredCompanies = this.companies
    }
  }
  calculate_vat_amount(InvoiceItems) {
    InvoiceItems.forEach(element => {
      if (element.InvoiceItems.item.taxcode.percentage)
        (1 + element?.InvoiceItems[0]?.item?.taxcode?.percentage / 100) * (element?.InvoiceItems[0]?.item?.taxcode?.percentage / 100)
    });


  }

  async getCasesForCompany(event) {
    if (event.value == 0) {
      this.cases = [];
    }
    else {
      this.cases = await this.court.getCaseForCompanyList(event.value)
    }
  }
  valueChanged(event) {
    if (event.value == 'Client') {
      this.addForm.controls['clientID'].setValidators([Validators.required]);
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('companyID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else if (event.value == 'Company') {
      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([Validators.required]);
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('clientID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else {
      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([Validators.required]);
      this.addForm.get('clientID').setValue('')
      this.addForm.get('companyID').setValue('')
    }
  }
  public filterClientlist(value) {
    return this.filteredClients = this.clients.filter((val) => {
      return val.full_name?.toLowerCase().includes(this.ClientFilterCtrl.value);
    })
  }

  clearSelectionClient() {
    this.filteredClients = this.clients
  }

  public filterCompanylist(value) {
    return this.filteredCompanies = this.companies.filter((val) => {
      return val.full_name?.toLowerCase().includes(this.ClientFilterCtrl.value);
    })
  }

  clearSelectionCompany() {
    this.filteredCompanies = this.companies
  }


  async ngOnInit() {
    this.addForm.controls['pending_amount'].disable()

    this.id = this.route.snapshot.params.id;
    this.Invoice = await this.finance.getInvoice(this.id);
    this.invoiceDetails = await this.finance.getAllInvoiceDetails(this.id);

    this.clients = await this.court.getClientForList();
    this.filteredClients = this.clients
    if (this.Invoice.caseID != null) {
      this.cases = await this.court.getCaseForClient(this.Invoice.clientID)
    }
    this.validation_messages = {
      'clientID': [
        { type: 'required', message: 'Finance.Invoice.messages.Client.required' },
      ],
      'CompanyID': [
        { type: 'required', message: 'Finance.Invoice.messages.Company.required' },
      ],
      'recipient_name': [
        { type: 'required', message: 'Finance.Invoice.messages.Recepient.required' },
      ],
      'invoice_status': [
        { type: 'required', message: 'Finance.Invoice.messages.invoice_status.required' },
      ],
      'due_date': [
        { type: 'required', message: 'Finance.Invoice.messages.due_date.required' },
      ],
      'payment_method': [
        { type: 'required', message: 'Finance.Invoice.messages.payment_method.required' },
      ],
      'cheque_date': [
        { type: 'required', message: 'Finance.Invoice.messages.cheque_date.required' },
      ],
      'drawn_on': [
        { type: 'required', message: 'Finance.Invoice.messages.drawn_on.required' },
      ],
      'cheque_number': [
        { type: 'required', message: 'Finance.Invoice.messages.cheque_number.required' },
      ],
      'paid_amount': [
        { type: 'required', message: 'Finance.Invoice.messages.cheque_number.required' },
      ]

    }

    if (this.Invoice.clientID) {
      this.typeofinvoice = "Client"
      this.addForm.controls['clientID'].setValidators([Validators.required]);
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('companyID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else if (this.Invoice.companyID) {
      this.typeofinvoice = "Company"
      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([Validators.required]);
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('clientID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else {
      this.typeofinvoice = "Other"

      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([Validators.required]);
      this.addForm.get('clientID').setValue('')
      this.addForm.get('companyID').setValue('')
    }


    this.addForm.setValue({

      id: this.Invoice.id,
      paid_amount: (this.Invoice.net_amount - this.Invoice.pending_amount).toFixed(3),
      invoice_no: this.Invoice?.invoice_no,
      invoice_date: this.Invoice?.invoice_date,
      clientID: this.Invoice?.clientID,
      recipient_name: this.Invoice.recipient_name,
      caseID: this.Invoice?.caseID,
      companyID: this.Invoice?.companyID,
      gross_amount: this.Invoice.gross_amount,
      tax_amount: this.Invoice.tax_amount,
      net_amount: this.Invoice.net_amount.toFixed(3),
      no_of_month: this.Invoice.no_of_month,
      start_date: this.Invoice.start_date,
      due_date: this.Invoice.due_date,
      next_payment_date: this.Invoice.next_payment_date,
      cheque_date: this.Invoice.cheque_date,
      drawn_on: this.Invoice.drawn_on,
      cheque_number: this.Invoice.cheque_number,
      is_instalment: this.Invoice.is_instalment,
      payment_method: this.Invoice.payment_method,
      pending_amount: this.Invoice.pending_amount.toFixed(3),
      invoice_status: this.Invoice.invoice_status,
      comments: this.Invoice.comments
    })
    this.isLoading = false;
    this.InvoiceDetails = [];
    for (let i = 0; i < this.invoiceDetails.length; i++) {
      this.InvoiceDetails.push({
        itemID: this.invoiceDetails[i].item.id,
        gross_amount: this.invoiceDetails[i].gross_amount,
        tax_amount: this.invoiceDetails[i].tax_amount,
        net_amount: this.invoiceDetails[i].net_amount,
        item_name: this.invoiceDetails[i].item.name,
        description: this.invoiceDetails[i].description
      })
    }
    this.calculate()


  }

  checkCheque(event) {
    if (event.value == 'Cheque') {
      this.isCheque = true;
      this.addForm.get('cheque_date').setValidators([Validators.required])
      this.addForm.get('drawn_on').setValidators([Validators.required])
      this.addForm.get('cheque_number').setValidators([Validators.required])
    }
    else {
      this.isCheque = false;
      this.addForm.get('cheque_date').setValidators([])
      this.addForm.get('drawn_on').setValidators([])
      this.addForm.get('cheque_number').setValidators([])
      this.addForm.get('cheque_date').setValue(null);
      this.addForm.get('drawn_on').setValue('');
      this.addForm.get('cheque_number').setValue('');
    }
  }

  async getCasesForClient(event) {
    if (event.value == 0) {
      this.cases = [];
    }
    else {
      this.cases = await this.court.getCaseForClient(this.Invoice.clientID)
    }
  }

  //Calculate for update
  calculate() {
    let gross_amount = 0;
    let tax_amount = 0;
    let net_amount = 0;
    this.InvoiceDetails.forEach((val) => {
      gross_amount += val.gross_amount;
      tax_amount += val.tax_amount;
      net_amount += val.net_amount;
    });

    this.addForm.get('gross_amount').setValue(gross_amount);
    this.addForm.get('tax_amount').setValue(tax_amount);
    this.addForm.get('net_amount').setValue(net_amount);
    //this.addForm.get('paid_amount').setValue(this.Invoice.net_amount - this.Invoice.pending_amount);
    if (this.InvoiceDetails.length > 1) {
      this.addForm.get('paid_amount').setValue(net_amount);
      this.addForm.get('pending_amount').setValue(0);
    }
    else {
      this.addForm.get('paid_amount').setValue(this.Invoice.net_amount - this.Invoice.pending_amount);
      this.addForm.get('pending_amount').setValue(net_amount - (this.Invoice.net_amount - this.Invoice.pending_amount));
    }
  }

  async addOrEditDetails(itemIndex, itemId) {
    const modal = await this.modalController.create({ component: AddInvoiceDetailModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(res => {
      if (res.data.data.invoice_details) {
        this.InvoiceDetails.push({
          ...res.data.data.invoice_details
        })
        this.calculate();
      }
      if (this.InvoiceDetails.length > 1)
        this.addForm.controls['paid_amount'].disable()
      else
        this.addForm.controls['paid_amount'].enable()
    });
    return await modal.present();
  }

  async edit(row) {
    const modal = await this.modalController.create({ component: UpdateInvoiceDetailModal, cssClass: 'responsiveModal', componentProps: { InvoiceDetail: row } });
    await modal.present();
    modal.onDidDismiss().then(async dt => {

      this.InvoiceDetails = await this.finance.getAllInvoiceDetails(this.id);
      this.calculate();
    })
  }

  async delete(index) {
    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete the Item ?", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.InvoiceDetails.splice(index, 1);
      if (this.InvoiceDetails.length > 1)
        this.addForm.controls['paid_amount'].disable()
      else
        this.addForm.controls['paid_amount'].enable()
      this.calculate()
    }
  }

  instalmentChange(ev) {
    if (ev.checked) {
      this.isInstallment = true;
      //this.addForm.get('').setValidators([])
      this.addForm.get('no_of_month').setValidators([Validators.required])
      this.addForm.get('start_date').setValidators([Validators.required])
      this.addForm.get('next_payment_date').setValidators([Validators.required])
    }
    else {
      this.isInstallment = false;
      this.addForm.get('no_of_month').setValidators([])
      this.addForm.get('start_date').setValidators([])
      this.addForm.get('next_payment_date').setValidators([])
    }
  }

  async updateInvoiceAmount() {
    this.Invoice = await this.finance.getInvoice(this.id);
    this.InvoiceDetails = await this.finance.getAllInvoiceDetails(this.id);
    let gross_amount = 0;
    let tax_amount = 0;
    let net_amount = 0;
    this.InvoiceDetails.forEach((val) => {
      gross_amount += val.gross_amount;
      tax_amount += val.tax_amount;
      net_amount += val.net_amount;
    });
    let data = {
      "id": parseInt(this.id.toString()),
      "gross_amount": gross_amount,
      "tax_amount": tax_amount,
      "net_amount": net_amount
    }
    let updated = await this.finance.UpdateInvoice(data);
    this.addForm.get('gross_amount').setValue(gross_amount);
    this.addForm.get('tax_amount').setValue(tax_amount);
    this.addForm.get('net_amount').setValue(net_amount);
  }


  async add() {
    this.addForm.controls['paid_amount'].enable();
    let { ...data } = this.addForm.value;
    if (this.addForm.valid && this.InvoiceDetails?.length != 0) {
      let { ...data } = this.addForm.value;
      if (data.paid_amount > data.net_amount ) {
        let confirm = await this.app.presentConfirmAlert("Operations.Sorry", "Finance.Receipt.Errors.over", "Operations.Cancel", "Operations.Ok", true)
      } 

      else {
        if (this.InvoiceDetails.length > 1) {
          /* this.addForm.get('invoice_date').setValue( data.net_amount);
           this.addForm.get('pending_amount').setValue( 0);
           */

        }

        await this.app.presentLoading();
        await this.addForm.setValue({
          id: this.Invoice.id,
          invoice_date: data.invoice_date,
          invoice_no: data.invoice_no,
          clientID: data.clientID ? parseInt(data.clientID) : null,
          caseID: data.clientID ? parseInt(data.caseID) : null,
          companyID: data.clientID ? parseInt(data.companyID) : null,
          recipient_name: data.recipient_name,
          gross_amount: data.gross_amount ? data.gross_amount : 0,
          tax_amount: data.tax_amount ? data.tax_amount : 0,
          net_amount: data.net_amount ? data.net_amount : 0,
          no_of_month: parseInt(data.no_of_month),
          start_date: DateTime.fromJSDate(data.start_date).toISO(),
          next_payment_date: DateTime.fromJSDate(data.next_payment_date).toISO(),
          pending_amount: this.invoiceDetails.length > 1 ? 0 : data.net_amount - data.paid_amount,
          due_date: data.due_date,
          paid_amount: this.invoiceDetails.length > 1 ? data.net_amount : data.paid_amount,
          cheque_date: data.cheque_date,
          drawn_on: data.drawn_on,
          cheque_number: data.cheque_number,
          is_instalment: data.is_instalment,
          payment_method: data.payment_method,
          invoice_status: data.invoice_status,
          comments: data.comments
        })


        try {
          let forming = this.addForm.value
          let InvoiceObject = {
            data: forming, items: this.InvoiceDetails

          }
          await this.finance.UpdateInvoice(InvoiceObject)
          await this.app.dismissLoading();

          this.router.navigate(['finance/invoice']);
        } catch (e) {
          console.log(e);
        }
      }

    } else {

      if (this.InvoiceDetails?.length == 0) {
        let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Invoice.Errors.Add_item", "Operations.Cancel", "Operations.Ok", true)

      } else if ((data.net_amount - data.paid_amount) < 0) {
        let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "The pending amount should be greater than 0 ", "Operations.Cancel", "Operations.Ok", true)

      }
      this.addForm.markAllAsTouched();
      //await this.app.dismissLoading();
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.addForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  updateTextBox() {

    this.addForm.controls["net_amount"].setValue(this.addForm.value.tax_amount + this.addForm.value.gross_amount);
  }
  async step0() {
    this.segment = 0
  }
  async step1() {
    this.segment = 1
  }
  async step2() {
    this.segment = 2
  }
  async step3() {
    this.segment = 3
  }
  dismiss() {
    this.router.navigate(['/finance/invoice-detail', this.id])


  }
}

@Component({
  selector: 'update-invoice-detail',
  templateUrl: './update-invoice-detail.html',
})
export class UpdateInvoiceDetailModal implements OnInit {
  @Input('InvoiceDetail') InvoiceDetail: InvoiceDetail;


  isLoading = true;
  AddTags: boolean
  segment: number;
  addForm: FormGroup;
  items: Item[];
  item: Item;
  isEditMode = false;
  isHidden = true;
  newComment = '';
  previewData = ``;
  showComments = false;
  showCommentsHandle = true;
  sideHasBackdrop = true;
  sideMode: 'over' | 'push' | 'side' = 'over';
  onSave = () => {
    console.log('save');
  }
  validation_messages: any
  SelectedItem: any
  ChooseItem: any
  clients: Client[]
  filteredClients: Client[]
  constructor(public court: CourtService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {
    this.addForm = fb.group({
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      item_name: ['', [Validators.nullValidator]],
      description: ['']
    });
  }

  async ngOnInit() {
    this.validation_messages = {
      'itemID': [
        { type: 'required', message: 'Finance.Expense.messages.Item.required' },
      ],
      'gross_amount': [
        { type: 'required', message: 'Finance.Expense.messages.gross_amount.required' },
      ]

    }
    this.items = await this.finance.getAllItems();

    this.filteredClients = this.clients
    this.addForm.setValue({
      itemID: "",
      gross_amount: "",
      tax_amount: "",
      net_amount: "",
      item_name: "",
      description: ""
    })
    this.isLoading = false;
  }

  updatePrice(event) {
    this.SelectedItem = this.items[event.value]
    this.addForm.get('item_name').setValue(this.items[event.value].name);
    this.addForm.get('gross_amount').setValue(this.items[event.value].rate);
    this.addForm.get('tax_amount').setValue((this.items[event.value].taxcode.percentage / 100) * this.addForm.get('gross_amount').value);
    this.addForm.get('net_amount').setValue(((this.items[event.value].taxcode.percentage / 100) * this.items[event.value].rate) + this.addForm.get('gross_amount').value);
  }

  updateTextBox() {
    this.addForm.get('tax_amount').setValue((this.SelectedItem.taxcode.percentage / 100) * this.addForm.get('gross_amount').value);

    this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"].value + this.addForm.controls["gross_amount"].value);
  }

  update_net_amount() {

    this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"].value + this.addForm.controls["gross_amount"].value);
  }
  // updateAccountCodeName(event) {
  //   console.log(event);
  //   this.addForm.get('account_code_name').setValue(this.accountCodes[event.value].acc_code_en);
  // }

  async add() {

    if (this.addForm.valid) {
      let data = this.addForm.value;
      data.itemID = this.items[data.itemID].id;
      this.modalCtrl.dismiss({
        'dismissed': true,
        data: {
          expense_details: data
        }
      });
    } else {
      this.addForm.markAllAsTouched();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data: {
        Invoice_details: null
      }
    });
  }
}


