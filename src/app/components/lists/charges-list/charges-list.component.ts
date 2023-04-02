
import { Component, OnInit } from '@angular/core';
import { Case, Employee, payment, Session } from 'src/app/interfaces/types';
import { Court, Company, CaseType, CourtRoom, Fees, Charge, ChargeType } from './../../../interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Permission, Role, User, Education, Client } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { DateAdapter } from '@angular/material/core';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'charges-list',
  templateUrl: './charges-list.component.html',
  styleUrls: ['./charges-list.component.scss'],
})
export class ChargesListComponent implements OnInit {
  isAddBlock = false;
  charge: Charge[]

  @Input('FromFinance') FromFinance: Boolean;
  @Input('CaseID') CaseID: number;
  @Input('case') case: Case;
  @Input('isEdit') isEdit: boolean;
  charges: any;
  @Input('isAdd') isAdd: boolean = false;
  ChargesColumns: string[];
  @Input('selectedcharge') selectedcharge: Case[];
  ChargeList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Charge>(true, []);
  @ViewChild('chargeTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  isEditMode: boolean

  addForm
  constructor(
    public Court: CourtService,
    fb: FormBuilder, public router: Router,
    public lang: LanguageService,
    public modalController: ModalController,
    public app: AppService,
    public court: CourtService,
    public authz: AuthzService,
    public print: PrintService
  ) {
  }

  async ngOnInit() {
    if (this.FromFinance) {


      this.charges = await this.court.getAllCharges()
      console.log("this.charges")

      console.log(this.charges)
    }
    else {
      this.case = await this.court.getOnecase(this.CaseID)
      this.charges = this.case.charge


    }

    this.isEditMode = false
    this.ChargesColumns = ["reference_no", "recipient_name", "Charge_name", "amount", "Case", "date", "Status", "comment", "Action"];
    this.getDisplayedColumns();
    this.ChargeList = new MatTableDataSource(this.charges);
    this.ChargeList.paginator = this.tablePaginator;
    if (this.selectedcharge && this.showSelected) {
      let selectedIds = this.selectedcharge.map(dt => dt.id);

    }
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.ChargesColumns : this.ChargesColumns
  }

  async add() {


    const modal = await this.modalController.create({ component: AddCharge, cssClass: 'responsiveModal', componentProps: { CaseID: this.CaseID, recipient_name: this.case?.client?.full_name } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();


  }

  async details(row) {

    const modal = await this.modalController.create({ component: ChargeDetailsModal, cssClass: 'responsiveModal', componentProps: { ChargeID: row.id } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();


  }


  

    applyFilter() {
      //this.caseList.filterPredicate=null
        this.ChargeList.filterPredicate = (data, filter) => {
          //console.log(data)
          return data.case?.CaseNo?.toLocaleLowerCase().includes(filter) ||
          data?.ChargeType?.name_en.toLocaleLowerCase().includes(filter) ||
          data?.ChargeType?.name_ar?.toLocaleLowerCase().includes(filter) ||
          data?.recipient_name?.toLocaleLowerCase().includes(filter) 
  
        }
        this.ChargeList.filter = this.searchTerm.trim().toLowerCase();
      
    
  
    }

  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.court.deleteCharge(row.id)
      this.ngOnInit()

    }
  }

  printCharge(charge) {
    this.print.printCharge(charge, this.CaseID)
  }
}


@Component({
  selector: 'add_charge',
  templateUrl: './add_charge.html',
})

export class AddCharge implements OnInit {
  @Input('CaseID') CaseID: number;
  @Input('recipient_name') recipient_name: string;
  isLoading = true;
  addForm: FormGroup;
  validation_messages: any;
  ChargeTypes: ChargeType[]
  Cases: Case[]
  public CasesFilterCtrl: FormControl = new FormControl();
  public filteredCases: Case[]
  min_date: Date
  max_date = new Date();
  currant_date = new Date();

  constructor( private dateAdapter: DateAdapter<Date> ,public modalCtrl: ModalController, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.min_date = new Date(this.currant_date.getFullYear(), this.currant_date.getMonth(), this.currant_date.getDate() - 7);

    this.addForm = fb.group({
      caseId: ['',],
      reference_no: ['',],
      recipient_name: ['', [Validators.required]],
      ChargeTypeID: ['', [Validators.required]],
      Amounts: ['', [Validators.required]],
      Comments: ['',],
      status: ['', [Validators.required]],
      date: ['',],

    });

    this.addForm.get('status').valueChanges.subscribe(val => {
      if (val == 'Paid') {
        this.addForm.controls['date'].setValidators([Validators.required]);
      } else {

        this.addForm.controls['date'].clearValidators();
      }
    });
  }


  async ngOnInit() {
    this.ChargeTypes = await this.Court.getAllChargeTypes()
    this.addForm.get('caseId').setValue(Number(this.CaseID))

    if (this.recipient_name)
      this.addForm.get('recipient_name').setValue(this.recipient_name)
    this.addForm.get('status').setValue('Pending')


    if (!this.CaseID) {
      this.Cases = await this.Court.getCaseForList()
      this.filteredCases = this.Cases

    }

    this.validation_messages = {
      'Charge_name': [
        { type: 'required', message: 'Court.Charge.massages.Charge_name.required' },
      ],
      'Amounts': [
        { type: 'required', message: 'Court.Charge.massages.Amounts.required' },
      ],
      'recipient_name': [
        { type: 'required', message: 'Court.Charge.massages.Amounts.required' },

      ],
      'Status': [
        { type: 'required', message: 'Court.Charge.massages.Status.required' },
      ],
    }
  }

  public filterEmployeelist(value) {

    return this.filteredCases = this.Cases.filter((val) => {
      let c = val?.CaseNo + "-" + val.client?.full_name;

      return c.toLowerCase().includes(this.CasesFilterCtrl.value);
    })



  }
  async getcase(ev) {

    this.recipient_name = await (await this.court.getOnecase(Number(ev.value))).client.full_name
    this.addForm.get('recipient_name').setValue(this.recipient_name)

  }

  clearSelectionCases() {
    this.filteredCases = this.Cases
  }
  async getChargeAmount() {


    let chragetype = await this.court.getOneChargeType(this.addForm.value.ChargeTypeID)

    this.addForm.get('Amounts').setValue(chragetype.amount)


  }
  async add() {

    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;

      await this.addForm.setValue({
        caseId: data.caseId ? data.caseId :null,
        reference_no: data.reference_no,
        ChargeTypeID: data.ChargeTypeID,
        Amounts: data?.Amounts,
        Comments: data.Comments,
        status: data?.status,
        date: data.date ? data.date : null,


        recipient_name: data.recipient_name

      })
      try {
        let data = this.addForm.value;
        data = {
          caseId: data.caseId ? data.caseId : null,
          reference_no: data.reference_no,
          ChargeTypeID: data?.ChargeTypeID,
          Amounts: data?.Amounts,
          Comments: data?.Comments,
          status: data?.status,
          date: data.date ? data.date : null,
          recipient_name: data?.recipient_name

        }
        await this.Court.addCharge(data);
        await this.app.dismissLoading();
        this.dismiss();

      } catch (e) {
        console.log(e);
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

@Component({
  selector: 'charge-details',
  templateUrl: './charge-details.html',
})

export class ChargeDetailsModal implements OnInit {
  ChargeTypes: ChargeType[]
  @Input('ChargeID') ChargeID: number;
  @Input('recipient_name') recipient_name: string;
  Show_recipient_name: boolean
  charge: Charge;
  isLoading = true;
  updateForm: FormGroup;
  validation_messages: any;
  currant_date = new Date();
  min_date: Date
  max_date = new Date();
  Cases: Case[]
  public CasesFilterCtrl: FormControl = new FormControl();
  public filteredCases: Case[]
  constructor( private dateAdapter: DateAdapter<Date> ,public modalCtrl: ModalController, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.min_date = new Date(this.currant_date.getFullYear(), this.currant_date.getMonth(), this.currant_date.getDate() - 7);
    this.Show_recipient_name = true
    this.updateForm = fb.group({
      id: ['',],
      reference_no: ['',],
      caseId: ['',],
      ChargeTypeID: ['', [Validators.required]],
      Amounts: ['', [Validators.required]],
      Comments: ['',],
      Status: ['', [Validators.required]],
      date: ['',],
      recipient_name: ['',]

    });

    this.updateForm.get('Status').valueChanges.subscribe(val => {
      if (val == 'Paid') {
        this.updateForm.controls['date'].setValidators([Validators.required]);
      } else {

        this.updateForm.controls['date'].clearValidators();
      }
    });



  }

  public filterEmployeelist(value) {

    return this.filteredCases = this.Cases.filter((val) => {
      let c = val?.CaseNo + "-" + val.client?.full_name;

      return c.toLowerCase().includes(this.CasesFilterCtrl.value);
    })



  }
  async getcase(ev) {

    this.recipient_name = await (await this.court.getOnecase(Number(ev.value))).client.full_name
    this.updateForm.get('recipient_name').setValue(this.recipient_name)
    if (ev.value) {
      this.Show_recipient_name = false
    }

  }

  clearSelectionCases() {
    this.filteredCases = this.Cases
  }
  async ngOnInit() {

    this.charge = await this.court.getOneCharge(this.ChargeID);

    this.updateForm.setValue({
      id: this.ChargeID,
      reference_no: this.charge.reference_no,
      caseId: this.charge.caseId,
      ChargeTypeID: this.charge.ChargeTypeID,
      Amounts: this.charge?.Amounts,
      Comments: this.charge?.Comments,
      Status: this.charge.status,
      date: this.charge?.Date,
      recipient_name: this.charge?.recipient_name
    })
    this.Cases = await this.Court.getCaseForList()
    this.filteredCases = this.Cases
    this.ChargeTypes = await this.Court.getAllChargeTypes()
    if (this.charge.caseId) {
      this.Show_recipient_name = false
    }

    this.validation_messages = {
      'Charge_name': [
        { type: 'required', message: 'Court.Charge.massages.Charge_name.required' },
      ],
      'ChargeTypeID': [
        { type: 'required', message: 'Court.Charge.massages.Amounts.required' },
      ],
      'Status': [
        { type: 'required', message: 'Court.Charge.massages.Status.required' },
      ],
      'CPR': [
        { type: 'pattern', message: 'Court.Charge.massages.CPR.pattern' },
        { type: 'required', message: 'Court.Charge.massages.CPR.required' },
      ],
      'Name': [
        { type: 'required', message: 'Court.Charge.massages.Name.required' },
      ],
      'date': [
        { type: 'required', message: 'Court.Charge.massages.date.required' },
      ]
    }
  }

  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      try {
        await this.Court.updateCharge(data);
        await this.app.dismissLoading();
        this.dismiss();
        this.ngOnInit()
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }


  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
