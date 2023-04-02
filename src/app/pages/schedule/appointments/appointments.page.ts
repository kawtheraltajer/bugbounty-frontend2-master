import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { DateTime, Info } from 'luxon';
import { Employee, TimeSlot } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user.service';
import { colors } from '../colors';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {

  isLoading = true;
  view: 'month' | 'day' | 'week' = 'month';
  viewDate: Date = new Date();
  viewLuxon = DateTime.local();
  employees: Employee[] = [];
  viewEmployees: Employee[] = [];
  sideHasBackdrop = true;
  sideMode: 'over' | 'push' | 'side' = 'over';
  sideContent: 'settings' | 'help' = 'settings';
  constructor(public appointmentService: AppointmentService, public user: UserService, public lang: LanguageService, public app: AppService, public router: Router,
    public authz: AuthzService) { 
    /*if (!(this.authz.canDo('READ', 'Appointment', []) || this.authz.canDo('MANAGE', 'Appointment', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appointment', []) || this.authz.canDo('MANAGE', 'Appointment', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    await this.loadData();
    this.isLoading = false;
  }
  changeView(vi: 'day' | 'week' | 'month') {
    switch (vi) {
      case 'day':
        this.view = CalendarView.Day
        break;
      case 'week':
        this.view = CalendarView.Week
        break;
      case 'month':
        this.view = CalendarView.Month
        break;
      default:
        this.view = CalendarView.Month
        break;
    }
  }

  changeDate(vi: 'current' | 'next' | 'previous') {
    const plusOBJ: any = {};
    plusOBJ[this.view] = 1
    switch (vi) {
      case 'current':
        this.viewDate = new Date();
        break;
      case 'next':
        this.viewLuxon = DateTime.fromJSDate(this.viewDate).plus(plusOBJ);
        this.viewDate = DateTime.fromJSDate(this.viewDate).plus(plusOBJ).toJSDate();
        break;
      case 'previous':
        this.viewLuxon = DateTime.fromJSDate(this.viewDate).minus(plusOBJ);
        this.viewDate = DateTime.fromJSDate(this.viewDate).minus(plusOBJ).toJSDate();
        break;

      default:
        this.viewDate = new Date();
        this.viewLuxon = DateTime.fromJSDate(this.viewDate);
        break;
    }
    this.loadData()
  }

  async loadData() {
    let plusOBJ: any = {};
    plusOBJ[this.view] = 1
    let res = await this.appointmentService.getAllTimeSlots({
      range: {
        start: DateTime.fromJSDate(this.viewDate).startOf('month').toJSDate(),
        end: DateTime.fromJSDate(this.viewDate).endOf('month').toJSDate()
      }
    });
    this.employees = res.map(emp => { emp.selected = true; return emp });
    this.viewEmployees = this.employees; 
    console.log(res)
  }

  async changesHappend() {
    await this.loadData();
  }

  openSettings() { }

  selectEmp(emp: Employee, itemIndex: number) {
    // let index = this.employees.findIndex(val => val.id == emp.id);
    // this.items[itemIndex].selected = !emp.selected
    // this.employees[index].selected = !emp.selected;
    // console.log(this.employees[index]);
  }
  settings(op: 'reset' | 'apply') {
    switch (op) {
      case 'reset':
        this.employees.forEach(emp => emp.selected = true);
        this.viewEmployees = this.employees;
        break;
      case 'apply':
        this.viewEmployees = this.employees.filter(emp => emp.selected);
        break;

      default:
        break;
    }
  }
}

