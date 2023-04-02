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
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'claims-list',
  templateUrl: './claims-list.component.html',
  styleUrls: ['./claims-list.component.scss'],
})
export class ClaimsListComponent implements OnInit {
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
  claims_info: any
  addForm
  validation_messages:any;
  constructor(public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService, public print: PrintService) {

  
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
    if(this.claim != null){
     await this.addForm.setValue({
      id: this.claim?.id ,
      caseId: this.claim?.caseID,
      balance:this.claim?.balance,
      total:this.claim?.total,
      total_paid: this.claim?.total_paid,
      due_date: this.claim?.due_date,
      discount: this.claim?.discount,
      customerID:this.case?.clientID?this.case.clientID:this.case.companyID,
      details: this.claim?.details
    }) 
    }
    else{
      await this.addForm.setValue({
        id: 0,
        caseId: this.case.id ,
        balance:0,
        total:0,
        total_paid:0,
        due_date: null,
        discount:0,
        customerID:this.case.clientID?this.case.clientID:this.case.companyID,
        details: null

      }) 
    }

    this.validation_messages = {
      'total': [
        { type: 'required', message: 'Court.Claims.messages.total.required' },
      ],
      'due_date': [
        { type: 'required', message: 'Court.Claims.messages.due_date.required' },
      ]
    }

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

  async UpdateClaim() {
    if (this.claim == null) {
      let data = this.addForm.value;
      await this.addForm.setValue({
        id: 0,
        caseId: this.case.id,
        balance:data.total - data.total_paid,
        total:data.total,
        total_paid:0,
        due_date: data.due_date,
        discount:data.discount,
        customerID:this.case.clientID?this.case.clientID:this.case.companyID,
        details: data.details

      }) 
      await this.app.presentLoading();
      if (this.addForm.valid) {
        let data = this.addForm.value;
        try {
          await this.Court.addClaim(data);
          await this.app.dismissLoading();
          this.isEditMode=false
          this.ngOnInit()
        } catch (e) {
          console.log(e);
        }
      } else {
        this.addForm.markAllAsTouched();
        await this.app.dismissLoading();
      }
    } 
    else {
      await this.app.presentLoading();
      if (this.addForm.valid) {
        let data = this.addForm.value;
        if(data.total >= data.balance)
        {
          data = {
            id: data.id,
            caseId: data.caseID,
            balance: this.claim.balance + (data.total - this.claim.total),
            total:data.total,
            total_paid: data.total_paid,
            due_date: data.due_date,
            discount: data.discount,
            details: data.details
          }
        }
        else
        {
          data = {
            id: data.id,
            caseId: data.caseID,
            balance: data.total - data.total_paid,
            total:data.total,
            total_paid: data.total_paid,
            due_date: data.due_date,
            discount: data.discount,
            details: data.details
          }
        }
        
        try {
          await this.Court.UpdateClaim(data);
          this.isEditMode=false
          this.ngOnInit()

          await this.app.dismissLoading();

        } catch (e) {
          console.log(e);
        }
      } else {
        this.addForm.markAllAsTouched();
        await this.app.dismissLoading();
      }

    }
  }
  async add() {  
    if (this.claims_info.balance <= 0 )
    {
      if (this.lang.selectedLang == 'en') 
      {
        await this.app.presentAlert('Warning ~', 'You cannot add any more payment', 'errorAlert');
      }
      else
      {
        await this.app.presentAlert('لا تستطيع دفع المزيد', 'errorAlert');
      }
    }
    else
    {
    const modal = await this.modalController.create({ component: AddClaim, cssClass: 'responsiveModal', componentProps: { claimID: this.claim.id, CaseID:this.CaseID, balance: this.claim.balance, opponent: this.case.opponent.name, total: this.claim.total_paid } });
      modal.onWillDismiss().then(data => {
        this.ngOnInit()
      });
      return await modal.present();
    }
  }

  async ngOnChanges() {
    this.payments = await this.court.getClaimPayment( this.claims.id )
    this.paymentList.data = this.payments
  }
  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.PayemtnColumns : this.PayemtnColumns
  }

  async deleteClaim(row)
  {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Claims.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.court.deleteClaimPayment(row.id)
      this.ngOnInit()
    }
  }

  async openReceipt(payment: payment)
  {
    this.print.openReceipt(payment, this.CaseID)
  }

  async getLastPayment()
  {
    let payment = await this.court.getLastPayment(this.claim.id)
    this.print.openReceipt(payment, this.CaseID)
  }

}

@Component({
  selector: 'add-claim',
  templateUrl: './add-claim.html',
})

export class AddClaim implements OnInit {
  @Input('CaseID') CaseID: number;
  @Input('claimID') claimID: number;
  @Input('balance') balance: number;
  @Input('opponent') opponent: string;
  @Input('total') total: number;
  isLoading = true;
  addForm: FormGroup;
  validation_messages: any;
  constructor(public modalCtrl: ModalController, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService, public print: PrintService) {

    this.addForm = fb.group({
      CaseID: ['', ],
      received_from: ['',],
      amount: ['', [Validators.required]],
      method: ['', [Validators.required]],
      chegue_date: ['',],
      chegue_no: ['',],
      drown_on: ['',],
      comment: ['',],
      due_date: ['',],
      claimID:['',],
      balance: ['',],
      total: ['',]

    });
  } async ngOnInit() {

    this.validation_messages = {
      'received_from': [
        { type: 'required', message: 'Court.Claims.messages.received_from.required' },
      ],
      'amount': [
        { type: 'required', message: 'Court.Claims.messages.amount.required' },
      ],
      'method': [
        { type: 'required', message: 'Court.Claims.messages.method.required' },
      ]
    }
  }

  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      if(data.amount <= this.balance)
      {
        await this.addForm.setValue({
          CaseID:this.CaseID,
          received_from: this.opponent,
          amount: data.amount,
          method: data.method,
          chegue_date:  data.chegue_date?data.chegue_date :null,
          chegue_no: data.chegue_date?data.chegue_date :null,
          drown_on: data.chegue_date?data.drown_on :null,
          comment: data.comment?data.comment :null,
          due_date: null,
          claimID:this.claimID,
          balance: this.balance-data.amount,
          total: this.total + data.amount
        }) 
        try {   
          let data = this.addForm.value;
          let payment = await this.Court.addClaimPayment(data);
          //this.ngOnInit()
          await this.app.dismissLoading();
          this.dismiss();
          this.print.openReceipt(payment, this.CaseID)
        } catch (e) {
          console.log(e);
        }
      }
      else
      {
        if (this.lang.selectedLang == 'en') 
        {
          await this.app.presentAlert('Warning ~', 'The Amount you entered is greater than the balance', 'errorAlert');
        }
        else
        {
          await this.app.presentAlert('تنبيه ~', 'المبلغ المدخل أكبر من المبلغ المتبقي', 'errorAlert');
        }
        await this.app.dismissLoading();
      }
      
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}



