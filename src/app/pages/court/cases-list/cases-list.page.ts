import { Case } from 'src/app/interfaces/types';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { Router } from '@angular/router';
@Component({
  selector: 'cases-list',
  templateUrl: './cases-list.page.html',
  styleUrls: ['./cases-list.page.scss'],
})
export class CasesListPage implements OnInit {
  Cases: Case[]


  constructor(public router: Router, public lang: LanguageService, public modalController: ModalController, public app: AppService, public court: CourtService, public authz: AuthzService) {
    if (!(this.authz.canDo('READ', 'Case', []) || this.authz.canDo('MANAGE', 'Case', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }
  
  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'Case', []) || this.authz.canDo('MANAGE', 'Case', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.Cases = await this.court.getAllCases()

  }





}
