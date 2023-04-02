import { Case, Company } from './../../../interfaces/types';
import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/interfaces/types';
import { CourtService } from 'src/app/services/court.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
client:Client[];
Company:Company[]
cases:Case[];
segment:number
  constructor(public court: CourtService) { }

 async ngOnInit() {
this.segment=0;
    this.client= await this.court.getAllClients(); 
    this.Company= await this.court.getAllcompanies(); 
    this.cases=await this.court.getAllCases();

  }

}
