import { CaseType } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';


@Component({
  selector: 'app-case-types',
  templateUrl: './case-types.page.html',
  styleUrls: ['./case-types.page.scss'],
})
export class CaseTypesPage implements OnInit {
  searchTerm:string
  types: CaseType[] = [];
  CaseTypeFilter:CaseType[]
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



  constructor(public fb: FormBuilder, public courtServices: CourtService, public authz: AuthzService, public lang: LanguageService, public modalCtrl: ModalController, private router: Router, private app: AppService) {
    if (!(this.authz.canDo('READ', 'CaseType', []) || this.authz.canDo('MANAGE', 'CaseType', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', []) ||
        this.authz.canDo('MANAGE', 'LawyerAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }
  public applyFilter(){
    let custom_search_val
    if(this.searchTerm.trim() =="شرعي"){
      custom_search_val="Lowful"
    }else if(this.searchTerm.trim() =="مدني"){
      custom_search_val="Civilian" 
    }
    else if(this.searchTerm.trim() =="جنائي"){
      custom_search_val="Criminal" 
    }
    else if(this.searchTerm.trim() =="تنفيذ"){
      custom_search_val="Excution" 
    }

    console.log(custom_search_val)
      return  this.CaseTypeFilter = this.types.filter((val) => val.name_ar.toLowerCase().includes(this.searchTerm.trim()) ||
      val.name_en.toLowerCase().includes(this.searchTerm.trim())
      ||  val.type.toLowerCase().includes(custom_search_val)
      );
       
      }
      clearSelectionCaseType(){
        this.CaseTypeFilter=this.types
      }

  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'CaseType', []) || this.authz.canDo('MANAGE', 'CaseType', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', []) ||
        this.authz.canDo('MANAGE', 'LawyerAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.typeform = this.fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      comments: ['',],
      appeal_period: ['', Validators.required],
      discrimination_period: ['', Validators.required],
      type: ['', Validators.required],

    });
    this.isAdd = false
     this.types=await this.courtServices.getAllCaseType()
     console.log( this.types)
     this.CaseTypeFilter=this.types
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
  async update(type) {
    const modal = await this.modalCtrl.create({ component: UpdateCaseTypeModal, cssClass: 'responsiveModal', componentProps: { type: type } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }

  async addType() {
    await this.app.presentLoading();
    if (this.typeform.valid) {
      console.log("this.typeform.value")
      try {
        this.typeData = this.typeform.value
        let added = await this.courtServices.createCaseType(this.typeData);
        await this.app.dismissLoading();
        this.typeform.reset()
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
    this.typeform.reset()
      ;
    this.isAdd = false

  }

}

@Component({
  selector: 'update-caseType',
  templateUrl: './update-caseType.html',
})

export class UpdateCaseTypeModal implements OnInit {
  @Input('type') type: CaseType
  isLoading = true;
  updateForm: FormGroup;
  validation_messages: any;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public Court: CourtService, public authz: AuthzService) {

    this.updateForm = fb.group({
      id: ['',],
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      type: ['', Validators.required],
      comments: ['',],
      appeal_period: ['', Validators.required],
      discrimination_period: ['', Validators.required],

    });
  }

  async ngOnInit() {

    console.log(this.type);
    this.updateForm.setValue({
      id: this.type.id,
      name_ar: this.type.name_ar,
      name_en: this.type.name_en,
      type: this.type.type,
      comments: this.type.comments,
      appeal_period: this.type.appeal_period,
      discrimination_period: this.type.discrimination_period
    })

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

  async delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.Case-type.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log("delete" + this.updateForm.value.id);

    if (confirm) {
      await this.Court.deleteCaseType(this.updateForm.value.id);
      this.dismiss();
    }
  }

  async update() {
    console.log(this.updateForm.value)
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      console.log("update info")

      console.log(this.updateForm.value)
      try {
        await this.Court.updateCaseType(data);
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

