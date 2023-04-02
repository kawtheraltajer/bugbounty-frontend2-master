import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthzService } from 'src/app/services/authz.service';
import { CourtService } from 'src/app/services/court.service';
import { LanguageService } from 'src/app/services/language.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";
  public redirectUrl: string;
  constructor(
    public menu: MenuService, 
    private auth: AuthService, 
    private rt: Router, 
    public lang: LanguageService, 
    public court: CourtService, 
    public authz: AuthzService,
    private route: ActivatedRoute
    ) { this.menu.disableMainMenu(); }

  ionViewWillEnter() {
    // this.menu.disableMainMenu();
  }

  ionViewDidLeave() {
    console.log('will enter');
  }

  async ngOnInit() {
    // this.menu.disableMainMenu();
    if (this.auth.userData.value) {
      if(this.authz.canDo('MANAGE', 'ClientAccess', [])) {
        this.rt.navigateByUrl(`/ClientViewPage`)
      }
      else if(this.authz.canDo('MANAGE', 'CompanyAccess', [])) {
        this.rt.navigateByUrl(`/CompanyViewPage`)
      }
      else {
        this.redirectUrl = this.route.snapshot.queryParams.redirectUrl || '/dashboard'
        this.rt.navigateByUrl(this.redirectUrl)
        this.redirectUrl = ''
      }
      
      this.menu.enableMainMenu();
    }
  }

  async login() {
    
    await this.auth.login(this.email, this.password).then(async () => {
      if(this.authz.canDo('MANAGE', 'ClientAccess', [])) {
        this.rt.navigateByUrl(`/ClientViewPage`)
      }
      else if(this.authz.canDo('MANAGE', 'CompanyAccess', [])) {
        this.rt.navigateByUrl(`/CompanyViewPage`)
      }
      else {
        this.redirectUrl = this.route.snapshot.queryParams.redirectUrl || '/dashboard'
        this.rt.navigateByUrl(this.redirectUrl)
        this.redirectUrl = ''
      }
    });
  }
}
