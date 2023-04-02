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
import { AccountCode } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { AccountType } from '../../../interfaces/types';

@Component({
  selector: 'account-code-list',
  templateUrl: './account-code-list.component.html',
  styleUrls: ['./account-code-list.component.scss'],
})
export class AccountCodeListComponent implements OnInit {
  @Input('AccountCodes') AccountCodes: AccountCode[];
  @Input('isAdd') isAdd: boolean = false;
  AccountCodeColumns: string[];
  @Input('selectedAccountCode') selectedAccountCode: AccountCode[];
  accountCodeList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<AccountCode>(true, []);
  @ViewChild('AccountCodeTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status:string;
  
  constructor(public modalController: ModalController,public app: AppService,public finance:FinanceService,public authz: AuthzService,private router: Router) { }

  ngOnInit() {
    this.AccountCodeColumns = ['id','account_type','acc_code','description','Action'];
    this.getDisplayedColumns();
    this.accountCodeList = new MatTableDataSource(this.AccountCodes);
    this.accountCodeList.paginator = this.tablePaginator;
    if (this.selectedAccountCode && this.showSelected) {
      let selectedIds = this.selectedAccountCode.map(dt => dt.id);
      this.selection = new SelectionModel<AccountCode>(true, [
        ...this.accountCodeList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  ngOnChanges() {
    this.accountCodeList.data = this.AccountCodes
  }

  ngAfterViewInit() {
    this.accountCodeList = new MatTableDataSource(this.AccountCodes);
    this.accountCodeList.paginator = this.tablePaginator;
    this.accountCodeList.sort = this.sort;
  }

  async add() {
    const modal = await this.modalController.create({ component: AddAccountCodeModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
    return await modal.present();
  }

  async details(row) {

    this.router.navigate(['/finance/account-code-detail', row.id])

  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  getDisplayedColumns() {
    return this.app.isDesktop ? this.AccountCodeColumns : this.AccountCodeColumns.filter(dt => dt !== 'Action');
  }
  applyFilter() {
    this.accountCodeList.filter = this.searchTerm.trim().toLowerCase();
  }

  async delete(row) {

    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete the Account Codes ?", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      console.log('delete' + row.id)

      this.finance.deleteAccountCode(row.id)

    }
  }

}

@Component({
  selector: 'add-account-code',
  templateUrl: './add-account-code.html',
})
export class AddAccountCodeModal implements OnInit {

  isLoading = true;
  AddTags:boolean
  segment: number;
  addForm: FormGroup;
  accountTypes: AccountType[];
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
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService ) {


    this.addForm = fb.group({
      acc_typeID: ['', [Validators.required]],
      acc_code_en: ['', [Validators.required]],
      acc_code_ar: ['', [Validators.required]],
      description_en: ['', [Validators.required]],
      description_ar: ['', [Validators.required]]
    });

  }
  async ngOnInit() {

    this.accountTypes = await this.finance.getAllAccountTypes()
    this.addForm.setValue({
      acc_typeID: "",
      acc_code_en: "",
      acc_code_ar: "",
      description_en: "",
      description_ar: ""
    })

  }


  async add() {
    if (this.addForm.valid) {
     // await this.app.presentLoading();
      let {...data } = this.addForm.value;
      try {
        await this.addForm.setValue({
          acc_typeID: data.acc_typeID,
          acc_code_en: data.acc_code_en,
          acc_code_ar: data.acc_code_ar,
          description_en: data.description_en,
          description_ar: data.description_ar
        })

      
        let forming = this.addForm.value 
         console.log(forming)
     await this.finance.AddAccountCode(forming)
        //await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      //await this.app.dismissLoading();
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
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'account-code-details',
  templateUrl: './account-code-details.html',
})
export class AccountCodeDetailsModal implements OnInit {
  AccountCode: AccountCode;
  id: number;
  Description:any
    @Input('isAdd') isAdd: boolean = false;
    AccountCodeColumns: string[];
   
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
       this.AccountCode=await this.finance.getAccountCode(this.id);
     console.log(this.AccountCode)
    }
  
    async ngOnChanges() {
      this.id = this.route.snapshot.params.id;
      console.log()
           this.AccountCode=await this.finance.getAccountCode(this.id);
    }
  
    async ngAfterViewInit() {
      this.id = this.route.snapshot.params.id;
      console.log()
           this.AccountCode=await this.finance.getAccountCode(this.id);
    }
  
    async activate(id, ev) {
      console.log(id);
      console.log(ev);
  
    }
  
    async update() {
      console.log("this.")
  
      console.log(this.AccountCode)
      const modal = await this.modalController.create({ component: UpdateAccountCodeModal, cssClass: 'responsiveModal', componentProps: { AccountCode: this.AccountCode } });
      return await modal.present();
  
    }
  
    
  
    dismiss() {
      this.router.navigate(['finance/account-code'])
  
    }
}

@Component({
  selector: 'update-account-code',
  templateUrl: './update-account-code.html',
})
export class UpdateAccountCodeModal implements OnInit {
  @Input('AccountCode') AccountCode: AccountCode;
  isLoading = true;
  accountTypes: AccountType[];
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  tags:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService,  public lang: LanguageService,) {


    this.addForm = fb.group({
      id: ['', [Validators.required]],
      acc_typeID: ['', [Validators.required]],
      acc_code_en: ['', [Validators.required]],
      acc_code_ar: ['', [Validators.required]],
      description_en: ['', [Validators.required]],
      description_ar: ['', [Validators.required]]
    });

  }
  async ngOnInit() {
    console.log("new data");
    console.log(this.AccountCode);
    
    this.accountTypes = await this.finance.getAllAccountTypes()
    this.addForm.setValue({
      id: this.AccountCode.id,
      acc_typeID: this.AccountCode.acc_typeID,
      acc_code_en: this.AccountCode.acc_code_en,
      acc_code_ar: this.AccountCode.acc_code_ar,
      description_en: this.AccountCode.description_en,
      description_ar: this.AccountCode.description_ar
    })

  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
     console.log('update data',data);
     
      try {
        let user = await this.finance.UpdateAccountCode(data)
        await this.app.dismissLoading();

        this.dismiss();
        this.AccountCode= await this.addForm.value;
        this.ngOnInit()
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
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
