import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Appointment, AppointmentType, Employee, TimeSlot } from '../interfaces/types';
import { AuthzService } from './authz.service';
import { RRule, RRuleSet, Weekday } from 'rrule';
import { AppService } from './app.service';
import { LanguageService } from 'src/app/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  timeSlots = new BehaviorSubject<TimeSlot[]>([]);
  timeSlotsEmployees = new BehaviorSubject<Employee[]>([]);
  appointments = new BehaviorSubject<Appointment[]>([]);
  appointmentTypes = new BehaviorSubject<AppointmentType[]>([]);
  date: Date = new Date();
  constructor(public http: HttpClient, private app: AppService, private auth: AuthService, private authz: AuthzService,public lang: LanguageService) { }

  async createTimeSlot(data: {
    isRecurrence: boolean,
    startTime?: Date | string,
    endTime?: Date | string,
    date: Date | string,
    endDate?: Date | string,
    days?: number[],
    hours?: number[]
  }, employeeID?: number) {
    try {
      let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/appointment/timeSlot/create`, { data, employeeID }, { withCredentials: true }).toPromise();
      if(res.statusCode== 406) {
        if (this.lang.selectedLang == 'en') {
          await this.app.presentErrorAlert('Operations.Sorry', res.message_en, 'Operations.Ok', true)
        }
        else {
          await this.app.presentErrorAlert('Operations.Sorry', res.message_ar, 'Operations.Ok', true)
        }

      }else {
        return res
      }
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }

  async getAllTimeSlots(filter: { isBooked?: boolean, range: { start: string | Date, end: string | Date } }, employeeID?: number) {
    let ts = await this.http.post<Employee[]>(`${environment.apiUrl}/hcm/workforce/appointment/timeSlot/all`, { filter, employeeID }, { withCredentials: true }).toPromise();
    this.timeSlotsEmployees.next(ts);
    this.timeSlots.next(ts.map(dt => dt.timeSlots.map(tslot => { tslot.employee = dt; tslot.employeeID = dt.id; return tslot })).reduce((val, prev) => { return [...prev, ...val] }, []));

    return ts;
  }
  async getTimeSlot(id: number) {
    return await this.http.get<TimeSlot>(`${environment.apiUrl}/hcm/workforce/appointment/timeSlot/get/${id}`, { withCredentials: true }).toPromise();
  }

  async deleteTimeSlot(id: number) {
    let ts = await this.http.post<TimeSlot>(`${environment.apiUrl}/hcm/workforce/appointment/timeSlot/delete`, { id }, { withCredentials: true }).toPromise();
    this.timeSlots.next(this.timeSlots.value.filter(ts => ts.id != id));
    return ts;
  }

  async updateTimeSlot(id: number, data: TimeSlot) {

  }

  async createAppointment(data: { timeSlotID: number, typeID: number, data: Appointment }) {
    return await this.http.post<Appointment>(`${environment.apiUrl}/hcm/workforce/appointment/create`, data).toPromise();
  }

  async createClientAppointment(data: { timeSlotID: number, typeID: number, clientID: number, data: Appointment }) {
    return await this.http.post<Appointment>(`${environment.apiUrl}/hcm/workforce/appointment/createClientAppointment`, data).toPromise();
  }

  async UpdateAppointmentTime(data: { timeSlotID: number, appointmentID: number, typeID: number, data: Appointment }) {
    return await this.http.post<Appointment>(`${environment.apiUrl}/hcm/workforce/appointment/UpdateAppointmentTime`, data).toPromise();
  }

  async cancelAppointment(data) {
    let ts = await this.http.post<Appointment>(`${environment.apiUrl}/hcm/workforce/appointment/cancel`, { data }, { withCredentials: true }).toPromise();
    this.timeSlots.next(this.timeSlots.value.map(ts => {
      if (ts.appointmentID == data.id) {
        ts.appointmentID = null;
        ts.appointment = null;
        ts.isApproved = false;
        ts.isBooked = false;
      }
      return ts
    }));
    return ts
  }

  async getMyAppointments(
    filter: { range: { start: string | Date, end: string | Date } }
  ) {
    return await this.http.post<Appointment[]>(`${environment.apiUrl}/hcm/workforce/appointment/getMyAppointments`, { type: 'CLIENT', filter }, { withCredentials: true }).toPromise();
  }

  async createAppointmentType(data: { title_ar: string, title_en: string, color: string, isNotary?: boolean }) {
    let res = await this.http.post<AppointmentType>(`${environment.apiUrl}/hcm/workforce/appointment/type/create`, data, { withCredentials: true }).toPromise();
    await this.getAllAppointmentTypes();
    return res;
  }

  async updateAppointmentType(data: { id: number, title_ar?: string, title_en?: string, color?: string }) {
    let res = await this.http.post<AppointmentType>(`${environment.apiUrl}/hcm/workforce/appointment/type/update`, data, { withCredentials: true }).toPromise();
    await this.getAllAppointmentTypes();
    return res;
  }
  async deleteAppointmentType(id: number) {
    let res = await this.http.post<AppointmentType>(`${environment.apiUrl}/hcm/workforce/appointment/type/delete/${id}`, { withCredentials: true }).toPromise();
    await this.getAllAppointmentTypes();
    return res;
  }

  async getAllAppointmentTypes() {
    let res = await this.http.get<AppointmentType[]>(`${environment.apiUrl}/hcm/workforce/appointment/type/all`, { withCredentials: true }).toPromise();
    this.appointmentTypes.next(res);
    return res;
  }
  async appointmentApproval(data: { id: number, isApproved: boolean, reason?: string }) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/appointment/approval`, data, { withCredentials: true }).toPromise();
    this.appointmentTypes.next(res);
    return res;
  }

  async unapprove(data: { id: number, isApproved: boolean }) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/appointment/unapprove`, data, { withCredentials: true }).toPromise();
    this.appointmentTypes.next(res);
    return res;
  }

  async getAppointmentList(filter: any) {
    return await this.http.post<Appointment[]>(`${environment.apiUrl}/hcm/workforce/appointment/getAppointmentList`,{filter},
        { withCredentials: true }).toPromise();
  }

  async updateAppointment(data: any) {
    try {
      return await this.http.post<Appointment>(`${environment.apiUrl}/hcm/workforce/appointment/updateAppointment`, data ,
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }

  async getOneAppointment(id: number) {
    return await this.http.get<Appointment>(`${environment.apiUrl}/hcm/workforce/appointment/getOneAppointment/${id}`, { withCredentials: true }).toPromise();
  }

  createCalenderRule(startDate: Date, endDate: Date, days: Weekday[], hours: number[]) {
    const ruleSet = new RRuleSet();
    const rule = new RRule({
      freq: RRule.WEEKLY,
      dtstart: startDate,
      until: endDate,
      wkst: RRule.SU,
      byweekday: days,
      byhour: hours,
      byminute: [30]
    });
    ruleSet.rrule(rule);
    return ruleSet;
  }

  async getMyDashboardAppointments(date) {
    return await this.http.post<Appointment[]>(`${environment.apiUrl}/hcm/workforce/appointment/getMyDashboardAppointments`, {date},
    { withCredentials: true }).toPromise();
  }

  async appointmentComplete(id: number) {
    return await this.http.get<Appointment>(`${environment.apiUrl}/hcm/workforce/appointment/appointmentComplete/${id}`, { withCredentials: true }).toPromise();
  }
}
