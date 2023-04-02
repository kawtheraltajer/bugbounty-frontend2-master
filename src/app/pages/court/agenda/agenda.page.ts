
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CaseType, Court, DelayReson, Employee, Session, Opponent, Case, Client } from 'src/app/interfaces/types';
import { AuthzService } from 'src/app/services/authz.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort, MAT_SORT_HEADER_INTL_PROVIDER_FACTORY } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CourtService } from 'src/app/services/court.service';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import * as moment from 'moment';
import { PrintSessionsListComponent } from '../../../components/lists/print-sessions-list/print-sessions-list.component'
import { ActivatedRoute, Router } from '@angular/router';
import { CaseListComponent } from '../../../components/lists/case-list/case-list.component'
import { formatDate } from '@angular/common';
import { SessionDetailsModal } from '../session/session.page';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { PrintService } from 'src/app/services/print.service';
import { TranslateService } from '@ngx-translate/core';
import { timingSafeEqual } from 'crypto';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  segment: number;
  filter: {
    from_date: any,
    to_date: any,
    employeeID: any,
    type: any,
    delayReasonID: any,
    Previous_DelayReasonID: any
    status: any,
    caseID: number,
    case: {
      courtID: number,
      clientID: number,
      Opponent: {
        id: number
      }
    }

  }
  getAllData: boolean
  show_table: boolean = true;
  currant_date = new Date();
  formattedDate;
  employeeList: Employee[]
  public EmployeeFilterCtrl: FormControl = new FormControl();
  public filteredEmployee: Employee[]
  Courts: Court[];
  types: CaseType[];
  filter2: any = {}
  RealtionType: string
  Sessions: any[]
  sortedData: any[];
  Columnslist: { name: string, isSelected: boolean, value: string }[]
  Filter_Colums: any;
  @Input('isEdit') isEdit: boolean;
  @Input('isAdd') isAdd: boolean = false;
  SessionColumns: any;
  @Input('selectedSession') selectedSession: Session[];
  SessionList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Session>(true, []);
  @ViewChild('SessionTablePaginator', { static: true }) SessionTablePaginator: MatPaginator;
  @ViewChild(PrintSessionsListComponent) child: PrintSessionsListComponent;
  @ViewChild(CaseListComponent) caseList: CaseListComponent;
  isSearch = false;
  searchTerm = '';
  drawer: boolean = false;
  DelayReasons: DelayReson[];
  public CasesFilterCtrl: FormControl = new FormControl();
  public ClientFilterCtrl: FormControl = new FormControl();
  public OpponentFilterCtrl: FormControl = new FormControl();
  DelayResons: DelayReson[]
  public ReasonFilterCtrl: FormControl = new FormControl();
  public filteredReason: DelayReson[];
  filteredCases: Case[]
  filteredClient: Client[]
  filteredOpponent: Opponent[]
  Opponents: Opponent[]
  clients: Client[]
  DontSowForPrint: boolean = false
  Cases: Case[]
  tableData: any;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {

    this.SessionList.sort = sort;
  }
  print_list: { name: string, isSelected: boolean, value: string }[]

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public print: PrintService,
    public router: Router,
    public lang: LanguageService,
    public modalController: ModalController,
    public authz: AuthzService,
    public court: CourtService,
    public app: AppService,
    public translate: TranslateService,
    private act: ActivatedRoute) {
    if (!(this.authz.canDo('READ', 'Court', []) || this.authz.canDo('MANAGE', 'Court', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.print_list = []
    this.print_list = [
      {
        name: 'FileNo',
        value: 'FileNo',
        isSelected: true,
      },
      {
        name: 'Court_no',
        value: 'Court_no',
        isSelected: true,

      },
      {
        name: 'Case',
        value: 'Case',
        isSelected: true,

      },
      {
        name: 'Client',
        value: 'Client',
        isSelected: true,
      },
      {
        name: 'caseRepresentative',
        value: 'caseRepresentative',
        isSelected: true,

      },
      {
        name: 'Opponent',
        value: 'Opponent',
        isSelected: true,

      },
      {
        name: 'Lawyer_Name',
        value: 'Lawyer_Name',
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
        name: 'Previous_delay_Reason',
        value: 'Previous_delay_Reason',
        isSelected: true,

      },
      {
        name: 'Previous_delay_Reason_Details',
        value: 'Previous_delay_Reason_Details',
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

      },
      {
        name: 'decision',
        value: 'decision',
        isSelected: false,

      }

    ]
    this.Columnslist = [
      {
        name: 'FileNo',
        value: 'FileNo',
        isSelected: true,
      },
      {
        name: 'Court_no',
        value: 'Court_no',
        isSelected: true,

      },
      {
        name: 'Case',
        value: 'Case',
        isSelected: true,

      },
      {
        name: 'Client',
        value: 'Client',
        isSelected: true,
      },
      {
        name: 'caseRepresentative',
        value: 'caseRepresentative',
        isSelected: true,

      },
      {
        name: 'Opponent',
        value: 'Opponent',
        isSelected: true,

      },
      {
        name: 'Lawyer_Name',
        value: 'Lawyer_Name',
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
        name: 'Previous_delay_Reason',
        value: 'Previous_delay_Reason',
        isSelected: true,

      },
      {
        name: 'Previous_delay_Reason_Details',
        value: 'Previous_delay_Reason_Details',
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

      },
      {
        name: 'decision',
        value: 'decision',
        isSelected: false,

      },
      {
        name: 'Note',
        value: 'Note',
        isSelected: false,

      },

    ]
    this.currant_date.setHours(0, 0, 0, 0);
    this.filter = {
      from_date: this.currant_date,
      to_date: this.currant_date,
      employeeID: null,
      Previous_DelayReasonID: null,
      type: null,
      delayReasonID: null,
      status: null,
      caseID: null,
      case: {
        courtID: null,
        clientID: null,
        Opponent: {
          id: null
        }
      }


    }
    if (this.act.snapshot.params.id) {
      this.filter.employeeID = Number(this.act.snapshot.params.id)
    }
    this.segment = 0
    this.formattedDate = formatDate(this.currant_date, 'dd-MM-yyyy', 'en-US');
  }
  ionViewWillEnter() {
    if (!(this.authz.canDo('READ', 'Court', []) || this.authz.canDo('MANAGE', 'Court', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }
  async details(row) {
    //this.router.navigate(['court/cases-list/CaseDetails/', row.case.id])
    let session = await this.court.getOneSession(row.id)
    const modal = await this.modalController.create({ component: SessionDetailsModal, cssClass: 'responsiveModal', componentProps: { session: session } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }
  changeTOdate() {
    this.filter.from_date == this.filter.to_date
  }

  async ngOnInit() {

    if (!(this.authz.canDo('READ', 'Court', []) || this.authz.canDo('MANAGE', 'Court', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.drawer = false;
    this.Filter_Colums = this.Columnslist.filter((list) => list.isSelected == true)
    this.SessionColumns = [];

    for (let i = 0; i < this.Filter_Colums.length; i++) {

      this.SessionColumns.push(this.Filter_Colums[i].value);


    }
    if (this.segment == 0) {
      await this.app.presentLoading();
      this.Sessions = await this.court.getFilteredSessions(this.filter)
      this.sortedData = this.Sessions.slice();
      this.SessionList = new MatTableDataSource(this.Sessions);


      this.app.dismissLoading()
      this.Cases = await this.court.getCaseForList()
      this.filteredCases = this.Cases
      this.clients = await this.court.getClientForList()
      this.filteredClient = await this.clients
      this.Opponents = await this.court.getOpponentForList()
      this.filteredOpponent = this.Opponents

    }
    //this.child.ngOnInit()
    this.getDisplayedColumns();
    this.SessionList = new MatTableDataSource(this.Sessions);
    this.SessionList.paginator = this.SessionTablePaginator;
    this.SessionList.sort = this.sort;
    if (this.selectedSession && this.showSelected) {
      let selectedIds = this.selectedSession.map(dt => dt.id);
    }
    if (this.segment == 1) {
      this.RealtionType = "Appeal"
    }
    else if (this.segment == 2) {
      this.RealtionType = "Discrimination"
    }
    this.employeeList = await this.authz.getEmployees()
    this.filteredEmployee = this.employeeList
    this.Courts = await this.court.getAllCourts()
    this.types = await this.court.getAllCaseType()
    this.DelayReasons = await this.court.getDelayReson()

  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  async ngAfterViewInit() {

    this.SessionList = new MatTableDataSource(this.Sessions);
    this.SessionList.sort = this.sort;
    this.SessionList.sortingDataAccessor = (item, property) => {
      console.log(item, property)
      switch (property) {
        case 'FileNo': return item.case.internalFile_no;
        default: return item[property];
      }
    };
  }

  public filterCaselist(value) {
    if (this.CasesFilterCtrl.value == null || this.CasesFilterCtrl.value == "") {
      this.ngOnInit()
    } else {
      return this.filteredCases = this.Cases.filter((val) => {
        let c = val?.CaseNo + "-" + val.client?.full_name;

        return c.toLowerCase().includes(this.CasesFilterCtrl.value);
      })
    }





  }

  setDataSourceAttributes() {
    this.SessionList.sort = this.sort;
  }
  public filterClients(value) {
    if (this.ClientFilterCtrl.value == null || this.ClientFilterCtrl.value == "") {
      this.ngOnInit()
    } else {
      return this.filteredClient = this.clients.filter((val) => val.full_name.toLowerCase().includes(this.ClientFilterCtrl.value));
    }
  }
  clearClientSelection() {
    this.filteredClient = this.clients
  }

  public filterOpponents(value) {
    if (this.OpponentFilterCtrl.value == null || this.OpponentFilterCtrl.value == "") {
      this.ngOnInit()
    } else {
      return this.filteredOpponent = this.Opponents.filter((val) => val.name.toLowerCase().includes(this.OpponentFilterCtrl.value));
    }
  }
  clearOpponentSelection() {
    this.filteredOpponent = this.Opponents
  }

  clearSelectionCases() {
    this.filteredCases = this.Cases
  }
  CourtSelection(event) {
    if (event.val == null)
      delete this.filter.case.courtID;
    else
      Object.assign(this.filter, { case: { courtID: event.val } });
  }
  OpponentSelection(event) {
    if (event.val == null)
      delete this.filter.case.Opponent.id;
    else
      Object.assign(this.filter, { case: { Opponent: { id: event.val } } });
  }
  clientSelection(event) {
    if (event.val == null)
      delete this.filter.case.clientID;
    else
      Object.assign(this.filter, { case: { clientID: event.val } });
  }
  CaseSelection(event) {
    alert(event.val)
    if (this.filter.case == null)
      delete this.filter.caseID;
    else
      Object.assign(this.filter, { caseID: this.filter.caseID });
  }
  async getSessionWithFilter() {
    this.SessionList = null;
    if (this.filter.case == null)
      delete this.filter.caseID;
    else
      Object.assign(this.filter, { caseID: this.filter.caseID });
    //this.child.getSessionWithFilter2()
    //this.child.ngOnInit()
    this.ngOnInit()


  }

  applyFilter() {
    this.SessionList.filterPredicate = (data, filter) => {
      let c = data.case?.CaseNo + "-" + data.case?.client?.full_name;
      return data.reference_no?.toLocaleLowerCase().includes(filter) ||
        c.toLocaleLowerCase().includes(filter) ||
        data.case?.client?.full_name?.toLocaleLowerCase().includes(filter) ||
        data.case.type?.name_ar?.toLocaleLowerCase().includes(filter) ||
        data.case.type?.name_en?.toLocaleLowerCase().includes(filter) ||
        data.status?.toLocaleLowerCase().includes(filter) ||
        data.representative?.user.first_name?.toLocaleLowerCase().includes(filter) ||
        data.representative?.user.last_name?.toLocaleLowerCase().includes(filter) ||
        data.DelayReson?.name_ar?.toLocaleLowerCase().includes(filter) ||
        data.DelayReson?.name_en?.toLocaleLowerCase().includes(filter)
    }

    if (this.searchTerm == 'قيد الإنتظار')
      this.SessionList.filter = 'upcoming'.toLowerCase();

    else if (this.searchTerm == 'تأجيل')
      this.SessionList.filter = 'delayed'.toLowerCase();

    else if (this.searchTerm == 'محسومة')
      this.SessionList.filter = 'finished'.toLowerCase();

    else
      this.SessionList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.SessionColumns : this.SessionColumns
  }


  async printDiv12() {
    this.DontSowForPrint = true;
    await this.app.presentLoading();
    let popupWin, alignment, dir, title1 = '', tableData = '', sessionsTitle = '', date = '';

    if (this.lang.selectedLang == 'en') {
      sessionsTitle = "Sessions"
      date = 'From ' + moment(this.filter.from_date.toDateString()).format("DD/MM/YYYY") + " to " + moment(this.filter.to_date.toDateString()).format("DD/MM/YYYY")
      if (this.filter.type)
        title1 = "<h4 align='center' style='padding-top:2rem;'> " + this.translate.instant('Court.Cases.Case-type.Case_Types_Type.' + this.filter.type) + "</h4>"
      else {
        title1 = "<h4 align='center' style='padding-top:2rem;'> Sessions for all court </h4>"

      }
      alignment = "left"
      dir = "ltr"
    }
    else {

      sessionsTitle = "Sessions"
      if (this.filter.type)
        title1 = "<h4 align='center' style='padding-top:2rem;'> " + this.translate.instant('Court.Cases.Case-type.Case_Types_Type.' + this.filter.type) + "</h4>"
      else {
        title1 = "<h4 align='center' style='padding-top:2rem;'> الجلسات لجميع المحاكم </h4>"

      }
      alignment = "right"
      dir = "rtl"
      sessionsTitle = "الجلسات"
      date = 'من ' + moment(this.filter.from_date.toDateString()).format("DD/MM/YYYY") + " إلى " + moment(this.filter.to_date.toDateString()).format("DD/MM/YYYY")
    }
    this.tableData = null
    this.tableData = document.getElementById('tableData').innerHTML;

    this.tableData = `
        <table class="table table-bordered"  dir= ${dir}>
          ${this.tableData}
        </table>`


    popupWin = window.open('', '_blank', 'top=0,left=0,height=300,width=800');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 16px;
              min-height: 30px !important;
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
            td {
              min-height: 30px !important;
            }
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
          <title>Sessions</title>
        </head>
        <body>
          <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
              Print PDF
          </button>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
          <div style="padding-top:5rem;">
          <h1 align="center">${sessionsTitle}</h1>
          <h4 dir= ${dir}>${date}</h4>
          ${title1}
          ${this.tableData}
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
    await this.app.dismissLoading();

  }



  async printDiv1w2() {
    this.DontSowForPrint = true;
    await this.app.presentLoading();
    let popupWin, alignment, dir, title1 = '', tableData = '', sessionsTitle = '', date = '';

    if (this.lang.selectedLang == 'en') {
      sessionsTitle = "Sessions"
      date = 'From ' + moment(this.filter.from_date.toDateString()).format("DD/MM/YYYY") + " to " + moment(this.filter.to_date.toDateString()).format("DD/MM/YYYY")
      if (this.filter.type)
        title1 = "<h4 align='center' style='padding-top:2rem;'> " + this.translate.instant('Court.Cases.Case-type.Case_Types_Type.' + this.filter.type) + "</h4>"
      else {
        title1 = "<h4 align='center' style='padding-top:2rem;'> Sessions for all court </h4>"

      }
      alignment = "left"
      dir = "ltr"
    }
    else {

      sessionsTitle = "Sessions"
      if (this.filter.type)
        title1 = "<h4 align='center' style='padding-top:2rem;'> " + this.translate.instant('Court.Cases.Case-type.Case_Types_Type.' + this.filter.type) + "</h4>"
      else {
        title1 = "<h4 align='center' style='padding-top:2rem;'> الجلسات لجميع المحاكم </h4>"

      }
      alignment = "right"
      dir = "rtl"
      sessionsTitle = "الجلسات"
      date = 'من ' + moment(this.filter.from_date.toDateString()).format("DD/MM/YYYY") + " إلى " + moment(this.filter.to_date.toDateString()).format("DD/MM/YYYY")
    }
    this.tableData = null
    this.tableData = document.getElementById('tableData').innerHTML;

    this.tableData = `
        <table class="table table-bordered"  dir= ${dir}>
          ${this.tableData}
        </table>`
    let content = `
<table class="mat-table cdk-table mat-sort z-10 w-full overflow-y-auto bg-background text-step-600" dir= ${dir}>
<thead><tr>`
    for (let i = 0; i < this.print_list.length; i++) {
      content = content + `<th> ${this.translate.instant("Court.Session.Filter." + this.print_list[i]?.name)} </th>`
    }
    `</tr></thead>
`
    let empty = '  ';
    for (let i = 0; i < this.Sessions.length; i++) {
      content = content + `<tbody><tr style="width: 500px;" ><td> ${this.Sessions[i].case?.internalFile_no} </td>
      <td> ${this.Sessions[i].case.court?.name} - ${this.Sessions[i].case?.courtRoomID}</td> <td    > ${this.Sessions[i].case?.CaseNo} </td>
 <td style="width:20px;" > ${this.Sessions[i].case?.client?.full_name} </td>
 <td> ${this.Sessions[i].case?.caseRepresentative ? this.translate.instant("Court.Cases.Form.caseRepresentative." + this.Sessions[i].case?.caseRepresentative) : empty}</td>
    
 <td> ${this.Sessions[i].case.opponent?.name}</td>
<td> ${this.Sessions[i].representative?.user.first_name ? this.Sessions[i].representative?.user.first_name : empty}  ${this.Sessions[i].representative?.user.last_name ? this.Sessions[i].representative?.user.last_name : empty}</td>
<td> ${this.translate.instant("Court.Session.Form.status." + this.Sessions[i].status)}</td>
 <td>     ${new Date(this.Sessions[i].date).toLocaleDateString("es-CL")} </td>
 <td> ${this.Sessions[i].Previous_DelayReason?.name_ar ? this.Sessions[i].Previous_DelayReason?.name_ar : empty} </td>
   <td style="width: 500px;"> ${this.Sessions[i].Previous_DelayReason_Details ? this.Sessions[i].Previous_DelayReason_Details : empty} </td>
 <td> ${this.Sessions[i].DelayReason?.name_ar ? this.Sessions[i].DelayReason?.name_ar : empty} </td>
    <td> ${this.Sessions[i].next_session_date ? new Date(this.Sessions[i].next_session_date).toLocaleDateString("es-CL") : ' '} </td>
    <td style="width: 150px;text-align: justify;" >  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; <br>  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp; </td>
    
    </tr></tbody>`






    }

    `</table>`



    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 16px;
              min-height: 30px !important;
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
            }
          }
          @media screen
          {
            td {
              min-height: 30px !important;
            }
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
            }
          }
        </style>
        <head>
          <title>Sessions</title>
        </head>
        <body>
          <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
              Print PDF
          </button>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
          <div style="padding-top:5rem;">
          <h1 align="center">${sessionsTitle}</h1>
          <h4 dir= ${dir}>${date}</h4>
          ${title1}
          <table class="table table-bordered"  dir= ${dir}>

          <tr>
          </tr>
          </table>
          ${content}
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
    await this.app.dismissLoading();

  }
  EmployeeIDChange(id) {
    if (id.value == null)
      delete this.filter2.representativeID;
    else
      Object.assign(this.filter2, { representativeID: id.value });
  }
  StatusChange(status) {
    if (status.value == null)
      delete this.filter2.status;
    else
      Object.assign(this.filter, { status: status.value });
    Object.assign(this.filter2, { status: status.value });
  }
  CourtChange(court) {
    if (court.value == null)
      delete this.filter2.courtID;
    else
      Object.assign(this.filter2, { courtID: court.value });
  }
  TypeChange(type) {
    if (type.value == null)
      delete this.filter2.typeID;
    else
      Object.assign(this.filter2, { typeID: type.value });
  }
  getCasesWithFilter() {
    this.ngOnInit()
  }
  resetFilter() {
    this.filter2 = {}
  }

  public dssdsda() {
    let printContents, title
    this.getAllData = true
    printContents = document.getElementById('tableData').innerHTML

    if (this.lang.selectedLang == 'en') {
      title = 'Session List'
    }
    else {
      title = 'الجلسات'
    }
    this.print.printDiv(printContents, title)
    this.getAllData = false
  }
  public printDiv2() {
    this.caseList.printDiv(this.segment)
  }
  teste() {
    this.print.printData(this.Sessions, null, 'test', null, true, this.Sessions)

  }

  public filterEmployeelist(value) {
    return this.filteredEmployee = this.employeeList.filter((val) => {
      let c = val.user?.first_name + " " + val.user?.last_name
      return c.toLowerCase().includes(this.EmployeeFilterCtrl.value);
    })
  }

  clearSelectionEmployee() {
    this.filteredEmployee = this.employeeList
  }

  reset() {
    this.filter = {
      from_date: this.currant_date,
      to_date: this.currant_date,
      employeeID: null,
      type: null,
      delayReasonID: null,
      Previous_DelayReasonID: null,
      status: null,
      caseID: null,
      case: {
        courtID: null,
        clientID: null,
        Opponent: {
          id: null
        }
      }


    }
    this.filter2 = this.filter
    this.child.ngOnInit()
  }
}
