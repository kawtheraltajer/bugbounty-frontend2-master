import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from "../../environments/environment";
import { AuthService } from '../auth/auth.service';
import { TaskComment, Task, TaskStatus } from '../interfaces/types';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskStatuses = new BehaviorSubject<TaskStatus[]>([]);
  filter: any = {};
  constructor(private auth: AuthService, public http: HttpClient, private groupService: GroupService) { }

  async getFilteredTasks(groupID: number,filter:any) {
    return await this.http.post<TaskStatus[]>(`${environment.apiUrl}/hcm/workforce/task/getFilteredTasks`, {data:{filter:filter,groupID:groupID}

    }).toPromise();

  }
  async getAllTasks(groupID: number) {
    return await this.http.post<TaskStatus[]>(`${environment.apiUrl}/hcm/workforce/task/allTasks`, { groupID: groupID, filter: this.filter }).toPromise();
  } 
  
  async getTaskEmployeeNotifications(TaskID: number) {

    return await this.http.get<any[]>(`${environment.apiUrl}/hcm/workforce/task/getTaskEmployeeNotifications/${Number(TaskID)}`).toPromise();
  }

  async getData() {
    if (this.groupService.selectedGroup.value?.id) {
      this.taskStatuses.next(await this.getAllTasks(this.groupService.selectedGroup.value.id));
    }
  }

 
  async getTaskStatus() {
    return await this.http.get<Task[]>(`${environment.apiUrl}/hcm/workforce/task/getTaskStatus`).toPromise();
  }


  async getFilteredData(filter:any) {
    if (this.groupService.selectedGroup.value?.id) {
      this.taskStatuses.next(await this.getFilteredTasks(this.groupService.selectedGroup.value.id,filter));
    }
  }

  async getCaseTasks(caseID: Number) {
    let gID = this.groupService.selectedGroup.value?.id
    if (gID) {
      return await this.http.post<TaskStatus[]>(`${environment.apiUrl}/hcm/workforce/task/getCaseTasks`, { groupID: gID, caseID: caseID }).toPromise();
    }
  } 

  async createTask(data: {
    title: string,
    dueDate: Date,
    statusID: number,
    employeeID?: number,
    caseID?: number,
    index: number
  }) {
    const task = await this.http.post<Task>(`${environment.apiUrl}/hcm/workforce/task/createTask`, { groupID: this.groupService.selectedGroup.value.id, ...data }).toPromise();
    this.getData();
    return task;
  }

  async createStatus(data: TaskStatus) {
    let status = await this.http.post<TaskStatus>(`${environment.apiUrl}/hcm/workforce/task/createStatus`, data).toPromise();
    this.getData();
    return status;
  }

  async updateStatus(data: TaskStatus) {
    let { id, ...dt } = data;
    let status = await this.http.post<TaskStatus>(`${environment.apiUrl}/hcm/workforce/task/updateStatus`, { id, data: dt, groupID: this.groupService.selectedGroup.value.id }).toPromise();
    this.getData();
    return status;
  }
  async updateTasks(data: { tasks: Task[] }) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/task/updateTasks`, data).toPromise();
    this.getData();
    return res;
  }

  async updateCurrentTaskStatus(data: any) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/task/updateCurrentTaskStatus`, data).toPromise();
    this.getData();
    return res;
  }

  async updateStatusesIndex(data: { groups: { id: number, index: number }[] }) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/task/updateStatusesIndex`, data).toPromise();
    this.getData();
    return res;
  }
  async deleteTaskStatus(id: number) {
    let status = await this.http.post<TaskStatus>(`${environment.apiUrl}/hcm/workforce/task/deleteTaskStatus`, { id }).toPromise();
    this.getData();
    return status;
  }

  async changeTaskStatus(taskID: number, statusID: number, index?: number) {
    let res = await this.http.post<Task>(`${environment.apiUrl}/hcm/workforce/task/createStatus`, { taskID, statusID, index }).toPromise();
    this.getData();
    return res;
  }

  async assignTaskToEmployee(taskID: number, isConnect: boolean, employeeID?: number) {
    let res = await this.http.post<Task>(`${environment.apiUrl}/hcm/workforce/task/assignTaskToEmployee`, { taskID, isConnect, employeeID }).toPromise();
    this.getData();
    return res;
  }

  async linkCaseToTask(taskID: number, isConnect: boolean, caseID?: number) {
    let res = await this.http.post<Task>(`${environment.apiUrl}/hcm/workforce/task/linkCaseToTask`, { taskID, isConnect, caseID }).toPromise();
    this.getData();
    return res;
  }

  async getTask(id: number) {
    return await this.http.get<Task>(`${environment.apiUrl}/hcm/workforce/task/details/${Number(id)}`).toPromise();
  }

  async addComment(taskID: number, body: string) {
    if (body.trim() != '') {
      return await this.http.post<TaskComment>(`${environment.apiUrl}/hcm/workforce/task/addComment`, { taskID, body }).toPromise();
    }
  }

  async deleteComment(taskID: number, index: number) {
    return await this.http.post<TaskComment[]>(`${environment.apiUrl}/hcm/workforce/task/deleteComment`, { taskID, index }).toPromise();
  }

  async updateTask(
    taskID: number,
    data: {
      title?: string,
      details?: any,
      dueDate?: Date,
      caseID?: number,
      employeeID?: number
    }) {
    return await this.http.post<TaskComment>(`${environment.apiUrl}/hcm/workforce/task/updateTask`, { taskID, data }).toPromise();
  }

  async CountActiveTasks() {
    return await this.http.get<Number>(`${environment.apiUrl}/hcm/workforce/task/CountActiveTasks`, { withCredentials: true }).toPromise();
  }

  async getEmployeeTasks() {
    return await this.http.get<Task[]>(`${environment.apiUrl}/hcm/workforce/task/getEmployeeTasks`).toPromise();
  }

  async getEmployeeAssignedTasks() {
    return await this.http.get<Task[]>(`${environment.apiUrl}/hcm/workforce/task/getEmployeeAssignedTasks`).toPromise();
  }

  async getLastTenEmployeeTasks() {
    return await this.http.get<Task[]>(`${environment.apiUrl}/hcm/workforce/task/getLastTenEmployeeTasks`).toPromise();
  }

  async getTasksForPrinting(filter: any) {
    return await this.http.post<Task[]>(`${environment.apiUrl}/hcm/workforce/task/getTasksForPrinting`,{filter},
        { withCredentials: true }).toPromise();
  }
  async deleteTask(id: number) {
    let task = await this.http.post<Task>(`${environment.apiUrl}/hcm/workforce/task/deleteTask`, { id }).toPromise();
    this.getData();
    return task;
  }

  async getTasksNumber(CaseId: number) {
    return await this.http.get<number>(`${environment.apiUrl}/hcm/workforce/task/getTasksNumber/${Number(CaseId)}`).toPromise();
  }
}
