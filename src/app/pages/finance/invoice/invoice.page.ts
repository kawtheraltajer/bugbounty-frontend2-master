import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  isLoading = true;

  Invoices = [];
  perm: Permission
  constructor(
    public finance: FinanceService, 
    public app: AppService, 
    public authz: AuthzService,
    private router: Router
    ) { 
    /*if (!(this.authz.canDo('READ', 'Invoice', []) || this.authz.canDo('MANAGE', 'Invoice', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Invoice', []) || this.authz.canDo('MANAGE', 'Invoice', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
 
    console.log(this.Invoices);
    this.isLoading = false;
  }

}
