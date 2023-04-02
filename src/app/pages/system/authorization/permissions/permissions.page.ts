import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.page.html',
  styleUrls: ['./permissions.page.scss'],
})
export class PermissionsPage implements OnInit {

  isLoading = true;
  data = [];
  constructor(public authz: AuthzService, public app: AppService, public router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Permission', []) || this.authz.canDo('MANAGE', 'Permission', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Permission', []) || this.authz.canDo('MANAGE', 'Permission', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.data = (await this.authz.getAllPermissions());
    this.isLoading = false;
  }


}
