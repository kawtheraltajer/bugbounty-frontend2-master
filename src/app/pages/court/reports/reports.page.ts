import { ItemDetailsModal } from 'src/app/components/lists/item-list/item-list.component';

import { Component, OnInit, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { Employee, Company, Court, CaseType, Client, DelayReson } from 'src/app/interfaces/types';
import { AuthzService } from 'src/app/services/authz.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CourtService } from 'src/app/services/court.service';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import jspdf from 'jspdf';
declare var require: any;
import * as html2pdf from 'html2pdf.js';
import { formatDate} from '@angular/common';



import * as pdfMake from "pdfmake/build/pdfmake";
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  @ViewChild('htmlData', { static: false }) htmlData: ElementRef;
  @Inject('Window') private window: Window;

  @ViewChild('pdfTable')
  pdfTable!: ElementRef;
  segment: number;
  companies:Company[];
  Courts:Court[];
  types:CaseType[];
  clients:Client[];
  DelayResons:DelayReson[];
  filter: {
    Table_name: string,
    Columnslist: [],
    filter: any
  }
  report: any

  currant_date = new Date();
  formattedDate
  employeeList: Employee[]
  @Input('isEdit') isEdit: boolean;
  @Input('isAdd') isAdd: boolean = false;
  @Input('selectedReport') selectedReport: any[];
  ReportList = new MatTableDataSource([]);
  content: string;

  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<any>(true, []);
  @ViewChild('ReportTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  drawer: boolean = false;
  IsSelectTable: boolean = false;
  Columnslist: { name: string, isSelected: boolean, value: string }[]
  Columns: string[]
  Filter_Colums: any
  title = 'export-table-data-to-pdf-using-jspdf-example';

  head = [['ID', 'NAME', 'DESIGNATION', 'DEPARTMENT']]

  data = [
    [1, 'ROBERT', 'SOFTWARE DEVELOPER', 'ENGINEERING'],
    [2, 'CRISTINAO', 'QA', 'TESTING'],
    [3, 'KROOS', 'MANAGER', 'MANAGEMENT'],
    [4, 'XYZ', 'DEVELOPER', 'DEVLOPEMENT'],
    [5, 'ABC', 'CONSULTANT', 'HR'],
    [73, 'QWE', 'VICE PRESIDENT', 'MANAGEMENT'],
  ]

  constructor(
    private pdfGenerator: PDFGenerator, 
    public lang: LanguageService, 
    public authz: AuthzService, 
    public court: CourtService, 
    public app: AppService, 
    public router: Router,
    private act: ActivatedRoute,
    public print: PrintService) {
    if (!(this.authz.canDo('REPORT', 'Court', []) || this.authz.canDo('MANAGE', 'Company', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.currant_date.setHours(0,0,0,0);
    this.IsSelectTable = true
    this.Columnslist = [
      {
        name: 'Case_no',
        value: 'Case_no',
        isSelected: true,
      },
      {
        name: 'File_no',
        value: 'File_no',
        isSelected: true,

      },
      {
        name: 'Client',
        value: 'Client',
        isSelected: true,

      },
      {
        name: 'Opponent',
        value: 'Opponent',
        isSelected: true,

      },
      {
        name: 'Related_Company',
        value: 'Related_Company',
        isSelected: true,

      },
      {
        name: 'Court_no',
        value: 'Court_no',
        isSelected: true,

      },
      {
        name: 'Case_status',
        value: 'Case_status',
        isSelected: true,

      },
      {
        name: 'Case_type',
        value: 'Case_type',
        isSelected: true,

      }

    ]
    this.filter = {
      Table_name: "Case",
      Columnslist: [],
      filter: {}
    }
    if(this.act.snapshot.params.id) {
      Object.assign(this.filter.filter, {representativeID: Number(this.act.snapshot.params.id)});
    }
    this.formattedDate = formatDate(this.currant_date, 'dd-MM-yyyy', 'en-US');


  }
  /*printDiv() {
    var divToPrint = document.getElementById('print-index-invoice');
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    newWin.document.write('<html><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" media="print"/><body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 10);
  }*/
  importAsXlsx(){
    alert('hhhh')
    
    }

  openPDF() {

    const content = document.getElementById('table');


    html2pdf().from(content).set({
      margin: 0.05,
      image: { type: "jpeg", quality: 0.80 },
      filename: 'Test.pdf',
      html2canvas: { scale: 1.2, dpi: 300 },
      pagebreak: 'css',
      jsPDF: { orientation: "portrait", unit: 'pt', format: 'A4', compressPDF: true }
    }).save();




// define a generatePDF function that accepts a reports argument
  }
  
   


  //test
  public printDiv() {
    //this.print.printData(this.report, this.Columnslist, this.filter.Table_name)
    let printContents, popupWin, alignment, dir;
    printContents = document.getElementById('table').innerHTML;
    if (this.lang.selectedLang == 'en')
    {
      alignment = "left"
      dir = "ltr"
    }  
    else
    {
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
          <img _ngcontent-hup-c585="" src="../../../../assets/logos/logo2.jpg" alt="">
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

  ///



  public downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };

    pdfMake.fonts = {
      MyFontName: {
        normal: 'my-font-regular.ttf',
        bold: 'my-font-bold.ttf',
        italics: 'my-font-italics.ttf',
        bolditalics: 'my-font-bold-italics.ttf'
      }
    }
    const documentDefinitions = {
      content: '...',
      defaultStyle: {
        font: 'MyFontName'
      }
    };
    pdfMake.createPdf(documentDefinition).download();
    pdfMake.createPdf(
      documentDefinition,
      null, // tableLayouts
      {
        MyFontName: {
          normal: 'my-font-regular.ttf',
          bold: 'my-font-bold.ttf',
          italics: 'my-font-italics.ttf',
          bolditalics: 'my-font-bold-italics.ttf'
        }
      },
      pdfFonts.pdfMake.vfs).download();


  }

  SelectedTable() {
    this.IsSelectTable = true
    this.Columnslist = [];
    this.Columns = [];
    if (this.filter.Table_name == "Session") {
      this.filter.filter = {
        date: {
          gte: this.currant_date,
          lte: this.currant_date
        }
      }
      this.Columnslist = [
        {
          name: 'Ref_No',
          value: 'Ref_No',
          isSelected: true,
        },
        {
          name: 'Status',
          value: 'Status',
          isSelected: true,

        },
        {
          name: 'Session_Date',
          value: 'Session_Date',
          isSelected: true,

        },

        {
          name: 'Lawyer_Name',
          value: 'Lawyer_Name',
          isSelected: true,

        },
        {
          name: 'Delay_Reason',
          value: 'Delay_Reason',
          isSelected: true,

        },
        {
          name: 'Upcoming_Session',
          value: 'Upcoming_Session',
          isSelected: true,

        }

      ]


    } else if (this.filter.Table_name == "Case") {
      this.filter.filter = {};
      this.Columnslist = [
        {
          name: 'Case_no',
          value: 'Case_no',
          isSelected: true,
        },
        {
          name: 'File_no',
          value: 'File_no',
          isSelected: true,

        },
        {
          name: 'Client',
          value: 'Client',
          isSelected: true,

        },
        {
          name: 'Opponent',
          value: 'Opponent',
          isSelected: true,

        },
        {
          name: 'Related_Company',
          value: 'Related_Company',
          isSelected: true,

        },
        {
          name: 'Court_no',
          value: 'Court_no',
          isSelected: true,

        },
        {
          name: 'Case_status',
          value: 'Case_status',
          isSelected: true,

        },
        {
          name: 'Case_type',
          value: 'Case_type',
          isSelected: true,

        }

      ]


    }

    else if (this.filter.Table_name == "Company") {
      this.filter.filter = {};
      this.Columnslist = [
        {
          name: 'CR',
          value: 'CR',
          isSelected: true,
        },
        {
          name: 'Name',
          value: 'Name',
          isSelected: true,

        },
        {
          name: 'Mobile',
          value: 'Mobile',
          isSelected: true,

        },
        {
          name: 'whatsApp_phone',
          value: 'whatsApp_phone',
          isSelected: true,

        },


      ]
    }
    else if (this.filter.Table_name == "Client") {
      this.filter.filter = {};
      this.Columnslist = [
        {
          name: 'CPR',
          value: 'CPR',
          isSelected: true,
        },
        {
          name: 'Name',
          value: 'Name',
          isSelected: true,

        },
        {
          name: 'Mobile',
          value: 'Mobile',
          isSelected: true,

        },
        {
          name: 'whatsApp_phone',
          value: 'whatsApp_phone',
          isSelected: true,

        },


      ]
    }
    else if (this.filter.Table_name == "Claim") {
      this.filter.filter = {};
      this.Columnslist = [
        {
          name: 'id',
          value: 'id',
          isSelected: true,
        },
        {
          name: 'client',
          value: 'client',
          isSelected: true,

        },
        {
          name: 'CaseNo',
          value: 'CaseNo',
          isSelected: true,

        },
        {
          name: 'total',
          value: 'total',
          isSelected: true,

        },
        {
          name: 'total_paid',
          value: 'total_paid',
          isSelected: true,

        },
        {
          name: 'balance',
          value: 'balance',
          isSelected: true,

        },
        {
          name: 'due_date',
          value: 'due_date',
          isSelected: true,

        },
      ]
    }



  }
  /*changeTOdate() {

    this.filter.from_date == this.filter.to_date

  }*/
  async getReportWithFilter() {

    console.log(this.Columns)
    this.ngOnInit()


  }


  async ngOnInit() {
    if (!(this.authz.canDo('REPORT', 'Court', []) || this.authz.canDo('MANAGE', 'Company', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.drawer = false;
    this.companies=await this.court.getAllcompanies()
    this.employeeList = await this.authz.getEmployees()
    this.Courts=await this.court.getAllCourts()
    this.types=await this.court.getAllCaseType()
    this.clients =await this.court.getAllClients()
    this.DelayResons=await this.court.getDelayReson()

    this.Filter_Colums = this.Columnslist.filter((list) => list.isSelected == true)
    console.log("eee")
    this.Columns = [];
    for (let i = 0; i < this.Filter_Colums.length; i++) {

      this.Columns.push(this.Filter_Colums[i].value);

    }
    this.getDisplayedColumns();
    console.log(this.filter)
    this.report = await this.court.generateReport(this.filter)
    this.ReportList = new MatTableDataSource(this.report);
    this.ReportList.paginator = this.tablePaginator;
    if (this.selectedReport && this.showSelected) {
      let selectedIds = this.selectedReport.map(dt => dt.id);


    }
  }



  getDisplayedColumns(): string[] {

    return this.app.isDesktop ? this.Columns : this.Columns
  }

  async ngOnChanges() {
    console.log(this.filter)
    this.report = await this.court.generateReport(this.filter)
    this.ReportList.data = this.report
  }
  async ngAfterViewInit() {
    console.log(this.filter)
    this.report = await this.court.generateReport(this.filter)
    this.ReportList = new MatTableDataSource(this.report);
    this.ReportList.paginator = this.tablePaginator;
    this.ReportList.sort = this.sort;
  }

  EmployeeIDChange(id)
  {
    if(id.value == null)
      delete this.filter.filter.representativeID;
    else
      Object.assign(this.filter.filter, {representativeID: id.value});

    //console.log(this.filter);
  }

  FromDateChange(date)
  {
    this.filter.filter.date.gte = date;
    //console.log(this.filter);
  }

  ToDateChange(date)
  {
    this.filter.filter.date.lte = date;
    //console.log(this.filter);
  }

  StatusChange(status)
  {
    if(status.value == null)
      delete this.filter.filter.status;
    else
      Object.assign(this.filter.filter, {status: status.value});
    //console.log(this.filter)
  }

  CompanyChange(company)
  {
    if(company.value == null)
      delete this.filter.filter.companyID;
    else
      Object.assign(this.filter.filter, {companyID: company.value});

    //console.log(this.filter)
  }

  CourtChange(court)
  {
    if(court.value == null)
      delete this.filter.filter.courtID;
    else
      Object.assign(this.filter.filter, {courtID: court.value});
  }

  TypeChange(type)
  {
    if(type.value == null)
      delete this.filter.filter.typeID;
    else
      Object.assign(this.filter.filter, {typeID: type.value});
  }

  ClientChange(client)
  {
    if(client.value == null)
      delete this.filter.filter.clientID;
    else
      Object.assign(this.filter.filter, {clientID: client.value});
  }

  DelayReasonChange(reason)
  {
    if(reason.value == null)
      delete this.filter.filter.delayrResonID;
    else
      Object.assign(this.filter.filter, {delayrResonID: reason.value});
  }

  Previous_DelayReasonChange(reason)
  {
    if(reason.value == null)
      delete this.filter.filter.Previous_DelayReasonID;
    else
      Object.assign(this.filter.filter, {Previous_DelayReasonID: reason.value});
  }
  Previous_DelayReasonID

  ClaimStatusChange(status)
  {
    if(status.value == null)
      delete this.filter.filter.status;
    else
      Object.assign(this.filter.filter, {status: status.value, current_date: this.currant_date});
  }

}
