import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LanguageService } from './language.service';
@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnDestroy {
  routeURL = new BehaviorSubject<string>('');
  ShowMenu: Boolean = true;
  $routeSub;
  userMenu: {
    title: string,
    icon: string,
    url?: string,
    module?: string,
    subject?: string,
    actions?: string,
    open?: boolean,
    children?: any[],
    users?: string[]
  }[] = [
      {
        title: 'Dashboard.Title',
        url: '/dashboard',
        icon: 'grid-outline',
        users: ['employee'],
        subject:'Dashboard:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE'
      },
      {
        title: 'AdminDashboard.Title',
        url: '/admin-dashboard',
        icon: 'trending-up',
        users: ['employee'],
        subject: 'Finance:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE',
      },
      
      {
        title: 'Dashboard.Title',
        url: '/ClientViewPage',
        icon: 'grid-outline',
        subject: 'ClientAccess:READ:MANAGE'
      },
      {
        title: 'Dashboard.Title',
        url: '/CompanyViewPage',
        icon: 'grid-outline',
        subject: 'CompanyAccess:READ:MANAGE'
      }, {
        title: 'Court.Title',
        url: 'court',
        icon: 'business-outline',
        subject: 'Court:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE'
        //subject: 'Court',

      }, {
        title: 'Schedule.Appointment.My',
        url: '/myappointments',
        subject: 'Appointment:READ',
        users: ['client'],
        icon: 'calendar-number-outline',
      },

      {
        title: 'Tasks.Plural',
        url: '/tasks',
        subject: 'Task:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
        users: ['employee'],
        icon: 'file-tray-full-outline',
      }
      , {
        title: 'Schedule.Title',
        icon: 'calendar-outline',
        subject: 'TimeSlot:READ,Appointment:READ,AppointmentType:READ,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
        users: ['employee'],
        module: 'schedule',
        open: false,
        children: [
          {
            title: 'Schedule.TimeSlot.Plural',
            url: 'schedule/timeSlots',
            icon: 'time-outline',
            subject: 'TimeSlot:READ,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
          },
          {
            title: 'Schedule.Calendar',
            url: 'schedule/appointments',
            icon: 'calendar-outline',
            subject: 'TimeSlot:READ,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
          },
          {
            title: 'Schedule.AppointmentType.Plural',
            url: 'schedule/appointmentTypes',
            icon: 'bookmark-outline',
            subject: 'AppointmentType:READ,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
          },
          {
            title: 'Schedule.Booking.Plural',
            url: 'schedule/booking',
            icon: 'checkbox-outline',
          },
          {
            title: 'Schedule.AppointmentsTable.Plural',
            url: 'schedule/AppointmentsTable',
            icon: 'list',
            subject: 'AppointmentType:READ,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
          },
        ]
      },
      {
        title: 'HCM.ESS.Title',
        url: '/employee-self-service',
        users: ['employee'],
        icon: 'reader-outline',
        //subject:'Employee:READ:MANAGE'
        // subject: 'Log',

      }, {
        title: 'HCM.Title',
        icon: 'people-outline',
        //subject: 'TimeSlot:READ,Appointment:READ,AppointmentType:READ',
        subject: 'Finance:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,auditorAccess:MANAGE',
        //users: ['employee'],
        module: 'hcm',
        open: false,
        children: [
          {
            title: 'HCM.Appraisal.Title',
            url: 'hcm/appraisal',
            icon: 'speedometer-outline',
            subject: 'Appraisal:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE',
            users: ['employee'],
          },
          {
            title: 'HCM.Payroll.Title',
            url: 'hcm/payroll',
            icon: 'cash-outline',
            subject: 'PaySlip:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,auditorAccess:MANAGE',
          }, {
            title: 'HCM.Workforce.leaves.Title',
            url: 'hcm/workforce/leaves',
            icon: 'barbell-outline',
            subject: 'Leave:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,auditorAccess:MANAGE',
          },
          {
            title: 'HCM.Recruitment.Title',
            url: 'hcm/recruitment',
            icon: 'person-add-outline',
            subject: 'Vacancy:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE',
          },
          {
            title: 'HCM.Employee-managment.Title',
            url: 'hcm/employee-management',
            icon: 'people-outline',
            subject: 'Employee:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE',
            //  subject: 'Employee',
            // action: 'MANAGE'
          }
        ]
      },
          {
            title: 'HCM.Requests.Title',
            url: 'hcm/employee-requests-list',
            icon: 'document',
           // subject: 'EmployeeRequest:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
          },
      {
        title: 'Finance.Title',
        url: '/finance',
        icon: 'cash-outline',
        users: ['employee'],
        subject: 'Finance:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,auditorAccess:MANAGE',
        //subject: 'Employee',
        //action: 'MANAGE'

      },
      {
        title: 'MyAccount.Title',
        url: '/myaccount',
        icon: 'person-circle-outline'
      },
      {
        title: 'System.Title',
        icon: 'build-outline',
        module: 'System',
        users: ['employee'],
        subject: 'User:MANAGE,Permission:MANAGE,Role:MANAGE,Group:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE',
        open: false,
        children: [
          {
            title: 'System.Authorization.Plural',
            url: 'system/authorization',
            subject: 'User:MANAGE,Permission:MANAGE,Role:MANAGE,Group:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE',
            module: 'Authorization',
            icon: 'document-lock-outline',
            children: [
              {
                title: 'System.Users.Plural',
                url: 'system/authorization/users',
                icon: 'person-outline',
                subject: 'User',
                action: 'MANAGE'
              }, {
                title: 'System.Permissions.Plural',
                url: 'system/authorization/permissions',
                icon: 'key-outline',
                subject: 'Permission',
                action: 'MANAGE'
              }, {
                title: 'System.Roles.Plural',
                url: 'system/authorization/roles',
                icon: 'lock-closed-outline',
                subject: 'Role',
                action: 'MANAGE'

              }, {
                title: 'System.Groups.Plural',
                url: 'system/authorization/groups',
                icon: 'people-outline',
                subject: 'Group',
                action: 'MANAGE'
              }, {
                title: 'System.Link',
                url: 'system/authorization/link',
                icon: 'people-outline',
              },
            ]
          },
          {
            title: 'System.Logs.Title',
            url: 'system/logs',
            icon: 'reader-outline',
            subject: 'Log',
            action: 'MANAGE'
          },
          {
            title: 'System.Announcements',
            url: 'announcement',
            icon: 'megaphone-outline',
            subject: 'Announcement:READ:MANAGE,SuperAdminAccess:MANAGE,AdminAccess:MANAGE,AdminSupportAccess:MANAGE,SLawyerAccess:MANAGE,LawyerAccess:MANAGE'
          }
        ]
      }
    ];

 menuSide: 'start' | 'end' = 'start';

  menuType: 'overlay' | 'reveal' | 'push' = 'push';
  $subs: Subscription[] = [];
  constructor(public lang: LanguageService,public menu: MenuController, private rt: Router, private breakpointObserver: BreakpointObserver) {
    this.$routeSub = this.rt.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if ( this.rt.url == '/terms' ||  this.rt.url == '/login' || this.rt.url == '/forgetpassword' || ev.url == '/newBooking' || ev.url.includes('/jobs') || this.rt.url.includes('forgetpassword')) {
          this.disableMainMenu();
        } else {
          this.enableMainMenu();
        }
        this.routeURL.next(this.rt.url);
      }
    });
    this.breakpointObserver.observe('(max-width: 780px)').subscribe(result => {
      if (result.matches) {
        this.menuType = 'overlay';
        
        
      } else {
        this.menuType = 'push';
    
    }});

 
    if (this.lang.selectedLang == 'en') {
      this.menuSide = 'start';
    } else {
      this.menuSide = 'end';
    }

  }

  disableMainMenu() {
    this.menu.close();
    this.menu.enable(false);
  }
  enableMainMenu() {
    this.menu.enable(true);
  }

  ngOnDestroy() {

  }
}
