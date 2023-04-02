import { Case, Court, Company, CaseType, CourtRoom, Employee } from './../../../interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Permission, Role, User, Education, Client } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';

import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';

import { ActivatedRoute, Router } from '@angular/router';
import { ComponentsModule } from 'src/app/modules/components.module';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
})
export class CompaniesPage implements OnInit {
  @Input('isEdit') isEdit: boolean;
  companies: Company[];
  @Input('isAdd') isAdd: boolean = false;
  clientsColumns: string[];
  @Input('selectedcompany') selectedcompany: Company[];
  companyList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Company>(true, []);
  @ViewChild('ClientTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) { }
  async ngOnInit() {

    this.clientsColumns = ['id', 'CR', 'Name', 'Mobile', 'whatsApp_phone', 'Action'];



    this.getDisplayedColumns();

    this.companies = await this.court.getAllcompanies()

    //console.log(this.companies)
    this.companyList = new MatTableDataSource(this.companies);
    this.companyList.paginator = this.tablePaginator;
    if (this.selectedcompany && this.showSelected) {
      let selectedIds = this.selectedcompany.map(dt => dt.id);

    }

  }
  async ngOnChanges() {
    this.companies = await this.court.getAllcompanies()

    this.companyList.data = this.companies
  }
  async ngAfterViewInit() {
    this.companies = await this.court.getAllcompanies()

    this.companyList = new MatTableDataSource(this.companies);
    this.companyList.paginator = this.tablePaginator;
    this.companyList.sort = this.sort;
  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }


  async add() {
    const modal = await this.modalController.create({ component: AddCompanyModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnChanges()
    });
    return await modal.present();
  }

  async deleteComany(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Companies.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)

    if (confirm) {
      await this.court.deleteCompany(row.id)
      this.ngOnChanges()
    }


  }

  

  
  async details(row) {

    this.router.navigate(['court/companies/company-details/', row.id])
    

  }

  applyFilter() {
    this.companyList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.clientsColumns : this.clientsColumns
  }

}
@Component({
  selector: 'add-company',
  templateUrl: './add-company.html',
})

export class AddCompanyModal implements OnInit {

  @Input('company') company: Company
  isLoading = true;
  addForm: FormGroup;
  validation_messages:any;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public Court: CourtService) {

    this.addForm = fb.group({
      full_name: ['', [Validators.required]],
      CR: ['',],
      email: ['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'),Validators.required])]],
      //mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      mobile1: ['',],
      //mobile2: ['',[Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      mobile2: ['',],
      //whatsApp_phone: ['',[Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      whatsApp_phone: ['',],
      comments: ['',],
    });
  } async ngOnInit() {

    this.validation_messages = {
      'full_name': [
        { type: 'required', message: 'Court.Companies.Form.messages.full_name.required' },
      ],
      'CR': [
        { type: 'required', message: 'Court.Companies.Form.messages.CR.required' },
      ],
      'mobile1': [
        { type: 'required', message: 'Court.Companies.Form.messages.mobile1.required' },
        { type: 'pattern', message: 'Court.Companies.Form.messages.mobile1.pattern' },
      ],
      'mobile2': [
        { type: 'pattern', message: 'Court.Companies.Form.messages.mobile2.pattern' },
      ],
      'whatsApp_phone': [
        { type: 'pattern', message: 'Court.Companies.Form.messages.whatsApp_phone.pattern' },
      ],
      'email': [
        { type: 'required', message: 'Court.Companies.Form.messages.email.required' },
        { type: 'pattern', message: 'Court.Companies.Form.messages.email.pattern' },
      ]
    }

  }

  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.createcompany(data);
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
}

@Component({
  selector: 'company-details',
  templateUrl: './company-details.html',
})

export class CompanyDetailsModal implements OnInit {
  isEditMode: boolean
  @Input('company') company: Company
  @Input('fromCompanyView') fromCompanyView: boolean
  companyID: number
  @ViewChild('drawer') drawer: MatDrawer;
  isLoading = true;
  addForm: FormGroup;
  validation_messages:any;
  segment:number 
  CaseColumns: string[];
  Cases: Case[];
  Case_length:number;
  caseList = new MatTableDataSource([]);
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @Input('selectedcompany') selectedcompany: Case[];
  @Input('showSelected') showSelected: boolean;

  constructor(
    private rt: Router,
    public modalCtrl: ModalController,
    public app: AppService,
    fb: FormBuilder, public Court: CourtService,
    private act: ActivatedRoute,
    public lang: LanguageService,
    public court: CourtService,
    public router: Router,
    private auth: AuthService,
    public authz: AuthzService
  ) {
    
    this.segment=0
    //this.companyID = this.act.snapshot.params.id;
    this.addForm = fb.group({
      id: ['',],
      full_name: ['', [Validators.required]],
      CR: ['',],
      email: ['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}')])]],
      //mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      mobile1: ['',],
      //mobile2: ['',[Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      mobile2: ['',],
      //whatsApp_phone: ['',[Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      whatsApp_phone: ['',],
      type: ['',],
      comments: ['',],
    });
  }

  async ngOnInit() {
    this.isEditMode = false
    let c = await this.court.GetCompanyID(this.auth.userData.value.id)
    if(this.fromCompanyView) 
      this.companyID = (await this.court.GetCompanyID(this.auth.userData.value.id)).id
    else
      this.companyID = this.act.snapshot.params.id;

    this.company = await this.court.getOneCompany(this.companyID)

    //console.log('hhhhhhhhhhhh')
    this.isLoading = false;

    
    this.CaseColumns = ["ID","Case_no","File_no","Opponent","Related_Company","Court_no","Case_status","Case_type","Action"];
    this.getDisplayedColumns();
    this.Cases = this.company.cases
    //console.log(this.company);
    this.Case_length = this.company.cases.length
    this.caseList = new MatTableDataSource(this.Cases);
    this.caseList.paginator = this.tablePaginator;
    if (this.selectedcompany && this.showSelected) {
      let selectedIds = this.selectedcompany.map(dt => dt.id);

    }

    this.addForm.setValue({
      id: this.company.id,
      full_name: this.company?.full_name,
      CR: this.company.CR,
      email: this.company.email,
      mobile1: this.company.mobile1,
      mobile2: this.company.mobile2,
      whatsApp_phone: this.company.whatsApp_phone,
      type: this.company.type,
      comments: this.company.comments

    })
    //console.log(this.company);

    this.validation_messages = {
      'full_name': [
        { type: 'required', message: 'Court.Companies.Form.messages.full_name.required' },
      ],
      'CR': [
        { type: 'required', message: 'Court.Companies.Form.messages.CR.required' },
      ],
      'mobile1': [
        { type: 'required', message: 'Court.Companies.Form.messages.mobile1.required' },
        { type: 'pattern', message: 'Court.Companies.Form.messages.mobile1.pattern' },
      ],
      'mobile2': [
        { type: 'pattern', message: 'Court.Companies.Form.messages.mobile2.pattern' },
      ],
      'whatsApp_phone': [
        { type: 'pattern', message: 'Court.Companies.Form.messages.whatsApp_phone.pattern' },
      ],
      'email': [
        { type: 'required', message: 'Court.Companies.Form.messages.email.required' },
        { type: 'pattern', message: 'Court.Companies.Form.messages.email.pattern' },
      ]
    }

  }

  async ngOnChanges() {
    this.Cases = await (await this.court.getOneCompany(this.companyID)).cases;
    this.caseList = new MatTableDataSource(this.Cases);
  }

  async updateCompany() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.updateCompany(data);
        await this.app.dismissLoading();
        this.dismiss();
        this.ngOnInit()
        this.isEditMode = false
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Operations.Sorry', 'Court.Companies.required_failed', 'errorAlert');
    }

    

  }
  ngAfterViewInit() {

    // ['xl', '2xl'].includes(this.app.screenSize) ?
    //   setTimeout(() => {
    //     this.drawer.toggle()
    //   }, 1100) : null
  }

  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.createcompany(data);
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

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.CaseColumns : this.CaseColumns
  }

  async addCase() {
    const modal = await this.modalCtrl.create({ component: AddCaseCompanyModal, cssClass: 'responsiveModal',componentProps: { comp:this.companyID} });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async updateCase(row) {

    this.router.navigate(['components/lists/case-list/Case-details/', row.id])


  }
}

@Component({
  selector: 'add-case-company',
  templateUrl: './add-case-company.html',
})

export class AddCaseCompanyModal implements OnInit {
  @Input('comp') comp: number
  companies:Company[];
  clients:Client[];
  types:CaseType[];
  Courts:Court[];
  courtRooms:CourtRoom[];
  representatives:Employee[];
  segment:number
  isLoading = true;
  addForm: FormGroup;
  validation_messages:any;
    constructor(public modalCtrl : ModalController  ,  public Court :CourtService , fb: FormBuilder, public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    this.addForm = fb.group({
      companyID: ['', ],
      clientID: ['',[Validators.required] ],
      reference_no: ['',  ],
      typeID: ['',[Validators.required]],
      internalFile_no: ['',[Validators.required] ],
      comment: ['',],
      status: ['',],
      representativeID: ['',[Validators.required]],
      courtID: ['',[Validators.required] ],
      courtRoomID: ['',[Validators.required]],
      Opponent_name: ['',[Validators.required]],
      //Opponent_Mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$'),Validators.required])]],
      Opponent_Mobile1: ['', [Validators.required]],
      //Opponent_Mobile2: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      Opponent_Mobile2: ['',],
      Opponent_CPR: ['', [Validators.compose([Validators.pattern('^[0-9]{9}$')])]],
      Opponent_Nationality: ['',],
      Opponent_Organization: ['',],
      Opponent_Address: ['',],
      Opponent_Email:['', [Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}')])]]



    });
  } async ngOnInit() {

    this.segment=0;
    this.companies=await this.Court.getAllcompanies()
    this.clients =await this.Court.getAllClients()
    this.types=await this.Court.getAllCaseType()
    this.representatives= await this.authz.getEmployees()
    this.Courts=await this.Court.getAllCourts()
    this.courtRooms=await this.Court.getAllCourtRooms()
    //this.companyID = this.act.snapshot.params.id;
    this.addForm.get('companyID').setValue(Number(this.comp));
    
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
      ]
    }
  }

  /*async ngOnChanges() {
    this.clients = await this.court.getAllClients()
    this.clientList.data = this.clients
  }*/

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
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert("Operations.Sorry", "Court.Companies.required_filed", 'errorAlert',true);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
