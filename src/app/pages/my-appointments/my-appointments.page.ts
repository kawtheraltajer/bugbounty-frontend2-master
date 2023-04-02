import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { AuthService } from 'src/app/auth/auth.service';
import { AppointmentDetailsComponent } from 'src/app/components/schedule/appointment-details/appointment-details.component';
import { BookAppointmentComponent } from 'src/app/components/schedule/book-appointment/book-appointment.component';
import { Appointment } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.page.html',
  styleUrls: ['./my-appointments.page.scss'],
})
export class MyAppointmentsPage implements OnInit {
  selectedYear = DateTime.local().year;
  selectedMonth = DateTime.local().month;
  selectedDate = DateTime.local();
  selectedDateFormated: string = DateTime.local().toFormat('yyyy MMMM');
  isPending = true;
  isApproved = true;
  isCanceled = true;
  appointments: Appointment[] = [];
  viewAppointments: Appointment[] = [];
  constructor(public appoService: AppointmentService, public auth: AuthService, public app: AppService, private modalController: ModalController, public router: Router,
    public authz: AuthzService) { 
    /*if (!(this.authz.canDo('READ', 'Appointment', []) || this.authz.canDo('MANAGE', 'Appointment', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appointment', []) || this.authz.canDo('MANAGE', 'Appointment', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    await this.loadData();
  }

  chosenYearHandler(normalizedYear) {
    this.selectedYear = new Date(normalizedYear).getFullYear();;
  }

  async chosenMonthHandler(normalizedMonth, datepicker: MatDatepicker<Date>) {
    this.selectedMonth = new Date(normalizedMonth).getMonth();
    datepicker.select(new Date(this.selectedYear, this.selectedMonth, 1));
    console.log(this.selectedYear, this.selectedMonth);
    await this.appoService.getAllTimeSlots({
      range: {
        start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth }).startOf('month').toJSDate(),
        end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth }).endOf('month').toJSDate()
      }
    })
    datepicker.close();
  }

  openDatePicker(dp) {
    dp.open();
  }

  async closeDatePicker(eventData: Date, dp?: any) {
    console.log(DateTime.fromJSDate(eventData).toISODate());
    this.selectedDate = DateTime.fromJSDate(eventData);
    this.selectedDateFormated = this.selectedDate.toFormat('yyyy MMMM');
    dp.close();
    await this.loadData()
  }

  async loadData() {
    await this.app.presentLoading();
    this.appointments = [];
    this.appointments = (await this.appoService.getMyAppointments({
      range: {
        start: this.selectedDate.startOf('month').toJSDate(),
        end: this.selectedDate.endOf('month').toJSDate()
      }
    })).sort((el, dl) => {
      if (el.canceled) return -1;
      if (el.timeSlot[0] && dl.timeSlot[0]) {
        let first = DateTime.fromJSDate(el.timeSlot[0].date as Date).day
        let last = DateTime.fromJSDate(dl.timeSlot[0].date as Date).day
        return first == last ? 0 : (first < last ? -1 : 1)

      } else {
        return -1;
      }
    });

    this.filter();
    await this.app.dismissLoading();
  }

  async filter() {
    console.log(this.isApproved, this.isPending);
    this.viewAppointments = this.appointments.filter(appo => {
      if (appo.canceled) {
        return this.isCanceled;
      } else {
        if (appo.timeSlot[0].isApproved) {
          return this.isApproved;
        } else {
          return this.isPending;
        }
      }
    })
  }

  async details(appointment: Appointment) {
    const modal = await this.modalController.create({
      component: AppointmentDetailsComponent,
      cssClass: '',
      componentProps: {
        appointment
      }
    });
    // modal.onWillDismiss().then(data => {
    //   console.log(data);
    // });
    return await modal.present();
  }
  async book() {
    let user = this.auth.userData.value
    const modal = await this.modalController.create({
      component: BookAppointmentComponent,
      componentProps: {
        isModal: true,
        selectedClient: {
          client_name: user.first_name + ' ' + user.last_name,
          client_type: user.client.type,
          client_cpr: 970305230,
          client_email: user.email,
          client_phone: 66350024
        }
      }
    });

    modal.onWillDismiss().then(data => {
      ;
    });

    return await modal.present();
  }
}
