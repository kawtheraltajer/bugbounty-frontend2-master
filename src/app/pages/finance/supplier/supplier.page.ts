import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FinanceService } from 'src/app/services/finance.service';
import { Supplier } from '../../../interfaces/types';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.page.html',
  styleUrls: ['./supplier.page.scss'],
})
export class SupplierPage implements OnInit {

  isLoading = true;

  perm: Permission
  
  constructor(
    public finance: FinanceService, 
    public app: AppService,
    public authz: AuthzService,
    private router: Router
    ) { 
    /*if (!(this.authz.canDo('READ', 'Supplier', []) || this.authz.canDo('MANAGE', 'Supplier', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Supplier', []) || this.authz.canDo('MANAGE', 'Supplier', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.isLoading = false;
  }

}
