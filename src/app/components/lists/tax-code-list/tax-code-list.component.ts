import { Component, OnInit, ElementRef } from '@angular/core';
import { TaxCode } from '../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, ViewChild } from '@angular/core';
import { AuthzService } from 'src/app/services/authz.service';
import { AuthService } from '../../../auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { MatDrawer } from '@angular/material/sidenav';
import { LanguageService } from 'src/app/services/language.service';
import { FinanceService } from '../../../services/finance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancePage } from '../../../pages/finance/finance.page';

@Component({
  selector: 'tax-code-list',
  templateUrl: './tax-code-list.component.html',
  styleUrls: ['./tax-code-list.component.scss'],
})
export class TaxCodeListComponent implements OnInit {

  @Input('TaxCodes') TaxCodes: TaxCode[];
  @Input('isAdd') isAdd: boolean = false;
  TaxCodeColumns: string[];
  @Input('selectedTaxCode') selectedTaxCode: TaxCode[];
  taxCodeList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<TaxCode>(true, []);
  @ViewChild('TaxCodeTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status: string;

  constructor(public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { }

  async ngOnInit() {
    this.TaxCodes = (await this.finance.getAllTaxCode());

    this.TaxCodeColumns = ['id', 'code', 'percentage', 'Action'];
    this.getDisplayedColumns();
    this.taxCodeList = new MatTableDataSource(this.TaxCodes);
    this.taxCodeList.paginator = this.tablePaginator;
    if (this.selectedTaxCode && this.showSelected) {
      let selectedIds = this.selectedTaxCode.map(dt => dt.id);
      this.selection = new SelectionModel<TaxCode>(true, [
        ...this.taxCodeList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  async ngOnChanges() {
    this.TaxCodes = (await this.finance.getAllTaxCode());

    this.taxCodeList.data = this.TaxCodes
  }

  ngAfterViewInit() {
    this.taxCodeList = new MatTableDataSource(this.TaxCodes);
    this.taxCodeList.paginator = this.tablePaginator;
    this.taxCodeList.sort = this.sort;
  }

  async add() {
    const modal = await this.modalController.create({ component: AddTaxCodeModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit() 
        });
    return await modal.present();
  }


  async details(row) {

    const modal = await this.modalController.create({ component: UpdateTaxCodeModal, cssClass: 'responsiveModal', componentProps: { TaxCode: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit() 
        });
    return await modal.present();
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  getDisplayedColumns() {
    return this.TaxCodeColumns
  }
  applyFilter() {
    this.taxCodeList.filter = this.searchTerm.trim().toLowerCase();
  }



  async delete(row) {

    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Tax.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      this.finance.deleteTaxCode(row.id)
      this.ngOnChanges()

    }

  }
}




@Component({
  selector: 'add-taxcode',
  templateUrl: './add-tax-code.html',
})
export class AddTaxCodeModal implements OnInit {
  isLoading = true;
  AddTags: boolean
  addressForm: FormGroup;
  segment: number;
  addForm: FormGroup;
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
  validation_messages: any
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {


    this.addForm = fb.group({
      code_en: ['', [Validators.required]],
      percentage: ['', [Validators.compose([Validators.pattern('^[0-9]{1,3}$'),Validators.required])]],
    });

  }
  async ngOnInit() {
    this.validation_messages = {
      'code_en': [
        { type: 'required', message: 'Finance.Tax.Form.messages.code_en.required' },
      ],
      'percentage': [
        { type: 'required', message: 'Finance.Tax.Form.messages.percentage.required' },
        { type: 'pattern', message: 'Finance.Tax.Form.messages.percentage.pattern' },
      ],
    }

    this.addForm.setValue({
      code_en: "",
      percentage: ""
    })

  }


  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let { coverURL, ...data } = this.addForm.value;
      try {
        await this.addForm.setValue({
          code_en: data.code_en,
          percentage: data.percentage
        })


        let forming = this.addForm.value
        console.log(forming)
        await this.finance.AddTaxCode(forming)
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      // await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
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
  selector: 'taxcode-details',
  templateUrl: './tax-code-details.html',
})
export class TaxCodeDetailsModal implements OnInit {
  TaxCode: TaxCode;
  id: number;
  Description: any
  @Input('isAdd') isAdd: boolean = false;
  TaxCodeColumns: string[];

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
    this.TaxCode = await this.finance.getTaxCode(this.id);
    console.log(this.TaxCode)
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.TaxCode = await this.finance.getTaxCode(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.TaxCode = await this.finance.getTaxCode(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async update() {
    console.log("this.")

    console.log(this.TaxCode)
    const modal = await this.modalController.create({ component: UpdateTaxCodeModal, cssClass: 'responsiveModal', componentProps: { TaxCode: this.TaxCode } });
    return await modal.present();

  }



  dismiss() {
    this.router.navigate(['finance/tax'])

  }
}




@Component({
  selector: 'update-taxcode',
  templateUrl: './update-tax-code.html',
})
export class UpdateTaxCodeModal implements OnInit {

  @Input('TaxCode') TaxCode: TaxCode;
  isLoading = true;
  segment: number;
  addForm: FormGroup;
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService,) {


    this.addForm = fb.group({
      id: ['', [Validators.required]],
      code_en: ['', [Validators.required]],
      percentage: ['', [Validators.compose([Validators.pattern('^[0-9]{1,3}$'),Validators.required])]],
    });

  }

  async ngOnInit() {
    this.validation_messages = {
      'code_en': [
        { type: 'required', message: 'Finance.Tax.Form.messages.code_en.required' },
      ],
      'percentage': [
        { type: 'required', message: 'Finance.Tax.Form.messages.percentage.required' },
        { type: 'pattern', message: 'Finance.Tax.Form.messages.percentage.pattern' },
      ],
    }
    this.addForm.setValue({
      id: this.TaxCode.id,
      code_en: this.TaxCode.code_en,
      percentage: this.TaxCode.percentage
    })

  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      console.log('update data', data);

      try {
        let user = await this.finance.UpdateTaxCode(data)
        await this.app.dismissLoading();

        this.dismiss();
        this.TaxCode = await this.addForm.value;
        this.ngOnInit()


      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
     // await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
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


