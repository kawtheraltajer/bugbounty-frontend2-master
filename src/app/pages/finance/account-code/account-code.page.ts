import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-account-code',
  templateUrl: './account-code.page.html',
  styleUrls: ['./account-code.page.scss'],
})
export class AccountCodePage implements OnInit {

  isLoading = true;

  AccountCodes = [];
  perm: Permission

  constructor(public finance: FinanceService, public app: AppService) { }

  async ngOnInit() {
    this.AccountCodes = (await this.finance.getAllAccountCodes());
    console.log(this.AccountCodes);
    this.isLoading = false;
  }

}
