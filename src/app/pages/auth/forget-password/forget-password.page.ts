import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/services/app.service';
import { LanguageService } from 'src/app/services/language.service';
import { MenuService } from 'src/app/services/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  jwt = '';
  pas1 = '';
  pas2 = '';
  email = '';
  constructor(
    private authService: AuthService,
    private rt: Router,
    private appService: AppService,
    private route: ActivatedRoute,
    private http: HttpClient,
    public langService: LanguageService,
    public menu: MenuService) {
    this.menu.disableMainMenu();
    this.route.params.subscribe(params => {
      this.jwt = params.jwt;
    });
  }

  ngOnInit() {
    this.menu.disableMainMenu();
    if (this.jwt != '' && this.jwt != undefined) {
      console.log(this.jwt);
      this.menu.disableMainMenu();
    }
  }

  cancel() {
    this.rt.navigateByUrl('/login', {
      replaceUrl: true,
    });
  }


  async forget() {
    const res: any = await this.http.post(`${environment.apiUrl}/auth/forgetPassword`, { email: this.email }, { withCredentials: true }).toPromise();
    if (res.status != 404) {
      await this.appService.presentAlert('Forget Password !', 'An Email was sent to you to change your password!');
    } else {
      await this.appService.presentAlert('Forget Password !', 'Not found!');
    }
  }


  async change() {
    if (this.pas1 == this.pas2) {
      const res: any = await this.http.post(`${environment.apiUrl}/auth/changePasswordWithToken`, { token: this.jwt, password: this.pas1, confirm: this.pas2 }, { withCredentials: true }).toPromise();
      if (res.error) {
        await this.appService.presentAlert('Sorry!', 'Something Wrong Happend!', 'requiredAlert')
      } else {
        await this.appService.presentAlert('Success!', 'Password changed, You can log-in now!');
        this.rt.navigateByUrl('/login', {
          replaceUrl: true,
        });
      }
    } else {
      await this.appService.presentAlert('Sorry!', 'Enter matching password!', 'requiredAlert')
    }
  }

}
