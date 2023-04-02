import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-normal-reports',
  templateUrl: './normal-reports.page.html',
  styleUrls: ['./normal-reports.page.scss'],
})
export class NormalReportsPage implements OnInit {

  constructor(
    public authz: AuthzService,
    private router: Router
  ) { 
    /*if (!(this.authz.canDo('REPORT', 'Finance', []) || this.authz.canDo('MANAGE', 'Finance', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  ngOnInit() {
    /*if (!(this.authz.canDo('REPORT', 'Finance', []) || this.authz.canDo('MANAGE', 'Finance', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

}
