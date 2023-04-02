import { Appointment, Employee } from 'src/app/interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentDetailsModal } from '../../../pages/schedule/appointments-table/appointments-table.page';
import { SiteBookingComponent } from '../../schedule/site-booking/site-booking.component';
import { TermsPage } from './../../../pages/schedule/terms/terms.page';
import { HttpClient } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TimeSlot, ClientType, AppointmentType } from 'src/app/interfaces/types';

import { MenuService } from 'src/app/services/menu.service';
import { environment } from 'src/environments/environment';
import { getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js'
import { ErrorStateMatcher } from '@angular/material/core';
import { CountryCodes } from 'src/app/pipes/country-name.pipe';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';


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
  selector: 'appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent implements OnInit {
  @Input('admindashboard') admindashboard:any;
  @ViewChild('AppointmentTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('FromClient') FromClient: boolean;
  @Input('ClientID') ClientID: number;


  drawer: boolean = false;

  Appointments: Appointment[]
  appointmentTypes = [];
  AppointmentsColumns: string[];
  employeeList: Employee[];
  Columnslist: { name: string, isSelected: boolean, value: string }[]
  Filter_Colums: any
  AppointmentsLength: Number;
  AppointmentList = new MatTableDataSource([]);
  selection = new SelectionModel<Appointment>(true, []);
  current_date = new Date()
  min_date
  searchTerm = '';

  filter:any;

  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public appointmentService: AppointmentService, public authz: AuthzService, public court: CourtService) {
    this.current_date.setHours(0, 0, 0, 0);
    this.min_date = new Date(this.current_date.getFullYear(), this.current_date.getMonth(), this.current_date.getDate() + 30);

    this.filter = {
      from_date: this.current_date,
      to_date: this.min_date,
      employeeID: null,
      typeID: null
    }

    this.Columnslist = [
      {
        name: 'id',
        value: 'id',
        isSelected: true,
      },
      {
        name: 'type',
        value: 'type',
        isSelected: true,
      },
      {
        name: 'client_name',
        value: 'client_name',
        isSelected: true,
      },
      {
        name: 'client_type.client_type',
        value: 'client_type',
        isSelected: true,
      },
      {
        name: 'employee',
        value: 'employee',
        isSelected: true,
      },
      {
        name: 'date',
        value: 'date',
        isSelected: true,
      },
      {
        name: 'startTime',
        value: 'startTime',
        isSelected: true,
      },
      {
        name: 'endTime',
        value: 'endTime',
        isSelected: true,
      }
    ]
  }

  async ngOnInit() {
    this.drawer = false;
    this.employeeList = await this.authz.getEmployees()
    this.Filter_Colums = this.Columnslist.filter((list) => list.isSelected == true)
    this.AppointmentsColumns = [];
    for (let i = 0; i < this.Filter_Colums.length; i++) {
      this.AppointmentsColumns.push(this.Filter_Colums[i].value);
    }
    this.getDisplayedColumns();
    if(this.admindashboard == true){
      this.filter = {
        timeSlot: {
          every: {
            date: {
              gte: this.current_date,
              lte:this.current_date
            }
          }
        },
        NOT: {
            canceled: true
        }
      }

    }
    if (this.FromClient)
      this.Appointments = await this.court.getClientAppointments(this.ClientID)
    else
    {
      console.log(this.filter)
      this.Appointments = await this.appointmentService.getAppointmentList(this.filter)

    }

    this.appointmentTypes = await this.appointmentService.getAllAppointmentTypes()
    this.AppointmentList = new MatTableDataSource(this.Appointments);
    this.AppointmentList.paginator = this.tablePaginator;
  }

  getDisplayedColumns(): string[] {
    return this.app.isDesktop ? this.AppointmentsColumns : this.AppointmentsColumns;
  }

  async details(row) {
    this.router.navigate(['schedule/appointmentDetails/', row.id])
  }

  applyFilter() {
    this.AppointmentList.filter = this.searchTerm.trim().toLowerCase();
  }

  changeTOdate() {
    this.filter.from_date == this.filter.to_date
  }

  getSessionWithFilter() {
    this.ngOnInit()
  }

  /*add() {
    if(this.ClientID) {
      this.router.navigate(['book-appointment/'])
    }
  }
*/
  async add() {

    const modal = await this.modalController.create({
      component: AddClientOrCompanyAppointment,
      componentProps: {
        clientID: this.ClientID,
        isModal: true,
      }
    });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  public printDiv() {
    let printContents, popupWin, alignment, dir, name;
    printContents = document.getElementById('table').innerHTML;
    if (this.lang.selectedLang == 'en') {
      alignment = "left"
      dir = "ltr"
      name = "Appointments"
    }
    else {
      alignment = "right"
      dir = "rtl"
      name = "المواعيد"
    }

    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 12px;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              font-size: 14px;
              background-color: #f2f2f2 !important;
              -webkit-print-color-adjust: exact;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
          @media screen
          {
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              background-color: #f2f2f2 !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
        </style>
        <head>
          <title>${name}</title>
        </head>
        <body>
          <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
              Print PDF
          </button>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt=""> 
          <div style="padding-top:1rem;">
          <table class="table table-bordered" dir="${dir}">
            ${printContents}
          </table>
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }

}

@Component({
  templateUrl: './add-clientorcompany-appointment.html',

})
export class AddClientOrCompanyAppointment implements OnInit {

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
  @Input('clientID') clientID: number;
  bookForm: FormGroup;
  isFromSite = false;
  selectedType: AppointmentType;
  notaryEmployee: Employee;
  subs: Subscription[] = [];
  countries = []
  phoneMatcher = new PhoneErrorStateMatcher();
  defaultCountry;
  validation_messages
  noTimeSlots: boolean;
  appointmentTypes;
  clientOrCompany: boolean;
  FromclientOrCompany: boolean
  noNotary: boolean = false;
  id: number;
  constructor(
    private router: Router,
    private http: HttpClient,
    private modalCtrl: ModalController,
    public appointmentService: AppointmentService,
    public app: AppService,
    public lang: LanguageService,
    public menu: MenuService,
    private act: ActivatedRoute,
    private route: Router,
    fb: FormBuilder,
    public Court: CourtService,
    public translate: TranslateService,
    private authz: AuthzService,
    private auth: AuthService) {

    // if (this.act.snapshot.params.id)
    // this.clientID = this.act.snapshot.params.id;
    this.bookForm = fb.group({
      lawyer: ['', [Validators.required]],
      employee: ['', []],
      terms: ['', []],
      timeSlot: ['', [Validators.required]],
      client_name: ['', [Validators.required]],
      client_type: ['Individual', [Validators.required]],
      isRepresentative: [false, [Validators.required]],
      isNewClient: [false, [Validators.required]],
      isExtended: [false, [Validators.required]],
      client_cpr: ['', [Validators.compose([Validators.pattern('^[0-9]{9}$'), Validators.required])]],
      client_cr: [null, []],
      client_email: ['', [Validators.compose([Validators.email, Validators.required])]],
      client_phoneCountry: [null, [Validators.required]],
      client_phone: [null, [Validators.required]],
      clientID: [null, []],
      case_description: ['', []],
      typeID: ['', [Validators.required]],
      CprUrl: ['',],
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

  ngOnDestroy() {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
  async ngOnInit() {

    if (this.authz.canDo('MANAGE', 'ClientAccess', []) || this.authz.canDo('MANAGE', 'CompanyAccess', [])) {
      this.clientOrCompany = true
      if (this.authz.canDo('MANAGE', 'ClientAccess', [])) {
        let client = await this.Court.GetClientID(this.auth.userData.value.id)
        this.id = client.id
        this.bookForm.get('client_type').setValue('Individual')
        this.bookForm.get('client_cpr').setValue(client.CPR)
        this.bookForm.get('client_name').setValue(client.full_name)
        this.bookForm.get('client_phone').setValue(client.mobile1)
        this.bookForm.get('client_email').setValue(client.email)
      }
      else {
        let company = await this.Court.GetCompanyID(this.auth.userData.value.id)
        this.bookForm.get('client_type').setValue('Company')
        this.bookForm.get('client_cpr').setValue(company.CR)
        this.bookForm.get('client_name').setValue(company.full_name)
        this.bookForm.get('client_phone').setValue(company.mobile1)
        this.bookForm.get('client_email').setValue(company.email)
      }
    }

    if (this.clientID) {
      this.FromclientOrCompany = true
      this.isModal = true
      let client = await this.Court.getOneClient(this.clientID)
      this.bookForm.get('client_type').setValue('Individual')
      this.bookForm.get('client_cpr').setValue(client.CPR)
      this.bookForm.get('client_name').setValue(client.full_name)
      this.bookForm.get('client_phone').setValue(client.mobile1)
      this.bookForm.get('client_email').setValue(client.email)

    }

    this.validation_messages = {
      'lawyer': [
        { type: 'required', message: 'lawyer is required  |البريد الإلكتروني' },
      ],
      'terms': [
        { type: 'required', message: 'You cannot book an appointment without agreeing to the terms and conditions  | لايمكنك حجز موعد دون الموافقة على الشروط و الأحكام' },
      ],
      'timeSlot': [
        { type: 'required', message: 'time is required  |البريد الإلكتروني' },
      ],
      'client_name': [
        { type: 'required', message: 'Name  is required  | الإسم  مطلوب ' },
      ],
      'isRepresentative': [
        { type: 'required', message: 'Schedule.Booking.massages.isRepresentative.required' },
      ],
      'isNewClient': [
        { type: 'required', message: 'Schedule.Booking.massages.isNewClient.required' },
      ],
      'isExtended': [
        { type: 'required', message: 'Schedule.Booking.massages.isExtended.required' },
      ],
      'client_cpr': [
        { type: 'required', message: 'CPR is required  |الرقم الشخصي مطلوب ' },
        { type: 'minLength', message: 'CPR Must be 9 digits | الرقم الشخصي مكون من 9 ارقام' },
        { type: 'maxLength', message: ' CPR Must be 9 digits | الرقم الشخصي مكون من 9 ارقام' },
      ],
      'client_email': [
        { type: 'required', message: 'Email is required  |البريد الإلكتروني' },
        { type: 'pattern', message: 'Email is Invalid |البريد الإلكتروني غير صالح ' },
      ],
      'client_phone': [
        { type: 'required', message: 'phone is required  |رقم الإتصال  مطلوب ' },
        { type: 'minLength', message: 'phone Must at least 8 digits | الرقم الشخصي مكون على الاقل من  8 ارقام' },
        { type: 'maxLength', message: 'phone Must less than 13 digits | الرقم الشخصي اقل من 13ارقام' },
      ],
      'case_description': [
        { type: 'required', message: 'Email is required  |البريد الإلكتروني' },
      ],
    }

    let sub = this.bookForm.get('client_type').valueChanges.subscribe(dt => {
      if (dt == 'Individual') {
        this.bookForm.get('client_cr').setValidators([])
        this.bookForm.get('client_cpr').setValidators([Validators.compose([Validators.pattern('^[0-9]{9}$'), Validators.required])])
      } else {
        this.bookForm.get('client_cr').setValidators([])

        //this.bookForm.get('client_cr').setValidators([Validators.required])
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
    this.employeesTimeSlots = await this.http.get<Employee[]>(`${environment.apiUrl}/hcm/workforce/appointment/getAvailableTimeSlots`, { withCredentials: true }).toPromise();

    if (this.employeesTimeSlots.length > 0) {
      let notary = this.employeesTimeSlots.filter(dt => dt.isNotary)
      this.employeesTimeSlots = this.employeesTimeSlots.filter(dt => !dt.isNotary)
      this.notaryEmployee = notary.length > 0 ? notary[0] : { timeSlots: [] };

      if (this.notaryEmployee?.timeSlots.length < 1)
        this.appointmentTypes = (await this.appointmentService.getAllAppointmentTypes()).filter(dt => !dt.isNotary)
      else if (this.notaryEmployee?.timeSlots.length > 0 && this.employeesTimeSlots.length < 1)
        this.appointmentTypes = (await this.appointmentService.getAllAppointmentTypes()).filter(dt => dt.isNotary)
      else
        this.appointmentTypes = await this.appointmentService.getAllAppointmentTypes()
    }
    else {
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

  typeChanged(ev) {
    this.noNotary = false
    this.selectedType = ev.value;
    this.bookForm.get("lawyer").setValue(this.employeesTimeSlots ? this.employeesTimeSlots : null)

    if (this.selectedType && this.selectedType.isNotary) {
      const emp = this.notaryEmployee;
      if (emp?.timeSlots.length > 0) {
        this.bookForm.get('timeSlot').reset();
        this.bookForm.get('lawyer').setValue(emp);
        const ts = emp.timeSlots.find(x => x.id === this.selectedTimeSlot.id);
        this.bookForm.get('timeSlot').setValue(ts);
      }
      else {
        this.bookForm.get('timeSlot').reset();
        this.noNotary = true
      }
    }
    if (this.selectedEmployee) {
      const emp = this.employeesTimeSlots.find(x => x.id === this.selectedEmployee.id);
      this.bookForm.get('lawyer').setValue(emp);
    }
    if (this.selectedTimeSlot) {
      const emp = this.employeesTimeSlots.find(x => x.id === this.selectedEmployee.id);
      const ts = emp.timeSlots.find(x => x.id === this.selectedTimeSlot.id);
      this.bookForm.get('timeSlot').setValue(ts);
    }
  }

  selectEmp(ev) {
    console.log(ev);
  }

  async openTearm() {
    const modal = await this.modalCtrl.create({ component: TermsPage, cssClass: 'responsiveModalfull' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async bookAppointment() {
    if (this.bookForm.invalid) return;
    await this.app.presentLoading();
    let data = this.bookForm.value;
    console.log(data)
    if (this.bookForm.valid) {
      let { CprUrl, OtherUrl, ...data } = this.bookForm.value;
      let urls_CPR = null;
      let urls_Other = null;
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
        await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('Schedule.Booking.Errors.failed'), 'errorAlert');
      }

      try {
        console.log(this.clientID)
       if(this.clientOrCompany && data.terms){

       }else{
      let res = await this.appointmentService.createClientAppointment({
          timeSlotID: data.timeSlot.id,
          typeID: data.typeID.id,
          clientID: Number(this.clientID),
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
        this.bookForm.reset();
        this.dismiss(res);

        await this.app.dismissLoading();
        if (this.clientOrCompany) {
          if (this.lang.selectedLang == 'en') {
            let confirm = await this.app.presentConfirmAlert("Success", "You will receive an email when the appointment is confirmed. Thank you.", "Operations.Cancel", "Operations.Confirm", true)

          } else if (this.lang.selectedLang == 'ar') {
            let confirm = await this.app.presentConfirmAlert("تم", "سوف يصلك بريد إلكتروني في حال تثبيت الموعد", "Operations.Cancel", "Operations.Confirm", true)

          }

        } else {
          if (this.lang.selectedLang == 'en') {
            await this.app.presentAlert('Success', 'Booked Successfully', 'errorAlert')
          } else if (this.lang.selectedLang == 'ar') {
            await this.app.presentAlert('~', 'تم الحجز بنجاح', 'errorAlert')

          }
       }

  

        }


      } catch (error) {
        await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('Schedule.Booking.Errors.failed'), 'errorAlert');
      }
    } else {
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

}
