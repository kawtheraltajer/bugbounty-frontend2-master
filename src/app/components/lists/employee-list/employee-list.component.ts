import { Pagination } from './../../../interfaces/commen-interfaces';
import { Address, Designation } from './../../../interfaces/types';
import { Employee, Education, Certificate, Experience } from 'src/app/interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Role } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PrintService } from 'src/app/services/print.service';
import { TranslateService } from '@ngx-translate/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnChanges {
  isSearch = false;
  searchTerm = '';
  data: any;
  @Input('employeeID') employeeID: number
  employee: { page: number, data: Employee[] }[] = [];
  pageData: Employee[] = []
  isAddBlock = false;
  paginate: Pagination = {
    take: 12,
    skip: 0
  }
  dataCount = 0;
  itemsPerPage = 12;
  currentPage = 0;
  isEnd = false;
  isLoading = false;

  @ViewChild('EmployeeTablePaginator', { static: true }) tablePaginator: MatPaginator;
  Employees: Employee[]
  employeesColumns: string[];
  employeeList = new MatTableDataSource([]);
  getAllData: boolean;

  constructor(public lang: LanguageService, public print: PrintService, public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router, public user: UserService) { }
  ngOnChanges() {

  }
  ngAfterViewInit() {

  }

  /*async pageEvent(ev: {
    length: number
    pageIndex: number
    pageSize: number
    previousPageIndex?: number
  }) {
    console.log("wahts event !!");

    console.log(ev);

    await this.goToPage(ev.pageIndex);
  }
  async goToPage(pageNumber: number) {
    if (pageNumber >= 0) {
      this.currentPage = pageNumber;
      if (this.employee.findIndex(val => val.page == pageNumber) == -1) {
        this.paginate = {
          skip: (pageNumber * this.itemsPerPage),
          take: this.itemsPerPage <= 12 ? this.itemsPerPage : 12,
        }

        console.log(this.paginate)
        await this.getEmployee()
      } else {
        this.pageData = this.employee.filter(val => val.page == pageNumber)[0].data;
      }
    }
  }*/
  async activate(isActive: boolean) {
    await this.app.presentLoading();
    await this.authz.activeteUser(this.data.id, isActive);
    await this.app.dismissLoading();

  }
  async lock(isLocked: boolean) {
    await this.app.presentLoading();
    await this.authz.lockUser(this.data.id, isLocked);
    await this.app.dismissLoading();
  }

  async ngOnInit() {

    this.isLoading = true;
    this.employeesColumns = ['id', 'first_name', 'designation', 'Action'];
    this.getDisplayedColumns();
    this.Employees = await this.authz.getallEmployees({
      paginate: this.paginate
    });
    this.employeeList = new MatTableDataSource(this.Employees);
    this.employeeList.paginator = this.tablePaginator;

    /*this.getEmployee().then((data) => {

      this.isLoading = false;
    }).catch(er => {
      console.log("Get Employee Error");
    });;*/


  }

  public printDiv() {
    let printContents, title
    this.getAllData = true
    printContents = document.getElementById('table').innerHTML

    if (this.lang.selectedLang == 'en') {
      title = 'Employee List'
    }
    else {
      title = 'قائمة الموظفين'
    }
    this.print.printDiv(printContents, title)
    this.getAllData = false
  }

  getDisplayedColumns(): string[] {
    return this.employeesColumns
  }

  /*async getEmployee() {
    this.isLoading = true;
    let result = await this.authz.getallEmployees({
      paginate: this.paginate
    });

    console.log("result")
    console.log(result)
    if (result.count) {
      this.dataCount = result.count;
    }
    if ((this.employee.length * this.itemsPerPage) == this.dataCount) {
      this.isEnd = true
    } else {
      this.isEnd = false;
    }

    this.employee.push({
      page: this.currentPage,
      data: result.result
    });
    this.pageData = result.result;
    console.log(this.employee)
    this.isLoading = false;
  }*/


  async add() {
    const modal = await this.modalController.create({ component: AddEmployeeModal, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  async details(row) {

    this.router.navigate(['hcm/employee-management/employeeDetails', row.id])

  }
  getURL(imgPath: string) {
    return this.user.getProfilePicURL(imgPath);
  }

  applyFilter() {
    this.employeeList.filterPredicate = (data, filter) => {
      return data.user?.first_name?.toLocaleLowerCase().includes(filter) ||
        data.user?.last_name?.toLocaleLowerCase().includes(filter) ||
        data.designation?.title_en?.toLocaleLowerCase().includes(filter) ||
        data.designation?.title_ar?.toLocaleLowerCase().includes(filter)
    }
    this.employeeList.filter = this.searchTerm.trim().toLowerCase();
  }

  async deleteEmployee(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Personal_information.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.authz.deleteEmployee(row.id)


    }
  }

}


@Component({
  selector: 'add-employee',
  templateUrl: './add-employee.html',
})
export class AddEmployeeModal implements OnInit {
  @Input('id') id: number;
  @Input('employeeID') employeeID: number
  isLoading = true;
  addressForm: FormGroup;
  segment: number;
  addform: FormGroup;
  EmergencyContactForm: FormGroup;
  contactForm: FormGroup;
  roles: Role[] = [];
  designations: Designation[] = [];
  validation_messages: any;
  departments:any;
  constructor( fb: FormBuilder,public lang: LanguageService,public modalCtrl: ModalController, private app: AppService, public authz: AuthzService) {
    this.addform = fb.group({
      designationID: [,[Validators.required]],  
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      mobile: [null, Validators.required],
      email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      roleID: [null, [Validators.required]],
      password: [null, []],
      gender: [null,],
      marital_status: [null,],
      nationality: [null,],
      national_identity: [null,],
      religion: [null,],
      passport: [null,],
      birth_date: [null,],
      line1: ['',],
      line2: ['',],
      city: ['',],
      country: ['',],
      departmentID:[null, [Validators.required]],
      emergency_contacts_name: [null, [Validators.required]],
      emergency_contacts_relation: [null, [Validators.required]],
      emergency_contacts_email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      emergency_contacts_phone: [null,],
      emergency_contacts_mobile: [null,],
      bank_name:[null,],
      holder_name:[null,],
      IBAN:[null,]

    });

  }

  async ngOnInit() {

    this.departments = await this.authz.getAllDepartment()

    this.validation_messages = {
      'name': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.name.required' },

      ],


      'relation': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.relation.required' },

      ],


      'phone': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.phone.required' },
        { type: 'minlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'maxlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages fb: FormBuilder,.phone.pattern' }

      ],
      'email': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.email.required' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.email.pattern' }
      ],

      'first_name': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.first_name.required' }
      ],
      'last_name': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.last_name.required' }
      ],
      'gender': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.gender.required' }
      ],
      'nationality': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.nationality.required' },
      ],
      'national_identity': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.national_identity.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.national_identity.pattern' }
      ],
      'passport': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.passport.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.passport.pattern' }
      ],

      'religion': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.religion.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.religion.pattern' }
      ],
      'birth_date': [
        { type: 'required', message: 'Employee_managment.Personal_information.massages.birth_date.required' },
        { type: 'pattern', message: 'Employee_managment.Personal_information.massages.birth_date.pattern' }
      ],
      'mobile': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.phone.required' },
        { type: 'minlength', message: 'Employee_managment.Emergency_Contact.massages.phone.min' },
        { type: 'maxlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.phone.pattern' }

      ],


      'line1': [
        { type: 'required', message: 'Employee_managment.address.massages.line1.required' }
      ],
      'city': [
        { type: 'required', message: 'Employee_managment.address.massages.nationality.required' },
      ],
      'country': [
        { type: 'required', message: 'Employee_managment.address.massages.country.required' },
      ],


    }



    this.segment = 0;
    this.roles = await this.authz.getAllRoles();
    this.designations = await this.authz.getAlldesignation();
  }



  async add() {
    await this.app.presentLoading();
    if (this.addform.valid) {
      let data = this.addform.value;
      try {
        let employee = await this.authz.addEmployee(data);

        if (employee.case != 'success') {
          if (this.lang.selectedLang == 'en') 
          {
            this.app.presentAlert("Error", employee.massages.en)
          }
          else
           {
            this.app.presentAlert("خطأ", employee.massages.ar)
           }

        }
        await this.app.dismissLoading();
        this.dismiss(employee);

      } catch (e) {
        console.log(e);
      }
    } else {
      this.addform.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  async step0() {
    this.segment = 0
  }
  async step1() {
    this.segment = 1
  }
  async step2() {
    this.segment = 2
  }
  async step3() {
    this.segment = 3
  }

  async step4() {
    this.segment = 4
  }

  dismiss(data?: Employee) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }
}

@Component({
  selector: 'employee-details',
  templateUrl: './employee-details.html',
})
export class EmployeeDetailsModal implements OnInit {
  id: number
  segment = 0;
  Talint_segment = 0
  isLoading = true;
  data: Employee;
  educations: Education[];
  certificates: Certificate[];
  experiences: Experience[];
  Address: Address[];
  employees: Employee[] = []
  leave_segment = 0
  departments:any
  addform: FormGroup;

  constructor( fb: FormBuilder,public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.addform = fb.group({
      id:[null,],
      bank_name:[null,],
      holder_name:[null,],
      IBAN:[null,],
      personal_informationID:[null,],

    });


   }

  async ngOnInit() {
    await this.app.presentLoading();
    //employee id 

    this.id = this.route.snapshot.params.id;
    this.data = await this.authz.getEmployee(this.id);
    this.addform.get('bank_name').setValue(this.data?.personal_information?.bank_account?.bank_name)
    this.addform.get('holder_name').setValue(this.data?.personal_information?.bank_account?.holder_name)
    this.addform.get('IBAN').setValue(this.data?.personal_information?.bank_account?.IBAN)
    this.addform.get('id').setValue(this.data?.personal_information?.bank_account?.id)
    this.addform.get('personal_informationID').setValue(this.data?.personal_information?.id)
    console.log("this.data")
    console.log(this.data)
    this.Address = this.data.personal_information.addresses
    await this.app.dismissLoading()
    this.isLoading = false;

  }

  async updateBank_info() {
    await this.app.presentLoading();
    if (this.addform.valid) {
      let data = this.addform.value;
      try {
     await this.authz.updateBank_info(data);
        await this.app.dismissLoading();
        this.ngOnInit()

      } catch (e) {
        console.log(e);
      }
    } else {
      this.addform.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }
  getURL(imgPath: string) {
    return this.userService.getProfilePicURL(imgPath);
  }

  async dismiss() {
    this.router.navigate(['hcm/employee-management'])
  }
  async deleteEmployee() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Employee_managment.Personal_information.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      await this.authz.deleteEmployee(Number(this.id))
      await this.authz.deleteEmployee(this.id)
      this.router.navigate(['hcm/employee-management'])

    }
  }

  async updateDesignation() {
    const modal = await this.modalCtrl.create({ component: UpdateDesignationModal, cssClass: 'passwordModal', componentProps: { id: this.id, designationID: this.data.designation.id ,departmentID: this.data.departmentID ,RoleID: this.data.user.roleID ,UserID: this.data.userID } })
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    })
    return await modal.present();
  }
}
@Component({
  selector: 'update-designation',
  templateUrl: './update-designation.html',
})
export class UpdateDesignationModal implements OnInit {
  @Input('id') id: number;
  @Input('designationID') designationID: number
  @Input('departmentID') departmentID: number
  @Input('UserID') UserID: number

  @Input('RoleID') RoleID: number
  updateDesignationForm: FormGroup;
  designations: Designation[] = [];
  roles: Role[]
  departments:any
  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private app: AppService,
    public translate: TranslateService,
    public user: UserService,
    private authz: AuthzService) {
    this.updateDesignationForm = fb.group({
      designationID: ['', [Validators.required]],
      roleID: ['', [Validators.required]],
      departmentID: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.roles = await this.authz.getAllRoles()
    this.departments = await this.authz.getAllDepartment()
    this.designations = await this.authz.getAlldesignation();
    this.updateDesignationForm.get('designationID').setValue(this.designationID)
    this.updateDesignationForm.get('roleID').setValue(this.RoleID)
    this.updateDesignationForm.get('departmentID').setValue(this.departmentID)
  }

  async updateRole() {
    await this.app.presentLoading();
    if (this.updateDesignationForm.valid) {
      let val = this.updateDesignationForm.value;
      await this.authz.updateDesignation({
        employeeID: this.id,
        designationID: val.designationID,
        roleID: val.roleID,
        departmentID: val.departmentID,
        UserID:this.UserID
      });
      this.dismiss()
      await this.app.dismissLoading();

    } else {
      await this.app.presentAlert(this.translate.instant('Operations.Sorry'), this.translate.instant('MyAccount.Profile.messages.Fill'), 'errorAlert')
      await this.app.dismissLoading();

    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}

