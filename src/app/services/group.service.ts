import { filter } from 'rxjs/operators';
import { Employee } from './../interfaces/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Group } from '../interfaces/types';
import { AuthzService } from './authz.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  groups = new BehaviorSubject<Group[]>([]);
  selectedGroup = new BehaviorSubject<any>(null);
  filter=new BehaviorSubject<any>(null);
  constructor(public http: HttpClient, private auth: AuthService, private authz: AuthzService) { }

  async getAllGroups() {
    let grs = await this.http.get<Group[]>(`${environment.apiUrl}/group/all`).toPromise();
    this.groups.next(grs);
    grs.length > 0 ? this.selectedGroup.next(grs[0]) : this.selectedGroup.next(null);
    return grs;
  }

  async getGroup(id: number) {
    return await this.http.get<Group>(`${environment.apiUrl}/group/get/${id}`).toPromise();
  }


  async createGroup(data: {
    name: string,
    description: string,
    members?: number[],
    leaderID: number
  }) {
    let res = await this.http.post<Group>(`${environment.apiUrl}/group/create`, data, { withCredentials: true }).toPromise();
    await this.getAllGroups();
    return res;
  }

  async deleteGroup(id: number) {
    let res = this.http.delete<Group>(`${environment.apiUrl}/group/delete/${id}`).toPromise();
    await this.getAllGroups();
    return res;
  }

  async addMembersToGroup(data: { groupID: number, members: number[] }) {
    return await this.http.post<Group>(`${environment.apiUrl}/group/addMembers`, data).toPromise();
  }

  async changeLeader(data: { groupID: number, employeeID: number}) {
    return await this.http.post<Group>(`${environment.apiUrl}/group/changeLeader`, data).toPromise();
  }



  async updateGroup(data: {   name: string, description: string,}) {
    let res = await this.http.post<Group>(`${environment.apiUrl}/group/update`, data, { withCredentials: true }).toPromise();
    return res;  }
    
    
    
    

}
