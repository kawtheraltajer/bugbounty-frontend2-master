import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, Settings } from 'luxon';
import RRule from 'rrule';
import { Subscription } from 'rxjs';
import { Appointment, Employee, TimeSlot } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';
import { UserService } from 'src/app/services/user.service';
import { BookAppointmentComponent } from '../book-appointment/book-appointment.component';
import { TimeSlotDetailsComponent } from '../time-slot-details/time-slot-details.component';
import { AddTimeSlotModal } from '../time-slots-list/time-slots-list.component';
Settings.defaultZoneName = 'Asia/Riyadh';


@Component({
  selector: 'day-view-scheduler',
  templateUrl: 'day-view-scheduler.component.html',
  styleUrls: ['day-view-scheduler.component.scss']
})
export class DayViewComponentimplements implements OnChanges, OnInit, OnDestroy {
  @Input() employees: Employee[] = [];
  @Input() slots: TimeSlot[] = [];
  schedule: any = [];
  @Input() date: Date;
  @Input() startHour: number = 7;
  @Input() endHour: number = 21;
  @Input() split: number = 2;
  @Output() dataChanged = new EventEmitter();
  timeLine: { dateTime: Date, luxon: DateTime, timeSlots: TimeSlot[] }[] = [];
  daysInWeek = 1;
  subs: Subscription[] = [];

  constructor(public app: AppService,
    public alertController: AlertController,
    public authz: AuthzService,
    public translate: TranslateService,
    public appointmentService: AppointmentService,
    public userService: UserService,
    public modalController: ModalController) { }

  ngOnInit() {
    this.initTimeLine();
    this.mapTimeSlotToTimeLine();

  }

  ngOnChanges() {
    this.initTimeLine();
    this.mapTimeSlotToTimeLine();
  }

  initTimeLine() {
    this.timeLine = new RRule({
      dtstart: DateTime.fromJSDate(new Date(this.date)).set({
        hour: 0,
        minute: 0,
        second: 0,
      }).toJSDate(),
      freq: RRule.MINUTELY,
      count: (this.endHour - this.startHour) * 2,
      interval: 1,
      byhour: Array.from({ length: this.endHour - this.startHour }, (_, i) => i + this.startHour),
      byminute: [0, 30],
      bysecond: [0]
    }).all().map(dt => {
      let lx = DateTime.fromJSDate(dt)
        .toUTC()
        .setZone('local', { keepLocalTime: true });
      return {
        dateTime: lx.toJSDate(),
        luxon: lx,
        timeSlots: []
      }
    });
  }

  mapTimeSlotToTimeLine() {
    this.schedule = [];
    this.slots.forEach(slot => {
      let slotDate = DateTime.fromISO(slot.date as string);
      let slotStartTime = DateTime.fromISO(slot.startTime as string);
      slotDate.set({
        hour: slotStartTime.hour,
        minute: slotStartTime.minute,
        second: slotStartTime.second,
        millisecond: 0
      })
      this.schedule[slotDate.month] = this.schedule[slotDate.month] || [];
      this.schedule[slotDate.month][slotDate.day] = this.schedule[slotDate.month][slotDate.day] || [];
      this.schedule[slotDate.month][slotDate.day][slotStartTime.hour] = this.schedule[slotDate.month][slotDate.day][slotStartTime.hour] || [];
      this.schedule[slotDate.month][slotDate.day][slotStartTime.hour][slotStartTime.minute] = this.schedule[slotDate.month][slotDate.day][slotStartTime.hour][slotStartTime.minute] || [];
      this.schedule[slotDate.month][slotDate.day][slotStartTime.hour][slotStartTime.minute][slot.employeeID] = this.schedule[slotDate.month][slotDate.day][slotStartTime.hour][slotStartTime.minute][slot.employeeID] || [];
      this.schedule[slotDate.month][slotDate.day][slotStartTime.hour][slotStartTime.minute][slot.employeeID] = slot
    });
  }


  async addSlot(employee: Employee, time: { dateTime: Date, luxon: DateTime, timeSlots: TimeSlot[] }) {

    console.log(time.luxon.toFormat('HH:mm a'))
    const modal = await this.modalController.create({
      component: AddTimeSlotModal,
      cssClass: 'AddTimeSlotModal',
      componentProps: {
        selectedEmployee: employee,
        startTime: time.luxon,
        endTime: time.luxon.plus({ minutes: 30 }),
        date: time.dateTime,
        fromCaledar:true
      }
    });
    modal.onWillDismiss().then(data => {
      console.log(data);
      this.dataChanged.emit(true);
    });
    return await modal.present();
  }

  async deleteSlot(slot: TimeSlot) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.app.presentLoading()
      await this.appointmentService.deleteTimeSlot(slot.id);
      this.dataChanged.emit(true);
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
            this.dataChanged.emit(true);
            await this.app.dismissLoading();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
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
            console.log('Canceled', data);
          }
        },
        {
          text: this.translate.instant('Operations.Proceed'),
          handler: async (data: any) => {
            await this.app.presentLoading();
            console.log('Saved Information', data);
            await this.appointmentService.appointmentApproval({ id: apo.id, isApproved: false, reason: data.reason })
            this.dataChanged.emit(true);
            await this.app.dismissLoading();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async book(ts: TimeSlot) {
    console.log(ts)
    const modal = await this.modalController.create({
      component: BookAppointmentComponent,
      componentProps: {
        selectedEmployee: ts.employee,
        selectedTimeSlot: ts,
        isModal: true,
        fromTimeSlot: true
      }
    });
    modal.onWillDismiss().then(data => {
      this.dataChanged.emit(true);
    });
    return await modal.present();
  }

  async approve(ts: TimeSlot, isApproved: boolean) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.Sure", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.appointmentApproval({ id: ts.appointment.id, isApproved })
      this.dataChanged.emit(true);
    }
    return
  }

  async unapprove(ts: TimeSlot, isApproved: boolean) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.Sure", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.appointmentService.unapprove({ id: ts.appointment.id, isApproved })
      this.dataChanged.emit(true);
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