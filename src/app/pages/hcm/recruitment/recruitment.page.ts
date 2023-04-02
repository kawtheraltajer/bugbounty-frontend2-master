import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission, Employee } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.page.html',
  styleUrls: ['./recruitment.page.scss'],
})
export class RecruitmentPage implements OnInit {
  isLoading = true;
  data = [];
  perm: Permission
  constructor(public authz: AuthzService, public app: AppService, private router: Router) { 
    /*if (!(this.authz.canDo('READ', 'Vacancy', []) || this.authz.canDo('MANAGE', 'Vacancy', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }
  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Vacancy', []) || this.authz.canDo('MANAGE', 'Vacancy', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.authz.getAllVacancy().then(dt => {
      this.data = dt;
      this.isLoading = false;
    })
  }

}
