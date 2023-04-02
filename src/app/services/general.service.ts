import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { AuthService } from '../auth/auth.service';
import { Employee } from '../interfaces/types';
@Injectable({
  providedIn: 'root'
})

export class GeneralService {

  constructor(private auth: AuthService, public http: HttpClient) { }

  async get_all_logs(filter: any) {
    return await this.http.post<any>(`${environment.apiUrl}/general/get_all_logs/`, filter,{ withCredentials: true }).toPromise();

  }
  async get_user_notifications() {
    let ts = await this.http.get<any>(`${environment.apiUrl}/general/get_user_notifications`, { withCredentials: true }).toPromise();
    return ts;
  }
  async ReadNofitication(filter: any) {
    return await this.http.post<any>(`${environment.apiUrl}/general/ReadNofitication/`, filter,{ withCredentials: true }).toPromise();

  }

  async getOneLog(id: number) {
    return await this.http.get<any>(`${environment.apiUrl}/general/getOneLog/${id}`, { withCredentials: true }).toPromise();
  }

  async count_user_notifications() {
    return await this.http.get<any>(`${environment.apiUrl}/general/count_user_notifications`, { withCredentials: true }).toPromise();
  }

  async create_claim_notification_once() {
    return await this.http.get<any>(`${environment.apiUrl}/general/create_claim_notification_once`, { withCredentials: true }).toPromise();
  }

  async create_fees_notification_once() {
    return await this.http.get<any>(`${environment.apiUrl}/general/create_fees_notification_once`, { withCredentials: true }).toPromise();
  }


  async TodayAppointmentCount() {
    let ts = await this.http.get<Number>(`${environment.apiUrl}/general/TodayAppointmentCount`, { withCredentials: true }).toPromise();
    return ts;

  }
  async TodayReciptsCount() {
    let ts = await this.http.get<Number>(`${environment.apiUrl}/general/TodayReciptsCount`, { withCredentials: true }).toPromise();
    return ts;
  }

  async TodayDuePaymentCount() {
    let ts = await this.http.get<Number>(`${environment.apiUrl}/general/TodayDuePaymentCount`, { withCredentials: true }).toPromise();
    return ts;
  }

  async EmployeeReport(data: any) {
    console.log(data)
    return await this.http.post<any>(`${environment.apiUrl}/hcm/employee-managment/reports/`, data,{ withCredentials: true }).toPromise();

  }
  async getEmployeeBankInfo(id: number) {
    return await this.http.get<any>(`${environment.apiUrl}/hcm/employee-managment/getEmployeeBankInfo/${id}`, { withCredentials: true }).toPromise();
  }

  
  

}
