import { Component, OnInit } from '@angular/core';
import { Case, Claim, payment } from 'src/app/interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Client } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-session-list',
  templateUrl: './employee-session-list.component.html',
  styleUrls: ['./employee-session-list.component.scss'],
})
export class EmployeeSessionListComponent implements OnInit {

  isAddBlock = false;
  payment: payment[]
  claim: Claim
  @Input('claims') claims: Claim;
  @Input('CaseID') CaseID: number;
  @Input('case') case: Case;
  @Input('isEditMode') isEditMode: boolean;
  payments: any;
  @Input('isAdd') isAdd: boolean = false;
  PayemtnColumns: string[];
  @Input('selectedpayemt') selectedpayment: Case[];
  paymentList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Client>(true, []);
  @ViewChild('paymentTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  //isEditMode: boolean
  claims_info: any
  addForm
  validation_messages:any;
  constructor(public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {

    this.addForm = fb.group({
      id: ['',],
      caseId: ['', ],
      balance: ['',],
      total: ['', [Validators.required]],
      total_paid: ['', ],
      due_date: ['', [Validators.required]],
      discount: ['',],
      customerID:['',],
      details: ['',]

    });
  }

  async ngOnInit() {

    this.claim = await this.court.getClaim(this.CaseID)
    this.case = await this.court.getOnecase(this.CaseID)
    this.claims_info = this.claim

    this.isEditMode = false
    this.PayemtnColumns = ["ID", "received_from", "amount", "method", "comment", "Action"];
    this.getDisplayedColumns();
    this.payments = await this.court.getClaimPayment( this.claim.id )
    
    this.paymentList = new MatTableDataSource(this.payments);
    this.paymentList.paginator = this.tablePaginator;
    if (this.selectedpayment && this.showSelected) {
      let selectedIds = this.selectedpayment.map(dt => dt.id);
    }

  }

  applyFilter() {
    this.paymentList.filter = this.searchTerm.trim().toLowerCase();
  }

  async ngOnChanges() {
    this.payments = await this.court.getClaimPayment( this.claims.id )
    this.paymentList.data = this.payments
  }
  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.PayemtnColumns : this.PayemtnColumns.filter(dt => dt !== 'Action');
  }

}
