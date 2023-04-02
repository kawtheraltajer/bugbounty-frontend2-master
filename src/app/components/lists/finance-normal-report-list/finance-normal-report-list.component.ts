
import { Component, OnInit, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { AppService } from 'src/app/services/app.service';
import { FinanceService } from 'src/app/services/finance.service';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CourtService } from 'src/app/services/court.service';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'finance-normal-report-list',
  templateUrl: './finance-normal-report-list.component.html',
  styleUrls: ['./finance-normal-report-list.component.scss'],
})
export class FinanceNormalReportListComponent implements OnInit {

  @ViewChild('ReportTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @Input('selectedReport') selectedReport: any[];
  @Input('showSelected') showSelected: boolean;
  @Input('admindashboard') admindashboard:any;

  items: any
  searchTerm: string
  today = new Date()
  Assets: any
  test: any;
  reports: any
  current_date = new Date();
  IsSelectTable: boolean = false;
  ReportList = new MatTableDataSource([]);

  Columnslist: { name: string, isSelected: boolean, value: string }[]
  Columns: string[]
  Filter_Colums: any

  filter: {
    Table_name: string,
    Columnslist: [],
    filter: any
  }
  report: any
  formattedDate
  clients: any
  cases: any;
  suppliers: any
  showAccountTypeList: boolean = false
  AccountTypeList: any
  From_date: Date
  to_date: Date
  AccountTypes: any
  over_due_date: boolean = true;
  InvoiceTotal: any
  ReceiptTotal: any
  ExpenseTotal: any
  totalVatPaid:number
  constructor(private router: Router,public finance: FinanceService, public lang: LanguageService, public app: AppService, public court: CourtService,private dateAdapter: DateAdapter<Date>, ) {
      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.current_date.setHours(0, 0, 0, 0);
    this.over_due_date = false
    this.From_date = this.current_date
    this.to_date = this.current_date

    this.IsSelectTable = false
    this.filter = {
      Table_name: "",
      Columnslist: [],
      filter: {}
    }
    this.filter.Table_name = "Invoice"
    this.IsSelectTable = true
    this.formattedDate = formatDate(this.current_date, 'dd-MM-yyyy', 'en-US');

    this.Columnslist = [
      {
        name: 'ID',
        value: 'id',
        isSelected: true,
      },
      {
        name: 'invoice_no',
        value: 'invoice_no',
        isSelected: true,
      },
      {
        name: 'Name',
        value: 'recipient_name',
        isSelected: true,
      },
      {
        name: 'invoice_date',
        value: 'invoice_date',
        isSelected: true,
      },
      {
        name: 'invoice_status',
        value: 'invoice_status',
        isSelected: true,
      },
      {
        name: 'net_amount',
        value: 'net_amount',
        isSelected: true,
      },
      {
        name: 'tax_amount',
        value: 'tax_amount',
        isSelected: true,
      },
      {
        name: 'paid_amount',
        value: 'Paid_amount',
        isSelected: true,
      },
      {
        name: 'vat_paid_amount',
        value: 'Vat_Paid_amount',
        isSelected: true,
      },
      
      {
        name: 'Pending_Amount',
        value: 'pending_amount',
        isSelected: true,
      }

    ]
  }
  Clear() {
    this.over_due_date = false
  }
  async ngOnInit() {



   if( this.admindashboard ==true){
alert( this.filter.Table_name = "Invoice")
    }
    this.Filter_Colums = this.Columnslist.filter((list) => list.isSelected == true)

    this.Columns = [];
    for (let i = 0; i < this.Filter_Colums.length; i++) {
      this.Columns.push(this.Filter_Colums[i].value);
    }

    this.getDisplayedColumns();
    this.getReportWithFilter()
    this.ReportList = new MatTableDataSource(this.report);
    this.ReportList.paginator = this.tablePaginator;
    if (this.selectedReport && this.showSelected) {
      let selectedIds = this.selectedReport.map(dt => dt.id);
    }
  }

  FromDateChange(date) {
    this.filter.filter.date.gte = date;
  }

  ToDateChange(date) {
    this.filter.filter.date.lte = date;
  }

  generateTotalVat(){
    this.totalVatPaid=0;
    for (let i = 0; i < this.report.length; i++) {
      console.log(this.report[i])
      console.log(this.report.length)
      console.log(this.report[i].Invoice?.InvoiceItems.length)
      if (this.report[i].Invoice?.invoice_status == 'Paid' && this.report[i].Invoice?.InvoiceItems.length >2 ) {
   this.totalVatPaid=this.totalVatPaid+ this.report[i].Invoice.tax_amount
      }else if(this.report[i].Invoice?.InvoiceItems.length < 2 ){

          this.totalVatPaid=this.totalVatPaid+ this.report[i].amount /( 1+ this.report[i].Invoice?.InvoiceItems[0]?.item?.taxcode?.percentage / 100) *(this.report[i].Invoice?.InvoiceItems[0]?.item?.taxcode?.percentage / 100)

      }
      console.log("this.totalVatPaid")
      console.log(this.totalVatPaid)
  }


  }
  SelectedReportType() {



  }



  async getReportWithFilter() {

    this.Filter_Colums = this.Columnslist.filter((list) => list.isSelected == true)
    this.Columns = [];
    for (let i = 0; i < this.Filter_Colums.length; i++) {
      this.Columns.push(this.Filter_Colums[i].value);
    }
    if (this.filter.Table_name == "Invoice") {
      this.clients = await this.court.getClientForList()
      this.cases = await this.court.getAllCases()
      //console.log('this.filter.filter', this.filter.filter)
      /*if (this.over_due_date = true) {
        Object.assign(this.filter.filter, {due_date: {gt: this.current_date}});
        //this.filter.filter.due_date.gt = this.From_date
      }*/
      Object.assign(this.filter.filter, {invoice_date: {gte: this.From_date, lte: this.to_date}});
      this.InvoiceTotal = await this.finance.getInvoiceTotalForNormalReports(this.filter.filter)
      //this.filter.filter.invoice_date.gt = this.From_date
      //this.filter.filter.invoice_date.lte = this.to_date
    }
    else if (this.filter.Table_name == "Receipt") {
      Object.assign(this.filter.filter, {receipt_date: {gte: this.From_date, lte: this.to_date}});
      this.ReceiptTotal = await this.finance.getReceiptTotalForNormalReports(this.filter.filter)
      this.generateTotalVat()
      //this.filter.filter.receipt_date.gt = this.From_date
      //this.filter.filter.receipt_date.lte = this.to_date
    }
    else if (this.filter.Table_name == "Expense") {
      this.suppliers = await this.finance.getAllSuppliers()
      Object.assign(this.filter.filter, {expense_date: {gte: this.From_date, lte: this.to_date}});
      this.ExpenseTotal = await this.finance.getExpenceTotalForNormalReports(this.filter.filter)
      //this.filter.filter.expense_date.gt = this.From_date
      //this.filter.filter.expense_date.lte = this.to_date
    }

    this.getDisplayedColumns();

    this.report = await this.finance.generateReport(this.filter)
    if (this.filter.Table_name == "Receipt")
    this.generateTotalVat()
    this.ReportList = new MatTableDataSource(this.report);
    this.ReportList.paginator = this.tablePaginator;
  }
  details(row){  
    if (this.filter.Table_name == "Invoice") {
 
      this.router.navigate(['/finance/invoice-detail', row.id]) 
    }
  }

  async SelectedTable() {
    this.filter.filter = null
    this.IsSelectTable = true
    this.Columnslist = [];
    this.Columns = [];
    if (this.filter.Table_name == "Invoice") {
      this.clients = await this.court.getClientForList()
      this.cases = await this.court.getAllCases()
      this.filter.filter = {
        invoice_date: {
          gte: this.From_date,
          lte: this.to_date
        }
      }
      this.Columnslist = [
        {
          name: 'ID',
          value: 'id',
          isSelected: true,
        },
        {
          name: 'invoice_no',
          value: 'invoice_no',
          isSelected: true,
        },
        {
          name: 'Name',
          value: 'recipient_name',
          isSelected: true,
        },
        {
          name: 'invoice_date',
          value: 'invoice_date',
          isSelected: true,
        },
        {
          name: 'invoice_status',
          value: 'invoice_status',
          isSelected: true,
        },
        {
          name: 'net_amount',
          value: 'net_amount',
          isSelected: true,
        },
        {
          name: 'tax_amount',
          value: 'tax_amount',
          isSelected: true,
        },
        {
          name: 'paid_amount',
          value: 'Paid_amount',
          isSelected: true,
        },
        {
          name: 'vat_paid_amount',
          value: 'Vat_Paid_amount',
          isSelected: true,
        },
        
        {
          name: 'Pending_Amount',
          value: 'pending_amount',
          isSelected: true,
        }

      ]
    }
    else if (this.filter.Table_name == "Receipt") {
      this.filter.filter = {
        receipt_date: {
          gte: this.From_date,
          lte: this.to_date
        }
      }
      this.Columnslist = [
        {
          name: 'ID',
          value: 'id',
          isSelected: true,
        },
        {
          name: 'Receipt_no',
          value: 'receipt_no',
          isSelected: true,
        },
        {
          name: 'Name',
          value: 'recipient_name',
          isSelected: true,
        },
        {
          name: 'Receipt_Date',
          value: 'receipt_date',
          isSelected: true,
        },
        {
          name: 'description',
          value: 'description',
          isSelected: true,
        },
        {
          name: 'Amount',
          value: 'amount',
          isSelected: true,
        },
        {
          name: 'tax_amount',
          value: 'tax_amount',
          isSelected: true,
        },
        {
          name: 'Payment_Method',
          value: 'payment_method',
          isSelected: true,
        }

      ]

    }
    else if (this.filter.Table_name == "Expense") {
      this.suppliers = await this.finance.getAllSuppliers()
      this.filter.filter = {
        expense_date: {
          gte: this.From_date,
          lte: this.to_date
        }
      }

      this.Columnslist = [
        {
          name: 'ID',
          value: 'id',
          isSelected: true,
        },
        {
          name: 'expense_no',
          value: 'expense_no',
          isSelected: true,
        },
        {
          name: 'expense_date',
          value: 'expense_date',
          isSelected: true,
        },
        {
          name: 'gross_amount',
          value: 'gross_amount',
          isSelected: true,
        },

        {
          name: 'tax_amount',
          value: 'tax_amount',
          isSelected: true,
        },
        {
          name: 'net_amount',
          value: 'net_amount',
          isSelected: true,
        }
        ,
        {
          name: 'Supplier',
          value: 'Supplier',
          isSelected: true,
        },

        {
          name: 'payment_method',
          value: 'payment_method',
          isSelected: true,
        }


      ]

    }
    else if (this.filter.Table_name == "Item") {
      this.filter.filter = {}
      this.AccountTypes = await this.finance.getAllAccountTypes()
      this.Columnslist = [
        {
          name: 'ID',
          value: 'id',
          isSelected: true,
        },
        {
          name: 'name',
          value: 'name',
          isSelected: true,
        },
        {
          name: 'type',
          value: 'type',
          isSelected: true,
        },
        {
          name: 'account_Type',
          value: 'account_TypeID',
          isSelected: true,
        },

        {
          name: 'rate',
          value: 'rate',
          isSelected: true,
        }




      ]
      this.getDisplayedColumns()

    }

    else if (this.filter.Table_name == "Account") {
      this.filter.filter = {}


      this.Columnslist = [
        {
          name: 'ID',
          value: 'id',
          isSelected: true,
        },
        {
          name: 'name',
          value: 'name',
          isSelected: true,
        },
        {
          name: 'account_code',
          value: 'account_code',
          isSelected: true,
        },
        {
          name: 'type',
          value: 'type',
          isSelected: true,
        },

        {
          name: 'account_Type',
          value: 'account_type',
          isSelected: true,
        },
        {
          name: 'description',
          value: 'description',
          isSelected: true,
        }





      ]

    }

    else if (this.filter.Table_name == "Supplier") {

      this.filter.filter = {}

      this.Columnslist = [
        {
          name: 'ID',
          value: 'id',
          isSelected: true,
        },
        {
          name: 'Name',
          value: 'full_name',
          isSelected: true,
        },
        {
          name: 'mobile1',
          value: 'Mobile',
          isSelected: true,
        }

      ]

    }

  }
  getTypeAccount(ev) {
    this.AccountTypeList = [];
    this.showAccountTypeList = true

    if (ev.value == "Assets") {
      this.AccountTypeList = [{ name: 'Cash', label: 'Cash' }, { name: 'Bank', label: 'Bank' }, { name: 'Fixed Assets', label: 'Fixed_Assets' }, { name: 'Stock', label: 'Stock' }, { name: 'Payment Clearing', label: 'Payment_Clearing' }, { name: 'Other Assets', label: 'Other_Assets' },]

    } else if (ev.value == "Liability") {
      this.AccountTypeList = [{ name: 'Long Term Liabililty', label: 'Long_Term_Liabililty' }, { name: 'Stock', label: 'Stock' }, { name: 'Credit Card', label: 'Credit_Card' }, { name: 'Other Liabililty', label: 'Other_Liabililty' }]


    }
    else if (ev.value == "Equity") {
      this.showAccountTypeList = false
      this.AccountTypeList = [{ name: 'Equity', label: 'Equity' }]


    }
    else if (ev.value == "Income") {
      this.AccountTypeList = [{ name: 'Income', label: 'Income' }, { name: 'Other Income', label: 'Other_Income' }]


    } else if (ev.value == "Expenes") {
      this.AccountTypeList = [{ name: 'Expenes', label: 'Expenes' }, { name: 'Other Expenes', label: 'Other_Expenes' }]


    }
  }
  getDisplayedColumns(): string[] {

    return this.Columns
  }
  public printDiv() {
    let printContents, popupWin, alignment, dir;
    printContents = document.getElementById('table').innerHTML;
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
          <table class="table table-bordered" dir="${dir}">
            ${printContents}
          </table>
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }


}

