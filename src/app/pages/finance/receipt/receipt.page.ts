import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {

  isLoading = true;
  Receipts = [];
  perm: Permission

  constructor(
    public finance: FinanceService, 
    public app: AppService,
    public authz: AuthzService,
    private router: Router
    ) { 
    /*if (!(this.authz.canDo('READ', 'Receipt', []) || this.authz.canDo('MANAGE', 'Receipt', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Receipt', []) || this.authz.canDo('MANAGE', 'Receipt', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.Receipts = (await this.finance.getAllReceipts());
    console.log(this.Receipts);
    this.isLoading = false;
  }

}
