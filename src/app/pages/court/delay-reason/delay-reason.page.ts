
import {  DelayReson } from './../../../interfaces/types';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CourtService } from 'src/app/services/court.service';
import { ModalController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delay-reason',
  templateUrl: './delay-reason.page.html',
  styleUrls: ['./delay-reason.page.scss'],
})
export class DelayReasonPage implements OnInit {
  searchTerm:string
  types: DelayReson[] = [];
  DealyReasonFilter: DelayReson[]
  isAdd = false;
  resonData: DelayReson = {
    name_ar  :           '',
    name_en    :         '',
    type  :'Lowful',
    
  }
  typeform:FormGroup;
  validation_messages:any;

  constructor( public fb: FormBuilder,public courtServices:CourtService, public lang: LanguageService, public modalCtrl: ModalController, private app: AppService, public router: Router, public authz: AuthzService) {
    if (!(this.authz.canDo('READ', 'DelayReson', []) || this.authz.canDo('MANAGE', 'DelayReson', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', []) ||
        this.authz.canDo('MANAGE', 'LawyerAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }

  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'DelayReson', []) || this.authz.canDo('MANAGE', 'DelayReson', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', []) ||
        this.authz.canDo('MANAGE', 'LawyerAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.typeform = this.fb.group({
      name_ar:['',[Validators.required] ],
      name_en: ['', [Validators.required]],
      type:['', Validators.required],
    });
    this.types=await this.courtServices.getDelayReson();
    this.isAdd = false;
    this.DealyReasonFilter=this.types
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
  public applyFilter(){
    return  this.DealyReasonFilter = this.types.filter((val) => val.name_ar.toLowerCase().includes(this.searchTerm.trim()) ||
    val.name_en.toLowerCase().includes(this.searchTerm.trim())
    );
  
    }
    clearSelectionCaseType(){
      this.DealyReasonFilter=this.types
    }
  async ngOnChanges() {
    await this.courtServices.getDelayReson()
  }

  ViewAddForm(){
    this.isAdd =!this.isAdd
  }

  async addType() {
    await this.app.presentLoading();
    if (this.typeform.valid) {
      //console.log("this.typeform.value")
      try {
        this.resonData=this.typeform.value
        let added = await this.courtServices.createDelayReson(this.resonData);
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
    this.isAdd =!this.isAdd
  }

  async update(type) {
    const modal = await this.modalCtrl.create({ component: UpdatedelayReasonModal, cssClass: 'responsiveModal', componentProps: { type: type} });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      //console.log(data);
    });
    return await modal.present();
  }
}

@Component({
  selector: 'update-delay-reason',
  templateUrl: './update-delay-reason.html',
})

export class UpdatedelayReasonModal implements OnInit {
  @Input('type') type: DelayReson
  isLoading = true;
  updateForm: FormGroup;
  validation_messages:any;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public Court: CourtService, public authz: AuthzService ) {

    this.updateForm = fb.group({
      id: ['',],
      name_ar: ['', Validators.required],
      name_en:['', Validators.required],
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

  async updateDelayReason() {
    //console.log(this.updateForm.value)
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      //console.log("update info")

      //console.log(this.updateForm.value)
      try {
        await this.Court.updateDelayReason(data);
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
  /*ngAfterViewInit() {
    ['xl', '2xl'].includes(this.app.screenSize) ?
      setTimeout(() => {
        this.drawer.toggle()
      }, 1100) : null
  }*/

  async delete() {
    //console.log('delete' + this.updateForm.value.id)
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.delay-reson.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    //console.log(confirm);

    if (confirm) {
      await this.Court.deleteDelayReason(this.updateForm.value.id);
      this.dismiss();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

