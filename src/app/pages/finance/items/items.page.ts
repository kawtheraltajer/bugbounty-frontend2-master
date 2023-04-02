import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  isLoading = true;

  Items = [];
  perm: Permission
  
  constructor(
    public finance: FinanceService, 
    public app: AppService, 
    public authz: AuthzService,
    private router: Router
    ) { 
    /*if (!(this.authz.canDo('READ', 'Item', []) || this.authz.canDo('MANAGE', 'Item', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Item', []) || this.authz.canDo('MANAGE', 'Item', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.Items = (await this.finance.getAllItems());
    console.log(this.Items);
    this.isLoading = false;
  }

}