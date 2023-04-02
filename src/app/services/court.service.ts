import { filter } from 'rxjs/operators';
import { CaseType, Client, DelayReson, Request, CaseRequest, Company, Case, Claim, Court, CourtRoom, Session, Fees, payment, Charge, Invoice, Document, ChargeType, Announcement, Appointment, Opponent } from './../interfaces/types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination } from '../interfaces/commen-interfaces';

import { AppService } from './app.service';
@Injectable({
  providedIn: 'root'
})
export class CourtService {
  types = new BehaviorSubject<CaseType[]>([])
  ChargeType = new BehaviorSubject<ChargeType[]>([])
  delayResons = new BehaviorSubject<DelayReson[]>([])
  requests = new BehaviorSubject<Request[]>([])
  Clients = new BehaviorSubject<Client[]>([])
  Cases = new BehaviorSubject<Case[]>([])
  Courts = new BehaviorSubject<Court[]>([])
  CourtRooms = new BehaviorSubject<CourtRoom[]>([])
  Sessions = new BehaviorSubject<Session[]>([])
  Fees = new BehaviorSubject<Fees[]>([])
  payment = new BehaviorSubject<payment[]>([])
  Charge = new BehaviorSubject<Charge[]>([])
  Document=new BehaviorSubject<Document[]>([])
  Claim=new BehaviorSubject<Claim[]>([])


  Companies = new BehaviorSubject<Company[]>([])
  constructor(public http: HttpClient,
    private app: AppService,) { }
 
    async addCharge(data: Fees) {
      try {
        let Charge = await this.http.post<Charge>(`${environment.apiUrl}/court/addCharge/`,
          data,
          { withCredentials: true }).toPromise();
          Charge ? this.Charge.next([...this.Charge.value, Charge]) : null;
        return Charge;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }

    async getAllCharges() {
      let ts = await this.http.get<Charge[]>(`${environment.apiUrl}/court/getAllCharges`, { withCredentials: true }).toPromise();
      return ts;
    }  
    async getFilteredSessions(filter: any) {

      return await this.http.post<Session[]>(`${environment.apiUrl}/court/getFilteredSessions/`,filter,
          { withCredentials: true }).toPromise();
      
    }

    async getOneCharge(id: number) {
      let ts = await this.http.get<Charge>(`${environment.apiUrl}/court/getOneCharge/${id}`, { withCredentials: true }).toPromise();
      return ts;
    }
    async getOneChargeType(id: number) {
      let ts = await this.http.get<ChargeType>(`${environment.apiUrl}/court/getOneChargeType/${id}`, { withCredentials: true }).toPromise();
      return ts;
    }

    async updateCharge(data: Charge) {
      try {
        return await this.http.post<Charge>(`${environment.apiUrl}/court/updateCharge`, data ,
          { withCredentials: true }).toPromise();
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
    async deleteCharge(id: number) {
      let ts = await this.http.post<Charge>(`${environment.apiUrl}/court/deleteCharge`, { id }, { withCredentials: true }).toPromise();
      return ts;
    }
    async getRealtionTypeCases(filter: any) {
      let ts = await this.http.post<Case[]>(`${environment.apiUrl}/court/getRealtionTypeCases/`, filter, { withCredentials: true }).toPromise();
      return ts;
    }
    async addpaymentcharge(data: Fees) {
      try {
        let payment = await this.http.post<payment>(`${environment.apiUrl}/court/addpaymentcharge/`,
          data,
          { withCredentials: true }).toPromise();
          payment ? this.payment.next([...this.payment.value, payment]) : null;
        return payment;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
    async getLastPayment(id: any) {
      return await this.http.get<payment>(`${environment.apiUrl}/court/getLastPayment/${id}`, { withCredentials: true }).toPromise();
    }
    async getPayment(id: any) {
      return await this.http.get<payment>(`${environment.apiUrl}/court/getPayment/${id}`, { withCredentials: true }).toPromise();
    }
    async addfees(data: Fees) {
      try {
        let Fees = await this.http.post<Fees>(`${environment.apiUrl}/court/addfees/`,
          data,
          { withCredentials: true }).toPromise();
          Fees ? this.Fees.next([...this.Fees.value, Fees]) : null;
        return Fees;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
    
    async Updatefees(data: Fees) {
      try {
        let Fees = await this.http.post<Fees>(`${environment.apiUrl}/court/Updatefees/`,
          data,
          { withCredentials: true }).toPromise();
          Fees ? this.Fees.next([...this.Fees.value, Fees]) : null;
        return Fees;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
    async addpayment(data: Fees) {
      try {
        let payment = await this.http.post<payment>(`${environment.apiUrl}/court/addpayment/`,
          data,
          { withCredentials: true }).toPromise();
          payment ? this.payment.next([...this.payment.value, payment]) : null;
        return payment;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
    

    //caseType
    async getAllCaseType() {
    let ts = await this.http.get<CaseType[]>(`${environment.apiUrl}/court/getAllCaseType`, { withCredentials: true }).toPromise();
    this.types.next(ts);
    return ts;
  }  
  async createCaseType(data: CaseType) {
    try {
      let type = await this.http.post<CaseType>(`${environment.apiUrl}/court/createCaseType/`,
        data,
        { withCredentials: true }).toPromise();
      type ? this.types.next([...this.types.value, type]) : null;
      return type;
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }

  ​
  async updateCaseType(data: CaseType) {
    console.log(data);
    try {
      return await this.http.post<CaseType>(`${environment.apiUrl}/court/updateCaseType`, data ,
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }
​
  async deleteCaseType(id: number) {
    console.log("delete" + id);
    let ts = await this.http.post<CaseType>(`${environment.apiUrl}/court/deleteCaseType`, { id }, { withCredentials: true }).toPromise();
    //this.getAllClients();
    return ts;
  }
  
  
    //DelayReson

  async getDelayReson() {
    let ts = await this.http.get<DelayReson[]>(`${environment.apiUrl}/court/getDelayReson`, { withCredentials: true }).toPromise();
    this.delayResons.next(ts);
    return ts;
  }


  async updateDelayReason(data: DelayReson) {
    console.log(data);
    try {
      return await this.http.post<DelayReson>(`${environment.apiUrl}/court/updateDelayReason`, data ,
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }
​
  async deleteDelayReason(id: number) {
    console.log(id);
    let ts = await this.http.post<DelayReson>(`${environment.apiUrl}/court/deleteDelayReason`, { id }, { withCredentials: true }).toPromise();
    //this.getAllClients();
    return ts;
  }
  async createDelayReson(data: DelayReson) {

    try {
      let delayReson = await this.http.post<DelayReson>(`${environment.apiUrl}/court/createDelayReson/`,
        data,
        { withCredentials: true }).toPromise();
      delayReson ? this.delayResons.next([...this.delayResons.value, delayReson]) : null;
      return delayReson;
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }

  
//Requests
  async getRequests() {
    let ts = await this.http.get<Request[]>(`${environment.apiUrl}/court/getRequests`, { withCredentials: true }).toPromise();
    this.requests.next(ts);
    return ts;
  }


  async createRequest(data: Request) {

    try {
      let request = await this.http.post<Request>(`${environment.apiUrl}/court/createRequest/`,
        data,
        { withCredentials: true }).toPromise();
        request ? this.requests.next([...this.requests.value, request]) : null;
      return request;
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }
  
  async updateRequest(data: Request) {
    console.log(data);
    try {
      return await this.http.post<Request>(`${environment.apiUrl}/court/updateRequest`, data ,
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }
​
  async deleteRequest(id: number) {
    console.log(id);
    let ts = await this.http.post<Request>(`${environment.apiUrl}/court/deleteRequest`, { id }, { withCredentials: true }).toPromise();
    //this.getAllClients();
    return ts;
  }
  
  //client 


  async SearchForClient(data: {
    serach: string
  }) {

  return await this.http.post<{
      result: Client[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/SearchForClient`, data, { withCredentials: true }).toPromise();
  }

  
  async searchforCase(data: {
    serach: string,
    filter:any

  }) {

  return await this.http.post<{
      result: Case[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/searchforCase`, data, { withCredentials: true }).toPromise();
  }
  
  async searchforSession(data: {
    serach: string,
    CaseID:number

  }) {

  return await this.http.post<{
      result: Session[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/searchforSession`, data, { withCredentials: true }).toPromise();
  }

  async getAllClientsWithPagination(data: {
    paginate: Pagination
  }) {
  return await this.http.post<{
      result: Client[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/getAllClientsWithPagination`, data, { withCredentials: true }).toPromise();
  }
  async getAllSessionsWithPagination(data: {
    paginate: Pagination
  }) {
  return await this.http.post<{
      result: Session[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/getAllSessionsWithPagination`, data, { withCredentials: true }).toPromise();
  }

  async getAllCaseSessionsWithPagination(data: {
    paginate: Pagination,
    caseID:number
  }) {
  return await this.http.post<{
      result: Session[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/getAllCaseSessionsWithPagination`, data, { withCredentials: true }).toPromise();
  }

  async getAllClientCaseWithPagination(data: {
    paginate: Pagination,
    clientID:number
  }) {
  return await this.http.post<{
      result: Case[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/getAllClientCaseWithPagination`, data, { withCredentials: true }).toPromise();
  }
  
  async getAllCompanyCaseWithPagination(data: {
    paginate: Pagination,
    CompanyID:number
  }) {
  return await this.http.post<{
      result: Case[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/getAllCompanyCaseWithPagination`, data, { withCredentials: true }).toPromise();
  }
  async getAllcasesWithPagination(data: {
    paginate: Pagination
  }) {

    console.log("data")

    console.log(data)
  return await this.http.post<{
      result: Case[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/getAllcasesWithPagination`, data, { withCredentials: true }).toPromise();
  }
  async getRelatedCases(data: {
    paginate: Pagination,
    id:number
  }) {

    console.log("data")

    console.log(data)
  return await this.http.post<{
      result: Case[],
      count?: number,
      paginate: Pagination,
    }>(`${environment.apiUrl}/court/getRelatedCases`, data, { withCredentials: true }).toPromise();
  }


  async getAllClients() {
    let ts = await this.http.get<Client[]>(`${environment.apiUrl}/court/getAllClients`, { withCredentials: true }).toPromise();
    this.Clients.next(ts);
    return ts;
  }

  async createClient(data: Client) {

    try {
      let client = await this.http.post<Client>(`${environment.apiUrl}/court/createClient/`,
        data,
        { withCredentials: true }).toPromise();
        client ? this.Clients.next([...this.Clients.value, client]) : null;
      return client;
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }

  async updateClient(data: Client) {
    console.log('log og service')
    console.log(data)

    
    try {
      return await this.http.post<Client>(`${environment.apiUrl}/court/updateClient`, data ,
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }


  }

  async getCasePayment(id: number) {
    let ts = await this.http.get<payment>(`${environment.apiUrl}/court/getCasePayment/${id}`, { withCredentials: true }).toPromise();
    return ts;
  }



  async getOneClient(id: number) {
    let ts = await this.http.get<Client>(`${environment.apiUrl}/court/getOneClient/${id}`, { withCredentials: true }).toPromise();
    this.getAllClients();
    return ts;
  }

  async deleteClient(id: number) {
    let ts = await this.http.post<Client>(`${environment.apiUrl}/court/deleteClient`, { id }, { withCredentials: true }).toPromise();
    this.getAllClients();
    return ts;
  }

  async getAllcompanies() {
    let ts = await this.http.get<Company[]>(`${environment.apiUrl}/court/getAllcompanies`, { withCredentials: true }).toPromise();
    this.Companies.next(ts);
    return ts;
  }

  async createcompany(data: Company) {

    try {
      let Company = await this.http.post<Company>(`${environment.apiUrl}/court/createcompany/`,
        data,
        { withCredentials: true }).toPromise();
        Company ? this.Clients.next([...this.Companies.value, Company]) : null;
      return Company;
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }

  async updateCompany(data: Company) {
    try {
      return await this.http.post<Company>(`${environment.apiUrl}/court/updateCompany`,data,
        { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }

  async getOneCompany(id: number) {
    let ts = await this.http.get<Company>(`${environment.apiUrl}/court/getOneCompany/${id}`, { withCredentials: true }).toPromise();
    this.getAllcompanies();
    return ts;
  }

  async deleteCompany(id: number) {
    let ts = await this.http.post<Company>(`${environment.apiUrl}/court/deleteCompany`, { id }, { withCredentials: true }).toPromise();
    this.getAllcompanies();
    return ts;
  }
//cases 
async getAllCases() {
  let ts = await this.http.get<Case[]>(`${environment.apiUrl}/court/getAllCases`, { withCredentials: true }).toPromise();
  this.Cases.next(ts);
  return ts;
}

//cases 
async getCaseForList() {
  let ts = await this.http.get<Case[]>(`${environment.apiUrl}/court/getCaseForList`, { withCredentials: true }).toPromise();
  this.Cases.next(ts);
  return ts;
}

async getOpponentForList() {
  let ts = await this.http.get<Opponent[]>(`${environment.apiUrl}/court/getOpponentForList`, { withCredentials: true }).toPromise();
  return ts;
}
async getClientForList() {
  let ts = await this.http.get<Client[]>(`${environment.apiUrl}/court/getClientForList`, { withCredentials: true }).toPromise();
  this.Clients.next(ts);
  return ts;
}
async getOnecase(id: number) {
  let ts = await this.http.get<Case>(`${environment.apiUrl}/court/getOnecase/${id}`, { withCredentials: true }).toPromise();
  this.getAllCases();
  return ts;
}
async createCase(data: Case) {

  try {
    let Case = await this.http.post<Case>(`${environment.apiUrl}/court/createCase/`,
      data,
      { withCredentials: true }).toPromise();
      Case ? this.Cases.next([...this.Cases.value, Case]) : null;
    return Case;
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async deleteCase(id: number) {
  let ts = await this.http.post<Case>(`${environment.apiUrl}/court/deleteCase`, { id }, { withCredentials: true }).toPromise();
  this.getAllCases();
  return ts;
}


async updateCase(data: Case) {
  try {
    return await this.http.post<Case>(`${environment.apiUrl}/court/updateCase`,data,
      { withCredentials: true }).toPromise();
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}

async getClientLastCase(id: number) {
  let ts = await this.http.get<Case>(`${environment.apiUrl}/court/getClientLastCase/${id}`, { withCredentials: true }).toPromise();
  return ts;
}


//court


async getAllCourts() {
  let ts = await this.http.get<Court[]>(`${environment.apiUrl}/court/getAllCourts`, { withCredentials: true }).toPromise();
  this.Courts.next(ts);
  return ts;
}

async getOnecourt(id: number) {
  let ts = await this.http.get<Court>(`${environment.apiUrl}/court/getOnecourt/${id}`, { withCredentials: true }).toPromise();
  this.getAllCourts();
  return ts;
}

async getCaseForClient(id: number) {
  let ts = await this.http.get<Case[]>(`${environment.apiUrl}/court/getCaseForClient/${id}`, { withCredentials: true }).toPromise();
  this.getAllCourts();
  return ts;
}

async createCourt(data: Court) {

  try {
    let Court = await this.http.post<Court>(`${environment.apiUrl}/court/createCourt/`,
      data,
      { withCredentials: true }).toPromise();
      Court ? this.Cases.next([...this.Courts.value, Court]) : null;
    return Court;
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async deleteCourt(id: number) {
  let ts = await this.http.post<Court>(`${environment.apiUrl}/court/deleteCourt`, { id }, { withCredentials: true }).toPromise();
  this.getAllCourts();
  return ts;
}


async updateCourt(data: Court) {
  try {
    return await this.http.post<Case>(`${environment.apiUrl}/court/updateCourt`,data,
      { withCredentials: true }).toPromise();
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}

//court room 
async getAllCourtRooms() {
  let ts = await this.http.get<CourtRoom[]>(`${environment.apiUrl}/court/getAllCourtRooms`, { withCredentials: true }).toPromise();
  this.CourtRooms.next(ts);
  return ts;
}

async getOneCourtRoom(id: number) {
  let ts = await this.http.get<CourtRoom>(`${environment.apiUrl}/court/getOneCourtRoom/${id}`, { withCredentials: true }).toPromise();
  this.getAllCourtRooms();
  return ts;
}
async createCourtRoom(data: CourtRoom) {

  try {
    let CourtRoom = await this.http.post<CourtRoom>(`${environment.apiUrl}/court/createCourtRoom/`,
      data,
      { withCredentials: true }).toPromise();
      CourtRoom ? this.CourtRooms.next([...this.CourtRooms.value, CourtRoom]) : null;
    return CourtRoom;
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async deleteCourtRoom(id: number) {
  let ts = await this.http.post<CourtRoom>(`${environment.apiUrl}/court/deleteCourtRoom`, { id }, { withCredentials: true }).toPromise();
  this.getAllCourtRooms();
  return ts;
}


async updateCourtRooms(data: CourtRoom) {
  try {
    return await this.http.post<CourtRoom>(`${environment.apiUrl}/court/updateCourtRoom`,data,
      { withCredentials: true }).toPromise();
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
//session 

async getAllSessions() {
  let ts = await this.http.get<Session[]>(`${environment.apiUrl}/court/getAllSessions`, { withCredentials: true }).toPromise();
  this.Sessions.next(ts);
  return ts;
}

async getOneSession(id: number) {
  let ts = await this.http.get<Session>(`${environment.apiUrl}/court/getOneSession/${id}`, { withCredentials: true }).toPromise();
  this.getAllSessions();
  return ts;
}
async createSession(data: Session) {

  try {
    let Session = await this.http.post<Session>(`${environment.apiUrl}/court/createSession/`,
      data,
      { withCredentials: true }).toPromise();
      Session ? this.CourtRooms.next([...this.Sessions.value, Session]) : null;
    return Session;
  } catch (e) {
   // await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async deleteSession(id: number) {
  let ts = await this.http.post<Session>(`${environment.apiUrl}/court/deleteSession`, { id }, { withCredentials: true }).toPromise();
  this.getAllSessions();
  return ts;
}


async updateSession(data: Session) {
  try {
    return await this.http.post<Session>(`${environment.apiUrl}/court/updateSession`,data,
      { withCredentials: true }).toPromise();
  } catch (e) {
   // await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}

async getLawfulSessions(filter: any) {

  return await this.http.post<Session[]>(`${environment.apiUrl}/court/getLawfulSessions/`,filter,
      { withCredentials: true }).toPromise();
  
}

async getNotLawfulSessions(filter: any) {

  return await this.http.post<Session[]>(`${environment.apiUrl}/court/getNotLawfulSessions/`,filter,
      { withCredentials: true }).toPromise();
  
}

  async getMySessions(date) {
    return await this.http.post<Session[]>(`${environment.apiUrl}/court/getMySessions/`, {date},
    { withCredentials: true }).toPromise();
  }

  async CountMySessionsToday(filter: any) {
    return await this.http.post<Number>(`${environment.apiUrl}/court/CountMySessionsToday/`,filter,
    { withCredentials: true }).toPromise();
  }


async uploadCaseDocument(File) {
  let formData = new FormData();
  formData.append('File', File, File.name);
  return await this.http.post<{
    "fieldname": string,
    "originalname": string,
    "encoding": string,
    "mimetype": string,
    "destination": string,
    "filename": string,
    "path": string,
    "size": number
  }>(`${environment.apiUrl}/storage/uploadCaseDocument`, formData).toPromise();
}

async getCaseInvoice(id: number) {
  let res = await this.http.post<Invoice>(`${environment.apiUrl}/court/getCaseInvoice/`, { id }, { withCredentials: true }).toPromise();
  return res;
}

async generateReport(data: any) {
  let res = await this.http.post<[]>(`${environment.apiUrl}/court/generateReport/`, { data }, { withCredentials: true }).toPromise();
  return res;
}


async addDocuments(data: Document) {

  try {
    let Document = await this.http.post<Document>(`${environment.apiUrl}/court/addDocuments/`,
      data,
      { withCredentials: true }).toPromise();
      Document ? this.Document.next([...this.Document.value, Document]) : null;
    return Document;
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async deleteDocument(id: number) {
  let ts = await this.http.post<Document>(`${environment.apiUrl}/court/deleteDocument`, { id }, { withCredentials: true }).toPromise();
  this.getAllSessions();
  return ts;
}


async UpdateDocuments(data: Document) {
  try {
    return await this.http.post<Document>(`${environment.apiUrl}/court/UpdateDocuments`,data,
      { withCredentials: true }).toPromise();
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}

//Claims
async addClaim(data: Claim) {
  try {
    let Claim = await this.http.post<Claim>(`${environment.apiUrl}/court/addClaim/`,
      data,
      { withCredentials: true }).toPromise();
      //Claim ? this.Claim.next([...this.Claim.value, Claim]) : null;
    return Claim;
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async UpdateClaim(data: Claim) {
  try {
    let Claim = await this.http.post<Claim>(`${environment.apiUrl}/court/UpdateClaim/`,
      data,
      { withCredentials: true }).toPromise();
      //Claim ? this.Claim.next([...this.Claim.value, Claim]) : null;
    return Claim;
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async getClaimPayment(id: number) {
  let ts = await this.http.get<payment>(`${environment.apiUrl}/court/getClaimPayment/${id}`, { withCredentials: true }).toPromise();
  return ts;
}
async getClaim(id: number) {
  let ts = await this.http.get<Claim>(`${environment.apiUrl}/court/getClaim/${id}`, { withCredentials: true }).toPromise();
  return ts;
}
async addClaimPayment(data: payment) {
  try {
    let payment = await this.http.post<payment>(`${environment.apiUrl}/court/addClaimPayment/`,
      data,
      { withCredentials: true }).toPromise();
      payment ? this.payment.next([...this.payment.value, payment]) : null;
    return payment;
  } catch (e) {
    await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
  }
}
async deleteClaimPayment(id: number) {
  let ts = await this.http.post<Claim>(`${environment.apiUrl}/court/deleteClaimPayment`, { id }, { withCredentials: true }).toPromise();
  return ts;
}



    //chargeType
    async getAllChargeTypes() {
      let ts = await this.http.get<ChargeType[]>(`${environment.apiUrl}/court/getAllChargeTypes`, { withCredentials: true }).toPromise();
      this.ChargeType.next(ts);
      return ts;
    }  
    async createChargeTypes(data: ChargeType) {
      try {
        let type = await this.http.post<ChargeType>(`${environment.apiUrl}/court/createChargeTypes/`,
          data,
          { withCredentials: true }).toPromise();
        type ? this.ChargeType.next([...this.ChargeType.value, type]) : null;
        return type;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
  
    ​
    async updateChargeTypes(data: ChargeType) {
      console.log(data);
      try {
        return await this.http.post<ChargeType>(`${environment.apiUrl}/court/updateChargeTypes`, data ,
          { withCredentials: true }).toPromise();
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
  ​
    async deleteChargeTypes(id: number) {
      console.log("delete" + id);
      let ts = await this.http.post<ChargeType>(`${environment.apiUrl}/court/deleteChargeTypes`, { id }, { withCredentials: true }).toPromise();
      //this.getAllClients();
      return ts;
    }

    async CreateCaseRequest(data: any) {
      try {
        let request = await this.http.post<any>(`${environment.apiUrl}/court/CreateCaseRequest/`,
          data,
          { withCredentials: true }).toPromise();
        return request;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }
    async UpdateCaseRequest(data: any) {
      try {
        let request = await this.http.post<any>(`${environment.apiUrl}/court/UpdateCaseRequest/`,
          data,
          { withCredentials: true }).toPromise();
        return request;
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }

    async getAllCaseRequests(caseID: number) {
      let ts = await this.http.get<CaseRequest[]>(`${environment.apiUrl}/court/getAllCaseRequests/${caseID}`, { withCredentials: true }).toPromise();
      return ts;
    }
    
    async deleteCaseRequest(id: number) {
      let ts = await this.http.post<Charge>(`${environment.apiUrl}/court/deleteCaseRequest`, { id }, { withCredentials: true }).toPromise();
      return ts;
    }

    async CountActiveSessions() {
      let ts = await this.http.get<Number>(`${environment.apiUrl}/court/CountActiveSessions`, { withCredentials: true }).toPromise();
      return ts;
    }

    async CountActiveCases() {
      let ts = await this.http.get<Number>(`${environment.apiUrl}/court/CountActiveCases`, { withCredentials: true }).toPromise();
      return ts;
    }

    async createAnnouncement(data: Announcement) {
      try {
        return await this.http.post<Announcement>(`${environment.apiUrl}/court/createAnnouncement/`,
          data,
          { withCredentials: true }).toPromise();
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }

    async getAllAnnouncements(filter) {
      return await this.http.post<Announcement[]>(`${environment.apiUrl}/court/getAllAnnouncements`, filter, { withCredentials: true }).toPromise();
    }

    async getOneAnnouncement(id: number) {
      return await this.http.get<Announcement>(`${environment.apiUrl}/court/getOneAnnouncement/${id}`, { withCredentials: true }).toPromise();
    }

    async deleteAnnouncement(id: number) {
      return await this.http.post<Announcement>(`${environment.apiUrl}/court/deleteAnnouncement`, { id }, { withCredentials: true }).toPromise();
    }

    async uploadAnnouncementImage(File) {
      let formData = new FormData();
      formData.append('File', File, File.name);
      return await this.http.post<{
        "fieldname": string,
        "originalname": string,
        "encoding": string,
        "mimetype": string,
        "destination": string,
        "filename": string,
        "path": string,
        "size": number
      }>(`${environment.apiUrl}/storage/uploadAnnouncementImage`, formData).toPromise();
    }

    async uploadAnnouncementDocument(File) {
      let formData = new FormData();
      formData.append('File', File, File.name);
      return await this.http.post<{
        "fieldname": string,
        "originalname": string,
        "encoding": string,
        "mimetype": string,
        "destination": string,
        "filename": string,
        "path": string,
        "size": number
      }>(`${environment.apiUrl}/storage/uploadAnnouncementDocument`, formData).toPromise();
    }

    async getCurrentAnnouncement(current_date: Date) {
      return await this.http.post<Announcement>(`${environment.apiUrl}/court/getCurrentAnnouncement`,{current_date},
          { withCredentials: true }).toPromise();
    }

    getAnnouncementPicURL(pic: string) {
      if (pic && pic != '' && pic != 'null') {
        return `${environment.storageURL}/public/uploads/images/announcement/${pic}`;
      }
    }

    async updateAnnouncement(data: any) {
      try {
        return await this.http.post<Announcement>(`${environment.apiUrl}/court/updateAnnouncement`, data ,
          { withCredentials: true }).toPromise();
      } catch (e) {
        await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
      }
    }

    async checkClientAppointment(cpr: number) {
      return await this.http.get<Appointment>(`${environment.apiUrl}/court/checkClientAppointment/${cpr}`, { withCredentials: true }).toPromise();
    }

    async getClientAppointments(id: number) {
      return await this.http.get<Appointment[]>(`${environment.apiUrl}/court/getClientAppointments/${id}`, { withCredentials: true }).toPromise();
    }

    async GetOpponent(cpr: number) {
      return await this.http.get<Opponent>(`${environment.apiUrl}/court/GetOpponent/${cpr}`, { withCredentials: true }).toPromise();
    }
    
    async GetOpponentbyname(name: string) {
      return await this.http.get<Opponent>(`${environment.apiUrl}/court/GetOpponentbyname/${name}`, { withCredentials: true }).toPromise();
    }

    async GetClientID(id: number) {
      return await this.http.get<Client>(`${environment.apiUrl}/court/GetClientID/${id}`, { withCredentials: true }).toPromise();
    }

    async GetCompanyID(id: number) {
      return await this.http.get<Company>(`${environment.apiUrl}/court/GetCompanyID/${id}`, { withCredentials: true }).toPromise();
    }

    async getCaseForClientList(id: number) {
      let ts = await this.http.get<Case[]>(`${environment.apiUrl}/court/getCaseForClientList/${id}`, { withCredentials: true }).toPromise();
      return ts;
    }

    async getCaseForCompanyList(id: number) {
      let ts = await this.http.get<Case[]>(`${environment.apiUrl}/court/getCaseForCompanyList/${id}`, { withCredentials: true }).toPromise();
      return ts;
    }

    async getCompanyForList() {
      return await this.http.get<Company[]>(`${environment.apiUrl}/court/getCompanyForList`, { withCredentials: true }).toPromise();
    }
}

