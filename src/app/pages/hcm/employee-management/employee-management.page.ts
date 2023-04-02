import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission, Employee } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.page.html',
  styleUrls: ['./employee-management.page.scss'],
})

export class EmployeeManagementPage implements OnInit {
  isLoading = true;
  data = [];

  perm: Permission

  constructor(public authz: AuthzService, public app: AppService, private router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Employee', []) || this.authz.canDo('MANAGE', 'PaySlip', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }


  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Employee', []) || this.authz.canDo('MANAGE', 'PaySlip', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    //this.data = (await this.authz.getEmployees());
    this.isLoading = false;
  }
  async ionViewWillEnter() {
    this.data=[];
    //this.data = (await this.authz.getEmployees());
    this.isLoading = false;
  }
  


}