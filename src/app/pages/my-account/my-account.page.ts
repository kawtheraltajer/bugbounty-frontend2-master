import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  constructor(public auth: AuthService, public authz: AuthzService, public app: AppService,) { }

  async ngOnInit() {
  }

}
