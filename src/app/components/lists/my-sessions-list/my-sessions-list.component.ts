import { Session } from './../../../interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { Router } from '@angular/router';
import { SessionDetailsModal } from 'src/app/pages/court/session/session.page';

@Component({
  selector: 'my-sessions-list',
  templateUrl: './my-sessions-list.component.html',
  styleUrls: ['./my-sessions-list.component.scss'],
})
export class MySessionsListComponent implements OnInit {

  @Input('selectedSession') selectedSession: Session[];
  @Input('showSelected') showSelected: boolean;
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Sessions: Session[]
  SessionColumns: string[];
  SessionsLength: Number;
  SessionList = new MatTableDataSource([]);
  selection = new SelectionModel<Session>(true, []);
  current_date = new Date()

  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) { }

  async ngOnInit() {
    let current_date = new Date;
    current_date.setHours(0, 0, 0, 0);
    let date = {
      current_date: current_date
    }
    this.SessionColumns = ["Case","Case_type","Opponent","Session_Date","Status","Delay_Reason","next_session_date"];
    this.getDisplayedColumns();
    this.Sessions = await this.court.getMySessions(date)
    this.SessionList = new MatTableDataSource(this.Sessions);
    this.SessionList.paginator = this.tablePaginator;
  }

  async ngOnChanges() {
    let current_date = new Date;
    current_date.setHours(0, 0, 0, 0);
    let date = {
      current_date: current_date
    }
    this.Sessions = await this.court.getMySessions(date)
    this.SessionList.data = this.Sessions
  }

  async ngAfterViewInit() {
    let current_date = new Date;
    current_date.setHours(0, 0, 0, 0);
    let date = {
      current_date: current_date
    }
    this.Sessions = await this.court.getMySessions(date)
    this.SessionList = new MatTableDataSource(this.Sessions);
    this.SessionList.paginator = this.tablePaginator;
    this.SessionList.sort = this.sort;
    this.SessionsLength = this.Sessions.length;
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.SessionColumns : this.SessionColumns.filter(dt => dt !== 'Action');
  }


  async details(row) {
    let session = await this.court.getOneSession(row.id)
    const modal = await this.modalController.create({ component: SessionDetailsModal, cssClass: 'responsiveModal', componentProps: {session:session } });
     modal.onWillDismiss().then(data => {
       this.ngOnInit()
     });
     return await modal.present();
  }

}
