import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js';
import { Subscription } from 'rxjs';
import { Appointment, AppointmentType, ClientType, Employee, TimeSlot } from 'src/app/interfaces/types';
import { CountryCodes } from 'src/app/pipes/country-name.pipe';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { MenuService } from 'src/app/services/menu.service';
import { environment } from 'src/environments/environment';
import { CourtService } from 'src/app/services/court.service';

export class PhoneErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    let val = form.value;
    let isValid = false;
    if (!val.client_phoneCountry) {
      control.setErrors({
        countryCode: true
      })
    }
    if (val.client_phone && val.client_phoneCountry) {
      isValid = isValidPhoneNumber(String(val.client_phone), val.client_phoneCountry.country);
    }
    if (val.client_phoneCountry && !isValid) {
      control.setErrors({
        invalidPhone: true
      })
    }
    return !isValid && (control.dirty || control.touched || isSubmitted)
  }
}
@Component({
  selector: 'book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss'],
})
export class BookAppointmentComponent implements OnInit, OnDestroy {

  employeesTimeSlots: Employee[] = [];
  @Input() selectedEmployee: Employee;
  @Input() selectedTimeSlot: TimeSlot;
  @Input() selectedClient: {
    client_name: string,
    client_type: ClientType,
    client_cpr: number,
    client_cr: number,
    client_email: string,
    client_phone: number
  };
  @Input() isModal: boolean = false;
  @Input() isEdit: boolean = false;
  @Input() fromTimeSlot: boolean;
  bookForm: FormGroup;
  isFromSite = false;
  selectedType: AppointmentType;
  notaryEmployee: Employee;
  subs: Subscription[] = [];
  countries = []
  appointmentTypes = [];
  phoneMatcher = new PhoneErrorStateMatcher();
  defaultCountry;
  validation_messages
  noNotary: boolean;
  noTimeSlots: boolean;
  checkAppointment: boolean = false
  appointmentData: Appointment
  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    public appointmentService: AppointmentService,
    public app: AppService,
    public lang: LanguageService,
    public menu: MenuService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    public Court: CourtService,

    fb: FormBuilder,
    public translate: TranslateService,
    private authz: AuthzService) {
    this.bookForm = fb.group({
      lawyer: ['', [Validators.required]],
      employee: ['', []],
      terms:[false,[]],
      timeSlot: ['', [Validators.required]],
      client_name: ['', [Validators.required]],
      client_type: ['Individual', [Validators.required]],
      isRepresentative: [false, [Validators.required]],
      isNewClient: [false, [Validators.required]],
      isExtended: [false, [Validators.required]],
      client_cpr: ['', [ Validators.compose([Validators.pattern('^[0-9]{9}$'),Validators.required])]],
      client_cr: [null, []],
      client_email: ['', [ Validators.compose([Validators.email,Validators.required])]],

      client_phoneCountry: [null, [Validators.required]],
      client_phone: [null, [Validators.required]],
      case_description: ['', []],
      typeID: ['', [Validators.required]],
      CprUrl: ['', ],
      OtherUrl: ['',]
    });

    this.countries = CountryCodes.map(country => {
      try {
        let calCode = getCountryCallingCode(country.code as any);
        let data = { name: country.name, country: country.code, code: calCode, };
        if (country.code == 'BH') {
          this.defaultCountry = data
          this.bookForm.get('client_phoneCountry').setValue(data);
        }
        return data
      } catch (error) {
        return null
      }
    }).filter(ct => ct);
  }

  typeChanged(ev) {
    this.noNotary = false
    this.selectedType = ev.value;
    //this.bookForm.get("lawyer").setValue(this.employeesTimeSlots ? this.employeesTimeSlots : null)
  }

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
  async ngOnInit() {

    if(this.selectedEmployee != null)
    {
      //-----if not Notary get every type except notary-----
      if(!this.selectedEmployee.isNotary)
        this.appointmentTypes = (await this.appointmentService.getAllAppointmentTypes()).filter(dt => !dt.isNotary)
      //-----else, get every type-----
      else
        this.appointmentTypes = (await this.appointmentService.getAllAppointmentTypes()).filter(dt => dt.isNotary)

      this.bookForm.get('lawyer').setValue(this.selectedEmployee)
    }

    if(this.selectedTimeSlot != null)
      this.bookForm.get('timeSlot').setValue(this.selectedTimeSlot)

    let sub = this.bookForm.get('client_type').valueChanges.subscribe(dt => {
      if (dt == 'Individual') {
        this.bookForm.get('client_cr').setValidators([])
        this.bookForm.get('client_cpr').setValidators([Validators.compose([Validators.pattern('^[0-9]{9}$'),Validators.required])])
      } else {
        this.bookForm.get('client_cr').setValidators([Validators.required])
        this.bookForm.get('client_cpr').setValidators([]);
      }

      this.bookForm.controls['client_cr'].updateValueAndValidity()
      this.bookForm.controls['client_cpr'].updateValueAndValidity()
    });

    this.subs.push(sub);
    if (this.route.url == '/newBooking') {
      this.menu.disableMainMenu();
      this.isFromSite = true;
    }

    this.employeesTimeSlots = await this.http.get<Employee[]>(`${environment.apiUrl}/hcm/workforce/appointment/getSystemTimeSlots`, { withCredentials: true }).toPromise();
    if (this.employeesTimeSlots.length > 0) {
      //let notary = this.employeesTimeSlots.filter(dt => dt.isNotary)
      //this.employeesTimeSlots = this.employeesTimeSlots.filter(dt => !dt.isNotary)
      //this.notaryEmployee = notary.length > 0 ? notary[0] : { timeSlots: [] };
      this.appointmentService.getAllAppointmentTypes();
      if (this.selectedEmployee) {
        const emp = this.employeesTimeSlots.find(x => x.id === this.selectedEmployee.id);
        this.bookForm.get('lawyer').setValue(emp);
      }
      if (this.selectedTimeSlot) {
        const emp = this.employeesTimeSlots.find(x => x.id === this.selectedEmployee.id);
        const ts = emp ? emp.timeSlots.find(x => x.id === this.selectedTimeSlot.id) : null;
        this.bookForm.get('timeSlot').setValue(ts);
      }
    }
    else
    {
      this.noTimeSlots = true;
    }


    if (this.selectedClient) {
      this.bookForm.get('client_name').setValue(this.selectedClient.client_name);
      this.bookForm.get('client_cpr').setValue(this.selectedClient.client_cpr);
      this.bookForm.get('client_email').setValue(this.selectedClient.client_email);
      this.bookForm.get('client_phone').setValue(this.selectedClient.client_phone);
    }

    this.bookForm.get('client_phoneCountry').setValue(this.defaultCountry);
  }
  selectEmp(ev) {
    console.log(ev);
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.bookForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}



  async bookAppointment() {
    //if (this.bookForm.invalid) return;
    await this.app.presentLoading();
    let data = this.bookForm.value;
    console.log("test in booking function")
    console.log(data)
    console.log(this.findInvalidControls())
    if (this.bookForm.valid) {
      let {CprUrl,OtherUrl, ...data } = this.bookForm.value;
      let urls_CPR =null;
      let urls_Other=null;
      try {
        if (CprUrl) {
          let doc_cpr = CprUrl.files[0];
          let uploaded;
          if (doc_cpr) {
            uploaded = await this.Court.uploadCaseDocument(doc_cpr);
            if (uploaded?.file.filename) {
              urls_CPR = uploaded?.file.filename;
            }
          }
          
        }
        if (OtherUrl) {
          let doc = OtherUrl.files[0];
          let uploaded;
          if (doc) {
            uploaded = await this.Court.uploadCaseDocument(doc);
            if (uploaded?.file.filename) {
              urls_Other = uploaded?.file.filename;
            }
          }
        }
      }
      catch (error) {
        await this.app.presentAlert('Operations.Sorry', 'Schedule.Booking.Errors.failed', 'errorAlert');
      }
      try {
        let res = await this.appointmentService.createAppointment({
          timeSlotID: data.timeSlot.id,
          typeID: data.typeID.id,
          data: {
            client_name: data.client_name,
            client_type: data.client_type,
            client_cpr: data.client_type == 'Individual' ? data.client_cpr : undefined,
            client_cr: data.client_type == 'Company' ? data.client_cr : undefined,
            client_email: data.client_email,
            client_phone: data.client_phoneCountry.code + ' ' + data.client_phone,
            case_description: data.case_description,
            isExtended: data.isExtended,
            CprUrl: urls_CPR,
            OtherUrl: urls_Other
          }
        });
        if (this.lang.selectedLang == 'en') {
          await this.app.presentAlert('Success', 'Booked Successfully', 'errorAlert')
        }else if(this.lang.selectedLang == 'ar'){
          await this.app.presentAlert('~', 'تم الحجز بنجاح', 'errorAlert')

        }
        this.bookForm.reset();
        this.dismiss(res);
        this.route.navigate(['../../schedule/appointments/'])
      } catch (error) {
        await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('Schedule.Booking.Errors.failed'), 'errorAlert');
      }
    } else {
      console.log('Not Valid');
      this.bookForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
    await this.app.dismissLoading();
  }
  dismiss(data?: any) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }

  async checkAppointmentData() {
    if (this.bookForm.get('client_cpr').value != null && this.bookForm.get('client_cpr').valid) {
      this.appointmentData = await this.Court.checkClientAppointment(this.bookForm.get('client_cpr').value);
      if(this.appointmentData != null)
        this.checkAppointment = true
    }
    else {
      this.checkAppointment = false
      this.appointmentData = null
    }
  }

  async getAppointmentData() {
    let appoCode = this.appointmentData.client_phone.split(" ")[0]
    let code;
    for(let i = 0; i < this.countries.length; i++) {
      if(this.countries[i].code == appoCode) {
        code = this.countries[i]
        break;
      }
    }

    console.log(this.appointmentData.client_phone.split(" ")[0])
    this.bookForm.setValue({
      terms:this.bookForm.get('terms').value,
      lawyer: this.bookForm.get('lawyer').value,
      employee: this.bookForm.get('employee').value,
      timeSlot: this.bookForm.get('timeSlot').value,
      client_name: this.appointmentData.client_name,
      client_type: this.appointmentData.client_type,
      isRepresentative: this.bookForm.get('isRepresentative').value,
      isNewClient: this.bookForm.get('isNewClient').value,
      isExtended: this.bookForm.get('isExtended').value,
      client_cpr: this.appointmentData.client_cpr,
      client_cr: this.bookForm.get('client_cr').value,
      client_email: this.appointmentData.client_email,
      client_phoneCountry: code,
      client_phone: this.appointmentData.client_phone.split(" ")[1],
      case_description: this.bookForm.get('case_description').value,
      typeID: this.bookForm.get('typeID').value,
      CprUrl: this.bookForm.get('CprUrl').value,
      OtherUrl: this.bookForm.get('OtherUrl').value
    })
  }
}
