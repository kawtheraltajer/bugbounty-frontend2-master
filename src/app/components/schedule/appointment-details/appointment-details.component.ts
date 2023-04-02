import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Appointment } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
})
export class AppointmentDetailsComponent implements OnInit {
  @Input() appointment: Appointment;
  constructor(
    private modalController: ModalController,
    public app: AppService,
    public lang: LanguageService,
    private translate: TranslateService,
    private alertController: AlertController, public appointmentService: AppointmentService) { }

  ngOnInit() {
    // console.log(this.appointment);
  }

  dismiss(data?: any) {
    this.modalController.dismiss({
      'dismissed': true,
      data
    });
  }
  async cancel() {
    await this.alertController.create({
      header: this.translate.instant('Operations.Cancel') + ' ' + this.translate.instant('Schedule.Booking.Title'),
      message: 'Enter the reason: ',
      cssClass: 'cancelBooking',
      inputs: [
        {
          name: 'reason',
          placeholder: 'Ex: Not Answering Calls'
        },
      ],
      buttons: [
        {
          text: 'Back',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Proceed',
          handler: async (data: any) => {
            await this.app.presentLoading();
            console.log('Saved Information', data);
            await this.appointmentService.appointmentApproval({
              id: this.appointment.id,
              isApproved: false, reason: data.reason
            })
            await this.app.dismissLoading();
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
}
