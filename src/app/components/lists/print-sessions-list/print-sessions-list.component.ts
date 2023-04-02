import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Employee, Session } from 'src/app/interfaces/types';
import { AuthzService } from 'src/app/services/authz.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CourtService } from 'src/app/services/court.service';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'print-sessions-list',
  templateUrl: './print-sessions-list.component.html',
  styleUrls: ['./print-sessions-list.component.scss'],
})
export class PrintSessionsListComponent implements OnInit {

  @Input('filter') filter: {
    from_date: any,
    to_date: any,
    employeeID: any,
    type: any,
    delayReasonID: any,
    Previous_DelayReasonID:any
    
  }
  @Input('from_date') from_date;
  @Input('to_date') to_date;
  @Input('employeeID') employeeID;
  @Input('selectedSession') selectedSession: Session[];
  @Input('showSelected') showSelected: boolean;
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  currant_date = new Date()
  RealtionType: string
  SessionsLawful: Session[]
  SessionsNotLawful: Session[]
  employeeList: Employee[]
  SessionColumns: string[]
  LawfulSessionList = new MatTableDataSource([]);
  OtherSessionList = new MatTableDataSource([]);
  selection = new SelectionModel<Session>(true, []);
  show = true
  displayLawful = false
  displayOther = false


  constructor(public lang: LanguageService, public authz: AuthzService, public court: CourtService, public app: AppService) {
    
  }

  async ngOnInit() {
    this.employeeList = await this.authz.getEmployees()
    /*this.filter = {
      from_date: this.from_date,
      to_date: this.to_date,
      employeeID: this.employeeID
    }*/

    //console.log(this.filter)

    this.SessionColumns = ["FileNo","Court_no","Case","Opponent", "Lawyer_Name", "Status", "Session_Date", "Previous_delay_Reason", "Previous_delay_Reason_Details", "Delay_Reason", "Upcoming_Session"];
    if (this.filter.employeeID == "None") {
      this.filter.employeeID = null
    }
    this.SessionsLawful = null
    this.SessionsNotLawful = null
    this.displayLawful = false
    this.displayOther = false
    this.SessionsLawful = await this.court.getLawfulSessions(this.filter)
    this.SessionsNotLawful = await this.court.getNotLawfulSessions(this.filter)
    //console.log(this.SessionsLawful)
    //console.log(this.SessionsNotLawful)
    if(this.SessionsLawful?.length > 0)
      this.displayLawful = true

    if(this.SessionsNotLawful?.length > 0)
      this.displayOther = true

    this.getDisplayedColumns2();
    this.LawfulSessionList = new MatTableDataSource(this.SessionsLawful);
    this.OtherSessionList = new MatTableDataSource(this.SessionsNotLawful);
    this.LawfulSessionList.paginator = this.tablePaginator;
    if (this.selectedSession && this.showSelected) {
      let selectedIds = this.selectedSession.map(dt => dt.id);
    }
  }

  /*async ngOnChanges() {
    this.SessionsLawful = await this.court.getLawfulSessions(this.filter)
    this.SessionsNotLawful = await this.court.getNotLawfulSessions(this.filter)

    this.LawfulSessionList.data = this.SessionsLawful
    this.OtherSessionList.data = this.SessionsNotLawful

  }

  async ngAfterViewInit() {
    this.SessionsLawful = await this.court.getLawfulSessions(this.filter)
    this.SessionsNotLawful = await this.court.getNotLawfulSessions(this.filter)

    this.getDisplayedColumns2();
    this.LawfulSessionList = new MatTableDataSource(this.SessionsLawful);
    this.OtherSessionList = new MatTableDataSource(this.SessionsNotLawful);
    this.LawfulSessionList.paginator = this.tablePaginator;
    this.LawfulSessionList.sort = this.sort;
  }*/

  changeTOdate() {
    this.filter.from_date == this.filter.to_date
  }

  getSessionWithFilter2() {
    this.ngOnInit()
  }

  getDisplayedColumns2(): string[] {
    return this.app.isDesktop ? this.SessionColumns : this.SessionColumns
  }

  

}
