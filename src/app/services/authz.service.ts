import { Pagination } from './../interfaces/commen-interfaces';
import { EmergencyContactComponent } from './../components/personal-information/emergency-contact/emergency-contact.component';
import { Address, Contact, EmergencyContact, PersonalInformation, Designation, VacancyApplication, Department, LeaveType, Leave, Deduction, Allowance, Bonus, Leave_balance, Holiday, employee_request } from './../interfaces/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, concat } from 'rxjs';
import { environment } from "../../environments/environment";
import { AuthService } from '../auth/auth.service';
import { Action, Group, Permission, Role, Subject, User, Employee, Certificate, Experience, Education, Vacancy, PaySlip, EmployeeContract } from '../interfaces/types';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthzService {
  certificate: BehaviorSubject<Certificate[]> = new BehaviorSubject<Certificate[]>([]);
  experience: BehaviorSubject<Experience[]> = new BehaviorSubject<Experience[]>([]);
  education: BehaviorSubject<Education[]> = new BehaviorSubject<Education[]>([]);
  permissions: BehaviorSubject<Permission[]> = new BehaviorSubject<Permission[]>([]);
  employee: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  groups: BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  designations: BehaviorSubject<Designation[]> = new BehaviorSubject<Role[]>([]);
  vacancy: BehaviorSubject<Vacancy[]> = new BehaviorSubject<Vacancy[]>([]);
  department: BehaviorSubject<Department[]> = new BehaviorSubject<Vacancy[]>([]);
  LeaveType: BehaviorSubject<LeaveType[]> = new BehaviorSubject<LeaveType[]>([]);
  Leave: BehaviorSubject<Leave[]> = new BehaviorSubject<Leave[]>([]);
  Deductions: BehaviorSubject<Deduction[]> = new BehaviorSubject<Deduction[]>([]);
  Allowances: BehaviorSubject<Allowance[]> = new BehaviorSubject<Allowance[]>([]);
  Bonus: BehaviorSubject<Bonus[]> = new BehaviorSubject<Bonus[]>([]);
  PaySlip: BehaviorSubject<PaySlip[]> = new BehaviorSubject<PaySlip[]>([]);




  userAuthz: { actions: string[], permissions: any }[] = [];
  userAuthzSub: BehaviorSubject<{ actions: string[], permissions: Permission[] }[]> = new BehaviorSubject<{ actions: string[], permissions: Permission[] }[]>([]);
  constructor(public http: HttpClient, private auth: AuthService, private app: AppService) {
    this.auth.userJWT.subscribe(data => {
      this.userAuthz = [];
      this.userAuthzSub.next(null);
      if (data && data.permissions) {
        this.calculatePermissions(data.permissions)
      }
    });
  }

  async getAll() {
    await this.getAllGroups()
    await this.getAllRoles()
    await this.getAllPermissions()
    await this.getAllUsers();
  }

  async getAlldesignation() {
    let res = await this.http.get<Designation[]>(`${environment.apiUrl}/authz/designation`).toPromise();
    this.designations.next(res);
    return res;
  }

  // ! Roloes
  async getAllRoles() {
    let res = await this.http.get<Role[]>(`${environment.apiUrl}/authz/roles`).toPromise();
    this.roles.next(res);
    return res;
  }
  async getRole(id: number) {
    return await this.http.get<Role>(`${environment.apiUrl}/authz/role/${id}`).toPromise();
  }
  async addRole(data: Role) {
    let res = await this.http.post<Role>(`${environment.apiUrl}/authz/role/`, data, { withCredentials: true }).toPromise();
    await this.getAllRoles()
    return res;
  }

  // ! Groups
  async getAllGroups() {
    let res = await this.http.get<Group[]>(`${environment.apiUrl}/group/all`).toPromise();
    this.groups.next(res);
    return res;
  }

  async getGroup(id: number) {
    return await this.http.get<Group>(`${environment.apiUrl}/group/get/${id}`).toPromise();
  }

  async addGroup(data: Group) {
    let res = await this.http.post<Group>(`${environment.apiUrl}/group/create`, data, { withCredentials: true }).toPromise();
    await this.getAllGroups();
    return res;
  }

  // ! Permissions
  async getAllPermissions() {
    let res = await this.http.get<Permission[]>(`${environment.apiUrl}/authz/permissions`).toPromise();
    this.permissions.next(res);
    return res;
  }

  async getPermission(id: number) {
    return await this.http.get<Permission>(`${environment.apiUrl}/authz/permission/${id}`).toPromise();
  }

  async addPermission(data: any) {
    data.auth_field == '' ? delete data.auth_field : null;
    let res = await this.http.post<Permission>(`${environment.apiUrl}/authz/permission/`, data, { withCredentials: true }).toPromise();
    await this.getAllPermissions();
    return res;
  }

  // ! Users
  async getAllUsers() {
    
    console.log(environment.apiUrl)
    let res = await this.http.get<User[]>(`${environment.apiUrl}/user/all`).toPromise();
    this.users.next(res);
    return res;
  }
  async getUser(id: number) {
    try {
      return await this.http.get<User>(`${environment.apiUrl}/user/get/${id}`).toPromise();
    } catch (error) {
      console.log(error);

    }
  }
  async addUser(data: {
    roleID: number,
    user: { first_name: string, last_name: string, email: string },
    profile: { bio: string, pictureURL: string },
    designationID: number,
    type: 'emp' | 'cli' | 'none'
  }) {
    try {
      let res = await this.http.post<User>(`${environment.apiUrl}/user/create`, data).toPromise();
      await this.getAllUsers();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async updateUser(data: { userID?: number, first_name: string, last_name: string, bio: string }) {
    let res = await this.http.put<User>(`${environment.apiUrl}/user/update`, data).toPromise();
    await this.getAllUsers();
    return res;
  }

  async activeteUser(userID: number, isActive: boolean) {
    return await this.http.post<User>(`${environment.apiUrl}/auth/activateUser/${userID}/${isActive}`, {}).toPromise();
  }

  async lockUser(userID: number, isLocked: boolean) {
    return await this.http.post<User>(`${environment.apiUrl}/auth/lockUser/${userID}/${isLocked}`, {}).toPromise();
  }


  /*async getallEmployees(data: {
    paginate: Pagination
  }) {
    return this.http.post<{
      result: Employee[], paginate: Pagination, count?: number,
    }>(`${environment.apiUrl}/hcm/employee-managment/getAllEmployee`, data, { withCredentials: true }).toPromise();


  }*/

  async getallEmployees(data: {
    paginate: Pagination
  }) {
    try {
      return this.http.post<Employee[]>(`${environment.apiUrl}/hcm/employee-managment/getAllEmployee`, data, { withCredentials: true }).toPromise();
    } catch (e) {
      await this.app.presentErrorAlert('Operations.Sorry', 'Operations.Errors', 'Operations.Ok', true)
    }
  }

  // ! Authz OP
  async link(data: {
    type: 'permissionToRole' | 'roleToGroup' | 'roleToUser',
    permissionID?: number,
    roleID?: number,
    userID?: number,
    groupID?: number
  }) {
    return await this.http.post<User>(`${environment.apiUrl}/authz/link`, data).toPromise();
  }
  async simulate(data: { userID: number, action: Action, subject: Subject }) {
    return await this.http.post<{ isAuth: boolean }>(`${environment.apiUrl}/authz/simulate`, data).toPromise();
  }

  canAccess(action: Action, subject: Subject): { isAuth: boolean, permission?: Permission } {
    const jwt = this.auth.userJWT.value
    const filtered = jwt.permissions
      .filter(dt => (dt.action == action && dt.subject == subject) || (dt.subject == subject && dt.action == 'MANAGE'))
    if (filtered.length > 0) {
      const mng = filtered.filter(dt => dt.action == "MANAGE");
      if (mng.length > 0) {
        return { isAuth: true, permission: mng[0] };
      } else {
        return { isAuth: true, permission: filtered[0] };
      }
    } else {
      return { isAuth: false };
    }
  }

  canDo(action: Action, subject: Subject, data: any) {
    const jwt = this.auth.userJWT.value;
    let sub = this.userAuthz[subject] as { actions: string[], permissions: Permission[] };
    let permission: Permission;
    if (sub?.actions.includes('MANAGE')) {
      permission = sub.permissions.find(v => v.action == 'MANAGE');
    } else {
      permission = sub?.permissions.find(v => v.action == action);
    }

    // ! If user doesn't have any permission related dont pass
    if (!permission) return false;

    // ! If manage directly pass
    if (permission.action == 'MANAGE') return true;

    let auth_field = permission.auth_field ? permission.auth_field : null;
    // ! If auth field not specified pass
    if (!auth_field) return true;


    // ! If auth field is depends on a single field
    if (auth_field == 'employeeID') {
      return data[auth_field] == jwt[auth_field] || jwt.supervise.includes(data[auth_field])
    }

    if (auth_field == 'clientID') {
      return data['clientID'] == jwt['clientID'];
    }

    if (auth_field == 'groupID') {
      return jwt.groupIDs.includes(data['groupID']);
    }
    if (auth_field == 'userID') {
      return jwt.userID == data['userID'];
    }
  }

  calculatePermissions(perms: any[]) {
    
    this.userAuthz = [];
    for (const perm of perms) {
      if (this.userAuthz[perm.subject]) {
        //console.log("i am in calculate function")

    
        this.userAuthz[perm.subject].actions.push(perm.action)
        this.userAuthz[perm.subject].permissions.push(perm) 
           //console.log(this.userAuthz)
      } else {
        this.userAuthz[perm.subject] = { actions: [perm.action], permissions: [perm] };
      }
    }

    this.userAuthzSub.next(this.userAuthz);
    // console.log(this.userAuthz);

  }

  //deducation 



  async AddAllowance(data: Allowance) {

    try {
      let res = await this.http.post<Allowance>(`${environment.apiUrl}/hcm/employee-managment/AddAllowance/`, data, { withCredentials: true }).toPromise();
      return res;
      //this.Allowances.next(res)
    } catch (error) {
      console.log(error);
    }
  }

  async AddDeduction(data: Deduction) {

    try {
      let res = await this.http.post<Deduction>(`${environment.apiUrl}/hcm/employee-managment/AddDeduction/`, data, { withCredentials: true }).toPromise();
      //this.Deductions.next();

      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async AddBonus(data: Bonus) {

    try {
      let res = await this.http.post<Bonus>(`${environment.apiUrl}/hcm/employee-managment/AddBonus/`, data, { withCredentials: true }).toPromise();
      //this.Deductions.next();

      return res;
    } catch (error) {
      console.log(error);
    }
  }

  //employee

  async getEmployees() {
    let res = await this.http.get<Employee[]>(`${environment.apiUrl}/hcm/employee-managment/getEmployees`).toPromise();
    this.employee.next(res);
    return res;

  }

  async getEmployee(id: number) {
    return await this.http.get<any>(`${environment.apiUrl}/hcm/employee-managment/getEmployee/${id}`).toPromise();
  }
  async getCurrantmployee() {
    return await this.http.get<Employee>(`${environment.apiUrl}/hcm/employee-managment/getCurrantmployee`).toPromise();
  }
  async addEmployee(data: Employee) {

    try {
      let res = await this.http.post<any>(`${environment.apiUrl}/hcm/employee-managment/addEmployee/`, data, { withCredentials: true }).toPromise();
      await this.getEmployees();

      return res;
    } catch (error) {
      console.log(error);
    }
  }
  async updateBank_info(data: any) {

    try {
      let res = await this.http.post<any>(`${environment.apiUrl}/hcm/employee-managment/updateBank_info/`, data, { withCredentials: true }).toPromise();
      await this.getEmployees();

      return res;
    } catch (error) {
      console.log(error);
    }
  }


  async updateEmployee(data: Employee) {
    let res = await this.http.post<Employee>(`${environment.apiUrl}/hcm/employee-managment/updateEmployee/`, data, { withCredentials: true }).toPromise();
    await this.getEmployees();

    return res;
  }

  async deleteEmployee(id: number) {
    let res = await this.http.post<Experience>(`${environment.apiUrl}/hcm/employee-managment/deleteEmployee/`, { id }, { withCredentials: true }).toPromise();
    await this.getEmployees();

    return res;
  }


  //certificate
  async getEmployeeCertificate(id: number) {
    return await this.http.get<Certificate[]>(`${environment.apiUrl}/hcm/employee-managment/getEmployeeCertificate/${id}`).toPromise();

  }

  async getCertificate(id: number) {
    return await this.http.get<Certificate>(`${environment.apiUrl}/hcm/employee-managment/getCertificate/${id}`).toPromise();

  }
  async AddCertificate(data: Certificate) {
    let res = await this.http.post<Certificate>(`${environment.apiUrl}/hcm/employee-managment/AddCertificate/`, data, { withCredentials: true }).toPromise();

    await this.getEmployees();

    return res;

  }

  async updateCertificate(data: Certificate) {

    return await this.http.post<Certificate>(`${environment.apiUrl}/hcm/employee-managment/updateCertificate/`, data, { withCredentials: true }).toPromise();

  }

  async deleteCertificate(id: number) {
    let res = await this.http.post<Certificate>(`${environment.apiUrl}/hcm/employee-managment/deleteCertificate/`, { id }, { withCredentials: true }).toPromise();

    return res;
  }

  //Experience
  async getEmployeeExperience(id: number) {
    return await this.http.get<Experience[]>(`${environment.apiUrl}/hcm/employee-managment/getEmployeeExperience/${id}`).toPromise();

  }
  async AddExperience(data: Experience) {

    return await this.http.post<Experience>(`${environment.apiUrl}/hcm/employee-managment/AddExperience/`, data, { withCredentials: true }).toPromise();

  }
  async updateExperience(data: Experience) {

    return await this.http.post<Experience>(`${environment.apiUrl}/hcm/employee-managment/updateExperience/`, data, { withCredentials: true }).toPromise();


  }
  async deleteExperience(id: number) {
    let res = await this.http.post<Experience>(`${environment.apiUrl}/hcm/employee-managment/deleteExperience/`, { id }, { withCredentials: true }).toPromise();
    return res;
  }


  //Education

  async getEmployeeEducation(id: number) {
    return await this.http.get<Education[]>(`${environment.apiUrl}/hcm/employee-managment/getEmployeeEducation/${id}`).toPromise();

  }

  async getEducation(id: number) {
    return await this.http.get<Education>(`${environment.apiUrl}/hcm/employee-managment/getEducation/${id}`).toPromise();

  }

  async deleteEducation(id: number) {
    let res = await this.http.post<Education>(`${environment.apiUrl}/hcm/employee-managment/deleteEducation/`, { id }, { withCredentials: true }).toPromise();
    return res;
  }

  async AddEducation(data: Education) {

    let res = await this.http.post<Education>(`${environment.apiUrl}/hcm/employee-managment/AddEducation`, data, { withCredentials: true }).toPromise();
    return res;


  }


  async UpdateEducation(data: Education) {

    return await this.http.post<Education>(`${environment.apiUrl}/hcm/employee-managment/UpdateEducation`, data, { withCredentials: true }).toPromise();

  }

  //address

  async Addaddresses(data: Address) {

    return await this.http.post<Address>(`${environment.apiUrl}/hcm/employee-managment/AddAddress`, data, { withCredentials: true }).toPromise();

  }
  async UpdateAddress(data: Address) {

    return await this.http.post<Address>(`${environment.apiUrl}/hcm/employee-managment/UpdateAddress`, data, { withCredentials: true }).toPromise();

  }


  async deleteAddress(id: number) {
    let res = await this.http.post<Address>(`${environment.apiUrl}/hcm/employee-managment/deleteAddress/`, { id }, { withCredentials: true }).toPromise();
    return res;
  }

  //emergency contact



  s
  //em
  async AddEmergencyContact(data: EmergencyContact) {

    return await this.http.post<EmergencyContact>(`${environment.apiUrl}/hcm/employee-managment/AddEmergencyContact`, data, { withCredentials: true }).toPromise();

  }
  async deleteEmergencyContact(id: number) {
    let res = await this.http.post<EmergencyContact>(`${environment.apiUrl}/hcm/employee-managment/deleteEmergencyContact/`, { id }, { withCredentials: true }).toPromise();
    return res;
  }
  //contact

  async UpdateContact(data: Contact) {
    return await this.http.post<Contact>(`${environment.apiUrl}/hcm/employee-managment/UpdateContact/`, data, { withCredentials: true }).toPromise();

  }
  async UpdateEmergencyContact(data: EmergencyContact) {
    return await this.http.post<EmergencyContact>(`${environment.apiUrl}/hcm/employee-managment/UpdateEmergencyContact/`, data, { withCredentials: true }).toPromise();

  }


  async UpdatePersonalInformation(data: PersonalInformation) {
    return await this.http.post<PersonalInformation>(`${environment.apiUrl}/hcm/employee-managment/UpdatePersonalInformation/`, data, { withCredentials: true }).toPromise();



  }

  ///Vacancy

  async getSiteVacancy() {
    let res = await this.http.get<Vacancy[]>(`${environment.apiUrl}/hcm/talant-managment/getSiteVacancy`).toPromise();
    this.vacancy.next(res);
    return res;

  }



  async getAllVacancy() {
    let res = await this.http.get<Vacancy[]>(`${environment.apiUrl}/hcm/talant-managment/getAllVacancy`).toPromise();
    this.vacancy.next(res);
    return res;

  }

  async getVacancy(id: number) {
    return await this.http.get<Vacancy>(`${environment.apiUrl}/hcm/talant-managment/getVacancy/${id}`).toPromise();
  }
  async AddVacancy(data: Employee) {
    let res = await this.http.post<Vacancy>(`${environment.apiUrl}/hcm/talant-managment/AddVacancy/`, data, { withCredentials: true }).toPromise();
    await this.getAllVacancy();

    return res;
  }

  async UpdateVacancy(data: Vacancy) {
    let res = await this.http.post<Vacancy>(`${environment.apiUrl}/hcm/talant-managment/UpdateVacancy/`, data, { withCredentials: true }).toPromise();
    await this.getAllVacancy();

    return res;
  }

  async deleteVacancy(id: number) {
    let res = await this.http.post<Vacancy>(`${environment.apiUrl}/hcm/talant-managment/deleteVacancy/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllVacancy();

    return res;
  }
  //vacancyapplication 

  async AddApplicationVacancy(data: VacancyApplication) {
    let res = await this.http.post<VacancyApplication>(`${environment.apiUrl}/hcm/talant-managment/AddApplicationVacancy/`, data, { withCredentials: true }).toPromise();
    await this.getAllVacancy();

    return res;
  }

  async UpdateVacancyApplication(data: VacancyApplication) {
    let res = await this.http.post<VacancyApplication>(`${environment.apiUrl}/hcm/talant-managment/UpdateVacancyApplication/`, data, { withCredentials: true }).toPromise();

    return res;
  }


  async uploadCoverImage(img) {
    let formData = new FormData();
    formData.append('image', img, img.name);
    return await this.http.post<{
      "fieldname": string,
      "originalname": string,
      "encoding": string,
      "mimetype": string,
      "destination": string,
      "filename": string,
      "path": string,
      "size": number
    }>(`${environment.apiUrl}/storage/uploadCoverImage`, formData).toPromise();
  }




  async changeCoverImage(vacancyID: number, img) {
    let formData = new FormData();
    formData.append('image', img, img.name);
    formData.append('vacancyID', String(vacancyID));
    return await this.http.post<{ isUploaded: boolean }>(`${environment.apiUrl}/storage/changeProfilePicture`, formData).toPromise();
  }
  //department
  async getAllDepartment() {
    let res = await this.http.get<Department[]>(`${environment.apiUrl}/organization/department/getAllDepartment`).toPromise();
    this.department.next(res);
    return res;

  }

  getcoverURL(pic: string) {
    if (pic && pic != '' && pic != 'null') {
      return `${environment.apiUrl}/public/uploads/vacancy/cover-images/${pic}`;
    } else {
      return 'assets/fillers/businessman.png';
    }
  }


  async uploadFile(File) {
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
    }>(`${environment.apiUrl}/storage/uploadDocument`, formData).toPromise();
  }

  //contract 

  async getAllEmployeesContracts() {
    let res = await this.http.get<EmergencyContact[]>(`${environment.apiUrl}/hcm/employee-managment/getAllEmployeesContracts`).toPromise();
    this.employee.next(res);
    return res;
  }

  async getEmployeeContracts(id: number) {
    return await this.http.get<EmployeeContract[]>(`${environment.apiUrl}/hcm/employee-managment/getEmployeeContracts/${id}`).toPromise();
  }

  async getEmployeeCurrentContract(id: number) {
    return await this.http.get<EmployeeContract[]>(`${environment.apiUrl}/hcm/employee-managment/getEmployeeCurrentContract/${id}`).toPromise();
  }

  async AddEmployeeContracts(data: any, deductions: Deduction[], bounces: Bonus[], allowances: Allowance[]) {
    let res = await this.http.post<EmployeeContract>(`${environment.apiUrl}/hcm/employee-managment/AddEmployeeContracts/`, { data: data, deductions, bounces, allowances }, { withCredentials: true }).toPromise();
    await this.getEmployees();
    return res;
  }

  async UpdateEmployeeContract(data: EmployeeContract, deductions: Deduction[], bounces: Bonus[], allowances: Allowance[]) {
    let res = await this.http.post<EmployeeContract>(`${environment.apiUrl}/hcm/employee-managment/UpdateEmployeeContract/`, { data: data, deductions, bounces, allowances }, { withCredentials: true }).toPromise();
    await this.getEmployees();
    return res;
  }

  /*async UpdateEmployeeContract(data: EmployeeContract) {
    let res = await this.http.post<EmployeeContract>(`${environment.apiUrl}/hcm/employee-managment/UpdateEmployeeContract/`, data, { withCredentials: true }).toPromise();
    await this.getEmployees();
    return res;
  }*/

  async deleteEmployeeContract(id: number) {
    let res = await this.http.post<EmployeeContract>(`${environment.apiUrl}/hcm/employee-managment/deleteEmployeeContract/`, { id }, { withCredentials: true }).toPromise();
    await this.getEmployees();
    return res;
  }

  // leaves 
  async getEmptyTypeForEmployee(id: number) {
    return await this.http.get<LeaveType[]>(`${environment.apiUrl}/hcm/workforce/leave/getEmptyTypeForEmployee/${id}`).toPromise();
  }


  async getAllLeaveBalance() {
    return await this.http.get<Leave_balance[]>(`${environment.apiUrl}/hcm/workforce/leave/getAllLeaveBalance`).toPromise();


  }
  async addLeaveBalance(data: Leave_balance) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/leave/addLeaveBalance/`, data, { withCredentials: true }).toPromise();
    await this.getAllLeaves();
    return res;

  }
  async updateLeaveBalance(data: Leave_balance) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/leave/updateLeaveBalance/`, data, { withCredentials: true }).toPromise();
    await this.getAllLeaves();
    return res;

  }


  async deleteLeaveBalance(id: number) {
    let res = await this.http.post<any>(`${environment.apiUrl}//hcm/workforce/leave/deleteLeaveBalance/`, { id }, { withCredentials: true }).toPromise();

    return res;
  }
  async getLeaveTypes() {
    let res = await this.http.get<LeaveType[]>(`${environment.apiUrl}/hcm/workforce/leave/getLeaveTypes`).toPromise();
    this.LeaveType.next(res);
    return res;

  }

  async getAllLeaves() {
    return await this.http.get<Leave[]>(`${environment.apiUrl}/hcm/workforce/leave/getAllLeaves`).toPromise();


  }

  async getAllReportLeaves(data: any) {
    let res = await this.http.post<[]>(`${environment.apiUrl}/hcm/workforce/leave/getAllReportLeaves/`, { data }, { withCredentials: true }).toPromise();
    return res;
  }
  


  async getEmployeeLeave(id: number) {
    return await this.http.get<Leave[]>(`${environment.apiUrl}/hcm/workforce/leave/getEmployeeLeave/${id}`).toPromise();
  }

  async getEmployeeLeaveForPeriod(id: number, fromdate: Date, todate: Date) {
    return await this.http.post<Leave[]>(`${environment.apiUrl}/hcm/workforce/leave/getEmployeeLeave/`, {
      id,
      fromdate,
      todate
    }).toPromise();
  }

  async getEmployeeBalance(id: number) {
    return await this.http.get<Leave_balance[]>(`${environment.apiUrl}/hcm/workforce/leave/getEmployeeBalance/${id}`).toPromise();
  }

  async getEmployeeBalanceForPeriod(id: number, fromdate: Date, todate: Date) {
    return await this.http.post<Leave_balance[]>(`${environment.apiUrl}/hcm/workforce/leave/getEmployeeBalance/`, {
      id,
      fromdate,
      todate
    }).toPromise();
  }

  async AddEmployeeLeaves(data: Leave) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/leave/AddEmployeeLeaves/`, data, { withCredentials: true }).toPromise();
    return res;
  }
  async AddLeaveType(data: LeaveType) {
    let res = await this.http.post<LeaveType>(`${environment.apiUrl}/hcm/workforce/leave/AddLeaveType/`, data, { withCredentials: true }).toPromise();
    await this.getLeaveTypes();
    return res;
  }
  async UpdateLeaveType(data: LeaveType) {
    let res = await this.http.post<LeaveType>(`${environment.apiUrl}/hcm/workforce/leave/UpdateLeaveType/`, data, { withCredentials: true }).toPromise();
    await this.getLeaveTypes();
    return res;
  }

  async UpdateEmployeeLeave(data: Leave) {
    let res = await this.http.post<any>(`${environment.apiUrl}/hcm/workforce/leave/UpdateEmployeeLeave/`, data, { withCredentials: true }).toPromise();
    await this.getAllLeaves();
    return res;
  }


  async deleteLeaveType(id: number) {
    let res = await this.http.post<LeaveType>(`${environment.apiUrl}/hcm/workforce/leave/deleteLeaveType/`, { id }, { withCredentials: true }).toPromise();
    await this.getLeaveTypes();

    return res;
  }

  async deleteEmployeeLeave(id: number) {
    let res = await this.http.post<Leave>(`${environment.apiUrl}/hcm/workforce/leave/deleteEmployeeLeave/`, { id }, { withCredentials: true }).toPromise();
    await this.getLeaveTypes();
    return res;
  }

  async UpdateEmployeeLeaveStatus(id: number, approval: boolean) {
    let res = await this.http.post<Leave>(`${environment.apiUrl}/hcm/workforce/leave/UpdateEmployeeLeaveStatus/`, { id, approval }, { withCredentials: true }).toPromise();
    await this.getAllLeaves();
    return res;
  }

  async UpdateVacancystatus(id: number, status: string) {
    let res = await this.http.post<Leave>(`${environment.apiUrl}/hcm/talant-managment/UpdateVacancystatus/`, { id, status }, { withCredentials: true }).toPromise();
    //await this.getSiteVacancy();
    return res;
  }





  //holiday 

  async getAllHoliday() {
    let res = await this.http.get<Holiday[]>(`${environment.apiUrl}/hcm/workforce/leave/getAllHoliday`).toPromise();
    this.vacancy.next(res);
    return res;

  }

  async addHoliday(data: Holiday) {
    let res = await this.http.post<Holiday>(`${environment.apiUrl}/hcm/workforce/leave/addHoliday/`, data, { withCredentials: true }).toPromise();
    await this.getAllHoliday();

    return res;
  }

  async updateHoliday(data: Holiday) {
    let res = await this.http.post<Holiday>(`${environment.apiUrl}/hcm/workforce/leave/updateHoliday/`, data, { withCredentials: true }).toPromise();
    await this.getAllHoliday();

    return res;
  }

  async deleteHoliday(id: number) {
    let res = await this.http.post<Holiday>(`${environment.apiUrl}/hcm/workforce/leave/deleteHoliday/`, { id }, { withCredentials: true }).toPromise();
    await this.getAllHoliday();

    return res;
  }


  /// payroll


  async getPayslipformonthandyear(month: number, year: number) {
    console.log(month)
    let res = await this.http.post<PaySlip[]>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/getallformonthandyear/`, {
      month,
      year
    }, { withCredentials: true }).toPromise();
    return res;
  }

  
  async CreatePayslipForOneUser(data: any) {
    let res = await this.http.post<PaySlip>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/CreatePayslipForOneUser/`, data, { withCredentials: true }).toPromise();
    return res;
  }

  async getPaySlip(Filter:any) {
    let res = await this.http.post<any[]>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/getByfilter/`, {
      Filter
    }, { withCredentials: true }).toPromise();
    return res;
  }
  async updatePayslip(input: PaySlip) {
    let { id, ...data } = input
    // let res = await this.http.post<PaySlip[]>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/getallformonthandyear/`, {
    //   id,
    //   data
    // }, { withCredentials: true }).toPromise();
    // return res;

    let res = await this.http.post<PaySlip>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/update/`, { id, data }, { withCredentials: true }).toPromise();
    return res;
  }

  async updateaLLPayroll(data: PaySlip) {
    let res = await this.http.post<PaySlip>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/updateall/`, {  data }, { withCredentials: true }).toPromise();
    return res;
  }

  async createPayslip(data: PaySlip) {
    let res = await this.http.post<PaySlip>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/create/`, data, { withCredentials: true }).toPromise();
    return res;
  }

  async getpayslipForId(id: number) {
    return await this.http.get<PaySlip>(`${environment.apiUrl}/hcm/payroll/payroll/payslip/get/${id}`).toPromise();
  }

  async createEmployeeRequest(data: any) {
    return await this.http.post<employee_request>(`${environment.apiUrl}/hcm/employee-managment/createEmployeeRequest/`, data, { withCredentials: true }).toPromise();
  }

  async getAllEmployeeRequests() {
    return await this.http.get<employee_request[]>(`${environment.apiUrl}/hcm/employee-managment/getAllEmployeeRequests/`).toPromise();
  }

  async getRequestsISent() {
    return await this.http.get<employee_request[]>(`${environment.apiUrl}/hcm/employee-managment/getRequestsISent/`).toPromise();
  }

  async getOneEmployeeRequest(id: number) {
    return await this.http.get<employee_request>(`${environment.apiUrl}/hcm/employee-managment/getOneEmployeeRequest/${id}`, { withCredentials: true }).toPromise();
  }

  async markRequestAsRead(id: number) {
    return await this.http.get<employee_request>(`${environment.apiUrl}/hcm/employee-managment/markRequestAsRead/${id}`, { withCredentials: true }).toPromise();
  }

  async countInboxRequests() {
    return await this.http.get<number>(`${environment.apiUrl}/hcm/employee-managment/countInboxRequests/`).toPromise();
  }

  async ReplyToEmployeeRequest(data: any) {
    return await this.http.post<employee_request>(`${environment.apiUrl}/hcm/employee-managment/ReplyToEmployeeRequest/`, data, { withCredentials: true }).toPromise();
  }

  async updateDesignation(data: any) {
    return await this.http.post<any>(`${environment.apiUrl}/authz/updateDesignation`, data, { withCredentials: true }).toPromise();
  }

}
