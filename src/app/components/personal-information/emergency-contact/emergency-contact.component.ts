import { concat } from 'rxjs';
import { Contact, EmergencyContact, PersonalInformation } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'emergency-contact',
  templateUrl: './emergency-contact.component.html',
  styleUrls: ['./emergency-contact.component.scss'],
})

export class EmergencyContactComponent implements OnInit {
  @Input('isEdit') isEdit: boolean
  @Input('EmployeeId') EmployeeId: number

@Input('EmergencyContact') EmergencyContact: EmergencyContact[]
@Input('personalInformationID') personalInformationID: number
validation_messages:any;
data:any
EmergencyContactForm: FormGroup;
constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

  this.EmergencyContactForm = fb.group({
    id:['', ],
    name:['', ],
    relation: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    mobile: ['',Validators.required],
    email:['', [Validators.required]],
    personalInformationID:['',]

  });
}
async ngOnInit() {
  this.data = await this.authz.getEmployee(this.EmployeeId);
  
this.EmergencyContact =this.data.personal_information.emergency_contacts

}

  async update(EmergencyContact) {

    const modal = await this.modalCtrl.create({ component: UpdateEmergencyContactModal, cssClass: 'responsiveModal', componentProps: { EmergencyContact: EmergencyContact }});
      modal.onWillDismiss().then(data => {
        this.ngOnInit()
      });
      return await modal.present();
    }
  
   
  async add() {
  const modal = await this.modalCtrl.create({ component: AddEmergencyContactModal, cssClass: 'responsiveModal', componentProps: { personalInformationID: this.personalInformationID }});
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

}

@Component({
  selector: 'add-emergency-contact',
  templateUrl: './add-emergency-contact.html',
})
export class AddEmergencyContactModal implements OnInit {
  isLoading = true;
  @Input('personalInformationID') personalInformationID: number
  validation_messages:any;
  EmergencyContactForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.EmergencyContactForm = fb.group({
      name:['',  [Validators.required]],
      relation: ['', [Validators.required]],
      //phone: ['', [ Validators.compose([Validators.minLength(8),Validators.maxLength(11),Validators.pattern('[0-9]+'),Validators.required])]],
      phone: ['', [Validators.required]],
      //mobile: ['', [ Validators.compose([Validators.minLength(8),Validators.maxLength(11),Validators.pattern('[0-9]+'),Validators.required])]],
      mobile: ['', [Validators.required]],
      email: ['', [ Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'),Validators.required])]],
      personalInformationID:['', ]
  
    });
  }


  async ngOnInit() {
 
    this.validation_messages = {

      'name': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.name.required' },  
  
      ],
    

      'relation': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.relation.required' },  
  
      ],
  
    
      'phone': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.phone.required' },
        { type: 'minlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'maxlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.phone.pattern' }

      ],
      'email': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.email.required' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.email.pattern' }
      ],
    
    
    }

    this.EmergencyContactForm.setValue({
      name:"",
      relation: "",
      phone:null,
      mobile: 0,
      email:"",
      personalInformationID:this.personalInformationID

    })
  }
  
  async add() {
    await this.app.presentLoading();
    if (this.EmergencyContactForm.valid) {
      this.EmergencyContactForm.setValue({
        name:this.EmergencyContactForm.value.name,
        relation:this.EmergencyContactForm.value.relation,
        phone:this.EmergencyContactForm.value.phone,
        mobile: this.EmergencyContactForm.value.phone ,
        email:this.EmergencyContactForm.value.email ,
        personalInformationID:this.personalInformationID
  
      })
      let data = this.EmergencyContactForm.value;

      try {
        await this.authz.AddEmergencyContact(data);
        await this.app.dismissLoading();
        this.dismiss();
        this.ngOnInit() 
      } catch (e) {
        console.log(e);
      }
    } else {
      this.EmergencyContactForm.markAllAsTouched();
      await this.app.dismissLoading();
     // await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }


  async activate(isActive: boolean) {


  }
  async lock(isLocked: boolean) {

  }


  getURL(imgPath: string) {
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'update-emergency-contact',
  templateUrl: './update-emergency-contact.html',
})

export class UpdateEmergencyContactModal implements OnInit {
  @Input('EmergencyContact') EmergencyContact: EmergencyContact
  
  isLoading = true;
  EmergencyContactForm: FormGroup;
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.EmergencyContactForm = fb.group({
      id:['', ],
      name:['', ],
      relation: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      mobile: ['',Validators.required],
      email:['', [Validators.required]],
      personalInformationID:['', ]
  
    });}
  async ngOnInit()
  {
  

    this.validation_messages = {

      'name': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.name.required' },  
  
      ],
    

      'relation': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.relation.required' },  
  
      ],
  
    
      'phone': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.phone.required' },
        { type: 'minlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'maxlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.phone.pattern' }

      ],
      'email': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.email.required' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.email.pattern' }
      ],
    
    
    }

    this.EmergencyContactForm.setValue({
      id:this.EmergencyContact.id,
      name:this.EmergencyContact.name,
      relation:this.EmergencyContact.relation ,
      phone: this.EmergencyContact.phone,
      mobile:this.EmergencyContact.mobile,
      email:this.EmergencyContact.email,
      personalInformationID:this.EmergencyContact.personalInformationID
 
    })


  }
  async update() {
    await this.app.presentLoading();
    if (this.EmergencyContactForm.valid) {
      let data = this.EmergencyContactForm.value;
      try {
        await this.authz.UpdateEmergencyContact(data);
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.EmergencyContactForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  async Delete() {

   let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Emergency_Contact.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    
    if (confirm) {
      await this.authz.deleteEmergencyContact(this.EmergencyContact.id)
      this.dismiss();

    }
    this.dismiss();


  }

  
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

