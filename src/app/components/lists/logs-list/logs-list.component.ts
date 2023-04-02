import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MatTableExporterModule } from 'mat-table-exporter';

import { AppService } from 'src/app/services/app.service';
import { GeneralService } from 'src/app/services/general.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { JsonExporterService } from 'mat-table-exporter';
import { Employee } from 'src/app/interfaces/types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss'],
})
export class LogsListComponent implements OnInit {
  isAddBlock = false;
  logs: any
  @Input('isAdd') isAdd: boolean = false;
  LogsColumns: string[];
  @Input('selectedLogs') selectedLogs: any;
  LogsList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  @ViewChild('LogsTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  /*filter: {
    from_date: Date,
    to_date: Date,
    userID: number,
    Action: string
  }*/
  filter: any
  drawer: boolean = false;
  range = 'Today'
  today: Date
  employeeList: Employee[];

  constructor(public router: Router, public general: GeneralService, public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService) {
    let date = new Date().setHours(0, 0, 0, 0)
    this.today = new Date(date)
    this.filter = {
      date: {
        gte: this.today,
        lte: this.today
      }
    }
  }
  async ngOnInit() {
    //this.logs = await this.general.get_all_logs(this.filter)
    this.employeeList = await this.authz.getEmployees()
    this.logs = await this.general.get_all_logs(this.filter)
    //console.log("this.logs ")
    //console.log(this.logs)
    this.LogsColumns = ["ID", "table_name", "action", "User","Date" ];
    this.getDisplayedColumns();
    this.LogsList = new MatTableDataSource(this.logs);
    this.LogsList.paginator = this.tablePaginator;
    if (this.selectedLogs && this.showSelected) {
      let selectedIds = this.selectedLogs.map(dt => dt.id);

    }
   
  }


  async Convert_to_string_old_data(logs) {

    document.getElementById("old_data").textContent = JSON.stringify(logs?.old_data, undefined, 2);
    document.getElementById("new_data").textContent = JSON.stringify(logs?.new_data, undefined, 2);

   return null


  }
  
  getDisplayedColumns(): string[] {
    return this.LogsColumns
  }

  ResetFilter() {
    
  }


  async ngOnChanges() {
    this.logs = await this.general.get_all_logs(this.filter)
    this.LogsList.data = this.logs
  }
  async ngAfterViewInit() {
    this.logs = await this.general.get_all_logs(this.filter)
    this.LogsList.data = this.logs
    this.LogsList = new MatTableDataSource(this.logs);
    this.LogsList.paginator = this.tablePaginator;
    this.LogsList.sort = this.sort;
  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  async details(row) {

    this.router.navigate(['system/logs/details', row.id])
    //const modal = await this.modalController.create({ component: LogDetailModal, cssClass: 'responsiveModal', componentProps: { logs: row } });
    //return await modal.present();

  }

  getLogsWithFilter() {
    this.ngOnInit()
  }

  applyFilter() {
    this.LogsList.filterPredicate = (data, filter) => {
      let name = data.user?.first_name + ' ' + data.user?.last_name;
      return data.table_name?.toLocaleLowerCase().includes(filter) ||
        data.action?.toLocaleLowerCase().includes(filter) ||
        name.toLocaleLowerCase().includes(filter)
    }
    this.LogsList.filter = this.searchTerm.trim().toLowerCase();
  }

  changeTOdate() {
    this.filter.from_date == this.filter.to_date
  }

  SelectedRange() {
    if (this.range == "Today") {
      this.filter.date = {
        gte: new Date(this.today),
        lte: new Date(this.today)
      }
    }
    else if (this.range == "ThisMonth") {
      this.filter.date = {
        gte: new Date(this.today.getFullYear(), this.today.getMonth(), 1),
        lte: new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0)
      }
    }
    else if (this.range == "ThisYear") {
      this.filter.date = {
        gte: new Date(this.today.getFullYear(), 0, 1),
        lte: new Date(this.today.getFullYear(), 12, 0)
      }
    }
  }

  FromDateChange(date) {
    this.filter.date.gte = date;
  }

  ToDateChange(date) {
    this.filter.date.lte = date;
  }

  tableChanged(table) {
    if (table.value == null)
      delete this.filter.table_name;
    else
      Object.assign(this.filter, { table_name: table.value });
  }

  actionChanged(action) {
    if (action.value == null)
      delete this.filter.action;
    else
      Object.assign(this.filter, { action: action.value });
  }

}


@Component({
  selector: 'log-detail',
  templateUrl: './log-detail.html',
})

export class LogDetailModal implements OnInit {
  logs: any;
  logID: any;
  constructor(public modalCtrl: ModalController, private route: ActivatedRoute, public general: GeneralService, public app: AppService, public lang: LanguageService, public modalController: ModalController) {


  } async ngOnInit() {
    this.logID = this.route.snapshot.params.id;
    this.logs = await this.general.getOneLog(this.logID)
    this.Convert_to_string()

  }

  async Convert_to_string() {

    document.getElementById("old_data").textContent = JSON.stringify(this.logs?.old_data, undefined, 2);
    document.getElementById("new_data").textContent = JSON.stringify(this.logs?.new_data, undefined, 2);

    return null


  }
  async Convert_to_string2(string) {
    let temp = {
      Report_Type: 'ProfitAndLoss',
      Report_Basis: 'ThisMonth',
      From_Date: '2021-12-31T21:00:00.000Z',
      To_Date: '2022-01-30T21:00:00.000Z'
    }
    document.getElementById("jsons").textContent = JSON.stringify(temp, undefined, 2);

    let json = JSON.stringify(temp)


  }



  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
