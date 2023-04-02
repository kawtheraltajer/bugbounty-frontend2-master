import { Case, Court, Appointment, Opponent } from './../../../interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Client } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { MatDrawer } from '@angular/material/sidenav';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from 'src/app/auth/auth.service';
import { Pagination } from 'src/app/interfaces/commen-interfaces';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {
  allclients: { page: number, data: Client[] }[] = [];
  @Input('isEdit') isEdit: boolean;
  pageData: Client[] = []
  currentPage = 0;
  clients: Client[];
  @Input('isAdd') isAdd: boolean = false;
  clientsColumns: string[];
  @Input('selectedclient') selectedclient: Client[];
  clientList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Client>(true, []);
  @ViewChild('ClientTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  itemsPerPage = 5;
  dataCount = 0;
  searchTerm = '';
  segment: number
  isEnd = false;

  paginate: Pagination = {
    take: 5,
    skip: 0
  }
  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    if (!(this.authz.canDo('READ', 'Client', []) || this.authz.canDo('MANAGE', 'Client', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }
  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'Client', []) || this.authz.canDo('MANAGE', 'Client', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.segment = 0
    this.clientsColumns = ['id', 'CPR', 'Name', 'Mobile', 'whatsApp_phone', 'Action'];
    this.getDisplayedColumns();
    this.getallclientsss()


    if (this.selectedclient && this.showSelected) {
      let selectedIds = this.selectedclient.map(dt => dt.id);

    }

    this.getallclientsss()

  }

  clearSearchList(){
    if(this.searchTerm == null || this.searchTerm =="" ){
      this.getallclientsss()
    }
  }

 /* async ngOnInit() {
    if (!(this.authz.canDo('READ', 'Client', []) || this.authz.canDo('MANAGE', 'Client', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.segment = 0
    this.clientsColumns = ['id', 'CPR', 'Name', 'Mobile', 'whatsApp_phone', 'Action'];
    this.getDisplayedColumns();
    this.clients = await this.court.getAllClients()
    this.clientList = new MatTableDataSource(this.clients);
    this.clientList.paginator = this.tablePaginator;
    if (this.selectedclient && this.showSelected) {
      let selectedIds = this.selectedclient.map(dt => dt.id);

    }

  }*/

  async  SearchForClient(){

    let result = await this.court.SearchForClient({
      serach: this.searchTerm
    }); 
    this.clients=result.result;
    this.clientList.data = this.clients
    this.pageData = result.result;
  }


  /*async ngOnChanges() {
    // this.clients = await this.court.getAllClients( {paginate: this.paginate}
    //)
    this.clientList.data = this.clients
  }*/



  async getallclientsss() {
    this.searchTerm=""
    let result = await this.court.getAllClientsWithPagination({
      paginate: this.paginate
    });
    if (result.count) {
      this.dataCount = result.count;
    }
    if ((this.allclients.length * this.itemsPerPage) == this.dataCount) {
      this.isEnd = true
    } else {
      this.isEnd = false;
    }

    this.clients=result.result;
    this.clientList.data = this.clients
    this.pageData = result.result;
  }


  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }
  async add() {
    const modal = await this.modalController.create({ component: AddClientModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async deleteClient(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.clients.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.court.deleteClient(row.id).then(data => {
        this.ngOnInit()
      })
    }

  }


  async pageEvent(ev: {
    length: number
    pageIndex: number
    pageSize: number
    previousPageIndex?: number
  }) {
    console.log(ev);
    
    await this.goToPage(ev.pageIndex,ev.pageSize);
    this.paginate.take=ev.pageSize
  }
  async goToPage(pageNumber: number,pageSize:number) {
    if (pageNumber >= 0) {
      this.currentPage = pageNumber;
      if (this.allclients.findIndex(val => val.page == pageNumber) == -1) {
        this.paginate = {
          skip: (this.currentPage * this.itemsPerPage),
          take:pageSize,
        }
        this.getallclientsss()
      } else {
        this.pageData = this.allclients.filter(val => val.page == this.currentPage)[0].data;
      }
    }
  }



  async details(row) {
    this.router.navigate(['court/clients/client-details/', row.id])
  }

  applyFilter() {
    //this.clientList.filter = this.searchTerm.trim().toLowerCase();
    this.SearchForClient()
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.clientsColumns : this.clientsColumns
  }

}

@Component({
  selector: 'client-details',
  templateUrl: './client-details.html',
})

export class ClientDetailsModal implements OnInit {
  isEditMode: boolean
  cases: Case[]
  validation_messages: any;
  @Input('isEdit') isEdit: boolean;
  Cases: Case[];
  @Input('isAdd') isAdd: boolean = false;
  CaseColumns: string[];
  @Input('selectedclient') selectedclient: Case[];
  caseList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Client>(true, []);
  @ViewChild('CaseTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  @Input('employeeID') employeeID: number
  @Input('Educationid') Educationid: number
  @Input('client') client: Client
  @Input('ClientID') ClientID: number
  @Input('fromClient') fromClient: boolean
  @ViewChild('drawer') drawer: MatDrawer;
  Case_length: number;
  isLoading = true;
  addForm: FormGroup;
  segment: number
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
    this.segment = 0
    this.ClientID = this.act.snapshot.params.id;
    this.addForm = fb.group({
      id: ['',],
      full_name: ['', [Validators.required]],
      CPR: ['', [Validators.compose([Validators.pattern('^[0-9]{9}$'), Validators.required])]],
      email: ['', [Validators.compose([Validators.email, Validators.required])]],
      //mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$'), Validators.required])]],
      mobile1: ['', [Validators.required]],
      //mobile2: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      mobile2: ['',],
      Address: ['',],
      nationality: ['',],
      //whatsApp_phone: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      whatsApp_phone: ['',],
      type: ['',],
      details: ['',],
      appointments: ['',],
      job_position: ['',],
      comments: ['',],
      userID: ['',],

    });
  }


  async ngOnInit() {
    this.validation_messages = {
      'full_name': [
        { type: 'required', message: 'Court.clients.Form.messages.full_name.required' },
      ],
      'CPR': [
        { type: 'pattern', message: 'Court.clients.Form.messages.CPR.pattern' },
        { type: 'required', message: 'Court.clients.Form.messages.CPR.required' },
      ],
      'mobile1': [
        { type: 'required', message: 'Court.clients.Form.messages.mobile1.required' },
        { type: 'pattern', message: 'Court.clients.Form.messages.mobile1.pattern' },
      ],
      'mobile2': [
        { type: 'pattern', message: 'Court.clients.Form.messages.mobile2.pattern' },
      ],
      'whatsApp_phone': [
        { type: 'pattern', message: 'Court.clients.Form.messages.whatsApp_phone.pattern' },
      ],
      'email': [
        { type: 'required', message: 'Court.clients.Form.messages.email.required' },
        { type: 'email', message: 'Court.clients.Form.messages.email.pattern' },
      ]
    }

    this.isEditMode = false
    if (this.fromClient)
      this.ClientID = (await this.court.GetClientID(this.auth.userData.value.id)).id
    else
      this.ClientID = this.act.snapshot.params.id;

    this.client = await this.court.getOneClient(this.ClientID)
    this.isLoading = false;
    this.CaseColumns = ["ID", "Case_no", "File_no", "Opponent", "Related_Company", "Court_no", "Case_status", "Case_type", "Action"];
    this.getDisplayedColumns();
    this.Cases = this.client.cases
    this.Case_length = this.client.cases.length
    this.caseList = new MatTableDataSource(this.Cases);
    this.caseList.paginator = this.tablePaginator;
    if (this.selectedclient && this.showSelected) {
      let selectedIds = this.selectedclient.map(dt => dt.id);

    }
    this.addForm.setValue({
      id: this.client.id,
      full_name: this.client.full_name,
      CPR: this.client.CPR.toString(),
      email: this.client.email,
      mobile1: this.client.mobile1,
      mobile2: this.client.mobile2,
      Address: this.client.Address,
      nationality: this.client.nationality,
      whatsApp_phone: this.client.whatsApp_phone,
      type: this.client.type,
      job_position: this.client.job_position,
      comments: this.client.comments,
      details: null,
      appointments: null,
      userID: this.client?.userID

    })
  }

  async updateClient() {

    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      try {
        await this.Court.updateClient(data);
        await this.app.dismissLoading();
        this.dismiss();
        this.ngOnInit()
        this.isEditMode = false;
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      // await this.app.presentAlert('Operations.Sorry', 'Court.clients.Errors.required_filed', 'errorAlert');
    }
  }
  ngAfterViewInit() {
    ['xl', '2xl'].includes(this.app.screenSize) ?
      setTimeout(() => {
        this.drawer.toggle()
      }, 1100) : null
  }

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
      //await this.app.presentAlert('Operations.Sorry', 'Court.Companies.required_filed', 'errorAlert');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async details(row) {
    this.router.navigate(['Case-details/', row.id])
  }

  applyFilter() {
    this.caseList.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.CaseColumns : this.CaseColumns.filter(dt => dt !== 'Action');
  }
}


@Component({
  selector: 'add-client',
  templateUrl: './add-client.html',
})

export class AddClientModal implements OnInit {

  @Input('client') client: Client
  isLoading = true;
  addForm: FormGroup;
  validation_messages: any;
  checkAppointment: boolean = false
  checkOpponent: boolean = false
  appointmentData: Appointment
  opponent: Opponent
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public Court: CourtService) {

    this.addForm = fb.group({
      full_name: ['', [Validators.required]],
      CPR: ['', [Validators.compose([Validators.pattern('^[0-9]{9}$'), Validators.required])]],
      email: ['', [Validators.compose([Validators.email, Validators.required])]],
      //mobile1: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$'), Validators.required])]],
      mobile1: ['', [Validators.required]],
      //mobile2: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      mobile2: ['',],
      Address: ['',],
      nationality: ['',],
      //whatsApp_phone: ['', [Validators.compose([Validators.pattern('^[0-9]{8,13}$')])]],
      whatsApp_phone: ['',],
      type: ['',],
      details: ['',],
      appointments: ['',],
      job_position: ['',],
      comments: ['',],


    });
  }

  async ngOnInit() {

    this.validation_messages = {
      'full_name': [
        { type: 'required', message: 'Court.clients.Form.messages.full_name.required' },
      ],
      'CPR': [
        { type: 'pattern', message: 'Court.clients.Form.messages.CPR.pattern' },
        { type: 'required', message: 'Court.clients.Form.messages.CPR.required' },
      ],
      'mobile1': [
        { type: 'required', message: 'Court.clients.Form.messages.mobile1.required' },
        { type: 'pattern', message: 'Court.clients.Form.messages.mobile1.pattern' },
      ],
      'mobile2': [
        { type: 'pattern', message: 'Court.clients.Form.messages.mobile2.pattern' },
      ],
      'whatsApp_phone': [
        { type: 'pattern', message: 'Court.clients.Form.messages.whatsApp_phone.pattern' },
      ],
      'email': [
        { type: 'required', message: 'Court.clients.Form.messages.email.required' },
        { type: 'email', message: 'Court.clients.Form.messages.email.pattern' },
      ]
    }

  }

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
      //await this.app.presentAlert('Operations.Sorry', 'Court.clients.Errors.required_filed', 'errorAlert');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async checkClientAppointmentAndOpponent() {
    if (this.addForm.get('CPR').value != null && this.addForm.get('CPR').valid) {
      this.appointmentData = await this.Court.checkClientAppointment(this.addForm.get('CPR').value);
      if (this.appointmentData != null)
        this.checkAppointment = true
      else {
        this.opponent = await this.Court.GetOpponent(this.addForm.get('CPR').value);
        if (this.opponent != null) {
          this.checkAppointment = false
          this.checkOpponent = true
        }

      }
    }
    else {

      this.checkAppointment = false
      this.checkOpponent = false
      this.appointmentData = null





    }
  }

  async getAppointmentData() {
    this.addForm.setValue({
      full_name: this.appointmentData.client_name,
      CPR: this.appointmentData.client_cpr,
      email: this.appointmentData.client_email,
      mobile1: this.appointmentData.client_phone.split(' ')[1],
      mobile2: this.addForm.get('mobile2').value,
      Address: this.addForm.get('Address').value,
      nationality: this.addForm.get('nationality').value,
      whatsApp_phone: this.addForm.get('whatsApp_phone').value,
      type: this.addForm.get('type').value,
      details: this.addForm.get('details').value,
      appointments: this.addForm.get('appointments').value,
      job_position: this.addForm.get('job_position').value,
      comments: this.addForm.get('comments').value,
    })
  }
  async getOpponentData() {

    this.addForm.setValue({
      full_name: this.opponent.name,
      CPR: this.addForm.get('CPR').value,
      email: this.opponent.email,
      mobile1: this.opponent.main_mobile,
      mobile2: this.addForm.get('mobile2').value,
      Address: this.opponent.address,
      nationality: this.opponent.nationality,
      whatsApp_phone: this.addForm.get('whatsApp_phone').value,
      type: this.addForm.get('type').value,
      details: this.addForm.get('details').value,
      appointments: this.addForm.get('appointments').value,
      job_position: this.addForm.get('job_position').value,
      comments: this.addForm.get('comments').value,
    })
  }


}


