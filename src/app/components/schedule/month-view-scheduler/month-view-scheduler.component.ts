import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import { Appointment, Employee, TimeSlot } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user.service';
import { BookAppointmentComponent } from '../book-appointment/book-appointment.component';
import { TimeSlotDetailsComponent } from '../time-slot-details/time-slot-details.component';
@Component({
  selector: 'month-view-scheduler',
  templateUrl: './month-view-scheduler.component.html',
  styleUrls: ['./month-view-scheduler.component.scss'],
})
export class MonthViewSchedulerComponent implements OnInit, OnChanges {
  MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  isLoading = true;
  @Input() date: Date = new Date();
  @Input() viewEmployees: Employee[] = [];
  selectedDay: {
    date: Date,
    luxon: DateTime,
    timeSlots: TimeSlot[],
    employees: {
      employee: Employee,
      timeSlots: TimeSlot[]
    }[],
    count?: { timeSlot: number, approved: number, pending: number }
  };

  data = [];
  slots = [];
  employees: Employee[] = [];
  currentDay = DateTime.local();
  dates = [];
  sideMode: 'over' | 'push' | 'side' = 'over';
  sideHasBackdrop = false;
  grouped: {
    date: Date,
    luxon: DateTime,
    timeSlots: TimeSlot[],
    employees: {
      employee: Employee,
      timeSlots: TimeSlot[]
    }[],
    count?: { timeSlot: number, approved: number, pending: number }
  }[] = [];
  // @Output() dataChanged = new EventEmitter();
  constructor(public appointmentService: AppointmentService, public translate: TranslateService, private modalController: ModalController, private alertController: AlertController, public user: UserService, public lang: LanguageService, public app: AppService) {
  }

  async ngOnInit() {
    this.grouped = [];
    this.employees = [];
    await this.loadData();
  }

  async ngOnChanges() {
    this.grouped = [];
    this.employees = [];
    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    this.grouped = [];
    this.employees = [];
    let startOfMonth = DateTime.fromJSDate(this.date).startOf('month').startOf('week').plus({ day: -1 });
    let endOfMonth = DateTime.fromJSDate(this.date).endOf('month').endOf('week').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).plus({ day: -1 });
    this.dates = this.toRange(startOfMonth, endOfMonth);
    let res = await this.appointmentService.getAllTimeSlots({
      range: {
        start: startOfMonth.toJSDate(),
        end: endOfMonth.toJSDate()
      }
    });

    res.forEach((emp, i) => {
      let { timeSlots, ...employee } = emp;
      if (this.viewEmployees.findIndex(ep => ep.id == emp.id) == -1) {
        return;
      }
      timeSlots.forEach(ts => {
        let tsDate = DateTime.fromISO(ts.date as string)
        if (!this.grouped[tsDate.toISODate()]) {
          this.grouped[tsDate.toISODate()] = {
            luxon: tsDate,
            employees: [],
            timeSlots: [ts],
            count: {
              approved: ts.isApproved ? 1 : 0,
              timeSlot: (!ts.isApproved && !ts.isBooked) ? 1 : 0,
              pending: (!ts.isApproved && ts.isBooked) ? 1 : 0,
            }
          }
          this.grouped[tsDate.toISODate()].employees[emp.id] = { employee, timeSlots: [ts] }
        } else {
          if (!this.grouped[tsDate.toISODate()].employees[emp.id]) {
            this.grouped[tsDate.toISODate()].employees[emp.id] = { employee, timeSlots: [ts] }
          } else {
            if (this.grouped[tsDate.toISODate()].employees[emp.id].timeSlots.findIndex(x => x.id == ts.id) == -1) {
              this.grouped[tsDate.toISODate()].employees[emp.id].timeSlots.push(ts);
            }
          }
          if (this.grouped[tsDate.toISODate()].timeSlots.findIndex(x => x.id == ts.id) == -1) {
            this.grouped[tsDate.toISODate()].timeSlots.push(ts);
            this.grouped[tsDate.toISODate()].count.approved += ts.isApproved ? 1 : 0;
            this.grouped[tsDate.toISODate()].count.timeSlot += (!ts.isApproved && !ts.isBooked) ? 1 : 0;
            this.grouped[tsDate.toISODate()].count.pending += (!ts.isApproved && ts.isBooked) ? 1 : 0;
          }
        }
      });
    });

    this.employees = res;
    this.isLoading = false;
  }

  toRange = (start: DateTime, end: DateTime): DateTime[] => {
    let dates: DateTime[] = [];
    let st = start;
    while (!st.hasSame(end, 'day')) {
      dates.push(st);
      st = st.plus({ day: 1 });
    }
    dates.push(end);
    return dates
  }

  async deleteSlot(slot: TimeSlot) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.app.presentLoading()
      await this.appointmentService.deleteTimeSlot(slot.id);
      await this.loadData();
      await this.app.dismissLoading()
    }
  }

  async unbook(id: number) {
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
            await this.appointmentService.cancelAppointment({ id: id, isApproved: false, reason: data.reason });
            await this.loadData();
            await this.app.dismissLoading();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
    await this.loadData();
  }

  async cancel(apo: Appointment) {
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
            // console.log('Canceled', data);
          }
        },
        {
          text: this.translate.instant('Operations.Proceed'),
          handler: async (data: any) => {
            await this.app.presentLoading();
            // console.log('Saved Information', data);
            await this.appointmentService.appointmentApproval({ id: apo.id, isApproved: false, reason: data.reason })
            await this.loadData();
            await this.app.dismissLoading();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async book(ts: TimeSlot) {
    const modal = await this.modalController.create({
      component: BookAppointmentComponent,
      componentProps: {
        selectedEmployee: ts.employee,
        selectedTimeSlot: ts,
        isModal: true,
        fromTimeSlot: true
      }
    });
    modal.onWillDismiss().then(async data => {
      await this.loadData();
    });
    return await modal.present();
  }

  async approve(ts: TimeSlot, isApproved: boolean) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.Sure", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.appointmentApproval({ id: ts.appointment.id, isApproved })
      await this.loadData();
    }
    return
  }

  async unapprove(ts: TimeSlot, isApproved: boolean) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.Sure", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.unapprove({ id: ts.appointment.id, isApproved })
      await this.loadData();
    }
    return
  }
  async details(timeSlot: TimeSlot) {
    const modal = await this.modalController.create({
      component: TimeSlotDetailsComponent,
      cssClass: '',
      componentProps: {
        timeSlotID: timeSlot.id
      }
    });
    return await modal.present();
  }
}
