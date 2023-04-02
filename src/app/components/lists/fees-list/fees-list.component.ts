import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Receipt, Case, payment } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import {  Router } from '@angular/router';
import { FinanceService } from 'src/app/services/finance.service';
import { PrintService } from 'src/app/services/print.service';
import { AddInvoiceModal } from '../invoice-list/invoice-list.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'fees-list',
  templateUrl: './fees-list.component.html',
  styleUrls: ['./fees-list.component.scss'],
})
export class FeesListComponent implements OnInit {
  @Input('CaseID') CaseID: number;
  @Input('ClientID') ClientID: number;
  @Input('companyID') companyID: number;
  typeOfAdd:"Add"
  @Input('case') case: Case;
  Receipts: Receipt[]
  Invoice: any = null
  InvoiceDetail: any
  clientID: number
  constructor(public print: PrintService,
    public finance: FinanceService, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
  }

  async ngOnInit() {
    if (this.CaseID) {
      this.case = await this.court.getOnecase(this.CaseID)
      this.Invoice = await this.court.getCaseInvoice(this.CaseID);
      this.clientID = this.case.clientID
      this.companyID=this.case.companyID
      this.InvoiceDetail = this.Invoice.InvoiceItems;
      this.Receipts = this.Invoice.Receipts;
    } else {
      this.Invoice = null
    } this.clientID = this.case?.clientID
  
  } 

  printInvoice() {
    this.print.printInvoice(this.Invoice)
  }

  async add() {
    console.log(this.clientID)
    const modal = await this.modalController.create({ component: AddInvoiceModal, cssClass: 'responsiveModal', componentProps: { caseID:this.CaseID,clientID:this.clientID, } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async choose_one() {
    let confirm = await this.app.presentConfirmAlert("Choose one ", "Finance.Invoice.Errors.Add_or_link", "Operations.link_inv", "Operations.add_inv", true)
    if (confirm) {
       this.add();
    
    }else{
      this.link()
    }
  }
  async link() {
    console.log(this.clientID)
    const modal = await this.modalController.create({ component: LinkCaseToInvoice, cssClass: 'responsiveModal', componentProps: { case:this.case,clientID:this.clientID, } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

}

@Component({
  selector: 'link_case_to_invoice',
  templateUrl: './link_case_to_invoice.html',
})
export class LinkCaseToInvoice implements OnInit {
  @Input('case') case: any;
  @Input('ClientID') ClientID: number;
  @Input('companyID') companyID: number;
  addForm
  InvoiceFilter:any;
  invoices:any
  public InvoiceFilterCtrl: FormControl = new FormControl();

  constructor(public print: PrintService,
    public finance: FinanceService, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
      this.addForm = fb.group({
        id: ['',],
        caseID: ['', ],
        clientID: ['', ],
  
      })
 
    }

  async ngOnInit() {
    this.addForm.setValue({
      id:null,
      caseID: this.case?.id,
      clientID:this.case?.clientID
    })
    this.invoices= await this.finance.getunlinkInvoices()  
    this.InvoiceFilter = this.invoices
  } 

  printInvoice() {
  }

  async link() {
    let data = this.addForm.value;
 await this.finance.linkcasetoinvoice(data)
 this.dismiss()
 
  }
  public filterinvoice(value) {
    return this.InvoiceFilter = this.invoices.filter((val) => val.invoice_no.toLowerCase().includes(this.InvoiceFilterCtrl.value) ||
      val.recipient_name.toLowerCase().includes(this.InvoiceFilterCtrl.value)
    );

  }
  clearSelectionInvoice() {
    this.InvoiceFilter = this.invoices
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}







