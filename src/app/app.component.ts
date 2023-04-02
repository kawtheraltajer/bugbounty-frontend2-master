import { EmployeeService } from './services/employee.service';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuService } from './services/menu.service';
import { AuthService } from './auth/auth.service';
import { LanguageService } from './services/language.service';
import { AuthzService } from './services/authz.service';
import { AppService } from './services/app.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  ShowMenu:boolean=false
  side:string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menu: MenuService,
    public auth: AuthService,
    public authz: AuthzService,
    public app: AppService,
    public lang: LanguageService,
    public employee: EmployeeService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
     // this.statusBar.styleDefault();
     // this.splashScreen.hide();
     setTimeout(() => {
      //this.splashScreen.hide();
  }, 50);
    });
  }

  async ngOnInit() {
    await this.lang.initializeLanguage();
  this.side =  this.lang.selectedLang == 'en' ? "end" : "start";
  }

  async logout() {
    await this.auth.logout();
  }
  toggleMenuItem(index: number) {
    this.menu.userMenu = this.menu.userMenu.map((dt, i) => {
      if (i == index) {
        dt.open = !dt.open;
      } else {
        dt.open = false;
      }
      return dt;
    });
  }
 async setlang(ev){
    this.lang.setLanguage(ev)
    this.side =  this.lang.selectedLang == 'en' ? "end" : "start";
    this.menu.menu.close();
    //await this.lang.initializeLanguage();
   //this.ngOnInit()
  }
  HideMenu(){
    this.ShowMenu=!this.ShowMenu
  }
}
