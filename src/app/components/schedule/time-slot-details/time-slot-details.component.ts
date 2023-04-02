import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TimeSlot } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-time-slot-details',
  templateUrl: './time-slot-details.component.html',
  styleUrls: ['./time-slot-details.component.scss'],
})
export class TimeSlotDetailsComponent implements OnInit {
  @Input() timeSlotID: number;
  timeSlot: TimeSlot;
  constructor(public appo: AppointmentService, public lang: LanguageService, public app: AppService, private modalController: ModalController) { }

  async ngOnInit() {
    await this.app.presentLoading();
    try {
      this.timeSlot = await this.appo.getTimeSlot(this.timeSlotID);
    } catch (error) {
      console.log(error);
    }
    await this.app.dismissLoading();

  }

  dismiss(data?: any) {
    this.modalController.dismiss({
      'dismissed': true,
      data
    });
  }
}
