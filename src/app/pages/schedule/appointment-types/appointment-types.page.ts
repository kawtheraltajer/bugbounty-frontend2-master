import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-appointment-types',
  templateUrl: './appointment-types.page.html',
  styleUrls: ['./appointment-types.page.scss'],
})
export class AppointmentTypesPage implements OnInit {

  constructor(public appointmentService: AppointmentService, public app: AppService, public router: Router,
    public authz: AuthzService) {
    /*if (!(this.authz.canDo('READ', 'AppointmentType', []) || this.authz.canDo('MANAGE', 'AppointmentType', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'AppointmentType', []) || this.authz.canDo('MANAGE', 'AppointmentType', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

}
