import { Contact } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';


@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input('isEdit') isEdit: boolean
  @Input('contact') contact: Contact
  @Input('personalInformationID') personalInformationID: number
  @Output() UpdateContactEvent = new EventEmitter<any>();
  contactForm: FormGroup;
  validation_messages:any;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.contactForm = fb.group({
      id:['', ],
      //phone: ['', [ Validators.compose([Validators.minLength(8),Validators.maxLength(11),Validators.pattern('[0-9]+'),Validators.required])]],
      phone: ['', [Validators.required]],
      //mobile: ['', [ Validators.compose([Validators.minLength(8),Validators.maxLength(11),Validators.pattern('[0-9]+'),Validators.required])]],
      mobile: ['', [Validators.required]],
      email: ['', [ Validators.compose([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}'),Validators.required])]],
      personalInformationID:['', ],
    });
  }
  ngOnInit() {
    //console.log(this.contact)

    this.validation_messages = {

      'mobile': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.phone.required' },
        { type: 'minlength', message: 'Employee_managment.Emergency_Contact.massages.phone.min' },
        { type: 'maxlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.phone.pattern' }

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
    //console.log("contact")
    //console.log(this.contact)
    //console.log(this.personalInformationID)
    this.contactForm.setValue({
      id:this.contact.id,
      email:this.contact.email,
      mobile:this.contact.mobile,
      phone:this.contact.phone,
      personalInformationID:this.contact.personalInformationID
  
    })
  }
  async update() {
    await this.app.presentLoading();
    if (this.contactForm.valid) {
      let data = this.contactForm.value;
      
      try {
        await this.authz.UpdateContact(data);
        await this.app.dismissLoading();
        //this.ngOnInit()
        this.UpdateContactEvent.emit();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.contactForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
