import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AccountCode, PLBSSubCatAccCodeMapping, PLBSSubCategory, Supplier } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { PLBSCategory } from '../../../interfaces/types';

@Component({
  selector: 'plbs-sub-category-list',
  templateUrl: './plbs-sub-category-list.component.html',
  styleUrls: ['./plbs-sub-category-list.component.scss'],
})
export class PLBSSubCategoryListComponent implements OnInit {
  @Input('PLBSSubCategories') PLBSSubCategories: PLBSSubCategory[];
  PLBSSubCategoryColumns: string[];
  @Input('selectedPLBSSubCategory') selectedPLBSSubCategory: PLBSSubCategory[];
  pLBSSubCategoryList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<PLBSSubCategory>(true, []);
  @ViewChild('PLBSSubCategoryTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';

  constructor(public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { }

  ngOnInit() {
    this.PLBSSubCategoryColumns = ['id', 'PLBSID', 'sub_category', 'sub_cat_order', 'Action'];
    this.getDisplayedColumns();
    this.pLBSSubCategoryList = new MatTableDataSource(this.PLBSSubCategories);
    this.pLBSSubCategoryList.paginator = this.tablePaginator;
    if (this.selectedPLBSSubCategory && this.showSelected) {
      let selectedIds = this.selectedPLBSSubCategory.map(dt => dt.id);
      this.selection = new SelectionModel<Supplier>(true, [
        ...this.pLBSSubCategoryList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  getDisplayedColumns() {
    return this.app.isDesktop ? this.PLBSSubCategoryColumns : this.PLBSSubCategoryColumns.filter(dt => dt !== 'Action');
  }


  ngOnChanges() {
    this.pLBSSubCategoryList.data = this.PLBSSubCategories
  }

  ngAfterViewInit() {
    this.pLBSSubCategoryList = new MatTableDataSource(this.PLBSSubCategories);
    this.pLBSSubCategoryList.paginator = this.tablePaginator;
    this.pLBSSubCategoryList.sort = this.sort;
  }

  async add() {
    const modal = await this.modalController.create({ component: AddPLBSSubCategoryModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
    return await modal.present();
  }

  async details(row) {

    this.router.navigate(['/finance/plbs-sub-category', row.id])

  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  applyFilter() {
    this.pLBSSubCategoryList.filter = this.searchTerm.trim().toLowerCase();
  }

  async delete(row) {

    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete the PLBS Sub Category ?", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      console.log('delete' + row.id)

      this.finance.deleteItem(row.id)

    }
  }

}


@Component({
  selector: 'add-plbs-sub-category',
  templateUrl: './add-plbs-sub-category.html',
})
export class AddPLBSSubCategoryModal implements OnInit {
  isLoading = true;
  addForm: FormGroup;
  updatedNewForm: FormGroup
  pLBSCategoriesMapping: FormGroup;
  segment: number;
  accountCodes: AccountCode[];
  pLBSCategories: PLBSCategory[];


  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {

    this.addForm = fb.group({
      PLBSID: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      sub_cat_order: ['', [Validators.required]],
      account_code: ['', [Validators.required]],
    });
    this.updatedNewForm = fb.group({
      PLBSID: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      sub_cat_order: ['', [Validators.required]]
    });
    this.pLBSCategoriesMapping = fb.group({
      PLBSSubCatID: ['', [Validators.required]],
      account_codeID: ['', [Validators.required]],
    });

  }

  async ngOnInit() {
    this.accountCodes = await this.finance.getAllAccountCodes();
    this.pLBSCategories = await this.finance.getAllPLBSCategories();
    this.addForm.setValue({
      PLBSID: "",
      sub_category: "",
      sub_cat_order: "",
      account_code: "",
    })
  }



  async add() {
    console.log(this.addForm.value);
    if (this.addForm.valid) {
      // await this.app.presentLoading();
      let { ...data } = this.addForm.value;
      let array = data.account_code;


      try {
        this.updatedNewForm.setValue({
          PLBSID: data.PLBSID,
          sub_category: data.sub_category,
          sub_cat_order: data.sub_cat_order,
        })
        console.log("form");
        console.log(this.updatedNewForm.value)
        let subCategory = await this.finance.AddPLBSSubCategory(this.updatedNewForm.value)
        await this.finance.DeletePLBSSubCategoryMapping(subCategory.id)
        data.account_code.forEach(async element => {
          this.pLBSCategoriesMapping.setValue({
            PLBSSubCatID: subCategory.id,
            account_codeID: element,
          })
          console.log(this.pLBSCategoriesMapping.value);

          let subcategory = await this.finance.AddPLBSSubCategoryMapping(this.pLBSCategoriesMapping.value)
        });
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
  selector: 'plbs-sub-category-Detail',
  templateUrl: './plbs-sub-category-detail.html',
})
export class PLBSSubCategoryDetailModal implements OnInit {
  PLBSSubCategory: PLBSSubCategory;
  id: number;


  constructor(private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService,
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log(this.id)
    this.PLBSSubCategory = await this.finance.getPLBSSubCategory(this.id);
    console.log(this.PLBSSubCategory)
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.PLBSSubCategory = await this.finance.getPLBSSubCategory(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.PLBSSubCategory = await this.finance.getPLBSSubCategory(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async update() {
    console.log("this")
    console.log(this.PLBSSubCategory)
    const modal = await this.modalController.create({ component: UpdatePLBSSubCategoryModal, cssClass: 'responsiveModal', componentProps: { PLBSSubCategory: this.PLBSSubCategory } });
    return await modal.present();
  }



  dismiss() {
    this.router.navigate(['finance/plbs-category'])

  }
}

@Component({
  selector: 'update-plbs-sub-category',
  templateUrl: './update-plbs-sub-category.html',
})
export class UpdatePLBSSubCategoryModal implements OnInit {

  @Input('PLBSSubCategory') PLBSSubCategory: PLBSSubCategory;
  isLoading = true;
  segment: number;
  addForm: FormGroup;
  accountCodes: AccountCode[];
  pLBSCategories: PLBSCategory[];
  accountCodeList: PLBSSubCatAccCodeMapping[];
  accountCodeListStr: number[];

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService,) {


    this.addForm = fb.group({
      id: ['', [Validators.required]],
      PLBSID: ['', [Validators.required]],
      sub_category: ['', [Validators.required]],
      sub_cat_order: ['', [Validators.required]],
      account_code: ['', [Validators.required]],
    });

  }

  async ngOnInit() {
    console.log("new data");
    console.log(this.PLBSSubCategory);
    this.accountCodeListStr = [];

    this.accountCodes = await this.finance.getAllAccountCodes();
    this.pLBSCategories = await this.finance.getAllPLBSCategories();
    this.accountCodeList = await this.finance.getPLBSSubCategoryMapping(this.PLBSSubCategory.id)
    this.accountCodeList.forEach(element => {
      this.accountCodeListStr.push(element.account_codeID);
    });
    console.log("code list");
    console.log(this.accountCodeListStr);


    this.addForm.setValue({
      id: this.PLBSSubCategory.id,
      PLBSID: this.PLBSSubCategory.PLBSID,
      sub_category: this.PLBSSubCategory.sub_category,
      sub_cat_order: this.PLBSSubCategory.sub_cat_order,
      account_code: this.accountCodeListStr,
    })

  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      console.log('update data', data);

      try {
        let user = await this.finance.UpdatePLBSSubCategory(data)
        await this.app.dismissLoading();

        this.dismiss();
        this.PLBSSubCategory = await this.addForm.value;
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
