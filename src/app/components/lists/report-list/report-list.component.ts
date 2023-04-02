import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { DatePipe } from '@angular/common'
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit {
  drawer :boolean = false;
employeeList:any
filter:  {
  from_date:Date,
  to_date:Date,
  employeeID:any
}
currant_date=new Date();

  constructor(public lang: LanguageService,public app: AppService ) {

  }

  ngOnInit() {}
  getSessionWithFilter(){

  }
}
