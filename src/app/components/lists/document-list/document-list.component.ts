import { Address, Employee, Document, Case, DocumentType, Company, Appointment } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { CourtService } from 'src/app/services/court.service';
import { environment } from 'src/environments/environment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  @Input('FromClient') FromClient: Boolean
  @Input('FromCase') FromCase: Boolean
  @Input('FromCompany') FromCompany: Boolean
  @Input('FromAppointment') FromAppointment: Boolean
  @Input('caseID') caseID: number
  @Input('sessionID') sessionID: number
  @Input('ClientID') ClientID: number
  @Input('CompanyID') CompanyID: number
  @Input('AppointmentID') AppointmentID: number
  segment = 0;
  Document: Document[]
  case: Case
  company:Company
  appointment: Appointment
  Document_first_segment: Document[]
  Document_secound_segment: Document[]
  Document_third_segment: Document[]
  Document_fourth_segment: Document[]
  documentOther: Document[]
  documentCPR:Document[]
  documentAdvice_form:Document[]
  documentKnow_your_client_form:Document[]
  documentConsultations:Document[]

  Document_first_segment_filter: Document[]
  Document_secound_segment_filter: Document[]
  Document_third_segment_filter: Document[]
  Document_fourth_segment_filter: Document[]
  documentOther_filter: Document[]

  storageURL:any
  searchTerm: string
  constructor(private router: Router,public Court: CourtService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService, public appointmentService: AppointmentService) {
    this.segment = 1
  }

  async ngOnInit() {
    this.storageURL=environment.storageURL

    if (this.FromClient) {
      let client = await this.Court.getOneClient(this.ClientID)
      this.Document = client.documents
    } else if (this.FromCase) {
      this.case = await this.Court.getOnecase(this.caseID)
      this.ClientID = this.case.clientID
      this.Document = this.case.documents
    } else if (this.FromCompany) {
      this.company = await this.Court.getOneCompany(this.CompanyID)
      this.Document = this.company.documents
    } else if (this.FromAppointment) { 
      this.appointment = await this.appointmentService.getOneAppointment(this.AppointmentID)
      this.Document = this.appointment.documents
    }

    this.Document_first_segment = this.Document.filter((list) => list.document_type == "Documents")
    this.Document_first_segment_filter = this.Document_first_segment
    this.Document_secound_segment = this.Document.filter((list) => list.document_type == "Lawsuit_attachment")
    this.Document_secound_segment_filter = this.Document_secound_segment
    this.Document_third_segment = this.Document.filter((list) => list.document_type == "memoir")
    this.Document_third_segment_filter = this.Document_third_segment
    this.Document_fourth_segment = this.Document.filter((list) => list.document_type == "Adjudge_attachment")
    this.Document_fourth_segment_filter = this.Document_fourth_segment
    this.documentOther = this.Document.filter((list) => list.document_type == "Other")
    this.documentCPR = this.Document.filter((list) => list.document_type == "CPR")
    this.documentAdvice_form = this.Document.filter((list) => list.document_type == "Advice_form")
    this.documentKnow_your_client_form = this.Document.filter((list) => list.document_type == "Know_your_client_form")
    this.documentConsultations = this.Document.filter((list) => list.document_type == "Consultations")
    if (this.FromClient || this.FromCompany) {
      this.documentOther = this.documentOther.concat(this.documentCPR)
      this.documentOther = this.documentOther.concat(this.documentAdvice_form)
      this.documentOther = this.documentOther.concat(this.documentKnow_your_client_form)
      this.documentOther = this.documentOther.concat(this.documentConsultations )
    }
    this.documentOther_filter = this.documentOther

    if(this.FromAppointment){
      this.Document_first_segment = this.documentCPR
      this.Document_first_segment_filter = this.Document_first_segment
      this.Document_secound_segment =  this.documentAdvice_form
      this.Document_secound_segment_filter = this.Document_secound_segment
      this.Document_third_segment=  this.documentKnow_your_client_form
      this.Document_third_segment_filter = this.Document_third_segment
      this.Document_fourth_segment = this.documentConsultations
      this.Document_fourth_segment_filter = this.Document_fourth_segment
    }
  }


  async delete(document) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.document.delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.Court.deleteDocument(document.id);
      this.ngOnInit()
    }
  }
  ngAfterViewInit() {

  }
  ngOnChanges() {
  }
  async add() {

    const modal = await this.modalCtrl.create({ component: AddDocumentModal, cssClass: 'responsiveModal', componentProps: { caseID: this.caseID, ClientID: this.ClientID ,CompanyID:this.CompanyID, AppointmentID: this.AppointmentID } });
    modal.onWillDismiss().then(data => {
      this.segment = data.data.segment
      this.ngOnInit()
    });
    return await modal.present();
  }
  async download(Decument) {

    saveAs(`${environment.storageURL}/public/uploads/document/${Decument}`, Decument);


  }
  
  preview(Decument) {
 let url=environment.storageURL+'/public/uploads/document/'+Decument 
    localStorage.setItem('url', url);
    this.router.navigateByUrl('/preview-doc');
   // window.open(environment.storageURL+'/public/uploads/document/'+Decument, 'asdas', 'toolbars=0,width=400,height=320,left=200,top=200,scrollbars=1,resizable=1');
}

  async update(Document) {
    const modal = await this.modalCtrl.create({ component: UpdateDocumentModal, cssClass: 'responsiveModal', componentProps: { Document: Document } });
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

  public applyFilter() {
    if(this.segment == 1)
      this.Document_first_segment_filter = this.Document_first_segment.filter((val) => val.name.toLowerCase().includes(this.searchTerm.trim()))

    if(this.segment == 2)
      this.Document_secound_segment_filter = this.Document_secound_segment.filter((val) => val.name.toLowerCase().includes(this.searchTerm.trim()))

    if(this.segment == 3)
      this.Document_third_segment_filter = this.Document_third_segment.filter((val) => val.name.toLowerCase().includes(this.searchTerm.trim()))
    
    if(this.segment == 4)
      this.Document_fourth_segment_filter = this.Document_fourth_segment.filter((val) => val.name.toLowerCase().includes(this.searchTerm.trim()))
    
    if(this.segment == 5)
      this.documentOther_filter = this.documentOther.filter((val) => val.name.toLowerCase().includes(this.searchTerm.trim()))
  }
}

@Component({
  selector: 'add-document',
  templateUrl: './add-document.html',
})
export class AddDocumentModal implements OnInit {
  isLoading = true;
  @Input('caseID') caseID: number
  @Input('sessionID') sessionID: number
  @Input('ClientID') ClientID: number
  @Input('CompanyID') CompanyID: number
  @Input('AppointmentID') AppointmentID: number
  validation_messages: any;
  addForm: FormGroup;
  segment = 0;
  constructor(public Court: CourtService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.addForm = fb.group({
      name: ['', [Validators.required]],
      document_type: ['', [Validators.required]],
      caseID: ['',],
      ClientID: [],
      CompanyID:[],
      appointmentId:[],
      url: ['', [Validators.required]],
    });
  }




  async ngOnInit() {
    this.validation_messages = {
      'name': [
        { type: 'required', message: 'Employee_managment.address.massages.line1.required' }
      ],
      'document_type': [
        { type: 'required', message: 'Employee_managment.address.massages.city.required' },
      ],
      'caseID': [
        { type: 'required', message: 'Employee_managment.address.massages.country.required' },
      ],
      'sessionID': [
        { type: 'required', message: 'Employee_managment.address.massages.country.required' },
      ],

    }

    this.addForm.setValue({
      name: null,
      document_type: "",
      caseID: Number(this.caseID),
      ClientID: Number(this.ClientID),
      CompanyID:Number(this.CompanyID),
      appointmentId: Number(this.AppointmentID),
      url: null,
    })
  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let { url, ...data } = this.addForm.value;
      let urls = '';
      try {
        if (url) {
          let doc = url.files[0];
          let uploaded;
          if (doc) {
            uploaded = await this.Court.uploadCaseDocument(doc);
            if (uploaded?.file.filename) {
              urls = uploaded?.file.filename;
            }
          }
        }

        this.changeSegmentNumber(data.document_type)
        await this.addForm.setValue({
          name: data.name,
          document_type: data.document_type,
          caseID: data.caseID,
          ClientID:data.ClientID,
          CompanyID:data.CompanyID,
          appointmentId: data.appointmentId,
          url: urls ? urls : null,
        })
        let forming = this.addForm.value
        await this.Court.addDocuments(forming);
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



  changeSegmentNumber(document_type) {
    if (document_type == "memoir") {
      this.segment = 3
    } else if (document_type == "Documents") {
      this.segment = 1
    } else if (document_type == "Adjudge_attachment") {
      this.segment = 4
    } else if (document_type == "Lawsuit_attachment") {
      this.segment = 2
    } else if (document_type == "Other") {
      this.segment = 5
    } else if (document_type == "CPR") {
      this.segment = 1
    } else if (document_type == "Advice_form") {
      this.segment = 2
    } else if (document_type == "Know_your_client_form") {
      this.segment = 3
    } else if (document_type == "Consultations") {
      this.segment = 4
    } else {
      this.segment = 1
    }

  }
  dismiss() {
    this.modalCtrl.dismiss({
      segment: this.segment,
      'dismissed': true
    });
  }
}


@Component({
  selector: 'update-document',
  templateUrl: './update-document.html',
})

export class UpdateDocumentModal implements OnInit {
  @Input('Document') Document: Document
  validation_messages: any;
  addForm: FormGroup;
  @Input('isEdit') isEdit: boolean;
  isLoading = true;

  constructor(public Court: CourtService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.addForm = fb.group({
      id: [],
      name: ['', [Validators.required]],
      document_type: ['', [Validators.required]],
      caseID: ['',],
      sessionID: ['',],
      url: ['', [Validators.required]],

    });

  }
  async ngOnInit() {

    this.validation_messages = {
      'name': [
        { type: 'required', message: 'Employee_managment.address.massages.line1.required' }
      ],
      'document_type': [
        { type: 'required', message: 'Employee_managment.address.massages.city.required' },
      ],
      'caseID': [
        { type: 'required', message: 'Employee_managment.address.massages.country.required' },
      ],
      'sessionID': [
        { type: 'required', message: 'Employee_managment.address.massages.country.required' },
      ],

    }

    this.addForm.setValue({
      id: this.Document.id,
      name: this.Document.name,
      document_type: this.Document.document_type,
      caseID: this.Document.caseID,
      sessionID: null,
      url: this.Document.url,


    })
  }

  async update() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;


      try {
        await this.Court.UpdateDocuments(data);
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
  async activate(isActive: boolean) {

  }


  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

