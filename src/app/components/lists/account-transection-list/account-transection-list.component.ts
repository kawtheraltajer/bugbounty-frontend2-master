import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AccountCode, AccTransectionHeader, Expense, Invoice } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { AccTransectionDetail } from '../../../interfaces/types';

@Component({
  selector: 'account-transection-list',
  templateUrl: './account-transection-list.component.html',
  styleUrls: ['./account-transection-list.component.scss'],
})
export class AccountTransectionListComponent implements OnInit {
  @Input('AccTransectionHeaders') AccTransectionHeaders: AccTransectionHeader[];
  @Input('isAdd') isAdd: boolean = false;
  AccTransectionHeaderColumns: string[];
  @Input('selectedAccTransectionHeader') selectedAccTransectionHeader: AccTransectionHeader[];
  accTransectionHeaderList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<AccTransectionHeader>(true, []);
  @ViewChild('AccTransectionHeaderTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status: string;
  constructor(public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { }

  ngOnInit() {
    this.AccTransectionHeaderColumns = ['id', 'document_no', 'date','dr_cr' ,'cr','dr', 'document_type', 'amount', 'Action'];
    this.getDisplayedColumns();
    this.accTransectionHeaderList = new MatTableDataSource(this.AccTransectionHeaders);
    this.accTransectionHeaderList.paginator = this.tablePaginator;
    if (this.selectedAccTransectionHeader && this.showSelected) {
      let selectedIds = this.selectedAccTransectionHeader.map(dt => dt.id);
      this.selection = new SelectionModel<AccTransectionHeader>(true, [
        ...this.accTransectionHeaderList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  ngOnChanges() {
    this.accTransectionHeaderList.data = this.AccTransectionHeaders
  }

  ngAfterViewInit() {
    this.accTransectionHeaderList = new MatTableDataSource(this.AccTransectionHeaders);
    this.accTransectionHeaderList.paginator = this.tablePaginator;
    this.accTransectionHeaderList.sort = this.sort;
  }

  async add() {
    this.router.navigate(['/finance/add-transection'])
  }

  async details(row) {

    this.router.navigate(['/finance/transection-detail', row.id])

  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  getDisplayedColumns() {
    return this.app.isDesktop ? this.AccTransectionHeaderColumns : this.AccTransectionHeaderColumns.filter(dt => dt !== 'Action');
  }
  applyFilter() {
    this.accTransectionHeaderList.filter = this.searchTerm.trim().toLowerCase();
  }

  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete the Transection ?", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      console.log('delete' + row.id)
      this.finance.deleteAccountTransections(row.id)
    }
  }


}

@Component({
  selector: 'add-transection',
  templateUrl: './add-transection.html',
})
export class AddAccountTransectionModal implements OnInit {
  isLoading = true;
  AddTags: boolean
  segment: number;
  addForm: FormGroup;
  addDetailForm: FormGroup;
  accTransectionDetails: AccTransectionDetail[];
  tagsList: [];

  invoices: Invoice[];
  expenses: Expense[];
  today = new Date();
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
  constructor(private router: Router, public modalController: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService) {
    this.addForm = fb.group({
      document_no: ['', [Validators.required]],
      date: ['', [Validators.required]],
      document_type: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      status: ['', [Validators.required]],
      matchingstatus: [''],
      IdentifierId: ['', [Validators.required]]
    });

    this.addDetailForm = fb.group({
      transectionID: ['', [Validators.required]],
      account_codeID: ['', [Validators.required]],
      account_code_name: ['', [Validators.required]],
      dr_cr: ['', [Validators.required]],
      debit_amount: ['', [Validators.required]],
      credit_amount: ['', [Validators.required]],
      balance_amount: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    this.addForm.setValue({
      document_no: "",
      date: "",
      document_type: "",
      amount: "",
      status: "",
      matchingstatus: "",
      IdentifierId: "",
    })
    this.accTransectionDetails = [];
    this.invoices = await this.finance.getAllInvoices();
    this.expenses = await this.finance.getAllExpenses();
    this.addForm.valueChanges.subscribe(val => {
    })
  }

  calculate() {
    // this.addForm.get('gross_amount').setValue(gross_amount);
    // this.addForm.get('tax_amount').setValue(tax_amount);
    // this.addForm.get('net_amount').setValue(net_amount);
  }

  updateAmount(event,char) {
    console.log(this.invoices[event.value - 1]);
    console.log(event);
    
    if (event.value == 0) {
      this.addForm.get('amount').setValue("0");
    }
    else {
      this.addForm.get('amount').setValue(this.invoices[event.value - 1].net_amount);
    }
  }

  async addOrEditDetails(itemIndex, id) {
    const modal = await this.modalController.create({ component: AddAccountTransectionDetailModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(res => {
      console.log(res);
      if (res.data.data.transection_details) {
        this.accTransectionDetails.push(res.data.data.transection_details)
        this.calculate();
      }
    });
    return await modal.present();
  }

  async add() {
    if (this.addForm.valid) {
      // await this.app.presentLoading();
      let { ...data } = this.addForm.value;
      console.log(data);

      try {
        await this.addForm.setValue({
          document_no: data.document_no,
          date: DateTime.fromJSDate(data.date).toISO(),
          document_type: parseInt(data.document_type),
          amount: data.amount,
          status: data.status,
          matchingstatus: data.matchingstatus,
          invoiceID: data.invoiceID,
          expenseID: data.expenseID,
        })
        let forming = this.addForm.value
        console.log(forming)
        let transectionHeaderData = await this.finance.AddAccountTransection(forming)
        console.log("Transection Inserted");
        this.accTransectionDetails.forEach(async element => {
          this.addDetailForm.setValue({
            transectionID: transectionHeaderData.id,
            account_codeID: element.account_code,
            dr_cr: element.dr_cr,
            debit_amount: element.debit_amount,
            credit_amount: element.credit_amount,
            balance_amount: element.balance_amount,
          })
          let detail_forming = this.addDetailForm.value
          console.log("detail");
          console.log(detail_forming);
          await this.finance.AddAccountTransectionDetail(detail_forming)
          console.log("Transection Detail Inserted");
        });

        // await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      // await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
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

  async delete(index) {
    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete the Item ?", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      console.log('delete index' + index)
      this.accTransectionDetails.splice(index, 1);
      this.calculate()
    }
  }

  dismiss() {
    this.router.navigate(['finance/expense'])
  }
}

@Component({
  selector: 'add-transection-detail',
  templateUrl: './add-transection-detail.html',
})
export class AddAccountTransectionDetailModal implements OnInit {
  isLoading = true;
  AddTags: boolean
  segment: number;
  addForm: FormGroup;
  account_codes: AccountCode[];
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

  constructor(public modalCtrl: ModalController, private route: ActivatedRoute, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {
    this.addForm = fb.group({
      account_codeID: ['', [Validators.required]],
      account_code_name: ['', [Validators.required]],
      dr_cr: ['', [Validators.required]],
      debit_amount: ['', [Validators.required]],
      credit_amount: ['', [Validators.required]],
      balance_amount: ['', [Validators.nullValidator]]
    });                                                    
  }

  async ngOnInit() {
    this.account_codes = await this.finance.getAllAccountCodes()
    this.addForm.setValue({
      account_codeID: "",
      dr_cr: "",
      debit_amount: "",
      credit_amount: "",
      account_code_name: "",
      balance_amount: ""
    })
    this.isLoading = false;
  }

  updatePrice(event) {
    if (event.value - 1 < 0) {
      this.addForm.get('account_codeID').setValue("0");
      this.addForm.get('account_code_name').setValue("");
      //   this.addForm.get('gross_amount').setValue("0");
      //   this.addForm.get('tax_amount').setValue("0");
      //   this.addForm.get('net_amount').setValue("0");
    }
    else {
      this.addForm.get('account_codeID').setValue(this.account_codes[event.value - 1].id);
      this.addForm.get('account_code_name').setValue(this.account_codes[event.value - 1].acc_code_en + " - " + this.account_codes[event.value - 1].acc_code_ar);
      //   this.addForm.get('gross_amount').setValue(this.items[event.value - 1].rate);
      //   this.addForm.get('tax_amount').setValue((this.items[event.value - 1].taxcode.percentage / 100) * this.items[event.value - 1].rate);
      //   this.addForm.get('net_amount').setValue(((this.items[event.value - 1].taxcode.percentage / 100) * this.items[event.value - 1].rate) + this.items[event.value - 1].rate);
    }
  }

  updateTextBox() {
    //this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"]+this.addForm.controls["gross_amount"]);
  }

  async add() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data: {
        transection_details: this.addForm.value
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data: {
        transection_details: null
      }
    });
  }
}

@Component({
  selector: 'transection-detail',
  templateUrl: './transection-detail.html',
})
export class AccountTransectionDetailModal implements OnInit {
  AccTransectionHeader: AccTransectionHeader;
  AccTransectionDeatils: AccTransectionDetail[];
  id: number;
  Description: any
  @Input('isAdd') isAdd: boolean = false;
  InvoiceColumns: string[];

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

  constructor(private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService,
  ) { }
  async ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.AccTransectionHeader = await this.finance.getAccountTransection(this.id);
    console.log(this.AccTransectionHeader)
    this.AccTransectionDeatils = await this.finance.getAllAccountTransectionDetails(this.id);
    console.log(this.AccTransectionDeatils)
    this.isLoading = false;
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.AccTransectionHeader = await this.finance.getAccountTransection(this.id);
    this.AccTransectionDeatils = await this.finance.getAllAccountTransectionDetails(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.AccTransectionHeader = await this.finance.getAccountTransection(this.id);
    this.AccTransectionDeatils = await this.finance.getAllAccountTransectionDetails(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);
  }

  dismiss() {
    this.router.navigate(['finance/account-transection'])
  }
}