import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-company-view',
  templateUrl: './company-view.page.html',
  styleUrls: ['./company-view.page.scss'],
})
export class CompanyViewPage implements OnInit {

  constructor(
    public router: Router,
    public authz: AuthzService
  ) { 
    if (!(this.authz.canDo('READ', 'CompanyAccess', []) || this.authz.canDo('MANAGE', 'CompanyAccess', [])) ||
      (this.authz.canDo('MANAGE', 'ClientAccess', []))) {
      console.log('Access denied')
      this.router.navigateByUrl(`/login`)
    } 
  }

  ngOnInit() {
    if (!(this.authz.canDo('READ', 'CompanyAccess', []) || this.authz.canDo('MANAGE', 'CompanyAccess', [])) ||
      (this.authz.canDo('MANAGE', 'ClientAccess', []))) {
      console.log('Access denied')
      this.router.navigateByUrl(`/login`)
    }
  }

}
