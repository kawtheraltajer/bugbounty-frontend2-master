import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { AppService } from 'src/app/services/app.service';
import { FinanceService } from 'src/app/services/finance.service';
import { AuthzService } from 'src/app/services/authz.service';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  show_report: boolean = true;
  total = 0
  tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
    permission?: string
  }[] = [{
    title: 'Finance.IncomeExpense.Title',
    icon: 'cash-outline',
    selected: true,
    link: 'income-expense'
  },
  {
    title: 'Finance.VatReport.Title',
    icon: 'reader-outline',
    selected: false,
    link: 'vat'
  },
  {
    title: 'Finance.BalanceSheet.Title',
    icon: 'bar-chart-outline',
    selected: false,
    link: 'balance-sheet'
  }
    ]
  filter: any;
  items: any
  searchTerm: string
  today = new Date()
  Assets: any
  test: any;
  reports: any
  chartData = [
    { label: "Venezuela", value: "290" },
    { label: "Saudi", value: "260" },
    { label: "Canada", value: "180" },
    { label: "Iran", value: "140" },
    { label: "Russia", value: "115" },
    { label: "UAE", value: "100" },
    { label: "US", value: "30" },
    { label: "China", value: "30" }
  ];

  chartConfigs = {
    caption: "Countries With Most Oil Reserves [2017-18]", //caption of the chart
    subCaption: "In MMbbl = One Million barrels", //sub-caption of the chart
    xAxisName: "Country", //x-axis name of the chart
    yAxisName: "Reserves (MMbbl)", //y-axis name of the chart
    numberSuffix: "K",
    theme: "fusion" //applying a theme for the chart
  };
  expenseTotal: number
  incomeTotal: number
  expenseVatTotal: number
  incomeVatTotal: number
  constructor(private dateAdapter: DateAdapter<Date>, public finance: FinanceService, public lang: LanguageService, private router: Router, public app: AppService, public authz: AuthzService,) {
    this.show_report = true;

    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.filter = {
      Report_Type: "ProfitAndLoss",
      Report_Basis: "ThisMonth",
      From_Date: new Date(this.today.getFullYear(), this.today.getMonth(), 1),
      To_Date: new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0)
    }

  }

  async ngOnInit() {
    this.reports = await this.finance.getReport(this.filter);
    this.expenseTotal = this.calculatExpenseTotal(this.reports.expenses_items)
    this.incomeTotal = this.calculatIncomeTotal(this.reports.icomes_items)
    this.expenseVatTotal = this.calculatExpenseVatTotal(this.reports.expenses_items)
    this.incomeVatTotal = this.calculatIncomeVatTotal(this.reports.icomes_items)
    this.show_report = true
  }
  FromDateChange() {
    this.filter.From_Date = this.filter.To_Date;
    this.show_report = false

  }

  ToDateChange() {
    this.filter.To_Date = this.filter.From_Date;
    this.show_report = false
  }

  SelectedReportRange() {
    this.expenseTotal = null
    this.incomeTotal = null
    if (this.filter.Report_Basis == "Today") {
      this.filter.From_Date = this.today
      this.filter.To_Date = this.today

    } else if (this.filter.Report_Basis == "ThisMonth") {
      this.filter.From_Date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
      this.filter.To_Date = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
    }
    else if (this.filter.Report_Basis == "ThisYear") {
      this.filter.From_Date = new Date(this.today.getFullYear(), 0, 1);
      this.filter.To_Date = new Date(this.today.getFullYear(), 12, 0);
    }
    this.show_report = false

  }
  SelectedReportType() {
    this.show_report = false

  }
  selectTab(index: number) {
    this.tabs = this.tabs.map((dt, i) => {
      dt.selected = i === index;
      return dt
    });
    this.router.navigate(['finance/reports', this.tabs[index].link]);
  }



  async getReportWithFilter() {
    this.reports = null
    this.reports = await this.finance.getReport(this.filter);
    this.ngOnInit()
    this.show_report = true;
  }

  print() {
    if (this.filter.Report_Type == 'ProfitAndLoss' || this.filter.Report_Type == 'VatReport')
      this.printDiv()
   
  }

  public printDiv() {
    let printContents, popupWin, alignment, dir;
    printContents = this.filter.Report_Type == 'ProfitAndLoss' ? document.getElementById('table')?.innerHTML : document.getElementById('table2')?.innerHTML;
    if (this.lang.selectedLang == 'en') {
      alignment = "left"
      dir = "ltr"
    }
    else {
      alignment = "right"
      dir = "rtl"
    }
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 12px;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              font-size: 14px;
              background-color: #f2f2f2 !important;
              -webkit-print-color-adjust: exact;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
              table-layout: fixed;
            }
            img {
              float: left;
              position: relative;
              padding-bottom: 1em;
            }
            .custom1 {
              background-color: #DCDCDC !important;
              -webkit-print-color-adjust: exact;
            }
            .custom2 {
              background-color: #f5f5f5 !important;
              -webkit-print-color-adjust: exact;
              font-weight: bold;
            }
          }
          @media screen
          {
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              background-color: #f2f2f2 !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
              table-layout: fixed;
            }
            img {
              float: left;
              position: relative;
              padding-bottom: 1em;
            }
            .custom1 {
              background-color: #DCDCDC !important;
            }
            .custom2 {
              background-color: #f5f5f5 !important;
              font-weight: bold;
            }
          }
        </style>
        <head>
          <title>${this.filter.Table_name}</title>
        </head>
        <body>
          <table>
            <tr>
              <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
                  Print PDF
              </button>
            </tr>
          </table>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
          <div style="padding-top:1rem;">
          <div class="table table-bordered" dir="${dir}">
            ${printContents}
          </div>
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }

  public printeeBalanceSheet() {
    let printContents, popupWin, alignment, dir;
    printContents = document.getElementById('table')?.innerHTML;
    if (this.lang.selectedLang == 'en') {
      alignment = "left"
      dir = "ltr"
    }
    else {
      alignment = "right"
      dir = "rtl"
    }

    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 12px;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              font-size: 14px;
              background-color: #f2f2f2 !important;
              -webkit-print-color-adjust: exact;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
            .custom1 {
              background-color: #DCDCDC !important;
              -webkit-print-color-adjust: exact;
            }
            .custom2 {
              background-color: #f5f5f5 !important;
              -webkit-print-color-adjust: exact;
              font-weight: bold;
            }
          }
          @media screen
          {
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              background-color: #f2f2f2 !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
            .custom1 {
              background-color: #DCDCDC !important;
            }
            .custom2 {
              background-color: #f5f5f5 !important;
              font-weight: bold;
            }
          }
        </style>
        <head>
          <title>${this.filter.Table_name}</title>
        </head>
        <body>
          <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
              Print PDF
          </button>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
          <div style="padding-top:1rem;">
          <div class="table table-bordered" dir="${dir}">
            ${printContents}
          </div>
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }



  calculateTotal(item) {
    let total = 0
    let percentage = 0
    percentage = item?.taxcode?.percentage
    item.InvoiceItem.forEach(element => {
      const From_Date = new Date(this.filter.From_Date);
      const To_Date = new Date(this.filter.To_Date);
      for (let i = 0; i < element.invoice.Receipts.length; i++) {
        const Recipte_date = new Date(element.invoice.Receipts[i].receipt_date);
        if (element?.invoice?.Receipts[i].Invoice.invoice_status == "Paid" && element?.invoice?.Receipts[i].Invoice.InvoiceItems.length > 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
          total += (element.gross_amount - (element.gross_amount / (1 + percentage / 100) * (percentage / 100)))
        } else if (element?.invoice?.Receipts[i].Invoice.InvoiceItems.length == 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
          total += (element.invoice.Receipts[i].amount - (element.invoice.Receipts[i].amount / (1 + percentage / 100) * (percentage / 100)))
        }
      }
    });

    return total
  }


  calculateAccountTotal(account) {
    let total = 0
    let percentage = 0

    account.item.forEach(element => {
      percentage = element?.taxcode?.percentage
      element.InvoiceItem.forEach(element => {
        const From_Date = new Date(this.filter.From_Date);
        const To_Date = new Date(this.filter.To_Date);
        for (let i = 0; i < element.invoice.Receipts.length; i++) {
          const Recipte_date = new Date(element.invoice.Receipts[i].receipt_date);
          if (element?.invoice?.Receipts[i].Invoice.invoice_status == "Paid" && element?.invoice?.Receipts[i].Invoice.InvoiceItems.length > 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
            total += (element.gross_amount - (element.gross_amount / (1 + percentage / 100) * (percentage / 100)))
          } else if (element?.invoice?.Receipts[i].Invoice.InvoiceItems.length == 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
            total += (element.invoice.Receipts[i].amount - (element.invoice.Receipts[i].amount / (1 + percentage / 100) * (percentage / 100)))
          }
        }
      });
    });
    return total
  }
  calculateTotalforExpence(item) {
    let total = 0
    let percentage = 0
    percentage = item?.taxcode?.percentage
    item.expenseDetail.forEach(element => {
      const expense_date = new Date(element.expense.expense_date);
      const From_Date = new Date(this.filter.From_Date);
      const To_Date = new Date(this.filter.To_Date);
      //console.log(moment(element.expense.expense_date).format('DD-MM-YYYY') >= moment(this.filter.From_Date).format('DD-MM-YYYY'))
      if ((expense_date >= From_Date && expense_date <= To_Date) && !element.expense.is_deleted) {
        total += element.expense.gross_amount

      }
    });
    return total
  }
  calculateAccountTotalforExpence(account) {
    let total = 0
    account.item.forEach(element => {
      element.expenseDetail.forEach(element => {
        const expense_date = new Date(element.expense.expense_date);
        const From_Date = new Date(this.filter.From_Date);
        const To_Date = new Date(this.filter.To_Date);
        if ((expense_date >= From_Date && expense_date <= To_Date) && !element.expense.is_deleted) {
          total += element.expense.gross_amount

        }
      });
    });
    return total
  }
  calculateVatTotal(item) {
    let total = 0
    let percentage = 0
    percentage = item?.taxcode?.percentage
    item.InvoiceItem.forEach(element => {
      const From_Date = new Date(this.filter.From_Date);
      const To_Date = new Date(this.filter.To_Date);
      for (let i = 0; i < element.invoice.Receipts.length; i++) {
        const Recipte_date = new Date(element.invoice.Receipts[i].receipt_date);
        if (element?.invoice?.Receipts[i].Invoice.invoice_status == "Paid" && element?.invoice?.Receipts[i].Invoice.InvoiceItems.length > 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
          if(percentage == 0)
          total +=0
          else
          total += ((element.gross_amount / (1 + percentage / 100) * (percentage / 100)))
        } else if (element?.invoice?.Receipts[i].Invoice.InvoiceItems.length == 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
          total += ((element.invoice.Receipts[i].amount / (1 + percentage / 100) * (percentage / 100)))
        }
      }
    });
    return total
  }
  calculateAccountVatTotal(account) {
    let total = 0
    let percentage = 0
    account.item.forEach(element => {
      percentage = element?.taxcode?.percentage
      element.InvoiceItem.forEach(element => {
        const From_Date = new Date(this.filter.From_Date);
        const To_Date = new Date(this.filter.To_Date);
        for (let i = 0; i < element.invoice.Receipts.length; i++) {
          const Recipte_date = new Date(element.invoice.Receipts[i].receipt_date);
          if (element?.invoice?.Receipts[i].Invoice.invoice_status == "Paid" && element?.invoice?.Receipts[i].Invoice.InvoiceItems.length > 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
            if(percentage == 0)

            total +=0
            else
            total += ((element.gross_amount / (1 + percentage / 100) * (percentage / 100)))
          } else if (element?.invoice?.Receipts[i].Invoice.InvoiceItems.length == 1 && !element.invoice.Receipts[i].is_deleted && (Recipte_date >= From_Date && Recipte_date <= To_Date)) {
            total += ((element.invoice.Receipts[i].amount / (1 + percentage / 100) * (percentage / 100)))
            Math.ceil(total);
          }
        }
      });
    });
    return total
  }
  calculateAccountTotalVatforExpence(account) {
    let total = 0
    let percentage = 0

    account.item.forEach(element => {
      percentage = element?.taxcode?.percentage
      element.expenseDetail.forEach(element => {
        const expense_date = new Date(element.expense.expense_date);
        const From_Date = new Date(this.filter.From_Date);
        const To_Date = new Date(this.filter.To_Date);
        if ((expense_date >= From_Date && expense_date <= To_Date) && !element.expense.is_deleted) {
          total += (element.expense.tax_amount )

        }
      });
    });
    return total
  }
  calculateTotalVatforExpence(item) {
    let total = 0
    let percentage = 0
    percentage = item?.taxcode?.percentage
    item.expenseDetail.forEach(element => {
      const expense_date = new Date(element.expense.expense_date);
      const From_Date = new Date(this.filter.From_Date);
      const To_Date = new Date(this.filter.To_Date);
      if ((expense_date >= From_Date && expense_date <= To_Date) && !element.expense.is_deleted) {
        total += (element?.expense?.tax_amount )
      }
    });
    return total
  }

  calculatExpenseTotal(expenseAccounts){
    let total = 0;
    for(let i = 0; i < expenseAccounts.length; i++) {
      total += this.calculateAccountTotalforExpence(expenseAccounts[i])
    }
    return total;
  }

  calculatIncomeTotal(incomeAccounts){
    let total = 0;
    for(let i = 0; i < incomeAccounts.length; i++) {
      total += this.calculateAccountTotal(incomeAccounts[i])
    }
    return total;
  }

  calculatExpenseVatTotal(expenseAccounts){
    let total = 0;
    for(let i = 0; i < expenseAccounts.length; i++) {
      total += this.calculateAccountTotalVatforExpence(expenseAccounts[i])
    }
    return total;
  }

  calculatIncomeVatTotal(incomeAccounts){
    let total = 0;
    for(let i = 0; i < incomeAccounts.length; i++) {
      total += this.calculateAccountVatTotal(incomeAccounts[i])
    }
    return total;
  }

}
