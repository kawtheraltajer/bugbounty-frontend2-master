import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-charge-type',
  templateUrl: './charge-type.page.html',
  styleUrls: ['./charge-type.page.scss'],
})
export class ChargeTypePage implements OnInit {

  constructor(public authz: AuthzService, public router: Router) {
    if (!(this.authz.canDo('READ', 'ChargeType', []) || this.authz.canDo('MANAGE', 'ChargeType', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }

  ngOnInit() {
    if (!(this.authz.canDo('READ', 'ChargeType', []) || this.authz.canDo('MANAGE', 'ChargeType', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }

}
