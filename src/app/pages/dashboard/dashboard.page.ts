import { Task, Employee } from 'src/app/interfaces/types';
import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { EmployeePickerComponent } from 'src/app/components/pickers/employee-picker/employee-picker.component';
import { LanguageService } from 'src/app/services/language.service';
import { MenuService } from 'src/app/services/menu.service';
import { UserService } from 'src/app/services/user.service';
import { AppService } from 'src/app/services/app.service';
import { Session, Appointment } from './../../interfaces/types';
import { CourtService } from 'src/app/services/court.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { NotificationListComponent } from '../../components/lists/notification-list/notification-list.component';
import { AppointmentDetailsModal } from '../schedule/appointments-table/appointments-table.page';
import { GeneralService } from 'src/app/services/general.service';
import { AuthzService } from 'src/app/services/authz.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  time = new Date();
  timer;
  MyTasks: Task[];
  TasksIAssigned: Task[];
  MyAppointments: Appointment[];
  SessionColumns: string[];
  Sessions: Session[];
  TodaysAppointmentsLoading: boolean = true;
  MyTasksLoading: boolean = true;
  TasksIAssignedLoading: boolean = true;
  TodaysSessionsCount: Number = 0;
  ActiveSessionsCount: Number;
  ActiveCasesCount: Number;
  ActiveTasksCount: Number;
  MyTasksLength: Number = 0;
  AssignedTasksLength: Number = 0;
  MyAppointmentsLength: Number = 0;
  filter: {
    from_date: Date,
    to_date: Date
  }
  SessionList = new MatTableDataSource([]);
  @ViewChild(MatSort) sort: MatSort;
  @Input('selectedSession') selectedSession: Session[];
  @Input('showSelected') showSelected: boolean;
  notifications_count = 0;
  requests_count = 0;
  constructor(
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
    public task: TaskService
  ) 
  
  {
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
    if (!(this.authz.canDo('READ', 'Dashboard', []) || this.authz.canDo('MANAGE', 'Dashboard', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    await this.general.create_claim_notification_once();
    await this.general.create_fees_notification_once();
    this.SessionColumns = ["ID", "reference_no", "Case", "Status", "Session_Date", "Lawyer_Name", "Delay_Reason", "next_session_date", "Action"];
    this.getDisplayedColumns();
    this.Sessions = await this.court.getAllSessions()
    let currant_date = new Date;
    currant_date.setHours(0, 0, 0, 0);

    this.filter = {
      from_date: currant_date,
      to_date: currant_date
    }

    this.TodaysSessionsCount = await this.court.CountMySessionsToday(this.filter)
    this.ActiveSessionsCount = await this.court.CountActiveSessions()
    this.ActiveCasesCount = await this.court.CountActiveCases()
    this.ActiveTasksCount = await this.task.CountActiveTasks()
    this.task.getLastTenEmployeeTasks().then(data => {
      this.MyTasks = data
      this.MyTasksLoading = false
      this.MyTasksLength = this.MyTasks.length;
    })
    this.task.getEmployeeAssignedTasks().then(data => {
      this.TasksIAssigned = data
      this.TasksIAssignedLoading = false
      this.AssignedTasksLength = this.TasksIAssigned.length;
    })
    this.appointmentService.getMyDashboardAppointments(this.filter).then(data => {
      this.MyAppointments = data
      this.TodaysAppointmentsLoading = false
      this.MyAppointmentsLength = this.MyAppointments.length;
    })

    this.SessionList = new MatTableDataSource(this.Sessions);
    this.menu.enableMainMenu();
    if (this.selectedSession && this.showSelected) {
      let selectedIds = this.selectedSession.map(dt => dt.id);

    }
    this.notifications_count = await this.general.count_user_notifications()
    this.requests_count = await this.authz.countInboxRequests()

    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);



  }

  async ngAfterViewInit() {
    this.Sessions = await this.court.getAllSessions()
    this.SessionList = new MatTableDataSource(this.Sessions);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
  TasksisAssigned() {
    let me = this.auth.userData

    this.router.navigate(['../../tasks', me.value.id])


  }

  getProfilePic(pic: string) {
    return this.user.getProfilePicURL(pic);
  }

  async selectEmp(ev: any) {
    const mdl = await this.modalController.create({
      component: EmployeePickerComponent,
      componentProps: {
        isMulti: true
      }
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      console.log(dt);
    });
  }

  getDisplayedColumns(): string[] {
    return this.SessionColumns
  }

  async showNotifications(ev: any) {
    const popover = await this.popoverController.create({
      component: NotificationListComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    this.ngOnInit()
    console.log('onDidDismiss resolved with role', role);
  }

  goToCalendar() {
    this.router.navigate(['../../schedule/appointments/'])
  }

  moreSessions() {
    let me = this.auth.userData
    this.router.navigate(['../../court/agenda/', me.value.id])
  }

  goToTask(id) {
    this.router.navigate([`../../tasks/task-details/${id}`])
  }

  Cases() {
    let me = this.auth.userData
    this.router.navigate(['../../court/reports', me.value.id])
  }

  Tasks() {
    this.router.navigate(['../../tasks/'])
  }

  async goToAppointment(row) {
    this.router.navigate(['schedule/appointmentDetails/', row.id])
    /*const modal = await this.modalController.create({ component: AppointmentDetailsModal, cssClass: 'responsiveModal', componentProps: { appointmentID: row.id } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit();
    });
    return await modal.present();*/
  }

  goToRequest() {
    this.router.navigate(['../../hcm/employee-requests-list/'])
  }

}

