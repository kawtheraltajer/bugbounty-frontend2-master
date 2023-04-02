import { Appointment, AppointmentType, Employee, TimeSlot } from 'src/app/interfaces/types';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appointments-table',
  templateUrl: './appointments-table.page.html',
  styleUrls: ['./appointments-table.page.scss'],
})
export class AppointmentsTablePage implements OnInit {

  @ViewChild('AppointmentTablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  filter: any

  status;
  type;
  employee;

  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public appointmentService: AppointmentService, public authz: AuthzService) {
    /*if (!(this.authz.canDo('READ', 'Appointment', []) || this.authz.canDo('MANAGE', 'Appointment', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.current_date.setHours(0, 0, 0, 0);
    this.min_date = new Date(this.current_date.getFullYear(), this.current_date.getMonth(), this.current_date.getDate() + 30);

    this.filter = {
      timeSlot: {
        every: {
          date: {
            gte: this.current_date,
            lte: this.min_date
          }
        }
      },
      NOT: {
          canceled: true
      }
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
        name: 'client_cpr',
        value: 'client_cpr',
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
      },
      {
        name: 'isApproved',
        value: 'isApproved',
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
    this.Appointments = await this.appointmentService.getAppointmentList(this.filter)
    this.appointmentTypes = await this.appointmentService.getAllAppointmentTypes()
    this.AppointmentList = new MatTableDataSource(this.Appointments);
    this.AppointmentList.paginator = this.tablePaginator;
  }

  async ngOnChanges() {
    this.Appointments = await this.appointmentService.getAppointmentList(this.filter)
    this.AppointmentList.data = this.Appointments
  }

  async ngAfterViewInit() {
    this.Appointments = await this.appointmentService.getAppointmentList(this.filter)
    this.AppointmentList = new MatTableDataSource(this.Appointments);
    this.AppointmentList.paginator = this.tablePaginator;
    this.AppointmentList.sort = this.sort;
    this.AppointmentsLength = this.Appointments.length;
  }

  getDisplayedColumns(): string[] {
    return this.AppointmentsColumns;
  }

  async details(row) {
    this.router.navigate(['schedule/appointmentDetails/', row.id])
  }

  applyFilter() {
    this.AppointmentList.filter = this.searchTerm.trim().toLowerCase();
  }

  getSessionWithFilter() {
    this.ngOnInit()
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

  EmployeeIDChange(id) {
    if (id.value == null)
      delete this.filter.timeSlot.every.employeeID;
    else
      Object.assign(this.filter.timeSlot.every, { employeeID: id.value });
  }

  TypeChange(type) {
    if (type.value == null)
      delete this.filter.typeID;
    else
      Object.assign(this.filter, { typeID: type.value });
  }

  StatusChange(status) {
    if (status.value == null)
      delete this.filter.timeSlot.every.isApproved;
    else
      Object.assign(this.filter.timeSlot.every, { isApproved: status.value });

    console.log(this.filter)
  }

  FromDateChange(date) {
    this.filter.timeSlot.every.date.gte = date;
  }

  ToDateChange(date) {
    this.filter.timeSlot.every.date.lte = date;
  }

  ResetFilter() {
    this.filter = {
      timeSlot: {
        every: {
          date: {
            gte: null,
            lte: null
          }
        }
      },
      NOT: {
          canceled: true
      }
    }
    this.status = null;
    this.employee = null;
    this.type = null;
  }

}

@Component({
  selector: 'appointment-details',
  templateUrl: './appointment-details.html',
})

export class AppointmentDetailsModal implements OnInit {

  @Input('appointmentID') appointmentID: any
  @Input('case') case: any
  appointment: Appointment;

  isLoading = true;
  updateForm: FormGroup;
  validation_messages: any;

  constructor(
    public modalCtrl: ModalController,
    private alertController: AlertController,
    public translate: TranslateService,
    public modalController: ModalController,
    private act: ActivatedRoute,
    public lang: LanguageService,
    public app: AppService,
    fb: FormBuilder,
    public appointmentService: AppointmentService,
    public authz: AuthzService,
    public router: Router
  ) {
    /*if (!(this.authz.canDo('READ', 'Appointment', []) || this.authz.canDo('MANAGE', 'Appointment', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.appointmentID = this.act.snapshot.params.id;
    this.updateForm = fb.group({
      id: ['',],
      notes: ['',]
    });
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appointment', []) || this.authz.canDo('MANAGE', 'Appointment', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.appointment = await this.appointmentService.getOneAppointment(this.appointmentID)
    this.updateForm.get('id').setValue(this.appointment.id);
    this.updateForm.get('notes').setValue(this.appointment.notes);
  }

  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      let data = this.updateForm.value;
      try {
        await this.appointmentService.updateAppointment(data);
        await this.app.dismissLoading();
        this.ngOnInit()
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  async updateTimeSlot() {
    const modal = await this.modalController.create({ component: ChangeTimeSlotModal, cssClass: 'responsiveModal', componentProps: { appointment: this.appointment } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  /*async unbook() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.AppointmentsTable.delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.cancelAppointment(this.appointment.id);
      this.dismiss()
    }
  }*/

  async unbook() {
    await this.alertController.create({
      header: this.translate.instant('Operations.Cancel') + ' ' + this.translate.instant('Schedule.Booking.Title'),
      message: this.translate.instant('Schedule.TimeSlot.EnterReason'),
      cssClass: 'cancelBooking',
      inputs: [
        {
          name: 'reason',
          placeholder: this.translate.instant('Schedule.TimeSlot.Example')
        },
      ],
      buttons: [
        {
          text: this.translate.instant('Operations.Back'),
          handler: (data: any) => {
          }
        },
        {
          text: this.translate.instant('Operations.Proceed'),
          handler: async (data: any) => {
            await this.app.presentLoading();
            await this.appointmentService.cancelAppointment({ id: this.appointment.id, reason: data.reason });
            this.dismiss()
            this.router.navigate(['schedule/AppointmentsTable/'])
            await this.app.dismissLoading();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async approve(ts: TimeSlot, isApproved: boolean) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.Sure", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.appointmentApproval({ id: ts.appointment.id, isApproved })
      this.ngOnInit()
    }
    return
  }

  async unapprove(ts: TimeSlot, isApproved: boolean) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.Sure", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.unapprove({ id: ts.appointment.id, isApproved })
      this.ngOnInit()
    }
    return
  }

  async complete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.SendCompletionEmail", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.appointmentComplete(this.appointmentID)
      this.ngOnInit()
    }
    return
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

@Component({
  selector: 'change-time-slot',
  templateUrl: './change-time-slot.html',
})

export class ChangeTimeSlotModal implements OnInit {

  @Input('appointment') appointment: any
  @Input() selectedEmployee: Employee;
  @Input() selectedTimeSlot: TimeSlot;

  employeesTimeSlots: Employee[] = [];
  bookForm: FormGroup;
  isFromSite = false;
  selectedType: AppointmentType;
  notaryEmployee: Employee;
  countries = []
  defaultCountry;
  validation_messages
  noTimeSlots: boolean;
  appointmentTypes;
  noNotary: boolean = false;

  isLoading = true;
  updateForm: FormGroup;

  constructor(public modalCtrl: ModalController, private http: HttpClient, public lang: LanguageService, private app: AppService, fb: FormBuilder, public appointmentService: AppointmentService, public authz: AuthzService) {
    this.bookForm = fb.group({
      lawyer: ['', [Validators.required]],
      timeSlot: ['', [Validators.required]],
      typeID: ['', [Validators.required]],
    });
  }

  async ngOnInit() {

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

  async updateAppointment() {
    await this.app.presentLoading();
    let data = this.bookForm.value;
    if (this.bookForm.valid) {
      try {
        let res = await this.appointmentService.UpdateAppointmentTime({
          timeSlotID: data.timeSlot.id,
          appointmentID: this.appointment.id,
          typeID: data.typeID.id,
          data: {
            client_name: this.appointment.client_name,
            client_type: this.appointment.client_type,
            client_cpr: this.appointment.client_cpr,
            client_cr: this.appointment.client_cr,
            client_email: this.appointment.client_email,
            client_phone: this.appointment.client_phone,
            case_description: this.appointment.case_description,
            isExtended: this.appointment.isExtended,
            CprUrl: this.appointment.urls_CPR,
            OtherUrl: this.appointment.urls_Other
          }
        });
        this.dismiss()
      } catch (error) {

        if (this.lang.selectedLang == 'en') {
          await this.app.presentAlert('Sorry', 'Something wrong happened. Please check your inputs.', 'errorAlert')
        }
        else {
          await this.app.presentAlert('Sorry', 'Something wrong happened. Please check your inputs.', 'errorAlert')
        }
      }
    } else {
      console.log('Not Valid');
      await this.app.dismissLoading();
    }
    await this.app.dismissLoading();
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
