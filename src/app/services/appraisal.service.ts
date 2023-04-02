import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Pagination } from '../interfaces/commen-interfaces';
import { Appraisal, AppraisalApproval, AppraisalSection, AppraisalStatus, AppraisalTemplate, AppraisalType, Employee, SectionBlock } from '../interfaces/types';
import { AppService } from './app.service';
import { AuthzService } from './authz.service';

@Injectable({
  providedIn: 'root'
})
export class AppraisalService {
  types = new BehaviorSubject<AppraisalType[]>([])
  constructor(public http: HttpClient,
    private app: AppService,
    private auth: AuthService,
    private authz: AuthzService) { }

  // ! AppraisalTypes 
  async createAppraisalType(data: AppraisalType) {
    try {
      let type = await this.http.post<AppraisalType>(`${environment.apiUrl}/hcm/appraisal/type/create`,
        data,
        { withCredentials: true }).toPromise();
      type ? this.types.next([...this.types.value, type]) : null;
      return type;
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }
  async updateAppraisalType(data: AppraisalType) {
    try {
      return await this.http.post<AppraisalType>(`${environment.apiUrl}/hcm/appraisal/type/update`,
        { id: data.id, data },
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }
  async updateapprisal(data: Appraisal) {
    try {
      return await this.http.post<AppraisalType>(`${environment.apiUrl}/hcm/appraisal/updateapprisal/update`,
        { id: data.id, data },
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }
  async deleteAppraisalType(id: number) {
    try {
      return await this.http.delete(`${environment.apiUrl}/hcm/appraisal/type/delete/${id}`, { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'HCM.Appraisal.type.Errors.cant_delete', 'Operations.Ok', true)
    }
  }
  async getAllAppraisalTypes() {
    let ts = await this.http.get<AppraisalType[]>(`${environment.apiUrl}/hcm/appraisal/type/all`, { withCredentials: true }).toPromise();
    this.types.next(ts);
    return ts;
  }

  // ! Appraisal 
  async getAppraisal(id: number) {
    return await this.http.get<Appraisal>(`${environment.apiUrl}/hcm/appraisal/get/${id}`, { withCredentials: true }).toPromise();
  }
  async getAllAppraisal(data: {
    filter: { employeeID?: number, typeID?: number, year?: number, month?: number },
    paginate: Pagination
  }) {
    return await this.http.post<{
      result: Appraisal[],
      count?: number,
      paginate: Pagination,
      filter: any
    }>(`${environment.apiUrl}/hcm/appraisal/getAll`, data, { withCredentials: true }).toPromise();
  }

  async createAppraisal(
    data: {
      isTemplate?: boolean,
      approvals?: {
        byID: number,
        isMandatory: boolean
      }[],
      year: number,
      month?: number,
      appraiserID: number,
      typeID: number,
      employeeID: number,
      sections?: AppraisalSection[],
      templateID?: number
    }
  ) {
    return await this.http.post<Appraisal>(`${environment.apiUrl}/hcm/appraisal/create`, data, { withCredentials: true }).toPromise();
  }
  async createAppraisalTemplate(
    data: {
      approvals?: {
        byID: number,
        isMandatory: boolean
      }[],
      typeID: number,
      title_ar: string,
      title_en: string,
      sections?: AppraisalSection[],
    }
  ) {
    return await this.http.post<AppraisalTemplate>(`${environment.apiUrl}/hcm/appraisal/createTemplate`, data, { withCredentials: true }).toPromise();
  }
  async updateAppraisalTemplate(
    data: AppraisalTemplate
  ) {
    return await this.http.post<AppraisalTemplate>(`${environment.apiUrl}/hcm/appraisal/updateTemplate`, data, { withCredentials: true }).toPromise();
  }

  async getAppraisalTemplate(id: number) {
    return await this.http.get<AppraisalTemplate>(`${environment.apiUrl}/hcm/appraisal/getTemplate/${id}`, { withCredentials: true }).toPromise();
  }
  async getAppraisalTemplates(data: {
    filter: { typeID?: number, title?: string },
    paginate: Pagination
  }) {
    return await this.http.post<{
      result: AppraisalTemplate[],
      count?: number,
      paginate: Pagination,
      filter: any
    }>(`${environment.apiUrl}/hcm/appraisal/getTemplates`, data, { withCredentials: true }).toPromise();
  }
  async getAllAppraisalTemplates() {
    return await this.http.get<AppraisalTemplate[]>(`${environment.apiUrl}/hcm/appraisal/getAllTemplates`, { withCredentials: true }).toPromise();
  }


  // ! Section
  async createSection(data: AppraisalSection) {
    return await this.http.post<AppraisalSection>(`${environment.apiUrl}/hcm/appraisal/section/create`, data, { withCredentials: true }).toPromise();
  }
  async updateSection(input: AppraisalSection) {
    let { id, ...data } = input;
    return await this.http.post<AppraisalSection>(`${environment.apiUrl}/hcm/appraisal/section/update`, { id, data }, { withCredentials: true }).toPromise();
  }
  async getSectionTemplates() {
    return await this.http.get<AppraisalSection[]>(`${environment.apiUrl}/hcm/appraisal/section/templates`, { withCredentials: true }).toPromise();
  }

  // ! Blocks
  async createBlock(data: SectionBlock) {
    return await this.http.post<SectionBlock>(`${environment.apiUrl}/hcm/appraisal/block/create`, data, { withCredentials: true }).toPromise();
  }
  async updateBlock(data: SectionBlock) {
    try {
      return await this.http.post<SectionBlock>(`${environment.apiUrl}/hcm/appraisal/block/update`,
        { id: data.id, data },
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }
  async deleteBlock(id: number) {
    try {
      return await this.http.delete(`${environment.apiUrl}/hcm/appraisal/block/delete/${id}`, { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }

  async deletSection(id: number) {
    try {
      return await this.http.delete(`${environment.apiUrl}/hcm/appraisal/Section/delete/${id}`, { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }
  async getBlockTemplates() {
    return await this.http.get<SectionBlock[]>(`${environment.apiUrl}/hcm/appraisal/block/templates`, { withCredentials: true }).toPromise();
  }

  // !approvals
  async createApproval(data: AppraisalApproval) {
    return await this.http.post<AppraisalApproval>(`${environment.apiUrl}/hcm/appraisal/approval/create`, data, { withCredentials: true }).toPromise();
  }


  
  async updateApproval(data: AppraisalApproval) {
    try {
      return await this.http.post<AppraisalApproval>(`${environment.apiUrl}/hcm/appraisal/approval/update`,
        { id: data.byID, data },
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }
  async deleteApproval(id: number) {
    try {
      return await this.http.delete(`${environment.apiUrl}/hcm/appraisal/approval/delete/${id}`, { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Schedule.TimeSlot.Errors.Add', 'Operations.Ok', true)
    }
  }

  // ! Dashboard
  async getDashboard() {
    return await this.http.get<{
      byYearStatus?: {
        year: number,
        count: number,
        maxAppraiser: number,
        maxCount: number,
        statuses: { status: string, count: number }[],
        appraisers: {
          appraiserID: number,
          count: number,
        }
      }[],
      appraisers: Employee[]
    }>(`${environment.apiUrl}/hcm/appraisal/counts`, { withCredentials: true }).toPromise();
  }
}
