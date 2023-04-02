import { Address, Employee } from './../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
@Component({
  selector: 'addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss'],
})
export class AddressesListComponent implements OnInit {
  @Input('EmployeeId') EmployeeId: number
  @Input('id') id: number

  @Input('addresses') addresses: Address[]
  @Input('personalInformationID') personalInformationID: number
  data:Employee
 addressesList: Address[]

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) { }

  async ngOnInit() {

console.log(this.EmployeeId)
    this.data = await this.authz.getEmployee(this.EmployeeId);
    this.addresses=this.data.personal_information.addresses


  }

  ngAfterViewInit() {

  }
    ngOnChanges() {
  }
  async add() {
    console.log('id')
    const modal = await this.modalCtrl.create({ component: AddAddressesModal, cssClass: 'responsiveModal', componentProps: { personalInformationID: this.personalInformationID } });
    modal.onWillDismiss().then(data => {
      console.log(data);
      this.ngOnInit()
    });
    return await modal.present();
  }

  async update(address) {
    console.log("update address")

    console.log(address)
    const modal = await this.modalCtrl.create({ component: UpdateAddressesModal, cssClass: 'responsiveModal', componentProps: { address: address } });
    modal.onWillDismiss().then(data => {
      console.log(data);
      this.ngOnInit()
    });
    return await modal.present();
  }
  async Delete(address) {
   /* if (address.isMain) {
      let confirm = await this.app.presentConfirmAlert("Warning ", "You can't delete main addrees choose other main address before you delete address ", "Operations.Cancel", "Main address", true)
      console.log(confirm);
      if (confirm) {
        this.dismiss();
      }
      this.dismiss();
    } else {
      console.log('delete' + address.id)
      let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete address ?", "Operations.Cancel", "Operations.Confirm", true)
      console.log(confirm);

      if (confirm) {
        await this.authz.deleteAddress(address.id)
          this.ngOnInit()
         this.dismiss();
      
      

      }
      this.dismiss();
    }*/

    this.dismiss();
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}

@Component({
  selector: 'add-addresses',
  templateUrl: './add-addresses.html',
})
export class AddAddressesModal implements OnInit {
  isLoading = true;
  @Input('personalInformationID') personalInformationID: number
  validation_messages:any;
  addForm: FormGroup;

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.addForm = fb.group({
      line1: ['', [Validators.required]],
      line2: ['',],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      latitude: ['',],
      longitude: ['',],
      personalInformationID: ['',],
      isMain: ['',]
    });
  }



  async ngOnInit() {

    this.validation_messages = {
      'line1': [
        { type: 'required', message: 'Employee_managment.address.massages.line1.required' }
      ],
      'city': [
        { type: 'required', message: 'Employee_managment.address.massages.city.required' },
      ],
      'country': [
        { type: 'required', message: 'Employee_managment.address.massages.country.required' },
      ],
    }
    this.addForm.setValue({
      line1: "",
      isMain: false,
      line2: "",
      city: "",
      country: "",
      latitude: null,
      longitude: null,
      personalInformationID: this.personalInformationID

    })
  }

  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;
      console.log('address data')

      console.log(data)
      try {
        await this.authz.Addaddresses(data);
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
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
  selector: 'update-addresses',
  templateUrl: './update-addresses.html',
})

export class UpdateAddressesModal implements OnInit {
  @Input('address') address: Address;
  @Input('isEdit') isEdit: boolean;
  validation_messages:any;
  isLoading = true;
  addForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {

    this.addForm = fb.group({
      id: ['',],
      line1: ['', [Validators.required]],
      line2: ['',],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      latitude: ['',],
      longitude: ['',],
      personalInformationID: ['',],
      isMain: ['',]

    });
  }
  async ngOnInit() {
    this.validation_messages = {
      'line1': [
        { type: 'required', message: 'Employee_managment.address.massages.line1.required' }
      ],
      'city': [
        { type: 'required', message: 'Employee_managment.address.massages.nationality.required' },
      ],
      'country': [
        { type: 'required', message: 'Employee_managment.address.massages.country.required' },
      ],
    }
      this.addForm.setValue({
      id: this.address.id,
      line1: this.address.line1,
      line2: this.address.line2,
      city: this.address.city,
      country: this.address.country,
      latitude: this.address.latitude,
      longitude: this.address.longitude,
      personalInformationID: this.address.personalInformationID,
      isMain: this.address.isMain
    })


  }
  async update() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;


      try {
        await this.authz.UpdateAddress(data);
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }
  async activate(isActive: boolean) {

  }
  async Delete() {


    if (this.address.isMain) {
      let confirm = await this.app.presentConfirmAlert("Warning ", "You can't delete main addrees choose other main address before you delete address ", "Operations.Cancel", "Main address", true)
      console.log(confirm);
      if (confirm) {
        this.dismiss();

      }

      this.dismiss();
    } else {
   
      let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.address.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
      console.log(confirm)
      if (confirm == true) {
        await this.authz.deleteAddress(this.address.id)
        this.dismiss();

      }
    }
    this.dismiss();

  }


  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

