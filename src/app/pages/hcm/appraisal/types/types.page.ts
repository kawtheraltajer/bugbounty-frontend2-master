import { Component, OnInit,Input } from '@angular/core';
import { AppraisalType } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-types',
  templateUrl: './types.page.html',
  styleUrls: ['./types.page.scss'],
})
export class TypesPage implements OnInit {
  types: AppraisalType[] = [];
  isAdd = false;
  typeData: AppraisalType = {
    title_ar: '',
    title_en: ''
  }
  validation_messages:any
  typeform:FormGroup;

  constructor(public modalCtrl: ModalController,public lang: LanguageService,public fb: FormBuilder,public appraisalServices: AppraisalService, public app: AppService, public authz: AuthzService,
    private router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.typeform = this.fb.group({
      title_ar:['',[Validators.required] ],
      title_en: ['', [Validators.required]],

});
    await this.appraisalServices.getAllAppraisalTypes()

    this.validation_messages = {
      'title_ar': [
        { type: 'required', message: 'HCM.Appraisal.type.messages.title_ar.required' },
      ],
      'title_en': [
        { type: 'required', message: 'HCM.Appraisal.type.messages.title_en.required' },
      ]
    }
  }

  async update(type) {
    const modal = await this.modalCtrl.create({ component: UpdateTypeModal, cssClass: 'responsiveModal', componentProps: { type: type} });
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
        console.log(this.typeform.value)
       this.typeData=this.typeform.value
        let added = await this.appraisalServices.createAppraisalType(this.typeData);
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
  ViewAddForm(){
    this.isAdd =!this.isAdd

}
  clear() {
    this.typeform.reset();
    this.isAdd =false

}
}


@Component({
  selector: 'update-type',
  templateUrl: './update-type.html',
})

export class UpdateTypeModal implements OnInit {
  @Input('type') type: AppraisalType
  isLoading = true;
  updateForm: FormGroup;
  validation_messages:any;
    constructor( public modalCtrl: ModalController, public lang: LanguageService,public fb: FormBuilder,public appraisalServices: AppraisalService, public app: AppService) { 

    this.updateForm = fb.group({
      id: ['',],
      title_ar:['',[Validators.required] ],
      title_en: ['', [Validators.required]],

    });
  } 
  
  async ngOnInit() {

    console.log(this.type);
    this.updateForm.setValue({
      id: this.type.id,
      title_ar: this.type.title_ar,
      title_en: this.type.title_en,

    })

    this.validation_messages = {
      'title_ar': [
        { type: 'required', message: 'HCM.Appraisal.type.messages.title_ar.required' },
      ],
      'title_en': [
        { type: 'required', message: 'HCM.Appraisal.type.messages.title_en.required' },
      ]
    }

  }

  async delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "HCM.Appraisal.type.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log("delete" + this.updateForm.value.id);

    if (confirm) {
      await this.appraisalServices.deleteAppraisalType(this.updateForm.value.id);
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
        await this.appraisalServices.updateAppraisalType(data);
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



