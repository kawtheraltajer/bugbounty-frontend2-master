import {  Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.page.html',
  styleUrls: ['./client-view.page.scss'],
})
export class ClientViewPage implements OnInit {
  clientID: number;
  constructor(
    private act: ActivatedRoute,
    public lang: LanguageService, 
    public modalController: ModalController, 
    public app: AppService, 
    public court: CourtService, 
    public authz: AuthzService,
    private auth: AuthService,
    public router: Router
  ) {
    if (!(this.authz.canDo('READ', 'ClientAccess', []) || this.authz.canDo('MANAGE', 'ClientAccess', [])) ||
      (this.authz.canDo('MANAGE', 'CompanyAccess', []))) {
      console.log('Access denied')
      this.router.navigateByUrl(`/login`)
    }
    this.court.GetClientID(this.auth.userData.value.id).then(data => {
      this.clientID = data.id
    })
    //this.clientID = this.act.snapshot.params.id;
    //console.log('is const', this.clientID)
  }

  ionViewWillEnter() {
    if (!(this.authz.canDo('READ', 'ClientAccess', []) || this.authz.canDo('MANAGE', 'ClientAccess', [])) ||
      (this.authz.canDo('MANAGE', 'CompanyAccess', []))) {
      console.log('Access denied')
      this.router.navigateByUrl(`/login`)
    }
  }

  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'ClientAccess', []) || this.authz.canDo('MANAGE', 'ClientAccess', [])) ||
      (this.authz.canDo('MANAGE', 'CompanyAccess', []))) {
      this.router.navigateByUrl(`/login`)
    }
  }

}
