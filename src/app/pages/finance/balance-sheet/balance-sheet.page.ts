import { Component, OnInit } from '@angular/core';
import { FinanceService } from 'src/app/services/finance.service';
import { LanguageService } from 'src/app/services/language.service';
import { AccTransectionHeader, AccTransectionDetail } from '../../../interfaces/types';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.page.html',
  styleUrls: ['./balance-sheet.page.scss'],
})
export class BalanceSheetPage implements OnInit {
  isLoading = true;
  acct_tranc_head: AccTransectionHeader[];
  acct_tranc_detail: AccTransectionDetail[];
  //yearList: Array<string>;
  selectedYear: number;
  dateFrom: Date;
  dateTo: Date;
  date = new Date();
  yearList: Array<number>;
  cash: number;
  acct_rec: number;
  mac_eqp: number;
  insur: number;
  comp: number;
  fur: number;
  real_est_prop: number;
  other_ast: number;
  total_ast: number;
  acct_pay: number;
  vat: number;
  other_lib: number;
  total_lib: number;

  constructor(public finance: FinanceService, public lang: LanguageService) { }

  ngOnInit() {
    this.yearList = [];
    this.getYears()
    this.isLoading = false;
    this.acct_tranc_head = [];
    this.acct_tranc_detail = [];

    this.cash = 0;
    this.acct_rec = 0;
    this.mac_eqp = 0;
    this.insur = 0;
    this.comp = 0;
    this.fur = 0;
    this.real_est_prop = 0;
    this.other_ast = 0;
    this.total_ast = 0;
    this.acct_pay = 0;
    this.vat = 0;
    this.other_lib = 0;
    this.total_lib = 0;

  }

  getYears() {
    console.log("date");
    let year = new Date().getFullYear();
    console.log(year);
    console.log(this.date.getFullYear());

    for (let i = 2020; i <= year; i++) {
      console.log(i);

      this.yearList.push(i);
    }


  }

  calculateTotalAmount() {
    this.total_ast = 0;
    this.total_lib = 0;
  }

  async getReportData() {
    console.log(this.selectedYear);

    let fromDate = new Date(this.selectedYear + "-01-01")
    let toDate = new Date(this.selectedYear + "-12-31")

    console.log(fromDate);
    console.log(toDate);

    // console.log(this.dateFrom);
    // console.log(this.dateTo);
    // console.log({
    //   from:DateTime.fromJSDate(this.dateFrom).toJSDate(),
    //   to:DateTime.fromJSDate(this.dateTo).toJSDate(),
    //   iso:DateTime.fromISO(this.dateFrom.toISOString()).toJSDate()
    // });


    this.acct_tranc_head = await this.finance.getAccountTransectionRport(this.dateFrom, this.dateTo);
    for (let index = 0; index < this.acct_tranc_head.length; index++) {
      for (let j = 0; j < this.acct_tranc_head[index].acc_transection_detail.length; j++) {
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 1) {
          this.cash = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 2) {
          this.acct_rec = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 3) {
          this.mac_eqp = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 4) {
          this.insur = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 5) {
          this.comp = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 6) {
          this.fur = this.fur + this.acct_tranc_head[index].acc_transection_detail[j].account_codeID;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 8) {
          this.real_est_prop = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 8) {
          this.other_ast = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 9) {
          this.acct_pay = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 10) {
          this.vat = 0;
        }
        if (this.acct_tranc_head[index].acc_transection_detail[j].account_codeID == 11) {
          this.other_lib = 0;
        }
      }
    }
    //this.expenses = await this.finance.getExpenseRport(this.dateFrom, this.dateTo);
    //this.calculateTotalAmount()
  }

}
