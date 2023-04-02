import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Supplier } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
})
export class SupplierListComponent implements OnInit {
  @Input('Suppliers') Suppliers: Supplier[];
  SupplierColumns: string[];
  @Input('selectedSupplier') selectedSupplier: Supplier[];
  supplierList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Supplier>(true, []);
  @ViewChild('SupplierTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';

  constructor(public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { }

   async ngOnInit() {
    this.Suppliers = await this.finance.getAllSuppliers();
    this.SupplierColumns = ['id', 'full_name', 'Mobile', 'Action'];
    this.getDisplayedColumns();
    this.supplierList = new MatTableDataSource(this.Suppliers);
    this.supplierList.paginator = this.tablePaginator;
    if (this.selectedSupplier && this.showSelected) {
      let selectedIds = this.selectedSupplier.map(dt => dt.id);
      this.selection = new SelectionModel<Supplier>(true, [
        ...this.supplierList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  getDisplayedColumns() {
    return this.SupplierColumns
  }


  async ngOnChanges() {
    this.supplierList.data = this.Suppliers
    this.Suppliers = await this.finance.getAllSuppliers();
  }

  ngAfterViewInit() {
    this.supplierList = new MatTableDataSource(this.Suppliers);
    this.supplierList.paginator = this.tablePaginator;
    this.supplierList.sort = this.sort;
  }

  async add() {
    const modal = await this.modalController.create({ component: AddSupplierModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async details(row) {

    const modal = await this.modalController.create({ component: UpdateSupplierModal, cssClass: 'responsiveModal', componentProps: { Supplier: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();

  }


  applyFilter() {
    this.supplierList.filter = this.searchTerm.trim().toLowerCase();
  }



  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Finance.Supplier.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.finance.DeleteSupplier(row.id)  
          this.ngOnChanges()

    }

  }

}


@Component({
  selector: 'add-supplier',
  templateUrl: './add-supplier.html',
})
export class AddSupplierModal implements OnInit {
  isLoading = true;
  addForm: FormGroup;
  segment: number;
  validation_messages: any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService) {

    this.addForm = fb.group({
      full_name: ['', [Validators.required]],
      email: ['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}')])]],
      //mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{1,13}$'), Validators.required])]],
      mobile1: ['', [Validators.required]],
      //mobile2: ['', [Validators.compose([Validators.pattern('^[0-9]{1,13}$')])]],
      mobile2: ['',],
      Address: ['',],
      comments: [''],
    });
  }

  async ngOnInit() {
    this.validation_messages = {
      'full_name': [
        { type: 'required', message: 'Finance.Supplier.Form.messages.full_name.required' },
      ],
      'mobile1': [
        { type: 'required', message: 'Finance.Supplier.Form.messages.mobile1.required' },
        { type: 'pattern', message: 'Finance.Supplier.Form.messages.mobile1.pattern' },

      ],
      'mobile2': [
        { type: 'pattern', message: 'Finance.Supplier.Form.messages.mobile2.pattern' },
      ],
      'email': [
        { type: 'pattern', message: 'Finance.Supplier.Form.messages.email.pattern' },
      ]


    }
    this.addForm.setValue({
      full_name: "",
      email: "",
      mobile1: "",
      mobile2: null,
      Address: "",
      comments: "",
    })
  }

  async add() {
    if (this.addForm.valid) {
      let { ...data } = this.addForm.value;

      try {

        await this.finance.AddSupplier(data)
        //await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      //await this.app.dismissLoading();
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
  selector: 'supplier-detail',
  templateUrl: './supplier-detail.html',
})
export class SupplierDetailModal implements OnInit {
  Supplier: Supplier;
  id: number;

  constructor(private router: Router, public modalCtrl: ModalController, public modalController: ModalController, private route: ActivatedRoute, public app: AppService, public authz: AuthzService, public finance: FinanceService, public lang: LanguageService,
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.Supplier = await this.finance.getSupplier(this.id);
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    this.Supplier = await this.finance.getSupplier(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    this.Supplier = await this.finance.getSupplier(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async update() {
    const modal = await this.modalController.create({ component: UpdateSupplierModal, cssClass: 'responsiveModal', componentProps: { Supplier: this.Supplier } });
    return await modal.present();
  }



  dismiss() {
    this.router.navigate(['finance/supplier'])

  }
}

@Component({
  selector: 'update-supplier',
  templateUrl: './update-supplier.html',
})
export class UpdateSupplierModal implements OnInit {
  @Input('Supplier') Supplier: Supplier;
  isLoading = true;
  segment: number;
  addForm: FormGroup;
  validation_messages: any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public finance: FinanceService, public lang: LanguageService,) {


    this.addForm = fb.group({
      id: ['', [Validators.required]],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}')])]],
      //mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$'), Validators.required])]],
      mobile1: ['', [Validators.required]],
      //mobile2: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      mobile2: ['',],
      Address: ['',],
      comments: [''],
    });

  }

  async ngOnInit() {
    this.validation_messages = {
      'full_name': [
        { type: 'required', message: 'Finance.Supplier.Form.messages.full_name.required' },
      ],
      'mobile1': [
        { type: 'required', message: 'Finance.Supplier.Form.messages.mobile1.required' },
        { type: 'pattern', message: 'Finance.Supplier.Form.messages.mobile1.pattern' },

      ],
      'mobile2': [
        { type: 'pattern', message: 'Finance.Supplier.Form.messages.mobile2.pattern' },
      ],
      'email': [
        { type: 'pattern', message: 'Finance.Supplier.Form.messages.email.pattern' },
      ]
    }
    this.addForm.setValue({
      id: this.Supplier.id,
      full_name: this.Supplier.full_name,
      email: this.Supplier.email,
      mobile1: this.Supplier.mobile1,
      mobile2: this.Supplier.mobile2,
      Address: this.Supplier.Address,
      comments: this.Supplier.comments,
    })

  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;

      try {
        let user = await this.finance.UpdateSupplier(data)
        await this.app.dismissLoading();

        this.dismiss();
        this.Supplier = await this.addForm.value;
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
