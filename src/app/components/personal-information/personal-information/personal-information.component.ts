import {  PersonalInformation } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
@Component({
  selector: 'personal-informations',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent implements OnInit {
  @Input('PersonalInformation') PersonalInformation: PersonalInformation
  @Input('personalInformationID') personalInformationID: number
  PersonalInformationForm: FormGroup;
  validation_messages:any;
  @Input('EmployeeId') EmployeeId: number
  data:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.PersonalInformationForm = fb.group({
      id:['', ],
      gender: [null,],
      marital_status: [null, ],
      nationality: [null,],
      national_identity: [null, ],
      religion: [null, ],
      passport: [null, ],
      birth_date: [null, ],


    });
  
  }   


   async ngOnInit() {
    this.data = await this.authz.getEmployee(this.EmployeeId);
this.PersonalInformation=this.data.personal_information
    this.validation_messages = {
      'gender': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.gender.required' }
      ],
      'nationality': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.nationality.required' },
      ],
      'national_identity': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.national_identity.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.national_identity.pattern' }
      ],
      'passport': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.passport.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.passport.pattern' }
      ],
    
      'religion': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.religion.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.religion.pattern' }
      ],
      'birth_date': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.birth_date.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.birth_date.pattern' }
      ],
    
    
    }
    this.PersonalInformationForm.setValue({
      id:this.PersonalInformation.id,
      gender:this.PersonalInformation.gender,
      marital_status: this.PersonalInformation.marital_status ,
      nationality: this.PersonalInformation.nationality,
      national_identity: this.PersonalInformation.national_identity,
      religion: this.PersonalInformation.religion,
      passport:this.PersonalInformation.passport,
      birth_date: this.PersonalInformation.birth_date,
  
    })





  }

  async update(){
    await this.app.presentLoading();
    if (this.PersonalInformationForm.valid) {

      this.PersonalInformationForm.setValue({
        id:this.PersonalInformation.id,
        gender:this.PersonalInformationForm.value.gender,
        marital_status: this.PersonalInformationForm.value.marital_status,
        nationality: this.PersonalInformationForm.value.nationality,
        national_identity: this.PersonalInformationForm.value.national_identity,
        religion: this.PersonalInformationForm.value.religion,
        passport: this.PersonalInformationForm.value.passport,
        birth_date:  this.PersonalInformationForm.value.birth_date,
    
      })
  
      let data = this.PersonalInformationForm.value;
      
console.log(data)
      try {
        await this.authz.UpdatePersonalInformation(data);
        await this.app.dismissLoading();
        this.dismiss();
        this.ngOnInit() 
      } catch (e) {
        console.log(e);
      }
    } else {
      this.PersonalInformationForm.markAllAsTouched();
      await this.app.dismissLoading();
     // await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }

  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }


}
