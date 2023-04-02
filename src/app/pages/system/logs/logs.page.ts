import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {

  isLoading=true
  constructor(
    public router: Router,
    public authz: AuthzService
  ) { 
    /*if (!(this.authz.canDo('READ', 'Log', []) || this.authz.canDo('MANAGE', 'Log', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Log', []) || this.authz.canDo('MANAGE', 'Log', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.isLoading = false;

  }

}
