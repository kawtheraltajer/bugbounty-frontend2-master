import { Component, OnInit } from '@angular/core';
import { Expense, Invoice } from 'src/app/interfaces/types';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { Receipt } from '../../../interfaces/types';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-income-expense-report',
  templateUrl: './income-expense-report.page.html',
  styleUrls: ['./income-expense-report.page.scss'],
})
export class IncomeExpenseReportPage implements OnInit {
  isLoading = true;
  receipts:Receipt[];
  expenses:Expense[];
  totalIncome:number;
  totalExpense:number;
  dateFrom:Date;
  dateTo:Date;
  constructor( public finance: FinanceService,public lang: LanguageService) { }

  ngOnInit() {
    this.isLoading=false;
    this.receipts=[];
    this.expenses=[];
    this.totalIncome=0;
    this.totalExpense=0;
  }

  calculateTotalAmount(){
    this.receipts.forEach((val) => {
      this.totalIncome += val.amount;
    });
    this.expenses.forEach((val) => {
      this.totalExpense += val.net_amount;
    });
  }

  async getReportData(){
    // console.log(this.dateFrom);
    // console.log(this.dateTo);
    // console.log({
    //   from:DateTime.fromJSDate(this.dateFrom).toJSDate(),
    //   to:DateTime.fromJSDate(this.dateTo).toJSDate(),
    //   iso:DateTime.fromISO(this.dateFrom.toISOString()).toJSDate()
    // });
    

    this.receipts=await this.finance.getIncomeRport(this.dateFrom,this.dateTo);
    this.expenses=await this.finance.getExpenseRport(this.dateFrom,this.dateTo);
    this.calculateTotalAmount()
  }
}
