
import { Case, Employee,Court, Company, CaseType, CourtRoom, Client, Session, Opponent } from 'src/app/interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSessionModal, SessionDetailsModal } from 'src/app/pages/court/session/session.page';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Pagination } from 'src/app/interfaces/commen-interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Console } from 'console';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss'],
})
export class CaseListComponent implements OnInit {
  allCases: { page: number, data: Case[] }[] = [];
  isAddBlock = false;
  Carrant_Date = new Date()
  formattedDate;
  cases: Case[] = []
  casesFilted: any
  port: any
  @Input('RelatedCaseID') RelatedCaseID: number
  @Input('IsRelated') IsRelated: boolean
  @Input('FromCompany') FromCompany: boolean
  @Input('CompanyID') CompanyID: number
  @Input('FromClient') FromClient: boolean
  @Input('ClientID') ClientID: number
  @Input('RealationType') RealationType: any;
  @Input('Filter') Filter: any;
  CurrantDate = new Date()
  @Input('cases') case: Case[]
  @Input('isEdit') isEdit: boolean;
  Cases: Case[];
  CaseColumns: string[];
  @Input('selectedclient') selectedclient: Case[];
  caseList = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort: MatSort;
  currentPage = 0;
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  isSearch = false;
  searchTerm = '';
  defaultFilterPredicte: any;
  paginate: Pagination = {
    take: 5,
    skip: 0
  }
  pageData: any;
  isEnd = false;
  itemsPerPage = 5;
  dataCount = 0;
  result: any
  filter
  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    this.formattedDate = formatDate(this.CurrantDate, 'dd-MM-yyyy', 'en-US');
  }
  async ngOnInit() {

    if (this.RealationType) {
      this.CaseColumns = ["ID", "Case_no", "File_no", "Client", "Level", "Opponent", "Related_Company", "Court_no", "Case_status", "Case_type", "Remming_days"];

    } else {
      this.CaseColumns = ["ID", "Case_no", "File_no", "Client", "Level", "Opponent", "Related_Company", "Court_no", "Case_status", "Case_type", "Action"];
    }
    this.getDisplayedColumns();
    //this.Cases = await this.court.getAllCases()

      this.getallcases()


  }
  clear() {
    this.searchTerm = ""
    this.ngOnInit()
  }

  clearSearchList() {
    if (this.searchTerm == null || this.searchTerm == "") {
      this.ngOnInit()
    }
  }
  async SearchForCase() {

      let result = await this.court.searchforCase({
        serach: this.searchTerm,
        filter:this.Filter
        
      });
      this.cases = result.result;
      this.caseList.data = this.cases
      this.caseList.sort = this.sort;
      this.caseList.data = result.result
      this.pageData= result.result

    
  }

  async getallcases() {

    let result
    if (this.FromClient) {
      this.Filter={
        clientID: Number(this.ClientID),
        deleted: false,



      }
      result = await this.court.getAllClientCaseWithPagination({
        paginate: this.paginate,
        clientID: this.ClientID,
        
      });
    }
    else if (this.FromCompany) {
      this.Filter={
        CompanyID: Number(this.CompanyID)

      }
      result = await this.court.getAllCompanyCaseWithPagination({
        paginate: this.paginate,
        CompanyID: this.CompanyID
      });

    }
    else if (this.RealationType) {
      this.Filter={
        RelationType: this.RealationType,
        deleted: false,
        status: "Judged",


      }
      result = await this.court.getRealtionTypeCases({
        relationType: this.RealationType,
        Filter: this.Filter,
        paginate: this.paginate,
      });

    }

   else if (this.IsRelated == true) {
    this.Filter={
      ReltaedCaseId: Number(this.RelatedCaseID),
      deleted: false,



    }
    result = await this.court.getRelatedCases({
          paginate: this.paginate,
          id: this.RelatedCaseID
        })

    }
    else {
      result = await this.court.getAllcasesWithPagination({
        paginate: this.paginate
      });

    }


    this.dataCount = result.count;

    if ((this.allCases.length * this.itemsPerPage) == result.count) {
      this.isEnd = true
    } else {
      this.isEnd = false;
    }

    this.cases = result.result;
    this.caseList.data = this.cases
    this.caseList.sort = this.sort;
    this.pageData = result.result;
    this.pageData.sort = this.sort;
    this.caseList.data = result.result



  }

  async pageEvent(ev: {
    length: number
    pageIndex: number
    pageSize: number
    previousPageIndex?: number
  }) {
    //console.log(ev);

    await this.goToPage(ev.pageIndex, ev.pageSize);
    this.paginate.take = ev.pageSize
  }
  async goToPage(pageNumber: number, pageSize: number) {
    if (pageNumber >= 0) {
      this.currentPage = pageNumber;
      if (this.allCases.findIndex(val => val.page == pageNumber) == -1) {
        this.paginate = {
          skip: (this.currentPage * this.itemsPerPage),
          take: pageSize,
        }
        this.getallcases()
      } else {
        this.pageData = this.allCases.filter(val => val.page == this.currentPage)[0].data;
      }
    }
  }

  async ngOnChanges() {
        this.getallcases()


      
  
  }

  async add() {
    const modal = await this.modalController.create({ component: AddCaseModal, cssClass: 'responsiveModal', componentProps: { IsRelated: this.IsRelated, RelatedCaseID: this.RelatedCaseID, FromCompany: this.FromCompany, CompanyID: this.CompanyID, FromClient: this.FromClient, ClientID: this.ClientID } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async deleteClient(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.court.deleteCase(row.id)
      this.ngOnChanges()
    }
  }

  calculateRemainingDays(JudgedAt, type, element) {
    if (this.RealationType == "Appeal") {
      var sesstionDates = moment(JudgedAt).add(element.type.appeal_period, 'days').format('DD/MM/YYYY');
    } else if (this.RealationType == "Discrimination") {
      var sesstionDates = moment(JudgedAt).add(element.type.discrimination_period, 'days').format('DD/MM/YYYY');
    }

    if (moment(sesstionDates).format("DD/MM/YYYY") == moment(this.Carrant_Date).format("DD/MM/YYYY")) {
      return 0
    } else {
      return moment.utc(moment(sesstionDates, "DD/MM/YYYY").diff(moment(this.Carrant_Date, "DD/MM/YYYY"))).format("D")
    }
  }
  async details(event, row) {
    this.router.navigate(['CaseDetails/', row.id])
    event.stopPropagation();
  }

  applyFilter() {
    //this.caseList.filterPredicate=null
    if (this.IsRelated || this.FromCompany) {
      this.caseList.filterPredicate = (data, filter) => {
        //console.log(data)
        return data.CaseNo?.toLocaleLowerCase().includes(filter) ||
          data.type?.name_ar?.toLocaleLowerCase().includes(filter) ||
          data.client?.full_name?.toLocaleLowerCase().includes(filter) ||
          data.company?.full_name?.toLocaleLowerCase().includes(filter) ||
          data.opponent?.name?.toLocaleLowerCase().includes(filter) ||
          data.status?.toLocaleLowerCase().includes(filter) ||
          data.internalFile_no?.toLocaleLowerCase().includes(filter) ||
          data.RelationType?.toLocaleLowerCase().includes(filter) ||
          data.court?.name?.toLocaleLowerCase().includes(filter)
      }
      this.caseList.filter = this.searchTerm.trim().toLowerCase();
    }
    else {
      this.getallcases()
    }


  }





  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.CaseColumns : this.CaseColumns
  }

  /*nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }*/

  public printDiv(segment) {
    let printContents, popupWin, alignment, dir, title;

    if (segment == 1) {
      if (this.lang.selectedLang == 'en')
        title = "Appeal Cases"
      else
        title = "قضايا الاستئناف"
    }
    else if (segment == 2) {
      if (this.lang.selectedLang == 'en')
        title = "Discrimination Cases"
      else
        title = "قضايا التمييز"
    }

    printContents = document.getElementById('table2').innerHTML;
    if (this.lang.selectedLang == 'en') {
      alignment = "left"
      dir = "ltr"
    }
    else {
      alignment = "right"
      dir = "rtl"
    }

    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 12px;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              font-size: 14px;
              background-color: #f2f2f2 !important;
              -webkit-print-color-adjust: exact;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
          @media screen
          {
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              background-color: #f2f2f2 !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
        </style>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
              Print PDF
          </button>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
          <div style="padding-top:1rem;">
          <table class="table table-bordered" dir="${dir}">
            ${printContents}
          </table>
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }

}
@Component({
  selector: 'add-case',
  templateUrl: './add-case.html',
})

export class AddCaseModal implements OnInit {
  port: any[];
  @Input('RelatedCaseID') RelatedCaseID: number
  @Input('IsRelated') IsRelated: boolean
  @Input('FromCompany') FromCompany: boolean
  @Input('CompanyID') CompanyID: number
  @Input('FromClient') FromClient: boolean
  @Input('ClientID') ClientID: number
  companies: Company[];
  clients: Client[];
  types: CaseType[];
  Courts: Court[];
  courtRooms: CourtRoom[];
  representatives: Employee[];
  segment: number
  isLoading = true;
  addForm: FormGroup;
  validation_messages: any;
  isRelated: boolean
  caseslist: Case[]
  RelatedCase: any;
  case: Case;
  LastFileNo: string;
  usePreviousChecked: boolean = false;
  clientLastCase: Case;
  opponent: Opponent
  checkOpponent: Boolean = false
  search_client = ' '
  checkOpponentByname: Boolean = false
  /** control for the selected bank */
  public ClientsCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public ClientFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredClient: Client[];

  public CaseTypeFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public CaseTypeFilter: CaseType[];
  public CourtFilter: Court[];
  public CourtFilterCtrl: FormControl = new FormControl();

  public CaseRepresentativeFilter: any[];
  public CaseRepresentativeFilterCtrl: FormControl = new FormControl();
  CaseRepresentative: any;

  public courtRoomsFilterCtrl: FormControl = new FormControl();
  public courtRoomsFilter: CourtRoom[];

  /** list of banks filtered by search keyword */
  public CourtClient: Court[];
  // @ViewChild('singleSelect') singleSelect: MatSelect;

  constructor(public modalCtrl: ModalController, public translate: TranslateService, public Court: CourtService, fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    if (this.IsRelated == true) {

      this.isRelated = true
      this.getRealtedCase()

    } else {
      this.isRelated = false

    }

    this.addForm = fb.group({
      companyID: [''],
      clientID: ['', [Validators.required]],
      reference_no: ['',],
      typeID: ['', [Validators.required]],
      internalFile_no: [''],
      isRelated: ['',],
      comment: ['',],
      status: ['',],
      ReltaedCaseId: ['',],
      RelationType: ['',],
      representativeID: [''],
      courtID: [''],
      courtRoomID: [''],
      Opponent_name: ['', Validators.required],
      //Opponent_Mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      Opponent_Mobile1: ['',],
      //Opponent_Mobile2: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      Opponent_Mobile2: ['',],
      Opponent_CPR: ['', [Validators.compose([Validators.pattern('^[0-9]{9}$')])]],
      Opponent_Nationality: ['',],
      Opponent_Organization: ['',],
      Opponent_Address: ['',],
      Opponent_Email: ['', [Validators.compose([Validators.pattern('^[a-zA-Z][a-zA-Z0-9-.]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')])]],
      caseRepresentative: ['',],
      JudgedAt: ['',],
      Adjudge: ['',],
      CaseNo: ['',]

    });


    this.addForm.get('RelationType').setValue('level 1')
    this.addForm.get('status').valueChanges.subscribe(val => {
      if (val == 'Judged') {
        this.addForm.controls['JudgedAt'].setValidators([Validators.required]);
        this.addForm.controls['Adjudge'].setValidators([Validators.required]);
      } else {
        this.addForm.controls['JudgedAt'].clearValidators();
        this.addForm.controls['Adjudge'].clearValidators();
      }
      this.addForm.controls['JudgedAt'].updateValueAndValidity();
      this.addForm.controls['Adjudge'].updateValueAndValidity();
    });

    this.addForm.get('clientID').valueChanges.subscribe(val => {
      this.LastFileNo = null
      this.clientLastCase = null
      this.getClientLastcase(val)
    });

  }

  async getClientLastcase(val) {
    let clientLastCase = await this.court.getClientLastCase(val);
    if (clientLastCase)
      this.clientLastCase = clientLastCase
  }

  public filterClients(value) {
    return this.filteredClient = this.clients.filter((val) => val.full_name.toLowerCase().includes(this.ClientFilterCtrl.value));
  }
  clearSelection() {
    this.filteredClient = this.clients
  }


  public filterCaseType(value) {
    return this.CaseTypeFilter = this.types.filter((val) => val.name_ar.toLowerCase().includes(this.CaseTypeFilterCtrl.value) ||
      val.name_en.toLowerCase().includes(this.CaseTypeFilterCtrl.value)
    );
  }

  public filterCourt(value) {
    return this.CourtFilter = this.Courts.filter((val) => val.name.toLowerCase().includes(this.CourtFilterCtrl.value));
  }

  clearSelectionCaseType() {
    this.filteredClient = this.clients
  }

  clearSelectionCourt() {
    this.CourtFilter = this.Courts
  }

  async isChecked(event) {
    if (event.detail.checked) {
      this.LastFileNo = this.clientLastCase.internalFile_no
      this.addForm.get('internalFile_no').setValue(this.LastFileNo);
    }

    else {
      this.LastFileNo = null
      this.addForm.get('internalFile_no').setValue(null);
    }
  }

  Clear() {
    if (this.isRelated == true) {
      this.addForm.reset()
    }
  }
  async GetCaseType(id) {
    this.types = [];
    this.types = await this.court.getAllCaseType()
    this.addForm.get('typeID').setValue(id);

  }
  async AddNewCaeType() {
    const modal = await this.modalCtrl.create({ component: AddCaseTypesPage, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.GetCaseType(data.data.id)
    });
    return await modal.present();
  }
  async getRealtedCase() {
    if (this.IsRelated) {
      this.RelatedCase = await this.court.getOnecase(this.RelatedCaseID)

    } else {
      this.RelatedCase = await this.court.getOnecase(this.addForm.value.ReltaedCaseId)

    }

    this.addForm.setValue({
      ReltaedCaseId: this.RelatedCase?.id,
      companyID: this.RelatedCase?.companyID,
      clientID: this.RelatedCase?.clientID,
      reference_no: this.RelatedCase.reference_no,
      typeID: this.RelatedCase.typeID,
      internalFile_no: this.RelatedCase.internalFile_no,
      comment: this.RelatedCase.comment,
      status: this.RelatedCase.status,
      RelationType: this.addForm.value.RelationType,
      representativeID: this.RelatedCase.representativeID,
      courtID: this.RelatedCase?.courtID,
      isRelated: true,
      courtRoomID: this.RelatedCase?.courtRoomID,
      Opponent_name: this.RelatedCase?.opponent?.name,
      Opponent_Mobile1: this.RelatedCase.opponent?.main_mobile,
      Opponent_Mobile2: this.RelatedCase.opponent?.secondry_mobile,
      Opponent_CPR: this.RelatedCase.opponent?.cpr,
      Opponent_Nationality: this.RelatedCase.opponent?.nationality,
      Opponent_Organization: this.RelatedCase.opponent?.organization,
      Opponent_Address: this.RelatedCase.opponent?.address,
      Opponent_Email: this.RelatedCase.opponent?.email,
      caseRepresentative: this.RelatedCase.caseRepresentative,
      JudgedAt: this.RelatedCase.JudgedAt,
      Adjudge: this.RelatedCase.Adjudge,
      CaseNo: ""
    })
  }



  async ngOnInit() {

    if (this.IsRelated == true) {
      this.case = await this.court.getOnecase(Number(this.RelatedCaseID))
      this.isRelated = true
      this.getRealtedCase()

    } else {
      this.isRelated = false

    }

    this.segment = 0;
    this.companies = await this.Court.getAllcompanies()
    this.clients = await this.court.getClientForList()
    this.filteredClient = await this.clients
    this.types = await this.Court.getAllCaseType()
    this.CaseTypeFilter = this.types
    this.representatives = await this.authz.getEmployees()
    this.Courts = await this.Court.getAllCourts()
    this.CourtFilter = await this.Court.getAllCourts()
    this.Court.getAllCourtRooms().then((r)=>{
      this.courtRooms = r;
      this.courtRoomsFilter = r;
    })
    this.caseslist = await this.Court.getAllCases()

    this.CaseRepresentative = [
      {name: 'Challenged'},
      {name: 'Plague'},
      {name: 'AppealAgainst'},
      {name: 'Appeallant'},
      {name: 'Respondent'},
      {name: 'Prosecutor'},
      {name: 'Victim'},
      {name: 'Accused'},
      {name: 'OutletAgainst'},
      {name: 'Outlet'}
    ]
    this.CaseRepresentativeFilter = this.CaseRepresentative;

    if (this.FromCompany) {
      this.addForm.get('companyID').setValue(Number(this.CompanyID))
    }
    if (this.FromClient) {
      this.addForm.get('clientID').setValue(Number(this.ClientID))
    }


    this.validation_messages = {
      'internalFile_no': [
        { type: 'required', message: 'Court.Cases.Form.messages.internalFile_no.required' },
      ],
      'clientID': [
        { type: 'required', message: 'Court.Cases.Form.messages.clientID.required' },
      ],
      'companyID': [
        { type: 'required', message: 'Court.Cases.Form.messages.companyID.required' },
      ],
      'typeID': [
        { type: 'required', message: 'Court.Cases.Form.messages.typeID.required' },
      ],
      'courtID': [
        { type: 'required', message: 'Court.Cases.Form.messages.courtID.required' },
      ],
      'courtRoomID': [
        { type: 'required', message: 'Court.Cases.Form.messages.courtRoomID.required' },
      ],
      'representativeID': [
        { type: 'required', message: 'Court.Cases.Form.messages.representativeID.required' },
      ],
      'Opponent_name': [
        { type: 'required', message: 'Court.Cases.Form.messages.Opponent_name.required' },
      ],
      'Opponent_Mobile1': [
        { type: 'required', message: 'Court.Cases.Form.messages.Opponent_Mobile1.required' },
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_Mobile1.pattern' }
      ],
      'Opponent_Mobile2': [
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_Mobile2.pattern' }
      ],
      'Opponent_CPR': [
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_CPR.pattern' }
      ],
      'Opponent_Email': [
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_Email.pattern' }
      ],
      'JudgedAt': [
        { type: 'required', message: 'Court.Cases.Form.messages.JudgedAt.required' }
      ],
      'Adjudge': [
        { type: 'required', message: 'Court.Cases.Form.messages.Adjudge.required' }
      ]
    }
  }
  async checkClientAppointmentAndOpponent() {
    if (this.addForm.get('Opponent_CPR').value != null && this.addForm.get('Opponent_CPR').valid) {
      this.opponent = await this.Court.GetOpponent(this.addForm.get('Opponent_CPR').value);
      if (this.opponent != null) {
        this.checkOpponent = true

      }
    }
    else {
      this.checkOpponent = false
      this.opponent = null
    }
  }
  async GetOpponentbyname() {
    if (this.addForm.get('Opponent_name').value != null && this.addForm.get('Opponent_name').valid) {

      this.opponent = await this.Court.GetOpponentbyname(this.addForm.get('Opponent_name').value);
      if (this.opponent != null) {
        this.checkOpponentByname = true

      }
    }
    else {
      this.checkOpponent = false
      this.opponent = null
    }
  }
  async getOpponentData() {

    this.addForm.get("Opponent_name").setValue(this.opponent?.name)
    this.addForm.get("Opponent_Mobile1").setValue(this.opponent?.main_mobile)
    this.addForm.get("Opponent_Nationality").setValue(this.opponent?.nationality)
    this.addForm.get("Opponent_Organization").setValue(this.opponent?.organization)
    this.addForm.get("Opponent_Address").setValue(this.opponent?.address)
    this.addForm.get("Opponent_Email").setValue(this.opponent?.email)
    this.addForm.get("Opponent_CPR").setValue(this.opponent?.cpr)

  }




  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.createCase(data);
        await this.app.dismissLoading();
        this.dismiss();

      } catch (e) {
        console.log(e);
      }
    } else {
      if ((this.addForm.get('Opponent_name').invalid || this.addForm.get('Opponent_Mobile1').invalid) && !(this.addForm.get('clientID').invalid || this.addForm.get('typeID').invalid)) {
        if (this.lang.selectedLang == 'en')
          await this.app.presentAlert('Attention', 'Please enter opponent information', 'errorAlert');

        else
          await this.app.presentAlert('تنبيه', 'الرجاء إدخال بيانات الخصم', 'errorAlert');

      }
      //this.app.presentAlert("Operations.Attention", "Court.Cases.Errors.opponent_required", 'errorAlert', true);

      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  public filterCaseRepresentative(value) {
    return this.CaseRepresentativeFilter = this.CaseRepresentative.filter((val) =>
      this.translate.instant('Court.Cases.Form.caseRepresentative.' + val.name).toLowerCase().includes(this.CaseRepresentativeFilterCtrl.value));
  }

  clearSelectionCaseRepresentative() {
    this.CaseRepresentativeFilter = this.CaseRepresentative
  }

  public FilterCourtRoom(value) {
    return this.courtRoomsFilter = this.courtRooms.filter((val) => val.title.toLowerCase().includes(this.courtRoomsFilterCtrl.value));
  }

  clearSelectionCourtRoom() {
    this.courtRoomsFilter = this.courtRooms
  }
}


@Component({
  selector: 'case-details',
  templateUrl: './case-details.html',
})

export class CaseDetailssModal implements OnInit {
  allSessions: { page: number, data: Session[] }[] = [];
  isEditMode: boolean
  show: boolean
  companies: Company[];
  clients: Client[];
  DecumentForm: FormGroup
  types: CaseType[];
  Courts: Court[];
  CourtFilter: Court[];
  CourtFilterCtrl: FormControl = new FormControl();
  courtRooms: CourtRoom[];
  representatives: Employee[];
  @Input('Case') Case: Case
  CaseID: number
  @ViewChild('drawer') drawer: MatDrawer;
  segment: number
  isLoading = true;
  addForm: FormGroup;
  isAddBlock = false;
  Sessions: Session[]
  @Input('isEdit') isEdit: boolean;
  @Input('isAdd') isAdd: boolean = false;
  SessionColumns: string[];
  @Input('selectedSession') selectedSession: Session[];
  SessionList = new MatTableDataSource<Session>([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Session>(true, []);
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public CaseRepresentativeFilter: any[];
  public CaseRepresentativeFilterCtrl: FormControl = new FormControl();
  CaseRepresentative: any;
  public CaseTypeFilterCtrl: FormControl = new FormControl();
  public CaseTypeFilter: CaseType[];
  public courtRoomsFilterCtrl: FormControl = new FormControl();
  public courtRoomsFilter: CourtRoom[];
  public clientFilterCtrl: FormControl = new FormControl();
  public clientFilter: Client[];
  RelatedCase: Case[];
  isSearch = false;
  searchTerm = '';
  validation_messages: any;
  paginate: Pagination = {
    take: 5,
    skip: 0
  }
  pageData: Client[] = []
  currentPage = 0;
  isEnd = false;
  dataCount: number
  itemsPerPage = 5;
  constructor(
    private rt: Router,
    public modalCtrl: ModalController,
    public app: AppService,
    fb: FormBuilder, public Court: CourtService,
    private act: ActivatedRoute,
    public lang: LanguageService,
    public court: CourtService,
    public authz: AuthzService,
    public router: Router,
    public modalController: ModalController,
    public translate: TranslateService


  ) {
    this.segment = 0

     this.CaseID = this.act.snapshot.params.id;

    this.addForm = fb.group({
      id: ['',],
      companyID: ['',],
      clientID: ['', [Validators.required]],
      reference_no: ['',],
      typeID: ['', [Validators.required]],
      internalFile_no: ['',],
      comment: ['',],
      status: ['',],
      representativeID: ['',],
      courtID: ['',],
      courtRoomID: ['',],
      CaseNo: ['',],
      RelationType: ['',],
      Opponent_name: ['', [Validators.required]],
      //Opponent_Mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      Opponent_Mobile1: ['',],
      //Opponent_Mobile2: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      Opponent_Mobile2: ['',],
      Opponent_CPR: ['', [Validators.compose([Validators.pattern('^[0-9]{9}$')])]],
      Opponent_Nationality: ['',],
      Opponent_Organization: ['',],
      Opponent_Address: ['',],
      Opponent_Email: ['', [Validators.compose([Validators.pattern('^[a-zA-Z][a-zA-Z0-9-.]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')])]],
      caseRepresentative: ['',],

      JudgedAt: ['',],
      Adjudge: ['',],


    });
    this.addForm.get('status').valueChanges.subscribe(val => {
      if (val == 'Judged') {
        this.addForm.controls['JudgedAt'].setValidators([Validators.required]);
        this.addForm.controls['Adjudge'].setValidators([Validators.required]);
        this.show = true;
      } else {
        this.addForm.controls['JudgedAt'].clearValidators();
        this.addForm.controls['Adjudge'].clearValidators();
        this.show = false;
      }
      this.addForm.controls['JudgedAt'].updateValueAndValidity();
      this.addForm.controls['Adjudge'].updateValueAndValidity();
    });

  }
  async pageEvent(ev: {
    length: number
    pageIndex: number
    pageSize: number
    previousPageIndex?: number
  }) {
    //console.log(ev);

    await this.goToPage(ev.pageIndex, ev.pageSize);
    this.paginate.take = ev.pageSize
  }
  async goToPage(pageNumber: number, pageSize: number) {
    if (pageNumber >= 0) {
      this.currentPage = pageNumber;
      if (this.allSessions.findIndex(val => val.page == pageNumber) == -1) {
        this.paginate = {
          skip: (this.currentPage * this.itemsPerPage),
          take: pageSize,
        }
        this.getallSessions()
      } else {
        this.pageData = this.allSessions.filter(val => val.page == this.currentPage)[0].data;
      }
    }
  }

  async searchforSession() {

    let result = await this.court.searchforSession({
      serach: this.searchTerm,
      CaseID: this.CaseID
    });
    this.Sessions = result.result;
    this.pageData = result.result;


  }
  clearSearchList() {
    if (this.searchTerm == null || this.searchTerm == "") {
      this.getallSessions()
    }

  }
  async getallSessions() {
    this.searchTerm = ""
    let result = await this.court.getAllCaseSessionsWithPagination({
      paginate: this.paginate,
      caseID: this.CaseID
    });
    if (result.count) {
      this.dataCount = result.count;
    }
    if ((this.allSessions.length * this.itemsPerPage) == this.dataCount) {
      this.isEnd = true
    } else {
      this.isEnd = false;
    }
    this.Sessions = result.result;
    this.pageData = this.Sessions;
  }
  async ngOnInit() {
    if (this.isEdit) {
      this.companies = await this.Court.getAllcompanies()
      this.clients = await this.Court.getAllClients()
      this.Court.getAllCaseType().then((r)=>{
        this.types = r;
        this.CaseTypeFilter = r;
      })
      this.representatives = await this.authz.getEmployees()
      this.Courts = await this.Court.getAllCourts()
      this.CourtFilter = await this.Court.getAllCourts()
      this.Court.getAllCourtRooms().then((r)=>{
        this.courtRooms = r;
        this.courtRoomsFilter = r;
      })
      this.CaseRepresentative = [
        {name: 'Challenged'},
        {name: 'Plague'},
        {name: 'AppealAgainst'},
        {name: 'Appeallant'},
        {name: 'Respondent'},
        {name: 'Prosecutor'},
        {name: 'Victim'},
        {name: 'Accused'},
        {name: 'OutletAgainst'},
        {name: 'Outlet'}
      ]
      this.CaseRepresentativeFilter = this.CaseRepresentative;
    }

    this.isEditMode = false
    this.CaseID = this.act.snapshot.params.id;
    this.Case = await this.court.getOnecase(this.CaseID)


  //  this.RelatedCase = await this.court.getRelatedCases(this.CaseID)
    this.isLoading = false;
    this.addForm.setValue({
      id: this.Case?.id,
      companyID: this.Case?.companyID,
      clientID: this.Case?.clientID,
      reference_no: this.Case?.reference_no,
      typeID: this.Case?.typeID,
      internalFile_no: this.Case?.internalFile_no,
      comment: this.Case?.comment,
      status: this.Case?.status,
      representativeID: this.Case?.representativeID,
      courtID: this.Case?.courtID,
      courtRoomID: this.Case?.courtRoomID,
      CaseNo: this.Case?.CaseNo,
      Opponent_name: this.Case?.opponent?.name,
      Opponent_Mobile1: this.Case.opponent?.main_mobile,
      Opponent_Mobile2: this.Case.opponent?.secondry_mobile,
      Opponent_CPR: this.Case.opponent?.cpr,
      Opponent_Nationality: this.Case.opponent?.nationality,
      Opponent_Organization: this.Case.opponent?.organization,
      Opponent_Address: this.Case.opponent?.address,
      Opponent_Email: this.Case.opponent?.email,
      caseRepresentative: this.Case.caseRepresentative,
      JudgedAt: this.Case?.JudgedAt,
      Adjudge: this.Case.Adjudge,
      RelationType: this.Case?.RelationType
    })

    this.validation_messages = {
      'internalFile_no': [
        { type: 'required', message: 'Court.Cases.Form.messages.internalFile_no.required' },
      ],
      'clientID': [
        { type: 'required', message: 'Court.Cases.Form.messages.clientID.required' },
      ],
      'companyID': [
        { type: 'required', message: 'Court.Cases.Form.messages.companyID.required' },
      ],
      'typeID': [
        { type: 'required', message: 'Court.Cases.Form.messages.typeID.required' },
      ],
      'courtID': [
        { type: 'required', message: 'Court.Cases.Form.messages.courtID.required' },
      ],
      'courtRoomID': [
        { type: 'required', message: 'Court.Cases.Form.messages.courtRoomID.required' },
      ],
      'representativeID': [
        { type: 'required', message: 'Court.Cases.Form.messages.representativeID.required' },
      ],
      'Opponent_name': [
        { type: 'required', message: 'Court.Cases.Form.messages.Opponent_name.required' },
      ],
      'Opponent_Mobile1': [
        { type: 'required', message: 'Court.Cases.Form.messages.Opponent_Mobile1.required' },
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_Mobile1.pattern' }
      ],
      'Opponent_Mobile2': [
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_Mobile2.pattern' }
      ],
      'Opponent_CPR': [
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_CPR.pattern' }
      ],
      'Opponent_Email': [
        { type: 'pattern', message: 'Court.Cases.Form.messages.Opponent_Email.pattern' }
      ],
      'JudgedAt': [
        { type: 'required', message: 'Court.Cases.Form.messages.JudgedAt.required' }
      ],
      'Adjudge': [
        { type: 'required', message: 'Court.Cases.Form.messages.Adjudge.required' }
      ]
    }

    this.SessionColumns = ["ID", "Ref_No", "Case", "Status", "Session_Date", "Lawyer_Name", "Delay_Reason", "Upcoming_Session", "Action"];
    this.getDisplayedColumns();
    this.getallSessions()
  }

  async isChecked(event) {
    if (event.checked) {
      this.companies = await this.Court.getAllcompanies()
      this.clients = await this.Court.getClientForList()
      this.clientFilter = await this.clients
      this.Court.getAllCaseType().then((r)=>{
        this.types = r;
        this.CaseTypeFilter = r;
      })
      this.representatives = await this.authz.getEmployees()
      this.Courts = await this.Court.getAllCourts()
      this.CourtFilter = await this.Court.getAllCourts()
      this.Court.getAllCourtRooms().then((r)=>{
        this.courtRooms = r;
        this.courtRoomsFilter = r;
      })
      this.CaseRepresentative = [
        {name: 'Challenged'},
        {name: 'Plague'},
        {name: 'AppealAgainst'},
        {name: 'Appeallant'},
        {name: 'Respondent'},
        {name: 'Prosecutor'},
        {name: 'Victim'},
        {name: 'Accused'},
        {name: 'OutletAgainst'},
        {name: 'Outlet'}
      ]
      this.CaseRepresentativeFilter = this.CaseRepresentative;
    }

  }
  async updateClient() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.updateCase(data);
        await this.app.dismissLoading();
        this.dismiss()
        this.ngOnInit()
        this.isEditMode = false;
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      //ظ await this.app.presentAlert('Operations.Sorry', 'Court.Companies.required_filed', 'errorAlert');
    }
  }

  /*async ngAfterViewInit() {
    ['xl', '2xl'].includes(this.app.screenSize) ?
      setTimeout(() => {
        this.drawer.toggle()
      }, 1100) : null
    this.Sessions = this.Case.sessions
    this.SessionList = new MatTableDataSource(this.Sessions);
    this.SessionList.paginator = this.tablePaginator;
    this.SessionList.sort = this.sort;
  }*/

  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.createClient(data);
        await this.app.dismissLoading();
        this.dismiss();

      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Operations.Sorry', 'Court.Companies.required_filed', 'errorAlert');
    }
  }
  async detailsSesstion(row) {
    const modal = await this.modalController.create({ component: SessionDetailsModal, cssClass: 'responsiveModal', componentProps: { session: row, IsRelated: true } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async ngOnChanges() {
    this.getallSessions()

    if (this.isEdit) {
      this.companies = await this.Court.getAllcompanies()
      this.clients = await this.Court.getAllClients()
      this.Court.getAllCaseType().then((r)=>{
        this.types = r;
        this.CaseTypeFilter = r;
      })
      this.representatives = await this.authz.getEmployees()
      this.Courts = await this.Court.getAllCourts()
      this.Court.getAllCourtRooms().then((r)=>{
        this.courtRooms = r;
        this.courtRoomsFilter = r;
      })
      this.CaseRepresentative = [
        {name: 'Challenged'},
        {name: 'Plague'},
        {name: 'AppealAgainst'},
        {name: 'Appeallant'},
        {name: 'Respondent'},
        {name: 'Prosecutor'},
        {name: 'Victim'},
        {name: 'Accused'},
        {name: 'OutletAgainst'},
        {name: 'Outlet'}
      ]
      this.CaseRepresentativeFilter = this.CaseRepresentative;
    }
  }

  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async addsession() {
    const modal = await this.modalController.create({ component: AddSessionModal, cssClass: 'responsiveModal', componentProps: { case: this.CaseID } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async deleteSession(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Session.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.court.deleteSession(row.id)
      this.ngOnInit()
    }
  }

  async GetCaseType(id) {

    this.types = [];
    this.types = await this.court.getAllCaseType()
    this.addForm.get('typeID').setValue(id);

  }
  async AddNewCaeType() {
    const modal = await this.modalCtrl.create({ component: AddCaseTypesPage, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.GetCaseType(data.data.id)
    });
    return await modal.present();
  }
  async details(row) {
    this.router.navigate(['CaseDetails/', row.id])
  }

  applyFilter() {

    this.SessionList.filterPredicate = (data, filter) => {
      let c = data.case?.CaseNo + "-" + data.case?.client?.full_name;
      return data.reference_no?.toLocaleLowerCase().includes(filter) ||
        c.toLocaleLowerCase().includes(filter) ||
        data.case?.client?.full_name?.toLocaleLowerCase().includes(filter) ||
        data.case.type?.name_ar?.toLocaleLowerCase().includes(filter) ||
        data.case.type?.name_en?.toLocaleLowerCase().includes(filter) ||
        data.status?.toLocaleLowerCase().includes(filter) ||
        data.representative?.user.first_name?.toLocaleLowerCase().includes(filter) ||
        data.representative?.user.last_name?.toLocaleLowerCase().includes(filter) ||
        data.DelayReson?.name_ar?.toLocaleLowerCase().includes(filter) ||
        data.DelayReson?.name_en?.toLocaleLowerCase().includes(filter)
    }

    if (this.searchTerm == 'قيد الإنتظار')
      this.SessionList.filter = 'upcoming'.toLowerCase();

    else if (this.searchTerm == 'تأجيل')
      this.SessionList.filter = 'delayed'.toLowerCase();

    else if (this.searchTerm == 'محسومة')
      this.SessionList.filter = 'finished'.toLowerCase();

    else
      this.SessionList.filter = this.searchTerm.trim().toLowerCase();




  }

  getDisplayedColumns(): string[] {

    return this.app.isDesktop ? this.SessionColumns : this.SessionColumns.filter(dt => dt !== 'Action');
  }

  public filterCourt(value) {
    return this.CourtFilter = this.Courts.filter((val) => val.name.toLowerCase().includes(this.CourtFilterCtrl.value));
  }

  clearSelectionCourt() {
    this.CourtFilter = this.Courts
  }

  public filterCaseRepresentative(value) {
    return this.CaseRepresentativeFilter = this.CaseRepresentative.filter((val) =>
      this.translate.instant('Court.Cases.Form.caseRepresentative.' + val.name).toLowerCase().includes(this.CaseRepresentativeFilterCtrl.value));
  }

  clearSelectionCaseRepresentative() {
    this.CaseRepresentativeFilter = this.CaseRepresentative
  }

  public filterCaseType(value) {
    return this.CaseTypeFilter = this.types.filter((val) => val.name_ar.toLowerCase().includes(this.CaseTypeFilterCtrl.value) ||
      val.name_en.toLowerCase().includes(this.CaseTypeFilterCtrl.value)
    );
  }

  clearSelectionCaseType() {
    this.CaseTypeFilter = this.types
  }

  public FilterCourtRoom(value) {
    return this.courtRoomsFilter = this.courtRooms.filter((val) => val.title.toLowerCase().includes(this.courtRoomsFilterCtrl.value));
  }

  clearSelectionCourtRoom() {
    this.courtRoomsFilter = this.courtRooms
  }

  public filterClients(value) {
    return this.clientFilter = this.clients.filter((val) => val.full_name.toLowerCase().includes(this.clientFilterCtrl.value));
  }

  clearSelectionClients() {
    this.clientFilter = this.clients
  }
}



@Component({
  selector: 'add-caseType',
  templateUrl: './add-caseType.html',
})
export class AddCaseTypesPage implements OnInit {

  types: CaseType[] = [];
  isAdd = false;
  typeData: CaseType = {
    name_ar: '',
    name_en: '',
    comments: '',
    appeal_period: 0,
    discrimination_period: 0,
    type: 'Lowful',

  }
  typeform: FormGroup;
  validation_messages: any;

  NewCaseId: number

  constructor(public fb: FormBuilder, public courtServices: CourtService, public lang: LanguageService, public modalCtrl: ModalController, private router: Router, private app: AppService) { }

  async ngOnInit() {
    this.typeform = this.fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      comments: ['',],
      appeal_period: ['', Validators.required],
      discrimination_period: ['', Validators.required],
      type: ['', Validators.required],

    });
    this.isAdd = false
    await this.courtServices.getAllCaseType()

    this.validation_messages = {
      'name_ar': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.name_ar.required' },
      ],
      'name_en': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.name_en.required' },
      ],
      'type': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.type.required' },
      ],
      'appeal_period': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.appeal_period.required' },
      ],
      'discrimination_period': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.discrimination_period.required' },
      ]
    }
  }

  /*async ngOnChanges() {
    this.Sessions = await this.court.getAllSessions()
    console.log(this.Sessions)
    this.SessionList.data = this.Sessions
  }*/

  ViewAddForm() {
    this.isAdd = !this.isAdd

  }


  async addType() {
    await this.app.presentLoading();
    if (this.typeform.valid) {
      try {
        this.typeData = this.typeform.value
        let added = await this.courtServices.createCaseType(this.typeData);
        await this.app.dismissLoading();
        this.typeform.reset()
        this.isAdd = false;
        this.NewCaseId = added.id
        this.dismiss()
      } catch (e) {
        console.log(e);
      }
    } else {
      this.typeform.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  clear() {
    this.typeform.reset()
      ;
    this.isAdd = false

  }


  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      'id': this.NewCaseId
    });
  }

}





