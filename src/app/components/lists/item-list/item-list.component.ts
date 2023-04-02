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
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { Item, TaxCode, AccountCode } from '../../../interfaces/types';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {

  @Input('Items') Items: Item[];
  @Input('isAdd') isAdd: boolean = false;
  ItemColumns: string[];
  @Input('selectedItem') selectedItem: Item[];
  itemList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Item>(true, []);
  @ViewChild('ItemTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status: string;

  constructor(public lang: LanguageService,public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { }

  ngOnInit() {


    this.ItemColumns = ['id', 'name', 'type','account_TypeID', 'rate', 'Action'];
    this.getDisplayedColumns();
    this.itemList = new MatTableDataSource(this.Items);
    this.itemList.paginator = this.tablePaginator;
    if (this.selectedItem && this.showSelected) {
      let selectedIds = this.selectedItem.map(dt => dt.id);
      this.selection = new SelectionModel<Item>(true, [
        ...this.itemList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  ngOnChanges() {
    this.itemList.data = this.Items
  }

  ngAfterViewInit() {
    this.itemList = new MatTableDataSource(this.Items);
    this.itemList.paginator = this.tablePaginator;
    this.itemList.sort = this.sort;
  }

  async add() {
    const modal = await this.modalController.create({ component: AddItemModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
    return await modal.present();
  }

  async details(row) {

    this.router.navigate(['/finance/itemDetail', row.id])

  }

  
  async update(row) {

    const modal = await this.modalController.create({ component: UpdateItemModal, cssClass: 'responsiveModal', componentProps: { Item: row } });
    return await modal.present();

  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  getDisplayedColumns() {
    return this.app.isDesktop ? this.ItemColumns : this.ItemColumns.filter(dt => dt !== 'Action');
  }
  applyFilter() {
    this.itemList.filter = this.searchTerm.trim().toLowerCase();
  }

  async delete(row) {

    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Item.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      console.log('delete' + row.id)

      this.finance.deleteItem(row.id)

    }
  }
}



@Component({
  selector: 'add-Item',
  templateUrl: './add-Item.html',
})
export class AddItemModal implements OnInit {
  isLoading = true;
  AddTags: boolean
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  taxCodes: TaxCode[];
  accountCodes: AccountCode[];
  tagsList: [];
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
  AccountTypes:any
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {

    this.addForm = fb.group({
      name: ['', [Validators.required]],
      taxcodeID: ['', [Validators.required]],
      rate: ['', ],
      account_TypeID: ['', [Validators.required]],

    });

  }
  async ngOnInit() {
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'Finance.Item.messages.name.required' },
      ],
      'taxcodeID': [
        { type: 'required', message: 'Finance.Item.messages.taxcodeID.required'},
      ],
      'account_TypeID': [
        { type: 'required', message: 'Finance.Item.messages.account_TypeID.required' },
      ]
    }
    this.AccountTypes = await this.finance.getAllAccountTypes();
    this.taxCodes = await this.finance.getAllTaxCode()
    this.addForm.setValue({
      name: "",
      taxcodeID: "",
      rate: "",
      account_TypeID:""
    })
  }


  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let date = this.addForm.value;
      try {
        await this.finance.AddItem(date)
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
  selector: 'item-detail',
  templateUrl: './item-detail.html',
})
export class ItemDetailsModal implements OnInit {
  Item: Item;
  id: number;
  Description: any
  @Input('isAdd') isAdd: boolean = false;
  ItemColumns: string[];

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
  constructor(private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService,
  ) { }
  async ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.Item = await this.finance.getItem(this.id);
    console.log(this.Item)
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.Item = await this.finance.getItem(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.Item = await this.finance.getItem(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async update() {
    console.log("this.")

    console.log(this.Item)
    const modal = await this.modalController.create({ component: UpdateItemModal, cssClass: 'responsiveModal', componentProps: { Item: this.Item } });
    return await modal.present();

  }



  dismiss() {
    this.router.navigate(['finance/items'])

  }
}


@Component({
  selector: 'update-item',
  templateUrl: './update-item.html',
})
export class UpdateItemModal implements OnInit {

  @Input('Item') Item: any;
  isLoading = true;
  taxCodes: TaxCode[];
  accountCodes: AccountCode[];
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
  tags: any;
  AccountTypes:any;
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService,) {

    this.addForm = fb.group({
      id: ['',],

      name: ['', [Validators.required]],
      taxcodeID: ['', [Validators.required]],
      rate: ['', ],
      account_TypeID: ['', [Validators.required]],

    });

  }
  async ngOnInit() {
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'Finance.Item.messages.name.required' },
      ],
      'taxcodeID': [
        { type: 'required', message: 'Finance.Item.messages.taxcodeID.required'},
      ],
      'account_TypeID': [
        { type: 'required', message: 'Finance.Item.messages.account_TypeID.required' },
      ]
    }
    this.AccountTypes = await this.finance.getAllAccountTypes();
    this.taxCodes = await this.finance.getAllTaxCode()
    this.addForm.setValue({
      id:this.Item.id,
      name:this.Item.name,
      taxcodeID:this.Item.taxcodeID,
      rate:this.Item.rate,
      account_TypeID:this.Item.account_TypeID
    })
  



    this.addForm.setValue({
      id: this.Item.id,
      name: this.Item.name,
      type: this.Item.type,
      taxcodeID: this.Item.taxcodeID,
      rate: this.Item.rate,
      account_codeID: this.Item.account_codeID
    })

  }


  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      console.log('update data', data);

      try {
        let user = await this.finance.UpdateItem(data)
        await this.app.dismissLoading();

        this.dismiss();
        this.Item = await this.addForm.value;
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

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}



