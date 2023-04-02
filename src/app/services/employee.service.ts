import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { AuthService } from '../auth/auth.service';
import { Employee } from '../interfaces/types';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private auth: AuthService, public http: HttpClient) { }
  async getEmployees() {
    return await this.http.get<Employee[]>(`${environment.apiUrl}/employee-management/getAllEmployee`).toPromise();
  }

}
