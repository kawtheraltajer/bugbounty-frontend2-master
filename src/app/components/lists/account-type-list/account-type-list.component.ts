import { TypesPage } from './../../../pages/hcm/appraisal/types/types.page';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { AccountType } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'account-type-list',
  templateUrl: './account-type-list.component.html',
  styleUrls: ['./account-type-list.component.scss'],
})
export class AccountTypeListComponent implements OnInit {
  @Input('AccountTypes') AccountTypes: AccountType[];
  @Input('isAdd') isAdd: boolean = false;
  AccountTypeColumns: string[];
  @Input('selectedAccountType') selectedAccountType: AccountType[];
  accountTypeList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<AccountType>(true, []);
  @ViewChild('AccountTypeTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status:string;
  
  constructor(public lang: LanguageService,public modalController: ModalController,public app: AppService,public finance:FinanceService,public authz: AuthzService,private router: Router) { }

   async ngOnInit() {
    this.AccountTypes = (await this.finance.getAllAccountTypes());

    this.AccountTypeColumns = ['id','name','account_code','type','account_type','description','Action'];
    this.getDisplayedColumns();
    this.accountTypeList = new MatTableDataSource(this.AccountTypes);
    this.accountTypeList.paginator = this.tablePaginator;
    if (this.selectedAccountType && this.showSelected) {
      let selectedIds = this.selectedAccountType.map(dt => dt.id);
      this.selection = new SelectionModel<AccountType>(true, [
        ...this.accountTypeList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  async ngOnChanges() {
    this.AccountTypes = (await this.finance.getAllAccountTypes());

    this.accountTypeList.data = this.AccountTypes
  }

  ngAfterViewInit() {
    this.accountTypeList = new MatTableDataSource(this.AccountTypes);
    this.accountTypeList.paginator = this.tablePaginator;
    this.accountTypeList.sort = this.sort;
  }

  async add() {
    const modal = await this.modalController.create({ component: AddAccountTypeModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      console.log(data);
      this.ngOnInit()
    });
    return await modal.present();
  }

  async details(row) {

   // this.router.navigate(['/finance/account-type-detail', row.id])

  }

    
  async update(row) {

    console.log(row)
    const modal = await this.modalController.create({ component: UpdateAccountTypeModal, cssClass: 'responsiveModal', componentProps: { AccountType: row} });
    modal.onWillDismiss().then(data => {
      console.log(data);
      this.ngOnInit()
    });
    return await modal.present();
  }

  

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  getDisplayedColumns() {
    return this.AccountTypeColumns
  }
  applyFilter() {
    this.accountTypeList.filter = this.searchTerm.trim().toLowerCase();
  }

  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "    Finance.Account.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      console.log('delete' + row.id)

      this.finance.deleteAccountType(row.id)

    }
  }

}

@Component({
  selector: 'add-account-type',
  templateUrl: './add-account-type.html',
})
export class AddAccountTypeModal implements OnInit {
  isLoading = true;
  AddTags:boolean
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  tagsList:[];
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
  @ViewChild('previewComp') previewComp: EditorComponent;
  @ViewChild('#editorDiv') editorDiv: ElementRef;
  @ViewChild('#headerDiv') headerDiv: ElementRef;
  showAccountTypeList:boolean=true
AccountTypeList:any
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

  validation_messages: any;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService ) {



    this.addForm = fb.group({
      id: ['',],
      name_ar: ['',[Validators.required]],
      name_en: ['', [Validators.required]],
      account_code: ['',],
      type: ['', [Validators.required]],
      account_type: ['', [Validators.required]],
      description_en: ['', ],
      description_ar: ['', ],

    });

  }
  async ngOnInit() {
   
    this.showAccountTypeList=false
    this.validation_messages = {
      'name_ar': [
        { type: 'required', message: 'Finance.Account.messages.name_ar.required' },
      ],
      'name_en': [
        { type: 'required', message: 'Finance.Account.messages.name_en.required'},
      ],
      'account_code': [
        { type: 'required', message: 'Finance.Account.messages.account_code.required' },
      ],
      'type': [
        { type: 'required', message: 'Finance.Account.messages.type.required'},
      ],
      'account_type': [
        { type: 'required', message: 'Finance.Account.messages.account_type.required' },
      ]
    }

  }
  getTypeAccount(ev){
    this.AccountTypeList=[];
    this.showAccountTypeList=true
  
    if(   ev.value =="Assets")
    {
      this.AccountTypeList=[{name:'Cash',label:'Cash' },{ name:'Bank',label:'Bank'},{name:'Fixed Assets',label:'Fixed_Assets' },{name:'Stock',label:'Stock'},{name:'Payment Clearing',label:'Payment_Clearing'},{name:'Other Assets',label:'Other_Assets' },]
  
    }else  if( ev.value=="Liability"){
      this.AccountTypeList=[{name:'Long Term Liabililty',label:'Long_Term_Liabililty' },{ name:'Stock',label:'Stock'},{name:'Credit Card',label:'Credit_Card' },{name:'Other Liabililty',label:'Other_Liabililty'}]
  
  
    }
    else  if(ev.value=="Equity"){
      this.showAccountTypeList=false
      this.AccountTypeList=[{name:'Equity',label:'Equity' }]
  
  
    }
    else  if(ev.value=="Income"){
      this.AccountTypeList=[{name:'Income',label:'Income' },{name:'Other Income',label:'Other_Income' }]
  
  
    }  else  if(ev.value=="Expenes"){ 
      this.AccountTypeList=[{name:'Expenes',label:'Expenes' },{name:'Other Expenes',label:'Other_Expenes' }]
   
  
    }
  }
  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      try {
  
      
         console.log(data)
     await this.finance.AddAccountType(data)
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
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'account-type-details',
  templateUrl: './account-type-details.html',
})
export class AccountTypeDetailsModal implements OnInit {
  AccountType: AccountType;
  id: number;
  Description:any
    @Input('isAdd') isAdd: boolean = false;
    AccountTypeColumns: string[];
   
    @ViewChild(MatSort) sort: MatSort;
    isSearch = false;
    searchTerm = '';
    isEditMode = false;
    isHidden = true;
    newComment = '';
    editorData;
    previewData = ``;
    showComments = false;
    showCommentsHandle = true;
    sideHasBackdrop = true;
    sideMode: 'over' | 'push' | 'side' = 'over';
    onSave = () => {
      console.log('save');
    }
    @ViewChild('editorcomp') editorcomp: EditorComponent;
    @ViewChild('drawer') drawer: MatDrawer;
    @ViewChild('previewComp') previewComp: EditorComponent;
    @ViewChild('#editorDiv') editorDiv: ElementRef;
    @ViewChild('#headerDiv') headerDiv: ElementRef;
   
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
    constructor( private router: Router,public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService,public lang: LanguageService,
      ) { }
    async ngOnInit() {
      this.id = this.route.snapshot.params.id;
  console.log()
       this.AccountType=await this.finance.getAccountType(this.id);
     console.log(this.AccountType)
    }
  
    async ngOnChanges() {
      this.id = this.route.snapshot.params.id;
      console.log()
           this.AccountType=await this.finance.getAccountType(this.id);
    }
  
    async ngAfterViewInit() {
      this.id = this.route.snapshot.params.id;
      console.log()
           this.AccountType=await this.finance.getAccountType(this.id);
    }
  
    async activate(id, ev) {
      console.log(id);
      console.log(ev);
  
    }
  
    async update() {
      console.log("this")
      console.log(this.AccountType)
      const modal = await this.modalController.create({ component: UpdateAccountTypeModal, cssClass: 'responsiveModal', componentProps: { AccountType: this.AccountType } });
      return await modal.present();
    }
  
    
  
    dismiss() {
      this.router.navigate(['finance/account-type'])
  
    }
}

@Component({
  selector: 'update-account-type',
  templateUrl: './update-account-type.html',
})
export class UpdateAccountTypeModal implements OnInit {
  @Input('AccountType') AccountType: any;
  isLoading = true;
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  tags:any;
  AccountTypeList:any
  validation_messages:any
  showAccountTypeList:boolean=true
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService,  public lang: LanguageService,) {


    this.addForm = fb.group({
      id: ['',],
      name_ar: ['',[Validators.required]],
      name_en: ['', [Validators.required]],
      account_code: ['',],
      type: ['', [Validators.required]],
      account_type: ['', [Validators.required]],
      description_en: ['', ],
      description_ar: ['', ],

    });

  }
  async ngOnInit() {
    this.validation_messages = {
      'name_ar': [
        { type: 'required', message: 'Finance.Account.messages.name_ar.required' },
      ],
      'name_en': [
        { type: 'required', message: 'Finance.Account.messages.name_en.required'},
      ],
      'account_code': [
        { type: 'required', message: 'Finance.Account.messages.account_code.required' },
      ],
      'type': [
        { type: 'required', message: 'Finance.Account.messages.type.required'},
      ],
      'account_type': [
        { type: 'required', message: 'Finance.Account.messages.account_type.required' },
      ]
    }
    console.log("new data");
    console.log(this.AccountType);
    
    this.addForm.setValue({
      id: this.AccountType.id,
      name_ar: this.AccountType.name_ar,
      name_en: this.AccountType.name_en,
      account_code: this.AccountType.account_code,
      type: this.AccountType.type,
      account_type: this.AccountType.account_type,
      description_en: this.AccountType.description_en,
      description_ar:this.AccountType.description_ar,


    })
    if(   this.AccountType.account_type =="Assets")
    {
      this.AccountTypeList=[{name:'Cash',label:'Cash' },{ name:'Bank',label:'Bank'},{name:'Fixed Assets',label:'Fixed_Assets' },{name:'Stock',label:'Stock'},{name:'Payment Clearing',label:'Payment_Clearing'},{name:'Other Assets',label:'Other_Assets' },]

    }else  if(this.AccountType.account_type=="Liability"){
      this.AccountTypeList=[{name:'Long Term Liabililty',label:'Long_Term_Liabililty' },{ name:'Stock',label:'Stock'},{name:'Credit Card',label:'Credit_Card' },{name:'Other Liabililty',label:'Other_Liabililty'}]

  
    }
    else  if(this.AccountType.account_type=="Equity"){
      this.showAccountTypeList=false
      this.AccountTypeList=[{name:'Equity',label:'Equity' }]

  
    }
    else  if(this.AccountType.account_type=="Income"){
      this.AccountTypeList=[{name:'Income',label:'Income' },{name:'Other Income',label:'Other_Income' }]

  
    }  else  if(this.AccountType.account_type=="Expenes"){ 
      this.AccountTypeList=[{name:'Expenes',label:'Expenes' },{name:'Other Expenes',label:'Other_Expenes' }]
   
  
    }

  }

  
  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
     console.log('update data',data);
     
      try {
        let user = await this.finance.UpdateAccountType(data)
        await this.app.dismissLoading();

        this.dismiss();
        this.AccountType= await this.addForm.value;
        this.ngOnInit()


      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
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




getTypeAccount(ev){
  this.AccountTypeList=[];
  this.showAccountTypeList=true

  if(   ev.value =="Assets")
  {
    this.AccountTypeList=[{name:'Cash',label:'Cash' },{ name:'Bank',label:'Bank'},{name:'Fixed Assets',label:'Fixed_Assets' },{name:'Stock',label:'Stock'},{name:'Payment Clearing',label:'Payment_Clearing'},{name:'Other Assets',label:'Other_Assets' },]

  }else  if( ev.value=="Liability"){
    this.AccountTypeList=[{name:'Long Term Liabililty',label:'Long_Term_Liabililty' },{ name:'Stock',label:'Stock'},{name:'Credit Card',label:'Credit_Card' },{name:'Other Liabililty',label:'Other_Liabililty'}]


  }
  else  if(ev.value=="Equity"){
    this.showAccountTypeList=false
    this.AccountTypeList=[{name:'Equity',label:'Equity' }]


  }
  else  if(ev.value=="Income"){
    this.AccountTypeList=[{name:'Income',label:'Income' },{name:'Other Income',label:'Other_Income' }]


  }  else  if(ev.value=="Expenes"){ 
    this.AccountTypeList=[{name:'Expenes',label:'Expenes' },{name:'Other Expenes',label:'Other_Expenes' }]
 

  }
}
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
