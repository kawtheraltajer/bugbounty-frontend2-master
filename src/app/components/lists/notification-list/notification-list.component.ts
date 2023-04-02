import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { LanguageService } from 'src/app/services/language.service';
import { SessionDetailsModal } from 'src/app/pages/court/session/session.page';
import { CourtService } from 'src/app/services/court.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  notifications: any
  notifications_count = 0
  count = 0
  constructor(
    public lang: LanguageService, 
    public court: CourtService, 
    public modalController: ModalController, 
    public general: GeneralService, 
    public router: Router, 
    private popoverController: PopoverController
  ) { }
  
  async ngOnInit() {
    this.notifications = await this.general.get_user_notifications()
    this.notifications_count = await this.general.count_user_notifications()
    this.count = this.notifications.length
  }

  async viewNotificationsPage(notification) {
    let data = {
      "notification_id": notification.id,
      "isRead": true
    }
    await this.general.ReadNofitication(data)
    if (notification.table_name_en == 'Case') {
      this.router.navigate(['CaseDetails/', notification.action_id])
      this.dissmiss()
    }
    else if (notification.table_name_en == 'Session') {
      this.sessionDetails(notification.action_id)
    }
    else if (notification.table_name_en == 'Task') {
      this.router.navigate([`tasks/task-details/${notification.action_id}`])
      this.dissmiss()
    }
    else if (notification.table_name_en == 'Appointment') {
      this.router.navigate([`schedule/appointmentDetails/${notification.action_id}`])
      this.dissmiss()
    }
    else if (notification.table_name_en == 'Task_Case') {
      this.router.navigate([`CaseDetails/${notification.action_id}`])
      this.dissmiss()
    }
  }

  async sessionDetails(action_id) {
    let session = await this.court.getOneSession(action_id)
    const modal = await this.modalController.create({ component: SessionDetailsModal, cssClass: 'responsiveModal', componentProps: {session:session } });
     modal.onWillDismiss().then(data => {
       this.ngOnInit()
     });
     return await modal.present();
  }

  async dissmiss() {
    await this.popoverController.dismiss();
  }

}
