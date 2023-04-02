import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-time-slots',
  templateUrl: './time-slots.page.html',
  styleUrls: ['./time-slots.page.scss'],
})
export class TimeSlotsPage implements OnInit {

  constructor(public appointmentService: AppointmentService, public app: AppService, public router: Router,
    public authz: AuthzService) {
    /*if (!(this.authz.canDo('READ', 'TimeSlot', []) || this.authz.canDo('MANAGE', 'TimeSlot', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'TimeSlot', []) || this.authz.canDo('MANAGE', 'TimeSlot', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

}
