import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
// import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
// import { EditorComponent } from '@tinymce/tinymce-angular';
import { DateTime } from 'luxon';
import { Expense } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { CourtService } from 'src/app/services/court.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { Supplier, Item, ExpenseDetail } from '../../../interfaces/types';
import { MatDatepicker } from '@angular/material/datepicker';

export const APP_DATE_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric'}},
  display: {
      dateInput: {month: 'short', year: 'numeric'},
      monthYearLabel: {year: 'numeric'}
  }
};
@Component({
  selector: 'expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
  providers: [{
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
 }]
})
export class ExpenseListComponent implements OnInit {

  @Input('Expenses') Expenses: Expense[];
  @Input('isAdd') isAdd: boolean = false;
  ExpenseColumns: string[];
  @Input('selectedExpense') selectedExpense: Expense[];
  expenseList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Expense>(true, []);
  @ViewChild('ExpenseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status: string;
  selectedDate = new FormControl(new Date());
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  getall = false

  constructor(public modalController: ModalController, private dateAdapter: DateAdapter<Date>, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { 
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }
  async ngOnInit() {

    this.Expenses = await this.finance.getAllExpensesWithRange({
      start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).startOf('month').toJSDate(),
      end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('month').toJSDate()
    }, this.getall);
    this.ExpenseColumns = ['id', 'expense_no', 'expense_date', 'gross_amount', 'tax_amount', 'net_amount', 'supplier','details', 'Action'];
    this.getDisplayedColumns();
    this.expenseList = new MatTableDataSource(this.Expenses);
    this.expenseList.paginator = this.tablePaginator;
    if (this.selectedExpense && this.showSelected) {
      let selectedIds = this.selectedExpense.map(dt => dt.id);
      this.selection = new SelectionModel<Expense>(true, [
        ...this.expenseList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }
  async  ngOnChanges() {
    this.Expenses = await this.finance.getAllExpenses();
    this.expenseList.data = this.Expenses
  }
  ngAfterViewInit() {
    this.expenseList = new MatTableDataSource(this.Expenses);
    this.expenseList.paginator = this.tablePaginator;
    this.expenseList.sort = this.sort;
  }

  async add() {

    const modal = await this.modalController.create({ component: AddExpenseModal, cssClass: 'responsiveModal',  });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present(); 
  }

  async details(row) {
    const modal = await this.modalController.create({ component: UpdateExpenseModal, cssClass: 'responsiveModal' ,componentProps: { ExpenseId:  row.id } });
    modal.onWillDismiss().then(res => {
      this.ngOnInit()
    });
    return await modal.present();

  }

  getDisplayedColumns() {
    return this.ExpenseColumns
  }
  applyFilter() {
    this.expenseList.filter = this.searchTerm.trim().toLowerCase();
  }


  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Expense.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.finance.deleteExpense(row.id)
      this.ngOnInit()
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
  selector: 'add-expense',
  templateUrl: './add-expense.html',
})
export class AddExpenseModal implements OnInit {
  isLoading = true;
  addForm: FormGroup;
  addDetailForm: FormGroup;
  transectionForm: FormGroup;
  transectionDetailForm: FormGroup;
  expenseDetails: ExpenseDetail[];
  suppliers: Supplier[];
  isCheque = false;
  validation_messages:any
  today = new Date()
  constructor(public modalCtrl: ModalController,private router: Router, public modalController: ModalController, private app: AppService, public court: CourtService, fb: FormBuilder, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService) {
    this.addForm = fb.group({
      expense_date: ['',],
      supplierID: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      expense_status: ['', [Validators.required]],
      cheque_date: [''],
      details:[''],
      drawn_on: [''],
      cheque_number: [''],
    });

    this.addDetailForm = fb.group({
      expenseID: ['', [Validators.required]],
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      description: [''],
    });

  
  }

  async ngOnInit() {
    this.validation_messages = {
      'Supplier': [
        { type: 'required', message: 'Finance.Expense.messages.Supplier.required'},
      ],
      'expense_status': [
        { type: 'required', message: 'Finance.Expense.messages.expense_status.required' },
      ],
      
      'payment_method': [
        { type: 'required', message: 'Finance.Expense.messages.payment_method.required' },
      ],
      'cheque_date': [
        { type: 'required', message: 'Finance.Expense.messages.cheque_date.required'},
      ],
      'drawn_on': [
        { type: 'required', message: 'Finance.Expense.messages.drawn_on.required' },
      ],
      'cheque_number': [
        { type: 'required', message: 'Finance.Expense.messages.cheque_number.required' },
      ]
 
    }
    
    
    let d = new Date();
    this.suppliers = await this.finance.getAllSuppliers()
    this.addForm.setValue({
      expense_date:this.today,
      supplierID: "",
      payment_method: "Cash",
      gross_amount: "0",
      tax_amount: "0",
      net_amount: "0",
      details:"",
      expense_status: "Pending",
      cheque_date: null,
      drawn_on: "",
      cheque_number: "",
    })
    this.expenseDetails = [];
    this.addForm.valueChanges.subscribe(val => {
    })
    this.isLoading = false;

    
  }

  calculate() {
    let gross_amount = 0;
    let tax_amount = 0;
    let net_amount = 0;
    this.expenseDetails.forEach((val) => {
      gross_amount += val.gross_amount;
      tax_amount += val.tax_amount;
      net_amount += val.net_amount;
    });

    this.addForm.get('gross_amount').setValue(gross_amount);
    this.addForm.get('tax_amount').setValue(tax_amount);
    this.addForm.get('net_amount').setValue(net_amount);
  }
  async addOrEditDetails(itemIndex, itemId) {
    const modal = await this.modalController.create({ component: AddExpenseDetailModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(res => {
      if (res.data.data.expense_details) {
        this.expenseDetails.push(res.data.data.expense_details)
        this.calculate();
      }
    });
    return await modal.present();
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

  async add() {
    if (this.addForm.valid && this.expenseDetails.length > 0) {
      await this.app.presentLoading();
      let { ...data } = this.addForm.value;
      try {

        this.addForm.setValue({
          expense_date:data.expense_date,
          supplierID: parseInt(data.supplierID),
          payment_method: data.payment_method,
          gross_amount: data.gross_amount,
          tax_amount: data.tax_amount,
          net_amount: data.net_amount,
          details:data.details,
          expense_status: data.expense_status,
          cheque_date: data.cheque_date,
          drawn_on: data.drawn_on,
          cheque_number: data.cheque_number,
        })
        let forming = this.addForm.value
        let expenseData = await this.finance.AddExpense(forming);

        this.expenseDetails.forEach(async element => {
          this.addDetailForm.setValue({
            expenseID: expenseData.id,
            itemID: parseInt(element.itemID.toString()),
            gross_amount: element.gross_amount,
            tax_amount: element.tax_amount,
            net_amount: element.net_amount,
            description: element.description,
          })
       
          let detail_forming = this.addDetailForm.value
          await this.finance.AddExpenseDetail(detail_forming);
        });

        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {

      if(this.expenseDetails.length == 0){
        let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Expense.Errors.Add_item", "Operations.Cancel", "Operations.Ok", true)

      }
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  async delete(index) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Item.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)

    if (confirm) {
      this.expenseDetails.splice(index, 1);
      this.calculate()
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
   
    });
  }
}

@Component({
  selector: 'expense-detail',
  templateUrl: './expense-detail.html',
})
export class ExpenseDetailModal implements OnInit {
  Expense: Expense;
  ExpenseDetail: ExpenseDetail[];
  id: number;
  Description: any
  expenseDetail:any
  @Input('isAdd') isAdd: boolean = false;
  @Input('ExpenseId') ExpenseId: number 

  
  ExpenseColumns: string[];

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
    this.id = this.ExpenseId;
    if (this.id) {
      this.Expense = await this.finance.getExpense(this.id);
      this.ExpenseDetail = await this.finance.getAllExpenseDetails(this.id);
      this.isLoading = false;

    } else {
      console.log("There are no Id");
      this.router.navigateByUrl("finance/expense")

    }
  }

  async ngOnChanges() {
    this.id = this.ExpenseId;
    this.Expense = await this.finance.getExpense(this.id);
    this.ExpenseDetail = await this.finance.getAllExpenseDetails(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.ExpenseId;
    this.Expense = await this.finance.getExpense(this.id);
    this.ExpenseDetail = await this.finance.getAllExpenseDetails(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);
  }

  async update() {
    this.router.navigate(['/finance/update-expense', this.id])
  }

 

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
   
    });
  }
}

@Component({
  selector: 'add-expense-detail',
  templateUrl: './add-expense-detail.html',
})
export class AddExpenseDetailModal implements OnInit {
  SelectedItem:Item;
  isLoading = true;
  AddTags: boolean
  segment: number;
  addForm: FormGroup;
  items: Item[];
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
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private route: ActivatedRoute, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {
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
        { type: 'required', message: 'Finance.Expense.messages.Item.required'},
      ],
      'gross_amount': [
        { type: 'required', message: 'Finance.Expense.messages.gross_amount.required' },
      ]
 
    }
    this.items = await this.finance.getExpenceItems()


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
    this.SelectedItem=this.items[event.value]
    this.addForm.get('item_name').setValue(this.items[event.value].name);
    this.addForm.get('gross_amount').setValue(this.items[event.value].rate);
    this.addForm.get('tax_amount').setValue((this.items[event.value].taxcode.percentage / 100) * this.addForm.get('gross_amount').value);
    this.addForm.get('net_amount').setValue(((this.items[event.value].taxcode.percentage / 100) * this.items[event.value].rate) + this.addForm.get('gross_amount').value);

  }

  updateTextBox() {
    this.addForm.get('tax_amount').setValue((this.SelectedItem.taxcode.percentage / 100) * this.addForm.get('gross_amount').value);

    this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"].value+this.addForm.controls["gross_amount"].value);
  }

  update_net_amount() {

    this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"].value+this.addForm.controls["gross_amount"].value);
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
        expense_details: null
      }
    });
  }
}


@Component({
  selector: 'update-expense',
  templateUrl: './update-expense.html',
})
export class UpdateExpenseModal implements OnInit {
  @Input('ExpenseId') ExpenseId: number 

  Expense: any;
  ExpenseDetails: ExpenseDetail[];
  suppliers: Supplier[];
  id: number;
  isLoading = true;
  segment: number;
  addForm: FormGroup;
  addDetailForm: FormGroup;
  tags: any;
  isCheque = false;
  validation_messages:any
  expenseDetail:any;
  constructor(public modalController: ModalController, public authz: AuthzService, private route: ActivatedRoute, public court: CourtService, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService, private router: Router) {
    this.addForm = fb.group({
      expense_date: ['',],
      id: ['',],
      supplierID: ['',],
      payment_method: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      expense_status: ['', [Validators.required]],
      cheque_date: [''],
      details:[''],
      drawn_on: [''],
      cheque_number: [''],
    });

    this.addDetailForm = fb.group({
      expenseID: ['', [Validators.required]],
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      description: [''],
    });

  
  }

  async ngOnInit() {
    this.validation_messages = {
      'Supplier': [
        { type: 'required', message: 'Finance.Expense.messages.Supplier.required'},
      ],
      'expense_status': [
        { type: 'required', message: 'Finance.Expense.messages.expense_status.required' },
      ],
      
      'payment_method': [
        { type: 'required', message: 'Finance.Expense.messages.payment_method.required' },
      ],
      'cheque_date': [
        { type: 'required', message: 'Finance.Expense.messages.cheque_date.required'},
      ],
      'drawn_on': [
        { type: 'required', message: 'Finance.Expense.messages.drawn_on.required' },
      ],
      'cheque_number': [
        { type: 'required', message: 'Finance.Expense.messages.cheque_number.required' },
      ]
 
    }
     //this.id = this.route.snapshot.params.id;

     this.Expense = await this.finance.getExpense(this.ExpenseId);
 
     this.ExpenseDetails = await this.finance.getAllExpenseDetails(this.ExpenseId);
     this.expenseDetail = [];
     for (let i = 0; i < this.ExpenseDetails.length; i++) {
       this.expenseDetail.push({
         itemID: this.ExpenseDetails[i].item.id,
         gross_amount: this.ExpenseDetails[i].gross_amount,
         tax_amount: this.ExpenseDetails[i].tax_amount,
         net_amount: this.ExpenseDetails[i].net_amount,
         item_name: this.ExpenseDetails[i].item.name,
         description: this.ExpenseDetails[i].description
       })
     }
     this.calculate()
 
     this.suppliers = await this.finance.getAllSuppliers()
 
     this.addForm.setValue({
       id: this.Expense.id,
       expense_date: this.Expense.expense_date,
       supplierID: this.Expense.supplierID,
       payment_method: this.Expense.payment_method,
       gross_amount: this.Expense.gross_amount,
       tax_amount: this.Expense.tax_amount,
       net_amount: this.Expense.net_amount,
       expense_status: this.Expense.expense_status,
       cheque_date: this.Expense.cheque_date,
       drawn_on: this.Expense.drawn_on,
       cheque_number: this.Expense?.cheque_number ,
       details:this.Expense?.details
     })
 
     this.isLoading = false;
    

  }


  calculate() {
    let gross_amount = 0;
    let tax_amount = 0;
    let net_amount = 0;
    this.expenseDetail.forEach((val) => {
      gross_amount += val.gross_amount;
      tax_amount += val.tax_amount;
      net_amount += val.net_amount;
    });

    this.addForm.get('gross_amount').setValue(gross_amount);
    this.addForm.get('tax_amount').setValue(tax_amount);
    this.addForm.get('net_amount').setValue(net_amount);

    

  }
  async addOrEditDetails(itemIndex, itemId) {
    const modal = await this.modalController.create({ component: AddExpenseDetailModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(res => {
      if (res.data.data.expense_details) {
        this.expenseDetail.push(res.data.data.expense_details)
        this.calculate();
      }
    });
    return await modal.present();
  }



  async edit(row) {
    const modal = await this.modalController.create({
      component: UpdateExpenseDetailModal,
      cssClass: 'responsiveModal',
      componentProps: { ExpenseDetail: row }
    });
    await modal.present();
    modal.onDidDismiss().then(async dt => {
      this.ExpenseDetails = await this.finance.getAllExpenseDetails(this.id);
      this.calculate();
    })
  }

  async delete(index) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Item.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)

    if (confirm) {
      this.expenseDetail.splice(index, 1);
      this.calculate()
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

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;

      try {
        await this.addForm.setValue({
          id: this.Expense.id,
          expense_date:data.expense_date,
          supplierID: parseInt(data.supplierID),
          payment_method: data.payment_method,
          gross_amount: data.gross_amount,
          tax_amount: data.tax_amount,
          net_amount: data.net_amount,
          expense_status: data.expense_status,
          cheque_date: data.cheque_date,
          drawn_on: data.drawn_on,
          cheque_number: data.cheque_number ,
          details:data.details


       
        })
        let forming = this.addForm.value

        let InvoiceObject = {
          data: forming, items: this.expenseDetail

        }

        
        await this.finance.UpdateExpense( this.ExpenseId ,InvoiceObject)
        await this.app.dismissLoading();

 
        this.dismiss();

      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
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

  dismiss() {
    //this.router.navigate(['/finance/expense-detail', this.id])
    this.modalController.dismiss()
  }
}

@Component({
  selector: 'update-expense-detail',
  templateUrl: './update-expense-detail.html',
})
export class UpdateExpenseDetailModal implements OnInit {
  @Input('ExpenseDetail') ExpenseDetail: ExpenseDetail;
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

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {


    this.addForm = fb.group({
      id: ['', [Validators.required]],
      itemID: ['', [Validators.required]],
      gross_amount: ['', [Validators.required]],
      tax_amount: ['', [Validators.required]],
      net_amount: ['', [Validators.required]],
      description: [''],
    });

  }
  async ngOnInit() {

    this.items = await this.finance.getExpenceItems()
    this.item = await this.finance.getItem(this.ExpenseDetail.itemID)
    this.addForm.setValue({
      id: this.ExpenseDetail.id,
      itemID: this.ExpenseDetail.itemID,
      gross_amount: this.ExpenseDetail.gross_amount,
      tax_amount: this.ExpenseDetail.tax_amount,
      net_amount: this.ExpenseDetail.net_amount,
      description: this.ExpenseDetail.description,
    })
  }

  updatePrice(event) {
    if (event.value - 1 < 0) {
      this.addForm.get('itemID').setValue(this.ExpenseDetail.id);
      this.addForm.get('gross_amount').setValue("0");
      this.addForm.get('tax_amount').setValue("0");
      this.addForm.get('net_amount').setValue("0");
    }
    else {
      this.addForm.get('itemID').setValue(this.ExpenseDetail.id);
      this.addForm.get('gross_amount').setValue(this.items[event.value - 1].rate);
      this.addForm.get('tax_amount').setValue((this.items[event.value - 1].taxcode.percentage / 100) * this.items[event.value - 1].rate);
      this.addForm.get('net_amount').setValue(((this.items[event.value - 1].taxcode.percentage / 100) * this.items[event.value - 1].rate) + this.items[event.value - 1].rate);
    }
  }

  updateTextBox() {
    //this.addForm.controls["net_amount"].setValue(this.addForm.controls["tax_amount"]+this.addForm.controls["gross_amount"]);
  }

  async add() {

    this.addForm.get('id').setValue(this.ExpenseDetail.id);

    if (this.addForm.valid) {
      let data = this.addForm.value;

      try {
        let result = await this.finance.UpdateExpenseDetail(data)
        // await this.app.dismissLoading();
        await this.dismiss();
      } catch (e) {
        console.log(e);
      }
    }
    else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }

    //this.dismiss();
  }

  async dismiss() {
    await this.modalCtrl.dismiss({
      'dismissed': true,
    });
  }
}