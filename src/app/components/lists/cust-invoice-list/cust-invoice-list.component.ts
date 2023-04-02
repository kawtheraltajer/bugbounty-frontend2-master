import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Invoice, InvoiceDetail } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'cust-invoice-list',
  templateUrl: './cust-invoice-list.component.html',
  styleUrls: ['./cust-invoice-list.component.scss'],
})
export class CustInvoiceListComponent implements OnInit {

  @Input('Invoices') Invoices: Invoice[];
  @Input('isAdd') isAdd: boolean = false;
  InvoiceColumns: string[];
  @Input('selectedInvoice') selectedInvoice: Invoice[];
  invoiceList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Invoice>(true, []);
  @ViewChild('InvoiceTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  status: string;

  constructor(public modalController: ModalController, public app: AppService, public finance: FinanceService, public authz: AuthzService, private router: Router) { }

  ngOnInit() {
    this.InvoiceColumns = ['id', 'invoice_no', 'invoice_date', 'gross_amount', 'tax_amount', 'net_amount', 'is_instalment', 'Action'];
    this.getDisplayedColumns();
    this.invoiceList = new MatTableDataSource(this.Invoices);
    this.invoiceList.paginator = this.tablePaginator;
    if (this.selectedInvoice && this.showSelected) {
      let selectedIds = this.selectedInvoice.map(dt => dt.id);
      this.selection = new SelectionModel<Invoice>(true, [
        ...this.invoiceList.data.filter(row => selectedIds.includes(row.id))
      ]);
    }
  }

  ngOnChanges() {
    this.invoiceList.data = this.Invoices
  }

  ngAfterViewInit() {
    this.invoiceList = new MatTableDataSource(this.Invoices);
    this.invoiceList.paginator = this.tablePaginator;
    this.invoiceList.sort = this.sort;
  }


  async details(row) {
    this.router.navigate(['/finance/cust-invoice-detail', row.id])
  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  getDisplayedColumns() {
    return this.app.isDesktop ? this.InvoiceColumns : this.InvoiceColumns.filter(dt => dt !== 'Action');
  }
  applyFilter() {
    this.invoiceList.filter = this.searchTerm.trim().toLowerCase();
  }

}


@Component({
  selector: 'cust-invoice-detail',
  templateUrl: './cust-invoice-detail.html',
})
export class CustInvoiceDetailModal implements OnInit {
  Invoice: Invoice;
  InvoiceDetail: InvoiceDetail[];
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
    this.Invoice = await this.finance.getInvoice(this.id);
    console.log(this.Invoice)
    this.InvoiceDetail = await this.finance.getAllInvoiceDetails(this.id);
    console.log(this.InvoiceDetail)
    this.isLoading = false;
  }

  async ngOnChanges() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.Invoice = await this.finance.getInvoice(this.id);
    this.InvoiceDetail = await this.finance.getAllInvoiceDetails(this.id);
  }

  async ngAfterViewInit() {
    this.id = this.route.snapshot.params.id;
    console.log()
    this.Invoice = await this.finance.getInvoice(this.id);
    this.InvoiceDetail = await this.finance.getAllInvoiceDetails(this.id);
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);
  }

  dismiss() {
    this.router.navigate(['finance/cust-invoice'])
  }
}
