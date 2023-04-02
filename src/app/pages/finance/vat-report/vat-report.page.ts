import { Component, OnInit } from '@angular/core';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { Invoice, Expense } from '../../../interfaces/types';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-vat-report',
  templateUrl: './vat-report.page.html',
  styleUrls: ['./vat-report.page.scss'],
})
export class VatReportPage implements OnInit {
  isLoading = true;
  invoices: Invoice[];
  expenses: Expense[];
  totalIncome: number;
  totalExpense: number;
  dateFrom: Date;
  dateTo: Date;
  constructor(public finance: FinanceService, public lang: LanguageService) { }

  ngOnInit() {
    this.isLoading = false;
    this.invoices = [];
    this.expenses = [];
    this.totalIncome = 0;
    this.totalExpense = 0;
  }

  calculateTotalAmount() {
    this.invoices.forEach((val) => {
      this.totalIncome += val.net_amount;
    });
    this.expenses.forEach((val) => {
      this.totalExpense += val.net_amount;
    });
  }

  async getReportData() {
    console.log(this.dateFrom);
    console.log(this.dateTo);
    console.log(await this.finance.getExpenseVat(this.dateFrom, this.dateTo));
    this.invoices = await this.finance.getIncomeVat(this.dateFrom, this.dateTo);
    //

    this.expenses = await this.finance.getExpenseVat(this.dateFrom, this.dateTo);
  }

}
