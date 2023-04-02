import { data } from 'autoprefixer';
import { Leave, LeaveType, Leave_balance } from './../../interfaces/types';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { Permission, Employee, PersonalInformation, Contact } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { LanguageService } from 'src/app/services/language.service';
import * as moment from 'moment';
import { PrintService } from 'src/app/services/print.service';
import { GeneralService } from 'src/app/services/general.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-employee-self-service',
  templateUrl: './employee-self-service.page.html',
  styleUrls: ['./employee-self-service.page.scss'],
})
export class EmployeeSelfServicePage implements OnInit {
  isLoading = true;
  data: Employee;
  segment: number
  Services: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
  }[] = [{
    title: 'Employee_managment.Personal_information.title',
    icon: 'person-outline',
    selected: false,
    link: 'PersonalInfromation'
  },   {
  title: 'Employee_managment.Bank_info.Title',
  icon: 'card',
  selected: false,
  link: 'BankInfo'
},
  
  {

    title: 'Employee_managment.Services.Talents',
    icon: 'copy',
    selected: false,
    link: 'TalentPage'
  }, {
    title: 'HCM.Workforce.leaves.Title',
    icon: 'rocket-outline',
    selected: false,
    link: 'EmployeeLeavePage'
  },
  {
    title: 'Employee_managment.Services.Contracts',
    icon: 'bookmarks-outline',
    selected: false,
    link: 'ContractsPage'
  },
      {
        title: 'Employee_managment.Services.Reports',
        icon: 'folder-open',
        selected: false,
        link: 'EmployeeReportsPage'
      }
      /*{
        title: 'Employee_managment.Services.General_Requests',
        icon: 'document',
        selected: false,
        link: 'employee-request'
      },*/

    ]


  constructor(public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    if (!(this.authz.canDo('READ', 'Employee', []) || this.authz.canDo('MANAGE', 'Employee', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
  }
  async ngOnInit() {
    if (!(this.authz.canDo('READ', 'Employee', []) || this.authz.canDo('MANAGE', 'Employee', [])) &&
      ((this.authz.canDo('MANAGE', 'ClientAccess', []) ||
        this.authz.canDo('MANAGE', 'CompanyAccess', [])))) {
      this.router.navigateByUrl(`/login`)
    }
    this.segment = 0;
    this.data = (await this.authz.getCurrantmployee());
    this.isLoading = false;

  }
  openPage(url: string) {
    this.router.navigate(['employee-self-service/' + url])
  }

  getURL(imgPath) {
    return this.userService.getProfilePicURL(imgPath);
  }


}

@Component({
  selector: 'personal-information',
  templateUrl: './personal-information.html',
})
export class PersonalInformationPage implements OnInit {
  isLoading = true;
  data: Employee;
  segment: number
  id: number
  contact: Contact
  Edit_mode: boolean
  PersonalInformationForm: FormGroup
  contactForm: FormGroup
  validation_messages: any;
  constructor(public fb: FormBuilder, public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) {

    this.contactForm = fb.group({
      id: ['',],
      phone: ['', [Validators.required]],
      mobile: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      personalInformationID: ['',],


    });
    this.PersonalInformationForm = fb.group({
      id: ['',],
      gender: ['',],
      marital_status: ['',],
      nationality: ['',],
      national_identity: ['',],
      religion: [null,],
      passport: [null,],
      birth_date: [null,],


    });

  }



  async update() {


    await this.app.presentLoading();
    if (this.PersonalInformationForm.valid) {
      this.PersonalInformationForm.setValue({
        id: this.data.personal_information.id,
        gender: this.PersonalInformationForm.value.gender,
        marital_status: this.PersonalInformationForm.value.marital_status,
        nationality: this.PersonalInformationForm.value.nationality,
        national_identity: this.PersonalInformationForm.value.national_identity,
        religion: this.PersonalInformationForm.value.religion,
        passport: this.PersonalInformationForm.value.passport,
        birth_date: this.PersonalInformationForm.value.birth_date,

      })

      let data = this.PersonalInformationForm.value;

      try {
        await this.authz.UpdatePersonalInformation(data);
        await this.app.dismissLoading();
        this.Edit_mode = !this.Edit_mode
        this.segment = 0
        this.ngOnInit()
      } catch (e) {
        console.log(e);
        this.Edit_mode = !this.Edit_mode

      }
    } else {
      this.PersonalInformationForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');

    }


  } addemergency() {

  }

  updateemergencyContact(row) {

  }
  async ngOnInit() {
    this.data = await this.authz.getCurrantmployee();
    this.Edit_mode = false
    this.segment = 0;

    this.PersonalInformationForm.setValue({
      id: this.data.personal_information.id,
      gender: this.data.personal_information?.gender,
      marital_status: this.data.personal_information?.marital_status,
      nationality: this.data.personal_information?.nationality,
      national_identity: this.data.personal_information?.national_identity,
      religion: this.data.personal_information?.religion,
      passport: this.data.personal_information?.passport,
      birth_date: this.data.personal_information?.birth_date,

    })
    this.contactForm.setValue({
      id: this.data.personal_information.contact.id,
      email: this.data.personal_information.contact?.email,
      mobile: this.data.personal_information.contact?.mobile,
      phone: this.data.personal_information.contact?.phone,
      personalInformationID: this.data.personal_information.contact?.personalInformationID

    })

    this.isLoading = false;
    this.validation_messages = {
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

      'phone': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.phone.required' },
        { type: 'minlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'maxlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.phone.pattern' }

      ],
      'email': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.email.required' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.email.pattern' }
      ],



    }


  }
  dismiss() {

    this.router.navigate(['employee-self-service'])

  }

  async updateContact() {
    await this.app.presentLoading();
    if (this.contactForm.valid) {
      let data = this.contactForm.value;

      try {
        await this.authz.UpdateContact(data);
        await this.app.dismissLoading();
        this.Edit_mode = !this.Edit_mode
        this.segment = 4
        this.data = await this.authz.getCurrantmployee();

      } catch (e) {
        console.log(e);
      }
    } else {
      this.contactForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }
  getURL(imgPath) {
    return this.userService.getProfilePicURL(imgPath);
  }


}


@Component({
  selector: 'talent',
  templateUrl: './talent.html',
})
export class TalentPage implements OnInit {
  isLoading = true;
  data: Employee;
  segment: number
  constructor(public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.data = null

  }


  async ngOnInit() {
    this.segment = 0;
    this.data = await this.authz.getCurrantmployee();
    this.isLoading = false;
  }
  dismiss() {

    this.router.navigate(['employee-self-service'])

  }
  getURL(imgPath) {
    return this.userService.getProfilePicURL(imgPath);
  }


}


@Component({
  selector: 'contracts',
  templateUrl: './contracts.html',
})
export class ContractsPage implements OnInit {
  isLoading = true;
  data: Employee;


  constructor(public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }


  async ngOnInit() {
    this.data = await this.authz.getCurrantmployee();
    this.isLoading = false;
  }
  dismiss() {

    this.router.navigate(['employee-self-service'])
  }
  getURL(imgPath) {
    return this.userService.getProfilePicURL(imgPath);
  }
}

@Component({
  selector: 'employee-leave',
  templateUrl: './employee-leave.html',
})
export class EmployeeLeavePage implements OnInit {
  isLoading = true;
  data: Employee;
  id: number
  leaves: any;
  contact: Contact
  validation_messages: any;
  LeaveBalance: Leave_balance[]
  constructor(public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }


  async ngOnInit() {


    this.data = await this.authz.getCurrantmployee();
    this.id = this.data.id

    this.LeaveBalance = await this.authz.getEmployeeBalance(this.id)
    this.leaves = await this.authz.getEmployeeLeave(this.id);
    this.isLoading = false;
  }
  dismiss() {
    this.router.navigate(['employee-self-service'])

  }

  async add() {
    const modal = await this.modalCtrl.create({ component: AddEmployeeLeavePage, cssClass: 'responsiveModal', componentProps: { employeeID: this.id } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }
  getURL(imgPath) {
    return this.userService.getProfilePicURL(imgPath);
  }
  async update(leave) {
    const modal = await this.modalCtrl.create({ component: UpdateEmployeeLeavePage, cssClass: 'responsiveModal', componentProps: { leave: leave } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

}

@Component({
  selector: 'add-employee-leave',
  templateUrl: './add-employee-leave.html',
})

export class AddEmployeeLeavePage implements OnInit {
  minDate = new Date();;
  approval: Boolean
  addForm: FormGroup;
  LeaveType: LeaveType[];
  Employee: Employee[];
  validation_messages: any;
  to_date: any
  @Input('employeeID') employeeID: number;

  constructor(public lang: LanguageService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.addForm = fb.group({
      employeeID: ['', [Validators.required]],
      leaveTypeID: ['', [Validators.required]],
      approval: ['',],
      to_date: ['',],
      from_date: ['', [Validators.required]],
      total_days: ['', [Validators.required]],
      documentURL: ['',],
      status: ['',]

    });
  }
  async ngOnInit() {
    
    this.LeaveType = await this.authz.getLeaveTypes();
    this.approval = false;
    this.addForm.setValue({
      employeeID: Number(this.employeeID),
      leaveTypeID: "",
      approval: false,
      to_date: "",
      from_date: "",
      total_days: "",
      documentURL: "",
      status: "Pendding "
    })

    this.validation_messages = {
      'days': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.days.required' },
        { type: 'pattern', message: 'HCM.Workforce.leaves.massages.days.pattern' },

      ],
      'Leave_Type': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Leave_Type.required' },
      ],

      'Employee': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Employee.required' },
      ],

      'documentURL': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.documentURL.required' },
      ],
      'From_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.From_Date.required' },
        { type: 'date', message: 'Vacancy.massages.From_Date.date' },

      ],
      'To_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.To_Date.required' },
        { type: 'date', message: 'Vacancy.massages.To_Date.date' },

      ],

    }

  }

  set_to_date() {
    this.addForm.value.total_days

    this.to_date = moment(this.addForm.value.from_date, "DD-MM-YYYY").add(this.addForm.value.total_days - 1, 'days');


  }



  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let { documentURL, ...data } = this.addForm.value;
      let url = '';
      try {
        if (documentURL) {
          let doc = documentURL.files[0];
          let uploaded;
          if (doc) {
            uploaded = await this.authz.uploadFile(doc);
            if (uploaded?.file.filename) {
              url = uploaded?.file.filename;
            }
          }

        }

        this.addForm.setValue({
          employeeID: Number(this.employeeID),
          leaveTypeID: data.leaveTypeID,
          approval: data.approval,
          to_date: this.to_date,
          from_date: data.from_date,
          total_days: data.total_days,
          documentURL: url ? url : "",
          status: "Pendding"
        })

        let forming = this.addForm.value
        let leave = await this.authz.AddEmployeeLeaves(forming);
        if (leave.case != 'sucess') {
          if (this.lang.selectedLang == 'en') {
            this.app.presentAlert("Error", leave.massages.en)
          }
          else {
            this.app.presentAlert("خطأ", leave.massages.ar)
          }

        }
        await this.app.dismissLoading();
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}

@Component({
  selector: 'update-employee-leave',
  templateUrl: './update-employee-leave.html',
})

export class UpdateEmployeeLeavePage implements OnInit {
  minDate = new Date();;
  updateForm: FormGroup;
  @Input('leave') leave: Leave
  LeaveType: LeaveType[];
  Employee: Employee[];
  validation_messages: any;
  to_date: any;
  constructor(public lang: LanguageService, public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.updateForm = fb.group({
      id: ['',],
      employeeID: ['',],
      leaveTypeID: ['', [Validators.required]],
      approval: ['',],
      to_date: ['', [Validators.required]],
      from_date: ['', [Validators.required]],
      total_days: ['', [Validators.required]],
      status: [],
      douumentUrl: ['']
    });
  }
  async ngOnInit() {

    this.LeaveType = await this.authz.getLeaveTypes();
    //this.Employee = await this.authz.getEmployees()
    this.updateForm.setValue({
      id: this.leave.id,
      employeeID: this.leave.employeeID,
      leaveTypeID: this.leave.leaveTypeID,
      approval: this.leave.approval,
      to_date: this.leave.to_date,
      from_date: this.leave.from_date,
      total_days: this.leave.total_days,
      status: "Pendding ",
      douumentUrl: ""

    })

    this.to_date = this.leave.to_date
    this.validation_messages = {
      'days': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.days.required' },
        { type: 'pattern', message: 'HCM.Workforce.leaves.massages.days.pattern' },

      ],
      'Leave_Type': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Leave_Type.required' },
      ],

      'Employee': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.Employee.required' },
      ],

      'documentURL': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.documentURL.required' },
      ],
      'From_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.From_Date.required' },
        { type: 'date', message: 'Vacancy.massages.From_Date.date' },

      ],
      'To_Date': [
        { type: 'required', message: 'HCM.Workforce.leaves.massages.To_Date.required' },
        { type: 'date', message: 'Vacancy.massages.To_Date.date' },

      ],






    }

  }

  set_to_date() {
    this.updateForm.value.total_days

    this.to_date = moment(this.updateForm.value.from_date, "DD-MM-YYYY").add(this.updateForm.value.total_days - 1, 'days');


  }

  async delete() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "HCM.Workforce.leaves.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)

    if (confirm) {
      this.authz.deleteEmployeeLeave(this.leave.id)
      this.dismiss();
    }
  }
  async update() {
    await this.app.presentLoading();
    if (this.updateForm.valid) {
      this.updateForm.setValue({
        id: this.leave.id,
        employeeID: this.leave.employeeID,
        leaveTypeID: this.updateForm.value.leaveTypeID,
        approval: this.updateForm.value.approval,
        to_date: this.to_date,
        from_date: this.updateForm.value.from_date,
        total_days: this.updateForm.value.total_days,
        douumentUrl: "",
        status: "Pendding ",



      })

      let data = this.updateForm.value;
      try {

        let leave = await this.authz.UpdateEmployeeLeave(data);
        await this.app.dismissLoading();

        if (leave.case != 'sucess') {

          if (this.lang.selectedLang == 'en') {
            this.app.presentAlert("No Balance", leave.massages.en)
          }

          else {

            this.app.presentAlert("لا يوجد رصيد كافي", leave.massages.ar)

          }

        }
        this.dismiss();
      } catch (e) {
        console.log(e);
      }
    } else {
      this.updateForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}


@Component({
  selector: 'employee-reports',
  templateUrl: './employee-reports.html',
})
export class EmployeeReportsPage implements OnInit {
  isLoading = true;
  data: Employee;
  segment: number
  id: number
  contact: Contact
  Edit_mode: boolean
  PersonalInformationForm: FormGroup
  contactForm: FormGroup
  validation_messages: any;
  ReportType:any;
  @Input('employeeID') employeeID: number;
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  selectedDate = new FormControl(new Date());
  constructor(public general : GeneralService,public printservice : PrintService,public fb: FormBuilder, public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) {

    this.contactForm = fb.group({
      id: ['',],
      phone: ['', [Validators.required]],
      mobile: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      personalInformationID: ['',],


    });
    this.PersonalInformationForm = fb.group({
      id: ['',],
      gender: ['', [Validators.required]],
      marital_status: ['',],
      nationality: ['', [Validators.required]],
      national_identity: ['',],
      religion: ['', [Validators.required]],
      passport: ['', [Validators.required]],
      birth_date: ['', [Validators.required]],


    });

  }
  chosenYearHandler(normalizedYear) {
    this.selectedYear = new Date(normalizedYear).getFullYear();;
  }

  async chosenMonthHandler(normalizedMonth, datepicker: MatDatepicker<Date>) {
    this.selectedMonth = new Date(normalizedMonth).getMonth();
    datepicker.select(new Date(this.selectedYear, this.selectedMonth, 1));
    datepicker.close();
  }

 async print(){
  var data={
    employeeID:this.data?.id,
    type:this.ReportType,
    month: this.selectedMonth + 1,
    year: this.selectedYear

  }

  
  var information = await this.general.EmployeeReport(data)

   if( this.ReportType == "employeeCertificate"){
    var information = await this.general.EmployeeReport(data)

    console.log(information)
    this.printservice.experienceCertificate(information)

   }else if( this.ReportType == "salarycertificate")
   {
    var information = await this.general.EmployeeReport(data)

    this.printservice.salarycertificate(information)
   }
  

    else if( this.ReportType == "payslip")
   {
    var information = await this.general.EmployeeReport(data)

    this.printservice.printPayslip(information)
   } 

  
  }
  


  async update() {


    await this.app.presentLoading();
    if (this.PersonalInformationForm.valid) {
      this.PersonalInformationForm.setValue({
        id: this.data.personal_information.id,
        gender: this.PersonalInformationForm.value.gender,
        marital_status: this.PersonalInformationForm.value.marital_status,
        nationality: this.PersonalInformationForm.value.nationality,
        national_identity: this.PersonalInformationForm.value.national_identity,
        religion: this.PersonalInformationForm.value.religion,
        passport: this.PersonalInformationForm.value.passport,
        birth_date: this.PersonalInformationForm.value.birth_date,

      })

      let data = this.PersonalInformationForm.value;

      try {
        await this.authz.UpdatePersonalInformation(data);
        await this.app.dismissLoading();
        this.Edit_mode = !this.Edit_mode
        this.segment = 0
        this.ngOnInit()
      } catch (e) {
        console.log(e);
        this.Edit_mode = !this.Edit_mode

      }
    } else {
      this.PersonalInformationForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');

    }


  } addemergency() {

  }

  updateemergencyContact(row) {

  }
  async ngOnInit() {
    this.data = await this.authz.getCurrantmployee();
    this.Edit_mode = false
    this.segment = 0;

    this.PersonalInformationForm.setValue({
      id: this.data.personal_information.id,
      gender: this.data.personal_information?.gender,
      marital_status: this.data.personal_information?.marital_status,
      nationality: this.data.personal_information?.nationality,
      national_identity: this.data.personal_information?.national_identity,
      religion: this.data.personal_information?.religion,
      passport: this.data.personal_information?.passport,
      birth_date: this.data.personal_information?.birth_date,

    })
    this.contactForm.setValue({
      id: this.data.personal_information.contact.id,
      email: this.data.personal_information.contact?.email,
      mobile: this.data.personal_information.contact?.mobile,
      phone: this.data.personal_information.contact?.phone,
      personalInformationID: this.data.personal_information.contact?.personalInformationID

    })

    this.isLoading = false;
    this.validation_messages = {
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

      'phone': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.phone.required' },
        { type: 'minlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'maxlength', message: 'Employee_managment.Emergency_Contact.massages.phone.max' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.phone.pattern' }

      ],
      'email': [
        { type: 'required', message: 'Employee_managment.Emergency_Contact.massages.email.required' },
        { type: 'pattern', message: 'Employee_managment.Emergency_Contact.massages.email.pattern' }
      ],



    }


  }
  dismiss() {

    this.router.navigate(['employee-self-service'])

  }

  async updateContact() {

    await this.app.presentLoading();
    if (this.contactForm.valid) {
      let data = this.contactForm.value;

      try {
        await this.authz.UpdateContact(data);
        await this.app.dismissLoading();
        this.Edit_mode = !this.Edit_mode
        this.segment = 4
        this.data = await this.authz.getCurrantmployee();

      } catch (e) {
        console.log(e);
      }
    } else {
      this.contactForm.markAllAsTouched();
      await this.app.dismissLoading();
      //await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }
  getURL(imgPath) {
    return this.userService.getProfilePicURL(imgPath);
  }


}



@Component({
  selector: 'bank_info',
  templateUrl: './bank_info.html',
})
export class BankInfonPage implements OnInit {
  isLoading = true;
  data: any;
  segment: number
  id: number
  contact: Contact
  Edit_mode: boolean
  PersonalInformationForm: FormGroup
  addform: FormGroup
  validation_messages: any;
  employee:any
  constructor(public general: GeneralService,public fb: FormBuilder, public lang: LanguageService, public modalCtrl: ModalController, public app: AppService, public authz: AuthzService, private userService: UserService, private route: ActivatedRoute, private router: Router) {


    this.addform = fb.group({
      id:[null,],
      bank_name:[null,],
      holder_name:[null,],
      IBAN:[null,],
      account_number:[null,],
      personal_informationID:[null,],

    });

  }



  async ngOnInit() {
    await this.app.presentLoading();
    //employee id 
    this.employee= await this.authz.getCurrantmployee();
    console.log(this.data)
    this.data = await this.authz.getEmployee(this.employee.id);
    let bank_info = await  this.employee.personal_information.bank_account
    console.log(bank_info)
    this.addform.get('bank_name').setValue(bank_info?.bank_name)
    this.addform.get('holder_name').setValue(bank_info?.holder_name)
    this.addform.get('IBAN').setValue(bank_info?.IBAN)
    this.addform.get('id').setValue(bank_info?.id)
    this.addform.get('account_number').setValue(bank_info?.account_number)
    this.addform.get('personal_informationID').setValue(this.employee.personalInformationID)

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
  dismiss() {

    this.router.navigate(['employee-self-service'])

  }

  getURL(imgPath) {
    return this.userService.getProfilePicURL(imgPath);
  }


}


