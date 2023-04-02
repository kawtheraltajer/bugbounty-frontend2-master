import { Case, Session ,DelayReson ,Employee ,Client} from 'src/app/interfaces/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Pagination } from 'src/app/interfaces/commen-interfaces';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage implements OnInit {
  allSessions: { page: number, data: Session[] }[] = [];
  pageData: Client[] = []
  currentPage = 0;
  Sessions: Session[] 
  isEnd = false;
  dataCount: number
  itemsPerPage = 5;
  @Input('isAdd') isAdd: boolean = false;
  SessionColumns: string[];
  SessionList = new MatTableDataSource([]);
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchTerm = '';
  paginate: Pagination = {
    take: 5,
    skip: 0
  }
 
  inputFormControl = new FormControl({ value: null, disabled: true });

  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    if (!(this.authz.canDo('READ', 'Session', []) || this.authz.canDo('MANAGE', 'Session', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }
  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'Session', []) || this.authz.canDo('MANAGE', 'Session', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.SessionColumns = ["ID", "reference_no", "Case", "Court_no", "Case_type", "Opponent", "Status", "Session_Date", "Lawyer_Name", "Delay_Reason", "next_session_date", "Action"];
    this.getDisplayedColumns();
    this.getallSessions()
    //this.Sessions = await this.court.getAllSessions()
    //this.SessionList = new MatTableDataSource(this.Sessions);
    // this.SessionList.paginator = this.tablePaginator;
  }

  async ngAfterViewInit() {
    this.SessionList.sort = this.sort;
  }
  async ngOnChanges() {
    this.getallSessions()

  }
  clearSearchList(){
    if(this.searchTerm == null || this.searchTerm =="" ){
      this.getallSessions()
    }

  }


  async getallSessions() {
    this.searchTerm = ""
    let result = await this.court.getAllSessionsWithPagination({
      paginate: this.paginate
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
  async add() {
    const modal = await this.modalController.create({ component: AddSessionModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnChanges()
    });
    return await modal.present();
  }

  
  async pageEvent(ev: {
    length: number
    pageIndex: number
    pageSize: number
    previousPageIndex?: number
  }) {
    await this.goToPage(ev.pageIndex,ev.pageSize);
    this.paginate.take=ev.pageSize
  }
  async goToPage(pageNumber: number,pageSize:number) {
    if (pageNumber >= 0) {
      this.currentPage = pageNumber;
      if (this.allSessions.findIndex(val => val.page == pageNumber) == -1) {
        this.paginate = {
          skip: (this.currentPage * this.itemsPerPage),
          take:pageSize,
        }
        this.getallSessions()
      } else {
        this.pageData = this.allSessions.filter(val => val.page == this.currentPage)[0].data;
      }
    }
  }

  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Session.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.court.deleteSession(row.id)
      this.ngOnInit()
    }
  }



  async details(row) {
    const modal = await this.modalController.create({ component: SessionDetailsModal, cssClass: 'responsiveModal', componentProps: { session: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    //event.stopPropagation();
    return await modal.present();
  }

  async  searchforSession(){

    let result = await this.court.searchforSession({
      serach: this.searchTerm,
       CaseID:null
    }); 
    this.Sessions=result.result;
    this.pageData = result.result;


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
        data.representative?.user?.first_name?.toLocaleLowerCase().includes(filter) ||
        data.representative?.user?.last_name?.toLocaleLowerCase().includes(filter) ||
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

    return this.app.isDesktop ? this.SessionColumns : this.SessionColumns
  }

}

@Component({
  selector: 'add-session',
  templateUrl: './add-session.html',
})

export class AddSessionModal implements OnInit {
  Cases: Case[]

  Employees: Employee[]
  @Input('client') client: Client
  @Input('case') case: any
  isLoading = true;

  addFromCases = false;
  addForm: FormGroup;
  validation_messages: any; 
   DelayResons: DelayReson[]
  public ReasonFilterCtrl: FormControl = new FormControl();
  public filteredReason: DelayReson[];
  public CasesFilterCtrl: FormControl = new FormControl();
  public filteredCases: Case[]
  constructor(public modalCtrl: ModalController, private app: AppService, public lang: LanguageService, fb: FormBuilder, public Court: CourtService, public authz: AuthzService) {
    if (this.addFromCases) {
      this.addForm = fb.group({
        date: ['', [Validators.required]],
        representativeID: ['',],
        reference_no: ['',],
        session_no: ['',],
        caseID: ['',],
        delayID: ['',],
        delayrResonID: ['',],
        delay_details: ['',],
        status: ['',],
        comment: ['',],
        delay_reason: ['',],
        Previous_DelayReasonID: ['',],
        Previous_DelayReason_Details: ['',],
      });
    }
    else {
      this.addForm = fb.group({
        date: ['', [Validators.required]],
        representativeID: ['',],
        reference_no: ['',],
        session_no: ['',],
        caseID: ['', [Validators.required]],
        delayID: ['',],
        delay_details: ['',],
        delayrResonID: ['',],
        status: ['',],
        comment: ['',],
        delay_reason: ['',],
        Previous_DelayReasonID: ['',],
        Previous_DelayReason_Details: ['',],
      });
    }

  } async ngOnInit() {


    if (this.case)
      this.addFromCases = true;
    if (!this.addFromCases) {
      this.Cases = await this.Court.getCaseForList()
      this.filteredCases = this.Cases

    }

    this.DelayResons = await this.Court.getDelayReson()
    this.filteredReason = this.DelayResons
    this.Employees = await this.authz.getEmployees()
    if (this.addFromCases) {
      this.addForm.setValue({
        date: '',
        representativeID: 0,
        reference_no: " ",
        session_no: 0,
        caseID: JSON.parse(this.case),
        delay_reason: " ",
        delayrResonID: null,
        delayID: " ",
        delay_details: "",
        status: "UPCOMING",
        comment: " ",
        Previous_DelayReasonID: null,
        Previous_DelayReason_Details: null,

      })
      this.addForm.get('caseID').clearValidators();
    }
    else {
      this.addForm.setValue({
        date: '',
        representativeID: 0,
        reference_no: " ",
        session_no: 0,
        caseID: '',
        delayrResonID: null,
        delay_reason: " ",
        delayID: " ",
        delay_details: "",
        status: "UPCOMING",
        comment: " ",
        Previous_DelayReasonID: null,
        Previous_DelayReason_Details: null,
      })
    }


    this.validation_messages = {
      'caseID': [
        { type: 'required', message: 'Court.Session.Form.messages.caseID.required' },
      ],
      'status': [
        { type: 'required', message: 'Court.Session.Form.messages.status.required' },
      ],
      'date': [
        { type: 'required', message: 'Court.Session.Form.messages.date.required' },
      ]
    }




  }
  public filterEmployeelist(value) {

    return this.filteredCases = this.Cases.filter((val) => {
      let c = val?.CaseNo + "-" + val.client?.full_name;

      return c.toLowerCase().includes(this.CasesFilterCtrl.value);
    })



  }

  clearSelectionCases() {
    this.filteredCases = this.Cases
  }
  async AddNewDelayReson(forPrev) {
    const modal = await this.modalCtrl.create({ component: AddDelayReasonPage, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      if (forPrev)
        this.getPreviousDelayReson(data.data.id)
      else
        this.getDelayReson(data.data.id)
    });
    return await modal.present();
  }

  async getDelayReson(id) {
    this.DelayResons = []
    this.DelayResons = await this.Court.getDelayReson()
    this.addForm.get('delayrResonID').setValue(id);
  }

  async getPreviousDelayReson(id) {
    this.DelayResons = []
    this.DelayResons = await this.Court.getDelayReson()
    this.addForm.get('Previous_DelayReasonID').setValue(id);
  }

  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.createSession(data);
        await this.app.dismissLoading();
        this.dismiss();

      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Operations.Sorry', 'Court.Companies.required_filed', 'errorAlert');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  public filterdelayReaon(value) {
    return this.filteredReason = this.DelayResons.filter((val) => val.name_ar.toLowerCase().includes(this.ReasonFilterCtrl.value));
  }
  clearSelection() {
    this.filteredReason = this.DelayResons
  }
}

@Component({
  selector: 'session-details',
  templateUrl: './session-details.html',
})

export class SessionDetailsModal implements OnInit {
  Cases: Case[]
  DelayResons: DelayReson[]
  Employees: Employee[]
  @Input('session') session: any
  @Input('client') client: Client
  @Input('case') case: any
  @Input('addFromCases') addFromCases: boolean = false

  isLoading = true;
  updateForm: FormGroup;
  validation_messages: any;

  disable = true;
  public ReasonFilterCtrl: FormControl = new FormControl();
  public filteredReason: DelayReson[];
  public filteredpreReason: DelayReson[];

  //employee
  public EmployeeFilterCtrl: FormControl = new FormControl();
  public filteredEmployee: Employee[]
  public CasesFilterCtrl: FormControl = new FormControl();
  public filteredCases: Case[]
  employeelist = new MatTableDataSource([]);
  inputFormControl = new FormControl({ value: null, disabled: true });

  constructor(public router: Router, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public Court: CourtService, public authz: AuthzService, public lang: LanguageService) {


    this.updateForm = fb.group({
      id: ['',],
      date: ['', [Validators.required]],
      representativeID: ['',],
      reference_no: ['',],
      session_no: ['',],
      caseID: ['', [Validators.required]],
      delayID: ['',],
      delay_details: ['',],
      delayrResonID: ['',],
      Previous_DelayReasonID: ['',],
      Previous_DelayReason_Details: ['',],
      status: ['', [Validators.required]],
      comment: ['',],
      delay_reason: ['',],
      next_session_date: ['',],
      JudgedAt: ['',],
      Adjudge: ['',],
    });


   this.updateForm.get('status').valueChanges.subscribe(val => {
      if (val == 'DELAYED') {
        this.updateForm.controls['delayrResonID'].setValidators([Validators.required]);
        this.updateForm.controls['next_session_date'].setValidators([Validators.required]);

      }
      else if (val == 'FINISHED') {

      }
      else {
        this.updateForm.controls['delayrResonID'].clearValidators();
        this.updateForm.controls['next_session_date'].clearValidators();
      }
      this.updateForm.controls['delayrResonID'].updateValueAndValidity();
      this.updateForm.controls['next_session_date'].updateValueAndValidity();
    });
  }

  async ngOnInit() {
    if (this.session.status == "UPCOMING")
      this.disable = false;

      if (this.session.status == "DELAYED" || this.session.status == "FINISHED" ){
       // this.updateForm.controls['next_session_date'].disable()
      


      }

    this.updateForm.setValue({
      id: this.session.id,
      date: this.session.date,
      representativeID: this.session.representativeID,
      reference_no: this.session.reference_no,
      session_no: this.session.session_no,
      caseID: this.session.caseID,
      delayrResonID: this.session.delayrResonID,
      delay_reason: this.session.delay_reason,
      Previous_DelayReasonID: this.session.Previous_DelayReasonID,
      Previous_DelayReason_Details: this.session.Previous_DelayReason_Details,
      delayID: " ",
      delay_details: this.session.delay_details,
      status: this.session.status,
      comment: this.session.comment,
      next_session_date: this.session.next_session_date,
      JudgedAt: this.session.JudgedAt,
      Adjudge: this.session.Adjudge
      
    })


    this.Cases = await this.Court.getCaseForList()
    this.filteredCases = this.Cases
    this.DelayResons = await this.Court.getDelayReson()
    this.Employees = await this.authz.getEmployees()
    this.employeelist.data = this.Employees
    this.filteredEmployee = this.Employees
    this.filteredReason = this.DelayResons
    this.filteredpreReason = this.DelayResons


    this.validation_messages = {
      'caseID': [
        { type: 'required', message: 'Court.Session.Form.messages.caseID.required' },
      ],
      'status': [
        { type: 'required', message: 'Court.Session.Form.messages.status.required' },
      ],
      'date': [
        { type: 'required', message: 'Court.Session.Form.messages.date.required' },
      ],
      'delayrResonID': [
        { type: 'required', message: 'Court.Session.Form.messages.delayrResonID.required' },
      ],
      'next_session_date': [
        { type: 'required', message: 'Court.Session.Form.messages.next_session_date.required' },
      ]
    }
  }

  async delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.Case-type.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)

    if (confirm) {
      await this.Court.deleteSession(this.updateForm.value.id);
      this.dismiss();
    }
  }
  public filterEmployeelist(value) {

    return this.filteredEmployee = this.Employees.filter((val) => {
      let c = (val.user?.first_name + " " + val.user?.last_name)

      return c.toLowerCase().includes(this.EmployeeFilterCtrl.value);
    })



  }

  clearSelectionEmployee() {
    this.filteredEmployee = this.Employees
  }
  public filterdelayReaon(value) {
    return this.filteredReason = this.DelayResons.filter((val) => val.name_ar.toLowerCase().includes(this.ReasonFilterCtrl.value));
  }
  public filterdelaypreReaon(value) {
    return this.filteredpreReason = this.DelayResons.filter((val) => val.name_ar.toLowerCase().includes(this.ReasonFilterCtrl.value));
  }
  clearSelection() {
    this.filteredReason = this.DelayResons
    this.filteredpreReason = this.DelayResons
  }
  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;

      try {
        await this.Court.updateSession(data);
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
  async getDelayReson(id) {
    this.DelayResons = []
    this.DelayResons = await this.Court.getDelayReson()
    this.updateForm.get('delayrResonID').setValue(id);

  }
  async AddNewDelayReson(forPrev) {
    const modal = await this.modalCtrl.create({ component: AddDelayReasonPage, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      if (forPrev)
        this.getPreviousDelayReson(data.data.id)
      else
        this.getDelayReson(data.data.id)
    });
    return await modal.present();
  }

  async getPreviousDelayReson(id) {
    this.DelayResons = []
    this.DelayResons = await this.Court.getDelayReson()
    this.updateForm.get('Previous_DelayReasonID').setValue(id);
  }

  goToCase() {
    this.router.navigate(['CaseDetails/', this.session.caseID])
    this.dismiss()
  }
}
@Component({
  selector: 'app-delay-reason',
  templateUrl: './Add-delay-reason.html',
})
export class AddDelayReasonPage implements OnInit {

  types: DelayReson[] = [];
  isAdd = false;
  resonData: DelayReson = {
    name_ar: '',
    name_en: '',
    type: 'Lowful',

  }
  newDelayReson: number
  typeform: FormGroup;
  validation_messages: any;

  constructor(public fb: FormBuilder, public courtServices: CourtService, public lang: LanguageService, public modalCtrl: ModalController, private app: AppService) { }

  async ngOnInit() {
    this.typeform = this.fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      type: ['', Validators.required],
    });
    await this.courtServices.getDelayReson();
    this.isAdd = false;

    this.validation_messages = {
      'name_ar': [
        { type: 'required', message: 'Court.Cases.delay-reson.Form.messages.name_ar.required' },
      ],
      'name_en': [
        { type: 'required', message: 'Court.Cases.delay-reson.Form.messages.name_en.required' },
      ],
      'type': [
        { type: 'required', message: 'Court.Cases.delay-reson.Form.messages.type.required' },
      ]
    }
  }

  async ngOnChanges() {
    await this.courtServices.getDelayReson()
  }

  ViewAddForm() {
    this.isAdd = !this.isAdd
  }

  async addType() {
    await this.app.presentLoading();
    if (this.typeform.valid) {
      try {
        this.resonData = this.typeform.value
        let added = await this.courtServices.createDelayReson(this.resonData);
        await this.app.dismissLoading();
        this.typeform.reset()

        this.newDelayReson = added.id
        this.isAdd = false;
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
    this.typeform.reset();
    this.isAdd = !this.isAdd
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
      'id': this.newDelayReson
    });
  }


}