import { AppService } from './../services/app.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/types';
import { JWTPayload } from '../interfaces/JWT.interface';
import { Storage } from '@ionic/storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userJWT: BehaviorSubject<JWTPayload>;
  userData: BehaviorSubject<User>;
  private access_token: string = '';
  private refreshTokenTimeout;
  redirectUrl: string;
  constructor(
    private router: Router,
    private http: HttpClient,
    private app: AppService,
    private storage: Storage,
    private route: ActivatedRoute
  ) {
    this.userJWT = new BehaviorSubject<JWTPayload>(null);
    this.userData = new BehaviorSubject<User>(null);
    this.refreshToken(true);
  }

  public get userValue(): any {
    return this.userJWT.value;
  }

 
  async login(email: string, password: string) {
    return await this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password }, { withCredentials: true }).toPromise().then(async data => {
      switch (data.user) {
        case 'userIsLocked':
          await this.app.presentAlert('Sorry !', "Your Account is Locked,Please contact us!")
          break;
        case 'userNotActive':
          await this.app.presentAlert('Sorry !', "Your Account is Not Active,Please contact us!")
          break;
        case 'userCredentialsWrong':
          await this.app.presentAlert('Sorry !', "Email/Password is wrong.")
          break;
        case '':
          await this.app.presentAlert('Sorry !', "Unknown Error.")
          break;
        default:
         this.access_token = data.access_token;
          await this.storage.set("lawyer_refresh_token", data.refresh_token);
         this.userJWT.next(data.user);
          await this.getMe();
         this.startRefreshTokenTimer(data.access_token);
         this.redirectUrl = this.route.snapshot.queryParams.redirectUrl || '/';
         return data.user;
      }
    });
  }

  async getMe() {
    let us = await this.http.get<User>(`${environment.apiUrl}/user/me`, { withCredentials: true }).toPromise();
    this.userData.next(us);
    return us;
  }

  async register(data: { user: User }) {
    const regData = await this.http.post(`${environment.apiUrl}/auth/register`, data, { withCredentials: true }).toPromise();
    if (regData) {
      await this.login(data.user.email, data.user.password);
    }
    return regData;
  }

  async logout() {
    await this.http.post<any>(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).toPromise();
    this.stopRefreshTokenTimer();
    this.userJWT.next(null);
    console.log("this.userJWT")
    console.log(this.userJWT)
    await this.storage.remove("lawyer_refresh_token");
    location.reload();
  }

  async changePassword(data: { oldPassword: string, newPassword: string }) {
    return this.http.put(`${environment.apiUrl}/auth/changePassword`, data, { withCredentials: true }).toPromise();
  }

  async forgetPassword(email: string) {
    return await this.http.post<{ code: number }>(`${environment.apiUrl}/auth/forgetPassword`, { email }).toPromise();
  }

  getAccessToken(): string {
    return this.access_token;
  }

  getJWTPayload() {
    return JSON.parse(atob(this.access_token.split('.')[1]));
  }

  async refreshToken(isFirstTime?: boolean) {
    if (isFirstTime) {
      await this.app.presentLoading();
    }

    let refresh = await this.storage.get("lawyer_refresh_token");

    return await this.http.post<any>(`${environment.apiUrl}/auth/refreshtoken`, { refresh_token: refresh }, { withCredentials: true }).toPromise().then(
      async (data) => {
        if (isFirstTime) {
          await this.app.dismissLoading();
          // console.log('First time', data);
        }

        if (data.ok) {
          this.userData.next(data.user);
          this.access_token = data.access_token;
          Promise.all([this.storage.set("lawyer_refresh_token", data.refresh_token), this.getMe()])
          this.startRefreshTokenTimer(data.access_token);
          return data.user;
        } else {
          this.stopRefreshTokenTimer();
        }
      }, error => {
        console.log('Refresh Error', error);

      });

  }

  private startRefreshTokenTimer(jwtTok) {
    const jwtToken = JSON.parse(atob(this.access_token.split('.')[1]));
    this.userJWT.next(jwtToken);
    const now = new Date();
    const timeout = (jwtToken.exp - (now.getTime() / 1000)) * 1000;
    this.refreshTokenTimeout = setTimeout(async () => await this.refreshToken(), 100);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}