import { Employee, employee_request } from './../../../interfaces/types';
import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { EmployeePickerComponent } from '../../pickers/employee-picker/employee-picker.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourtService } from 'src/app/services/court.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employee-requests-list',
  templateUrl: './employee-requests-list.component.html',
  styleUrls: ['./employee-requests-list.component.scss'],
})
export class EmployeeRequestsListComponent implements OnInit {

  Requests: employee_request[]
  MyRequests: employee_request[]
  Requestslength: number
  MyRequestslength: number
  SelectedRequest: employee_request
  InboxSelectedItem: any
  SentSelectedItem: any
  segment: number
  InboxCount: number
  replyToRequest: employee_request
  RequestsLoading: boolean = true
  MyRequestsLoading: boolean = true

  constructor(
    public router: Router,
    public lang: LanguageService,
    public modalController: ModalController,
    public app: AppService,
    public authz: AuthzService,
    public user: UserService
  ) {
   /* if (!(this.authz.canDo('READ', 'EmployeeRequest', []) || this.authz.canDo('MANAGE', 'EmployeeRequest', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.segment = 0
  }

  async ngOnInit() {
   /* if (!(this.authz.canDo('READ', 'EmployeeRequest', []) || this.authz.canDo('MANAGE', 'EmployeeRequest', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.InboxCount = await this.authz.countInboxRequests()
    this.authz.getAllEmployeeRequests().then((val)=>{
      this.Requests = val
      this.Requestslength = this.Requests.length
      this.RequestsLoading = false
    })
    this.authz.getRequestsISent().then((val)=>{
      this.MyRequests = val
      this.MyRequestslength = this.MyRequests.length
      this.MyRequestsLoading = false
    })
  }

  async details() {
    const modal = await this.modalController.create({ component: RequestDetailsModal, cssClass: 'responsiveModal', componentProps: { SelectedRequest: this.SelectedRequest } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  getURL(imgPath: string) {
    return this.user.getProfilePicURL(imgPath);
  }

  async download(Document) {
    if (Document != '' && Document != 'null' && Document != null) {
      saveAs(`${environment.storageURL}/public/uploads/document/${Document}`, Document);
    }

    else {
      if (this.lang.selectedLang == 'en') {
        await this.app.presentAlert('Sorry ~', 'There is no file to dawnload it ', 'errorAlert');
      }
      else {
        await this.app.presentAlert('خطأ ~', 'لا يوجد ملف لتحميله', 'errorAlert');
      }
    }
  }

  async selectOneRequest(id) {
    this.SelectedRequest = await this.authz.getOneEmployeeRequest(id)
    if (this.SelectedRequest?.Reply_to_id)
      this.replyToRequest = await this.authz.getOneEmployeeRequest(this.SelectedRequest.Reply_to_id)
    else
      this.replyToRequest = null

    if (!this.SelectedRequest.IsRead) {
      this.InboxCount = this.InboxCount - 1
      await this.authz.markRequestAsRead(id)
    }

    if (!this.app.isDesktop)
      this.details()
  }

  async selectMyRequest(id) {
    this.SelectedRequest = await this.authz.getOneEmployeeRequest(id)
    if (this.SelectedRequest?.Reply_to_id)
      this.replyToRequest = await this.authz.getOneEmployeeRequest(this.SelectedRequest.Reply_to_id)
    else
      this.replyToRequest = null

    if (!this.app.isDesktop)
      this.details()
  }

  async add() {
    const modal = await this.modalController.create({ component: AddEmployeeRequestModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async reply() {
    const modal = await this.modalController.create({ component: AddEmployeeRequestModal, cssClass: 'responsiveModal', componentProps: { SelectedRequest: this.SelectedRequest } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async clickReply() {
    this.SelectedRequest = this.replyToRequest;
    if (this.SelectedRequest.Reply_to_id)
      this.replyToRequest = await this.authz.getOneEmployeeRequest(this.SelectedRequest.Reply_to_id)
    else
      this.replyToRequest = null

    if (!this.SelectedRequest.IsRead) {
      this.InboxCount = this.InboxCount - 1
      await this.authz.markRequestAsRead(this.SelectedRequest.id)
    }
  }

}

@Component({
  selector: 'request-details',
  templateUrl: './request-details.html',
})

export class RequestDetailsModal implements OnInit {

  @Input('SelectedRequest') SelectedRequest: employee_request;

  replyToRequest: employee_request

  constructor(
    public modalController: ModalController,
  ) {
  }

  async ngOnInit() { }

  async download(Document) {
    saveAs(`${environment.storageURL}/public/uploads/document/${Document}`, Document);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async reply() {
    const modal = await this.modalController.create({ component: AddEmployeeRequestModal, cssClass: 'responsiveModal', componentProps: { SelectedRequest: this.SelectedRequest } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

}

@Component({
  selector: 'add-request',
  templateUrl: './add-request.html'
})
export class AddEmployeeRequestModal implements OnInit {

  @Input() selectedEmployee: Employee
  @Input('SelectedRequest') SelectedRequest: employee_request

  addForm: FormGroup;
  validation_messages: any;

  constructor(
    public fb: FormBuilder,
    public lang: LanguageService,
    public modalCtrl: ModalController,
    public app: AppService,
    public authz: AuthzService,
    public user: UserService,
    public Court: CourtService,
    public translate: TranslateService,
  ) {
    this.addForm = fb.group({
      to_userId: ['',],
      subject: ['', [Validators.required]],
      body: ['',],
      OtherUrl: ['',],
      doc_url: ['',],
      Reply_to_id: ['',]
    });
  }

  ngOnInit() {
    if (this.SelectedRequest.to_userId != null) {
      this.addForm.get('to_userId').setValue(this.SelectedRequest.to_userId)
      this.addForm.get('Reply_to_id').setValue(this.SelectedRequest.id)
      this.addForm.get('subject').setValue(this.SelectedRequest.subject)
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async selectEmployee(ev?: any) {
    const mdl = await this.modalCtrl.create({
      component: EmployeePickerComponent,
      cssClass: 'popover-width',
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      if (!dt.data?.isCancel) {
        if (dt.data.employee) {
          this.addForm.get('to_userId').setValue(dt.data.employee.userID);
          this.selectedEmployee = dt.data.employee
        }
      }
    });
  }

  removeEmployee() {
    this.selectedEmployee = null;
  }

  async sendRequest() {
    let { OtherUrl, ...data } = this.addForm.value;
    let urls_Other = null;
    if (data?.to_userId) {
      try {
        if (OtherUrl) {
          let doc = OtherUrl.files[0];
          let uploaded;
          if (doc) {
            uploaded = await this.Court.uploadCaseDocument(doc);
            if (uploaded?.file.filename) {
              urls_Other = uploaded?.file.filename;
            }
          }
        }
      }
      catch (error) {
        await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('Schedule.Booking.Errors.failed'), 'errorAlert');
      }
      await this.app.presentLoading();
      if (this.addForm.valid) {
        try {
          if (data.Reply_to_id) {
            await this.authz.ReplyToEmployeeRequest({
              to_userId: data.to_userId,
              subject: data.subject,
              body: data.body,
              document: data.subject,
              doc_url: urls_Other,
              Reply_to_id: data.Reply_to_id
            });
          }
          else {
            await this.authz.createEmployeeRequest({
              to_userId: data.to_userId,
              subject: data.subject,
              body: data.body,
              document: data.subject,
              doc_url: urls_Other
            });
          }
          await this.app.dismissLoading();
          let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.General_Requests.Messages.Success", "Operations.Cancel", "Operations.Confirm", true)
          if (confirm) {
            this.dismiss()
          }
          else {
            this.dismiss()
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        this.addForm.markAllAsTouched();
        await this.app.dismissLoading();
      }
    }
    else {
      await this.app.dismissLoading();
      if (this.lang.selectedLang == 'en') {
        await this.app.presentAlert('Alert', 'Please select the employee', 'errorAlert');
      }
      else {
        await this.app.presentAlert('تنبيه', 'الرجاء اختيار الموظف', 'errorAlert');
      }
    }
  }

}
