import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-cust-invoice',
  templateUrl: './cust-invoice.page.html',
  styleUrls: ['./cust-invoice.page.scss'],
})
export class CustInvoicePage implements OnInit {
  isLoading = true;

  Invoices = [];
  perm: Permission
  constructor(public finance: FinanceService, public app: AppService) { }

  async ngOnInit() {
    this.Invoices = (await this.finance.getAllInvoices());
    console.log(this.Invoices);
    this.isLoading = false;
  }
}
