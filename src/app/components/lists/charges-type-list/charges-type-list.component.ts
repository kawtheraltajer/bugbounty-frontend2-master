import { ChargeType } from './../../../interfaces/types';


import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';
import { CaseType } from '../../../interfaces/types';





@Component({
  selector: 'charges-type-list',
  templateUrl: './charges-type-list.component.html',
  styleUrls: ['./charges-type-list.component.scss'],
})
export class ChargesTypeListComponent implements OnInit {
  searchTerm: string
  ChargeTypes: any;
  types: ChargeType[] = [];
  ChargeTypeFilter: CaseType[]
  isAdd = false;
  typeData: ChargeType = {
    id: 0,
    name_ar: '',
    name_en: '',
    amount: 0

  }
  typeform: FormGroup;
  validation_messages: any;



  constructor(public fb: FormBuilder, public courtServices: CourtService, public lang: LanguageService, public modalCtrl: ModalController, private router: Router, private app: AppService) {

    this.isAdd = false
  }

  async ngOnInit() {
    this.ChargeTypes = await this.courtServices.getAllChargeTypes()
    this.typeform = this.fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      amount: [0],

    });

    await this.courtServices.getAllCaseType()
    this.ChargeTypeFilter = this.ChargeTypes

    this.validation_messages = {
      'name_ar': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.name_ar.required' },
      ],
      'name_en': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.name_en.required' },
      ],

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
    const modal = await this.modalCtrl.create({ component: UpdateChargesTypeModal, cssClass: 'responsiveModal', componentProps: { type: type } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async addType() {
    await this.app.presentLoading();
    if (this.typeform.valid) {
      try {
        this.typeData = this.typeform.value
        let added = await this.courtServices.createChargeTypes(this.typeData);
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
    this.isAdd = false
  }

  public applyFilter() {
    return this.ChargeTypeFilter = this.ChargeTypes.filter((val) => val.name_ar.toLowerCase().includes(this.searchTerm.trim()) ||
      val.name_en.toLowerCase().includes(this.searchTerm.trim())
    );
  }

}

@Component({
  selector: 'update-chargesType',
  templateUrl: './update-chargesType.html',
})

export class UpdateChargesTypeModal implements OnInit {
  @Input('type') type: ChargeType
  isLoading = true;
  updateForm: FormGroup;
  validation_messages: any;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public Court: CourtService, public authz: AuthzService) {

    this.updateForm = fb.group({
      id: ['',],
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      amount: [0],

    });
  }

  async ngOnInit() {
    this.updateForm.setValue({
      id: this.type.id,
      name_ar: this.type.name_ar,
      name_en: this.type.name_en,
      amount: this.type.amount

    })

    this.validation_messages = {
      'name_ar': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.name_ar.required' },
      ],
      'name_en': [
        { type: 'required', message: 'Court.Cases.Case-type.Form.messages.name_en.required' },
      ],

    }

  }

  async delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Court.Cases.ChargeType.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.Court.deleteChargeTypes(this.updateForm.value.id);
      this.dismiss();
    }
  }

  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      try {
        await this.Court.updateChargeTypes(data);
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

