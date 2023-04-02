import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { MenuService } from 'src/app/services/menu.service';
import { UserService } from 'src/app/services/user.service';
import { AppService } from 'src/app/services/app.service';
import { CourtService } from 'src/app/services/court.service';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { GeneralService } from 'src/app/services/general.service';
import { AuthzService } from 'src/app/services/authz.service'
import { FinanceService } from 'src/app/services/finance.service';
import { DateTime } from 'luxon';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {
  time = new Date();
  timer;
  
  segment:0;
  TodayAppointmentCount: Number = 0;
  TodayReciptsCount: Number = 0;
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  getall = false
  TodayDuePaymentCount: Number = 0;
  constructor(  public finance:FinanceService  ,
    public general: GeneralService,
    public authz: AuthzService,
    public lang: LanguageService,
    private modalController: ModalController,
    public menu: MenuService,
    public auth: AuthService,
    public user: UserService,
    public popoverController: PopoverController,
    public app: AppService,
    public court: CourtService,
    public appointmentService: AppointmentService,
    private router: Router,
    public task: TaskService) { 
      
        if (!(this.authz.canDo('READ', 'Dashboard', []) || this.authz.canDo('MANAGE', 'Dashboard', [])) &&
          ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
            this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
          this.router.navigateByUrl(`/login`)
        }
      }
    
      ionViewWillEnter() {
        if (!(this.authz.canDo('READ', 'Dashboard', []) || this.authz.canDo('MANAGE', 'Dashboard', [])) &&
          ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
            this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
          this.router.navigateByUrl(`/login`)
        }
      }
    
      async ngOnInit() {
        this.segment=0
        if (!(this.authz.canDo('READ', 'Dashboard', []) || this.authz.canDo('MANAGE', 'Dashboard', [])) &&
          ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
            this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
          this.router.navigateByUrl(`/login`)
        }

        let currant_date = new Date;
        currant_date.setHours(0, 0, 0, 0);

        this.TodayAppointmentCount = await this.general.TodayAppointmentCount()
        this.TodayReciptsCount = await this.general.TodayReciptsCount()
        this.TodayDuePaymentCount= await this.general.TodayDuePaymentCount()
        
        this.TodayReciptsCount  = await this.finance.getAllReceiptsWithRangeCount({
          start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).startOf('day').toJSDate(),
          end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth + 1 }).endOf('day').toJSDate()
        }, this.getall)
      }
      async ngAfterViewInit() {

      }
    
      ngOnDestroy() {
        clearInterval(this.timer);
      }
  

  
    }
    
    



