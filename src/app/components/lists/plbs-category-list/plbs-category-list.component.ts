import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PLBSCategory } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'plbs-category-list',
  templateUrl: './plbs-category-list.component.html',
  styleUrls: ['./plbs-category-list.component.scss'],
})
export class PLBSCategoryListComponent implements OnInit {

  @Input('PLBSCategories') PLBSCategories: PLBSCategory[];
  PLBSCategoryColumns: string[];
  @Input('selectedPLBSCategory') selectedPLBSCategory: PLBSCategory[];
  pLBSCategoryList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<PLBSCategory>(true, []);
  @ViewChild('PLBSCategoryTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';

  constructor(public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { }

  ngOnInit() {
    this.PLBSCategoryColumns = ['id', 'PLBSRPT', 'category', 'category_order', 'Action'];
    this.getDisplayedColumns();
console.log("h am here ")
    console.log(this.PLBSCategories)
    this.pLBSCategoryList = new MatTableDataSource(this.PLBSCategories);
    this.pLBSCategoryList.paginator = this.tablePaginator;
    if (this.selectedPLBSCategory && this.showSelected) {
      let selectedIds = this.selectedPLBSCategory.map(dt => dt.id);
      this.selection = new SelectionModel<PLBSCategory>(true, [
        ...this.pLBSCategoryList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  getDisplayedColumns() {
    return this.app.isDesktop ? this.PLBSCategoryColumns : this.PLBSCategoryColumns.filter(dt => dt !== 'Action');
  }


  ngOnChanges() {
    this.pLBSCategoryList.data = this.PLBSCategories
  }

  ngAfterViewInit() {
    this.pLBSCategoryList = new MatTableDataSource(this.PLBSCategories);
    this.pLBSCategoryList.paginator = this.tablePaginator;
    this.pLBSCategoryList.sort = this.sort;
  }

  async add() {
    const modal = await this.modalController.create({ component: AddPLBSCategoryModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
    return await modal.present();
  }

  async details(row) {

    this.router.navigate(['/finance/plbs-category', row.id])

  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  applyFilter() {
    this.pLBSCategoryList.filter = this.searchTerm.trim().toLowerCase();
  }

  async delete(row) {

    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete the Supplier ?", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    if (confirm) {
      console.log('delete' + row.id)

      this.finance.deleteItem(row.id)

    }
  }

}


@Component({
  selector: 'add-plbs-category',
  templateUrl: './add-plbs-category.html',
})
export class AddPLBSCategoryModal implements OnInit {

  isLoading = true;
  addForm: FormGroup;
  segment: number;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {

    this.addForm = fb.group({
      PLBSRPT: ['', [Validators.required]],
      category: ['', [Validators.required]],
      category_order: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.addForm.setValue({
      PLBSRPT: "",
      category: "",
      category_order: "",
    })
  }

  async add() {
    console.log(this.addForm.value);
    if (this.addForm.valid) {
      // await this.app.presentLoading();
      let { ...data } = this.addForm.value;

      try {

        console.log(data)
        await this.finance.AddPLBSCategory(data)
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
  selector: 'plbs-category-Detail',
  templateUrl: './plbs-category-detail.html',
})
export class PLBSCategoryDetailModal implements OnInit {
  PLBSCategory: PLBSCategory;
  id: number;


  constructor(private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService,
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.params.id;
    console.log(this.id)
    this.PLBSCategory = await this.finance.getPLBSCategory(this.id);
    console.log(this.PLBSCategory)
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.PLBSCategory = await this.finance.getPLBSCategory(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.PLBSCategory = await this.finance.getPLBSCategory(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async update() {
    console.log("this")
    console.log(this.PLBSCategory)
    const modal = await this.modalController.create({ component: UpdatePLBSCategoryModal, cssClass: 'responsiveModal', componentProps: { PLBSCategory: this.PLBSCategory } });
    return await modal.present();
  }



  dismiss() {
    this.router.navigate(['finance/plbs-category'])

  }
}

@Component({
  selector: 'update-plbs-category',
  templateUrl: './update-plbs-category.html',
})
export class UpdatePLBSCategoryModal implements OnInit {

  @Input('PLBSCategory') PLBSCategory: PLBSCategory;
  isLoading = true;
  segment: number;
  addForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService,) {


    this.addForm = fb.group({
      id: ['', [Validators.required]],
      PLBSRPT: ['', [Validators.required]],
      category: ['', [Validators.required]],
      category_order: ['', [Validators.required]],
    });

  }

  async ngOnInit() {
    console.log("new data");
    console.log(this.PLBSCategory);

    this.addForm.setValue({
      id: this.PLBSCategory.id,
      PLBSRPT: this.PLBSCategory.PLBSRPT,
      category: this.PLBSCategory.category,
      category_order: this.PLBSCategory.category_order,
    })

  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      console.log('update data', data);

      try {
        let user = await this.finance.UpdatePLBSCategory(data)
        await this.app.dismissLoading();

        this.dismiss();
        this.PLBSCategory = await this.addForm.value;
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

