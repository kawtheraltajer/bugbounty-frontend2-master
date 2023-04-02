import { Contact } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';



@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  @Input('isEdit') isEdit: boolean;
  @Input('contact') contact: Contact
  @Input('personalInformationID') personalInformationID: number
  contactForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.contactForm = fb.group({
      id:['', ],
      phone: ['', [Validators.required]],
      mobile: ['',Validators.required],
      email:['', [Validators.required]],

    });
  }
  ngOnInit() {
    this.contactForm.setValue({
      id:this.contact.id,
      email:this.contact.email,
      mobile:this.contact.mobile,
      phone:this.contact.phone,
  
    })

  }
    update(){
      
    }

}
