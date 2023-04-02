import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.page.html',
  styleUrls: ['./account-type.page.scss'],
})
export class AccountTypePage implements OnInit {
  isLoading = true;

  perm: Permission

  constructor(
    public finance: FinanceService, 
    public app: AppService,
    public authz: AuthzService,
    private router: Router
    ) { 
    /*if (!(this.authz.canDo('READ', 'AccountType', []) || this.authz.canDo('MANAGE', 'AccountType', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'AccountType', []) || this.authz.canDo('MANAGE', 'AccountType', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.isLoading = false;
  }

}
