import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  isLoading = true;
  data: any;
  perm: Permission
  constructor(public authz: AuthzService, public app: AppService, public router: Router) { 
    /*if (!(this.authz.canDo('READ', 'User', []) || this.authz.canDo('MANAGE', 'User', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'User', []) || this.authz.canDo('MANAGE', 'User', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.data = (await this.authz.getAllUsers());
    console.log(this.authz.userAuthz['User'])
    let prs = this.authz.userAuthz['User'].permissions.filter(dt => dt.action == 'MANAGE');
    if (prs.length > 0) {
      this.perm = prs[0];
    }
    this.isLoading = false;
  }

}
