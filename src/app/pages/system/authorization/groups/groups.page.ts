import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  isLoading = true;
  data = [];
  constructor(public lang: LanguageService,public authz: AuthzService, public app: AppService, public router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Group', []) || this.authz.canDo('MANAGE', 'Group', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Group', []) || this.authz.canDo('MANAGE', 'Group', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.data = (await this.authz.getAllGroups());
    this.isLoading = false;
  }

}
