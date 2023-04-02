import { Company, TaxCode, Item, Invoice } from './../../../interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { Client, Receipt, ReceiptDetail } from '../../../interfaces/types';
import { CourtService } from 'src/app/services/court.service';
import { NavController } from '@ionic/angular';
import { PrintService } from 'src/app/services/print.service';
import { FeesListComponent } from 'src/app/components/lists/fees-list/fees-list.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DateTime } from 'luxon';
import { MatDatepicker } from '@angular/material/datepicker';
import { dateComparedToNow } from 'src/app/helpers/helpers';

export const APP_DATE_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric'}},
  display: {
      dateInput: {month: 'short', year: 'numeric'},
      monthYearLabel: {year: 'numeric'}
  }
};

@Component({
  selector: 'receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss'],
  providers: [{
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
 }]
})
export class ReceiptListComponent implements OnInit {
  @Input('admindashboard') admindashboard:any;
  @Input('FromFees') FromFees: boolean;
  @Input('clientID') clientID: number;
  @Input('InvoiceID') InvoiceID: number;
  @Input('CaseID') CaseID: number;
  @Input('Receipts') Receipts: any;
  @Output() newReceiptEvent = new EventEmitter<any>();
  ReceiptColumns: string[];
  @Input('selectedReceipt') selectedReceipt: Receipt[];
  receiptList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Receipt>(true, []);
  @ViewChild('ReceiptTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status: string;
  pending_amount: number = 0
  Add_Receipt: boolean = true
  @ViewChild(FeesListComponent) child: FeesListComponent;
  selectedDate = new FormControl(new Date());
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  getall = false
  current_date=new Date()
  constructor(public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router, public print: PrintService) { }

  async ngOnInit() {
    this.current_date.setHours(0, 0, 0, 0);

    this.ReceiptColumns = ['id', 'receipt_no', 'recipient_name', 'receipt_date', 'description', 'amount','tax_amount', 'payment_method', 'Action'];
    this.getDisplayedColumns();
    if (this.InvoiceID) {
      let invoice = await this.finance.getInvoice(Number(this.InvoiceID))
      if (invoice.pending_amount <= 0)
        this.Add_Receipt = false
      this.Receipts = invoice?.Receipts
    } else {
      if (this.FromFees) {
        this.Receipts = await (await this.finance.getInvoice(Number(this.InvoiceID))).Receipts
      } else {
        if(this.admindashboard == true){
          this.Receipts = await this.finance.getAllReceiptsWithRange({
            start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).startOf('day').toJSDate(),
            end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('day').toJSDate()
          }, this.getall)
        }else{
          this.Receipts = await this.finance.getAllReceiptsWithRange({
            start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).startOf('month').toJSDate(),
            end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('month').toJSDate()
          }, this.getall)
        }
  
      }
    }
  
    this.receiptList = new MatTableDataSource(this.Receipts);
    this.receiptList.paginator = this.tablePaginator;
    if (this.selectedReceipt && this.showSelected) {
      let selectedIds = this.selectedReceipt.map(dt => dt.id);
      this.selection = new SelectionModel<Receipt>(true, [
        ...this.receiptList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  async add() {
    if (this.Add_Receipt) {

      const modal = await this.modalController.create({ component: AddReceiptModal, cssClass: 'responsiveModal', componentProps: { clientID: this.clientID, CaseID: this.CaseID, InvoiceID: this.InvoiceID } });
      modal.onWillDismiss().then(res => {
        this.ngOnInit()
        this.newReceiptEvent.emit();
        //this.child.ngOnInit()

      });
      return await modal.present();
    } else {
      let confirm = await this.app.presentConfirmAlert("Operations.Sorry", "Finance.Receipt.Errors.paid", "Operations.Cancel", "Operations.Ok", true)
    }

  }

  async details(row) {
    const modal = await this.modalController.create({ component: ReceiptDetailModal, cssClass: 'responsiveModal', componentProps: { ReceiptID: row.id, clientID: this.clientID } });
    modal.onWillDismiss().then(res => {
      this.ngOnInit()
    });
    return await modal.present();

  }

  getDisplayedColumns() {
    return this.app.isDesktop ? this.ReceiptColumns : this.ReceiptColumns
  }
 
  applyFilter() {
    //this.caseList.filterPredicate=null
      this.receiptList.filterPredicate = (data, filter) => {
        //console.log(data)
        return data.Invoice?.recipient_name?.toLocaleLowerCase().includes(filter) ||
        data?.Invoice?.client?.full_name.toLocaleLowerCase().includes(filter) ||
        data?.Invoice?.company?.full_name.toLocaleLowerCase().includes(filter) ||
        data?.receipt_no.toLocaleLowerCase().includes(filter) ||
        data?.Invoice?.invoice_no.toLocaleLowerCase().includes(filter) 

      }
      this.receiptList.filter = this.searchTerm.trim().toLowerCase();
  }

  async openReceipt(reciept) {
    this.print.openFinanceReceipt(reciept)
  }

  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Receipt.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.finance.deleteReceipt(row.id).then(()=>{
        this.ngOnInit()
        this.newReceiptEvent.emit()
      })
    }
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
  selector: 'add-receipt',
  templateUrl: './add-receipt.html',
})
export class AddReceiptModal implements OnInit {
  @Input('clientID') clientID: number;
  @Input('CaseID') CaseID: number;
  @Input('InvoiceID') InvoiceID: number;
  isDisabled: boolean = false
  isLoading = true;
  addForm: FormGroup;
  addDetailForm: FormGroup;
  invoiceUpdateForm: FormGroup;
  invoice: Invoice[];
  receipt_temp_data: {
    "is_checked": boolean,
    "invoice_id": number,
    "invoice_no": string,
    "invoice_date": Date,
    "amount": number,
    "amount_paid": number,
  }[] = [];
  tagsList: [];
  isEditMode = false;
  isCheque = false;
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
  forms = []
  today = new Date();
  amount_paid: number = 0
  selectedInvoice: Invoice
  pending_amount: number = 0
  caseInvoice: Invoice
  validation_messages: any;
  Add_recipt: boolean = true

  filteredCompanies
  cases
  ClientFilterCtrl
  filteredClients
  companies: Company[];
  clients: Client[];
  tax_percentage: number;
  constructor(private dateAdapter: DateAdapter<Date> ,private navCtrl: NavController, private router: Router, public modalController: ModalController, public court: CourtService, private app: AppService, fb: FormBuilder, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

    this.addForm = fb.group({
      cust_clientID: [null,],
      companyID: [null,],
      recipient_name: ['',],
      receipt_date: ['', [Validators.required]],
      description: ['',],
      cheque_date: [''],
      drawn_on: [''],
      cheque_number: [''],
      amount: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
      invoiceID: [null,]

    });

    this.addDetailForm = fb.group({
      receiptID: ['', [Validators.required]],
      invoiceID: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    });
    this.invoiceUpdateForm = fb.group({
      id: [''],
      pending_amount: ['']
    });
  }
  async ngOnInit() {
    let d = new Date();

    this.validation_messages = {
      'cust_clientID': [
        { type: 'required', message: 'Finance.Receipt.messages.Client.required' },
      ],
      'amount': [
        { type: 'required', message: 'Finance.Receipt.messages.amount.required' },
      ],
      'payment_method': [
        { type: 'required', message: 'Finance.Receipt.messages.payment_method.required' },
      ],
      'cheque_date': [
        { type: 'required', message: 'Finance.Receipt.messages.cheque_date.required' },
      ],
      'drawn_on': [
        { type: 'required', message: 'Finance.Receipt.messages.drawn_on.required' },
      ],
      'cheque_number': [
        { type: 'required', message: 'Finance.Receipt.messages.cheque_number.required' },
      ]
      ,
      'receipt_date': [
        { type: 'required', message: 'Finance.Invoice.messages.due_date.required' },

      ]

    }


    this.clients = await this.court.getClientForList()
    this.filteredClients = this.clients
    this.addForm.get('receipt_date').setValue(this.today)
    this.addForm.get('payment_method').setValue('Cash')
    this.addForm.get('cheque_date').setValue(null)
    if (this.InvoiceID) {
      this.selectedInvoice = await this.finance.getInvoice(Number(this.InvoiceID));
      this.tax_percentage = this.selectedInvoice.InvoiceItems[0].item.taxcode.percentage
      this.addForm.get('cust_clientID').setValue(this.clientID)
      this.addForm.get('amount').setValue(this.selectedInvoice?.pending_amount)
      this.addForm.get('invoiceID').setValue(this.selectedInvoice?.id),
      this.pending_amount = Number((this.selectedInvoice.pending_amount).toFixed(2))
      this.addForm.get('amount').setValue(this.pending_amount)
      this.addForm.get('invoiceID').setValue(this.selectedInvoice?.id)
    }
    else if (this.InvoiceID == null && this.clientID != null) {
      this.invoice = [];
      this.receipt_temp_data = [];
      this.invoice = await this.finance.getInvoiceForCustomer(this.clientID);

      this.caseInvoice = await this.court.getCaseInvoice(this.CaseID);
      

      this.getCaseInvoice()

      this.invoice.forEach(element => {
        let data = {
          "is_checked": false,
          "invoice_id": element.id,
          "invoice_no": element.invoice_no,
          "invoice_date": element.invoice_date,
          "amount": element.net_amount,
          "amount_paid": 0,
        }
        this.receipt_temp_data.push(data);
      });

      this.addForm.get('cust_clientID').setValue(this.clientID)
      this.addForm.get('amount').setValue(Number((this.caseInvoice?.pending_amount).toFixed(2)))
      this.addForm.get('invoiceID').setValue(this.caseInvoice?.id)




    }

    this.addDetailForm.setValue({
      receiptID: "",
      invoiceID: this.InvoiceID ? this.InvoiceID : null,
      amount: ""
    })
    this.invoice = [];
    this.isLoading = false;
  }
  async typechanged(event) {
    this.cases = []
    if (event.value == 'Company' && !this.companies) {
      this.companies = await this.court.getCompanyForList()
      this.filteredCompanies = this.companies
    }
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
  async setAmount(event) {
    if (this.InvoiceID) {
      this.selectedInvoice = await this.finance.getInvoice(this.InvoiceID);

    }
    if (this.caseInvoice) {
      this.selectedInvoice = await this.finance.getInvoice(this.caseInvoice.id);

    } else {
      this.selectedInvoice = await this.finance.getInvoice(event.value);

    }
    this.tax_percentage = this.selectedInvoice.InvoiceItems[0].item.taxcode.percentage
    this.pending_amount = this.selectedInvoice.pending_amount
    this.addForm.get('amount').setValue(Number((this.pending_amount).toFixed(2)))
    this.addForm.get('invoiceID').setValue(this.selectedInvoice?.id)
  }




  async getCaseInvoice() {

    this.pending_amount = this.caseInvoice.pending_amount
    this.amount_paid += this.caseInvoice.pending_amount
    if (this.amount_paid != this.pending_amount) {
      this.pending_amount = this.pending_amount - this.amount_paid
    }
    //this.pending_amount= this.selectedInvoice.pending_amount - this.amount_paid
    this.addForm.get('amount').setValue(this.amount_paid)
  }
  async getInvoice(event) {
    if (event.value == 0) {
      this.invoice = [];
      this.receipt_temp_data = [];
    }
    else {
      this.invoice = await this.finance.getInvoiceForCustomer(event.value);
      this.invoice.forEach(element => {
        let data = {
          "is_checked": false,
          "invoice_id": element.id,
          "invoice_no": element.invoice_no,
          "invoice_date": element.invoice_date,
          "amount": element.net_amount,
          "amount_paid": 0,
        }
        this.receipt_temp_data.push(data);
      });
    }
  }

  async add() {
    let data = this.addForm.value;
    if (this.addForm.valid) {

      if (data.amount > this.pending_amount) {
        let confirm = await this.app.presentConfirmAlert("Operations.Sorry", "Finance.Receipt.Errors.over", "Operations.Cancel", "Operations.Ok", true)
      }
      else {
        await this.app.presentLoading();
        await this.finance.AddReceipt(data);
        await this.app.dismissLoading();
        this.dismiss();
        this.ngOnInit()
      }


    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
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
  public filterClientlist(value) {
    return this.filteredClients = this.clients.filter((val) => {
      return val.full_name?.toLowerCase().includes(this.ClientFilterCtrl.value);
    })
  }
  valueChanged(event) {
    if (event.value == 'Client') {
      this.addForm.controls['cust_clientID'].setValidators([Validators.required]);
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('companyID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else if (event.value == 'Company') {
      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([Validators.required]);
      this.addForm.controls['recipient_name'].setValidators([])
      this.addForm.get('cust_clientID').setValue('')
      this.addForm.get('recipient_name').setValue('')
    }
    else {
      this.addForm.controls['clientID'].setValidators([])
      this.addForm.controls['companyID'].setValidators([])
      this.addForm.controls['recipient_name'].setValidators([Validators.required]);
      this.addForm.get('cust_clientID').setValue('')
      this.addForm.get('companyID').setValue('')
    }
  }

  clearSelectionClient() {
    this.filteredClients = this.clients
  }
  async getCasesForCompany(event) {
    if (event.value == 0) {
      this.cases = [];
    }
    else {
      this.cases = await this.court.getCaseForCompanyList(event.value)
    }
  }
  public filterCompanylist(value) {
    return this.filteredCompanies = this.companies.filter((val) => {
      return val.full_name?.toLowerCase().includes(this.ClientFilterCtrl.value);
    })
  }

  clearSelectionCompany() {
    this.filteredCompanies = this.companies
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}



@Component({
  selector: 'receipt-detail',
  templateUrl: './receipt-detail.html',
})
export class ReceiptDetailModal implements OnInit {
  Receipt: any;
  ReceiptDetail: ReceiptDetail[];
  Description: any
  @Input('isAdd') isAdd: boolean = false;
  InvoiceColumns: string[];
  @Input("ReceiptID") ReceiptID: number;
  @Input('Receipts') Receipts: Receipt[];
  @Input('clientID') clientID: number;

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

  constructor(private navCtrl: NavController, private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService,
  ) { }
  async ngOnInit() {
    //this.id = this.route.snapshot.params.id;
    this.Receipt = await this.finance.getReceipt(this.ReceiptID);
    this.ReceiptDetail = await this.finance.getAllReceiptDetails(this.ReceiptID);
    this.isLoading = false;
  }

  async ngOnChanges() {
    // this.id = this.route.snapshot.params.id;
    this.Receipt = await this.finance.getReceipt(this.ReceiptID);
    this.ReceiptDetail = await this.finance.getAllReceiptDetails(this.ReceiptID);
  }

  async ngAfterViewInit() {
    //this.id = this.route.snapshot.params.id;
    this.Receipt = await this.finance.getReceipt(this.ReceiptID);
    this.ReceiptDetail = await this.finance.getAllReceiptDetails(this.ReceiptID);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
