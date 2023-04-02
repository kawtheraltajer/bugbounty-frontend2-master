import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { FinanceService } from 'src/app/services/finance.service';
import { AccTransectionHeader } from '../../../interfaces/types';

@Component({
  selector: 'app-account-transection',
  templateUrl: './account-transection.page.html',
  styleUrls: ['./account-transection.page.scss'],
})
export class AccountTransectionPage implements OnInit {

  isLoading = true;
  AccTransectionHeaders = [];
  perm: Permission

  constructor(public finance: FinanceService, public app: AppService) { }

  async ngOnInit() {
    this.AccTransectionHeaders = (await this.finance.getAllAccountTransections());
    console.log(this.AccTransectionHeaders);
    this.isLoading = false;
  }
}
