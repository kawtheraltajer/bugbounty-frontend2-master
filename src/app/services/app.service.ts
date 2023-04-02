import { Injectable, enableProdMode } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { KeyValue, Location, WeekDay } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActionEnum, ClientTypeEnum, ModuleEnum, SubjectEnum, AppraisalStatusEnum } from '../interfaces/types';
import {
  AnnouncementScalarFieldEnum,
  UserScalarFieldEnum,
  AddressScalarFieldEnum,
  AppointmentScalarFieldEnum,
  CaseScalarFieldEnum,
  ClientScalarFieldEnum,
  CourtScalarFieldEnum,
  EmployeeScalarFieldEnum,
  GroupScalarFieldEnum,
  LeaveScalarFieldEnum,
  LogScalarFieldEnum,
  PermissionScalarFieldEnum,
  RoleScalarFieldEnum,
  SessionScalarFieldEnum,
  TaskScalarFieldEnum,
  TaskStatusScalarFieldEnum,
  AppointmentTypeScalarFieldEnum,
  TimeSlotScalarFieldEnum,
  AppraisalScalarFieldEnum,
} from '../interfaces/enums';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import * as tinyColor from "tinycolor2";
import { ColorPickerComponent } from '../components/pickers/color-picker/color-picker.component';
import RRule, { Weekday } from 'rrule';
import { DateTime } from 'luxon';

import { TranslateService } from '@ngx-translate/core';
import { Settings } from "luxon";
import { environment } from 'src/environments/environment';
Settings.defaultZoneName = 'Asia/Riyadh';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  tinycolor = tinyColor;
  isDesktop = true;
  currentRoute = 'home'
  isSmallScreen = false;
  screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'sm';
  enums = {
    'Subject': Object.keys(SubjectEnum),
    'Action': Object.keys(ActionEnum),
    'Module': Object.keys(ModuleEnum),
    'ClientType': Object.keys(ClientTypeEnum),
    'AppaisalStatus': Object.keys(AppraisalStatusEnum)
  }
  fields = {
    'Court': CourtScalarFieldEnum,
    'Client': ClientScalarFieldEnum,
    'Case': CaseScalarFieldEnum,
  /*  'Companies':CompaniesScalarFieldEnum,
    'Session': SessionScalarFieldEnum,
    'CaseType': CaseTypeScalarFieldEnum,
    'DelayReson': DelayResonScalarFieldEnum,
    'Requests':RequestsScalarFieldEnum,
    'ChargeType':ChargeTypeScalarFieldEnum,
    'Report':ReportScalarFieldEnum,*/
    'Announcement':AnnouncementScalarFieldEnum,
    'User': UserScalarFieldEnum,
    'Task': TaskScalarFieldEnum,
    'TaskStatus': TaskStatusScalarFieldEnum,
    'TimeSlot': TimeSlotScalarFieldEnum,
    'Appointment': AppointmentScalarFieldEnum,
    'AppointmentType': AppointmentTypeScalarFieldEnum,
    'Leave': LeaveScalarFieldEnum,
    'Address': AddressScalarFieldEnum,
    'Employee': EmployeeScalarFieldEnum,
    'Supervisor': EmployeeScalarFieldEnum,
    'Log': LogScalarFieldEnum,
    'Role': RoleScalarFieldEnum,
    'Permission': PermissionScalarFieldEnum,
    'Group': GroupScalarFieldEnum,
    'Appraisal': AppraisalScalarFieldEnum,
  };
  auth_fields = {
    'Announcement': Object.keys(AnnouncementScalarFieldEnum).filter((key) => key.includes('id') || key.includes('Id')),
    'User': Object.keys(UserScalarFieldEnum).filter((key) => key.includes('ID') || key.includes('Id')),
    'Task': Object.keys(TaskScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'TaskStatus': Object.keys(TaskStatusScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'TimeSlot': Object.keys(TimeSlotScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Appointment': Object.keys(AppointmentScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'AppointmentType': Object.keys(AppointmentTypeScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Court': Object.keys(CourtScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Case': Object.keys(CaseScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Session': Object.keys(SessionScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Leave': Object.keys(LeaveScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Address': Object.keys(AddressScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Client': Object.keys(ClientScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Employee': Object.keys(EmployeeScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Supervisor': Object.keys(EmployeeScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Log': Object.keys(LogScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Role': Object.keys(RoleScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Permission': Object.keys(PermissionScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    'Group': Object.keys(GroupScalarFieldEnum).filter(key => key.includes('ID') || key.includes('Id')),
    "Appraisal": Object.keys(AppraisalScalarFieldEnum).filter((key) => key.includes('ID') || key.includes('Id'))
  }
  days: { name: string, number: number, luxon: DateTime, value: Weekday, isSelected: boolean }[] = [
    {
      name: 'Days.Sunday',
      value: RRule.SU,
      number: 0,
      luxon: DateTime.local().set({ weekday: 0 }),
      isSelected: false,
    },
    {
      name: 'Days.Monday',
      value: RRule.MO,
      number: 1,
      luxon: DateTime.local().set({ weekday: 1 }),
      isSelected: false,
    },
    {
      name: 'Days.Tuesday',
      value: RRule.TU,
      number: 2,
      luxon: DateTime.local().set({ weekday: 2 }),
      isSelected: false,
    }, {
      name: 'Days.Wednesday',
      value: RRule.WE,
      number: 3,
      luxon: DateTime.local().set({ weekday: 3 }),
      isSelected: false,
    }
    , {
      name: 'Days.Thursday',
      value: RRule.TH,
      number: 4,
      luxon: DateTime.local().set({ weekday: 4 }),
      isSelected: false,
    }, {
      name: 'Days.Friday',
      value: RRule.FR,
      number: 5,
      luxon: DateTime.local().set({ weekday: 5 }),
      isSelected: false,
    }, {
      name: 'Days.Saturday',
      value: RRule.SA,
      number: 6,
      luxon: DateTime.local().set({ weekday: 6 }),
      isSelected: false,
    }
  ]

  hours: { value: string, number: number, isSelected: boolean }[] = [

  ]
  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translate: TranslateService,
    public router: Router,
    private location: Location,
    private breakpointObserver: BreakpointObserver) {
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.isDesktop = true;
    } else {
      this.isDesktop = false;
    }
    this.initialScreenSize()
    this.breakpointObserver.observe([
      '(min-width: 640px)',
      '(min-width: 768px)',
      '(min-width: 1024px)',
      '(min-width: 1280px)',
      '(min-width: 1536px)']).subscribe(result => {
        if (result.matches) {
          // console.log(result);
          if (result.breakpoints['(min-width: 1536px)']) {
            this.screenSize = '2xl';
          } else if (result.breakpoints['(min-width: 1280px)']) {
            this.screenSize = 'xl';
          } else if (result.breakpoints['(min-width: 1024px)']) {
            this.screenSize = 'lg';
          } else if (result.breakpoints['(min-width: 768px)']) {
            this.screenSize = 'md';
          } else {
            this.isSmallScreen = true;
            this.screenSize = 'sm';
          }

          // console.log('Screen Size :', this.screenSize);

        } else {
          this.isSmallScreen = false;
        }
      });
  }


  initialScreenSize() {
    let w = window.innerWidth;
    if (w >= 1536) {
      this.screenSize = '2xl';
    } else if (w >= 1280) {
      this.screenSize = 'xl';
    } else if (w >= 1024) {
      this.screenSize = 'lg';
    } else if (w >= 768) {
      this.screenSize = 'md';
    } else {
      this.screenSize = 'sm';
    }
    // console.log('Initial Size ---- ');
    // console.log(this.screenSize);
    // console.log('Initial Size ---- ');

  }

  getProfilePicURL(pic: string) {
    if (pic && pic != '' && pic != 'null') {
      return `${environment.apiUrl}/public/uploads/images/${pic}`;
    } else {
      return 'assets/fillers/profile-temp.png';
    }
  }
  routerBack() {
    this.location.back();
  }


  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  initializeHours() {
    this.hours = new RRule({
      freq: RRule.HOURLY,
      dtstart: new Date(),
      count: 13,
      interval: 1,
      byhour: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      byminute: [0],
      bysecond: [0]
    }).all().map(dt => {
      console.log({
        numberUTC: DateTime.fromJSDate(dt).hour,
        number: DateTime.fromJSDate(dt).toUTC().hour,
        value: DateTime.fromJSDate(dt).toUTC().toFormat('HH:mm a'),
        isSelected: false
      });

      return {
        number: DateTime.fromJSDate(dt).toUTC().hour,
        numberUTC: DateTime.fromJSDate(dt).toUTC().hour,
        value: DateTime.fromJSDate(dt).toUTC().toFormat('HH:mm a'),
        isSelected: false
      }
    });
  }
  resetHoursAndDays() {
    this.days.map(dt => { dt.isSelected = false; return dt });
    this.hours.map(hr => { hr.isSelected = false; return hr });
  }

  async presentAlert(header, message, cssClass?, subHeader?, translated?: boolean) {

    if (translated) {
      header = this.translate.instant(header);
      message = this.translate.instant(message);
      subHeader = this.translate.instant(subHeader);
    }
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
      cssClass
    });

    await alert.present();
  }

  async selectColor(ctr: PopoverController, ev, currentColor?: string) {
    return new Promise<string>(async (resolve, reject) => {
      const popover = await ctr.create({
        component: ColorPickerComponent,
        event: ev,
        componentProps: { currentColor },
        cssClass: 'popover-width',
        translucent: false
      });

      await popover.present();

      popover.onWillDismiss().then(dt => {
        if (currentColor) {
          if (dt.data?.isDataBack) {
            resolve('#' + dt.data.color);
          } else {
            resolve(currentColor);
          }
        } else {
          resolve('#' + dt.data?.color);
        }
      });
    })
  }


  async presentAlertWithBtns(header, message, firstBtnText, firstBtnRoute, secondBtnText, secondBtnRoute) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: firstBtnText,//'Continue shopping'
          handler: () => {
            this.router.navigate([firstBtnRoute])
          }
        },
        {
          text: secondBtnText,//'Go to cart'
          handler: () => {
            this.router.navigate([secondBtnRoute])
          }
        }
      ],

    });

    await alert.present();
  }

  async presentConfirmAlert(header: string, message: string, cancelText: string, confirmText: string, translated?: boolean) {
    if (translated) {
      header = this.translate.instant(header);
      message = this.translate.instant(message);
      cancelText = this.translate.instant(cancelText);
      confirmText = this.translate.instant(confirmText);
    }
    return new Promise<boolean>(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header,
        message,
        backdropDismiss: false,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(false)
            }
          },
          {
            text: confirmText,
            handler: () => {
              resolve(true)
            }
          }
        ],
      });
      await alert.present();
    })
  }

  async presentErrorAlert(header: string, message: string, dismissText: string, translated?: boolean) {
    if (translated) {
      header = this.translate.instant(header);
      message = this.translate.instant(message);
      dismissText = this.translate.instant(dismissText);
    }
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'errorAlert',
      buttons: [
        {
          text: dismissText,
          role: 'cancel',
          handler: () => { }
        },
      ],
    });
    await alert.present();
  }

  async readFile(file: File): Promise<{ file: File, url: any, ok: boolean }> {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = (ev) => {
        resolve({ file, url: ev.target.result, ok: true });
      }
      fr.onerror = (ev => {
        reject({ file, url: '', ok: false })
      })
    });
  }

  async presentLoading() {
    let loading = await this.loadingController.create({
      spinner: null,
      message: `<img src="../../assets/logos/logo-main.svg">`,
      cssClass: 'loading-custom-pulse',
      translucent: true,
      duration: 8000
    });
    loading.present();
  }

  async dismissLoading() {
    return await this.loadingController.dismiss();
  }

  // ! Helpers
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  // Order by ascending property value
  valueAscOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value.localeCompare(b.value);
  }

  // Order by descending property key
  keyDescOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  ligthenColor(color: string, percent?: number) {
    if (percent) {
      return tinyColor(color).lighten(percent).desaturate().toHexString();
    } else {
      return tinyColor(color).lighten(60).desaturate().toHexString();
    }
  };
}

function AppraisalStatisTypeEnum(AppraisalStatisTypeEnum: any) {
  throw new Error('Function not implemented.');
}
