import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Task } from 'src/app/interfaces/types';
import { AuthzService } from 'src/app/services/authz.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CourtService } from 'src/app/services/court.service';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { TaskService } from 'src/app/services/task.service';


@Component({
  selector: 'print-tasks-list',
  templateUrl: './print-tasks-list.component.html',
  styleUrls: ['./print-tasks-list.component.scss'],
})

export class PrintTasksListComponent implements OnInit {

  @Input('filter') filter: {
    createdByID: number,
    from_date: any,
    to_date: any,
    employeeID: any,
    Report_Basis: any,
    statusID: number
  }
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  currant_date = new Date()
  RealtionType: string
  Tasks: Task[]
  TaskColumns: string[]
  TasksList = new MatTableDataSource([]);

  constructor(
    public lang: LanguageService,
    public authz: AuthzService,
    public court: CourtService,
    public taskService: TaskService,
    public app: AppService) { }

  async ngOnInit() {

    this.TaskColumns = ["title", "case","Client","File_no","Court_no", "Opponent", "dueDate", "Employee", "status", "details","Note"];
    if (this.filter.employeeID == "None") {
      this.filter.employeeID = null
    }

    let fltr: any = {
      dueDate: {
        gte: this.filter.from_date,
        lte: this.filter.to_date
      }
    };
    if (this.filter.createdByID)
      Object.assign(fltr, { createdByID: this.filter.createdByID });

    if (this.filter.employeeID)
      Object.assign(fltr, { employeeID: this.filter.employeeID });
    if (this.filter.statusID) {
      if (this.filter.statusID == -1) {
        Object.assign(fltr, {
          statusID: {
            not: 3

          }
        });

      }     
      else if (this.filter.statusID == 0) {
        Object.assign(fltr, { statusID: null });

      }
      else {
        Object.assign(fltr, { statusID: this.filter.statusID });

      }

    }

    this.Tasks = await this.taskService.getTasksForPrinting(fltr)

    this.getDisplayedColumns2();
    this.TasksList = new MatTableDataSource(this.Tasks);
    this.TasksList.paginator = this.tablePaginator;

  }

  changeTOdate() {
    this.filter.from_date == this.filter.to_date
  }

  getSessionWithFilter2() {
    this.ngOnInit()
  }

  getDisplayedColumns2(): string[] {
    return this.TaskColumns
  }
}
