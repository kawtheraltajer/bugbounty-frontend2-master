import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.page.html',
  styleUrls: ['./payroll.page.scss'],
})
export class PayrollPage implements OnInit {

  constructor(
    public authz: AuthzService,
    private router: Router
  ) { 
    /*if (!(this.authz.canDo('READ', 'PaySlip', []) || this.authz.canDo('MANAGE', 'PaySlip', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'PaySlip', []) || this.authz.canDo('MANAGE', 'PaySlip', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

}
