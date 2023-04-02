import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.page.html',
  styleUrls: ['./tax.page.scss'],
})
export class TaxPage implements OnInit {
  isLoading = true;

  perm: Permission

  constructor(
    public finance: FinanceService, 
    public app: AppService,
    public authz: AuthzService,
    private router: Router
    ) { 
    /*if (!(this.authz.canDo('READ', 'Tax', []) || this.authz.canDo('MANAGE', 'Tax', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {

    /*if (!(this.authz.canDo('READ', 'Tax', []) || this.authz.canDo('MANAGE', 'Tax', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.isLoading = false;
  }
}