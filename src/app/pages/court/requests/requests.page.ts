import { Request } from './../../../interfaces/types';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CourtService } from 'src/app/services/court.service';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  searchTerm: string
  RequestFilter: Request[]
  requests: Request[] = [];
  isAdd = false;
  requestData: Request = {
    name_ar: '',
    name_en: '',
    type: 'Lowful',
  }
  typeform: FormGroup;
  validation_messages: any;

  constructor(public fb: FormBuilder, public courtServices: CourtService, public modalCtrl: ModalController, public lang: LanguageService, private app: AppService, public router: Router,
    public authz: AuthzService) {
    if (!(this.authz.canDo('READ', 'Request', []) || this.authz.canDo('MANAGE', 'Request', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }

  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'Request', []) || this.authz.canDo('MANAGE', 'Request', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.typeform = this.fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      type: ['', Validators.required],
    });
    this.requests = await this.courtServices.getRequests();
    this.RequestFilter = this.requests
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
    await this.courtServices.getRequests();
  }

  ViewAddForm() {
    this.isAdd = !this.isAdd
  }

  async addType() {
    await this.app.presentLoading();
    if (this.typeform.valid) {
      //console.log("this.typeform.value")
      try {
        this.requestData = this.typeform.value
        let added = await this.courtServices.createRequest(this.requestData);
        await this.app.dismissLoading();
        this.typeform.reset()
        this.ngOnInit()
        this.isAdd = false;
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
    this.isAdd = !this.isAdd;
  }

  async update(type) {
    const modal = await this.modalCtrl.create({ component: UpdateRequestModal, cssClass: 'responsiveModal', componentProps: { type: type } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      //console.log(data);
    });
    return await modal.present();
  }

  public applyFilter() {
    return this.RequestFilter = this.requests.filter((val) => val.name_ar.toLowerCase().includes(this.searchTerm.trim()) ||
      val.name_en.toLowerCase().includes(this.searchTerm.trim())
    );
  }
}

@Component({
  selector: 'update-request',
  templateUrl: './update-request.html',
})

export class UpdateRequestModal implements OnInit {
  @Input('type') type: Request
  isLoading = true;
  updateForm: FormGroup;
  validation_messages: any;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public Court: CourtService, public authz: AuthzService) {

    this.updateForm = fb.group({
      id: ['',],
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  async ngOnInit() {

    //console.log(this.type);
    this.updateForm.setValue({
      id: this.type.id,
      name_ar: this.type.name_ar,
      name_en: this.type.name_en,
      type: this.type.type,
    })

    this.validation_messages = {
      'name_ar': [
        { type: 'required', message: 'Court.Cases.requests.Form.messages.name_ar.required' },
      ],
      'name_en': [
        { type: 'required', message: 'Court.Cases.requests.Form.messages.name_en.required' },
      ],
      'type': [
        { type: 'required', message: 'Court.Cases.requests.Form.messages.type.required' },
      ]
    }

  }

  async delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.requests.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    //console.log(confirm);

    if (confirm) {
      await this.Court.deleteRequest(this.updateForm.value.id);
      this.dismiss();
    }
  }

  async update() {
    //console.log(this.updateForm.value)
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      //console.log("update info")

      //console.log(this.updateForm.value)
      try {
        await this.Court.updateRequest(data);
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

