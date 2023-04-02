import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Role } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit {
  isLoading = true;
  data = [];
  constructor(public authz: AuthzService, public app: AppService, public router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Role', []) || this.authz.canDo('MANAGE', 'Role', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Role', []) || this.authz.canDo('MANAGE', 'Role', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.data = (await this.authz.getAllRoles());
    this.isLoading = false;
  }

}
