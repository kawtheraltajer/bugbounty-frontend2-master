import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { EmployeePickerComponent } from 'src/app/components/pickers/employee-picker/employee-picker.component';
import { Pagination } from 'src/app/interfaces/commen-interfaces';
import { Appraisal, AppraisalTemplate, AppraisalType, Employee } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { LanguageService } from 'src/app/services/language.service';
import { AuthzService } from 'src/app/services/authz.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appraisals-list',
  templateUrl: './appraisals-list.page.html',
  styleUrls: ['./appraisals-list.page.scss'],
})
export class AppraisalsListPage implements OnInit {
  appraisals: { page: number, data: Appraisal[] }[] = [];
  pageData: Appraisal[] = []
  templates: AppraisalTemplate[] = [];

  types: AppraisalType[] = [];
  newAppraisal: Appraisal & { templateID?: number } = {}
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
  years: number[] = [];
  months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  pages: number[] = []
  today = new Date();
  filter: {
    Table_name: string,
    Columnslist: [],
    filter: any
  }
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  employeeList:Employee[]
  validation_messages:any
  typeform:FormGroup;
  constructor(public fb: FormBuilder,public  authz:AuthzService,public appraisalServices: AppraisalService, public app: AppService, private modalController: ModalController, public lang: LanguageService, public popoverController: PopoverController,
    private router: Router) {
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    // for (let index = 0; index < 100; index++) {
    //   this.appraisals.push(this.appraisal)
    // }

    this.filter = {
      Table_name: "",
      Columnslist: [],
      filter: {
        month: this.selectedMonth + 1,
        year: this.selectedYear
      }
    }
    this.ngOnInit()
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.employeeList = await this.authz.getEmployees()
    this.isLoading = true;
    this.getAppraisals().then((data) => {

      this.isLoading = false;
    }).catch(er => {
      console.log("Get Appraisals Error");
    });;
    let currentYear = DateTime.local().year;
    for (let index = -1; index <= 1; index++) {
      this.years.push(currentYear + index)
    }
    this.appraisalServices.getAllAppraisalTypes().then((data) => {
      this.types = data;
    }).catch(er => {
      console.log("Get Types Error");
    });
    this.appraisalServices.getAllAppraisalTemplates().then((data) => {
      this.templates = data;
    }).catch(er => {
      console.log("Get Templates Error");
    });
  }
  reset_filter (){
    this.filter.filter=null
  }

  async getAppraisals() {
    this.isLoading = true;
    let result = await this.appraisalServices.getAllAppraisal({
      filter: this.filter.filter,
      paginate: this.paginate
    });
    if (result.count) {
      this.dataCount = result.count;
    }
    if ((this.appraisals.length * this.itemsPerPage) == this.dataCount) {
      this.isEnd = true
    } else {
      this.isEnd = false;
    }

    this.appraisals.push({
      page: this.currentPage,
      data: result.result
    });
    this.pageData = result.result;
    this.isLoading = false;
  }
  async createAppraisal() {
    await this.app.presentLoading();
    console.log(
      {
        'appraiser': this.newAppraisal.appraiser,
        'employee': this.newAppraisal.employee,
        'type': this.newAppraisal.type,
        'year': this.newAppraisal.year,
        'month': this.newAppraisal.month,
        templateID: this.newAppraisal.templateID
      }
    );

    if (this.newAppraisal.appraiser != null && this.newAppraisal.employee != null && this.newAppraisal.type != null && this.newAppraisal.year != null && this.newAppraisal.month != null) {
      let appr = await this.appraisalServices.createAppraisal({
        employeeID: this.newAppraisal.employee.id,
        appraiserID: this.newAppraisal.appraiser.id,
        typeID: this.newAppraisal.type.id,
        year: this.newAppraisal.year,
        month: this.newAppraisal.month,
        ...((this.newAppraisal.templateID) && { templateID: this.newAppraisal.templateID })
      });
      this.appraisals = [];
      this.pages = [];
      this.goToPage(0);
      this.isAddBlock = false;
      this.newAppraisal = {}
    } else {
      await this.app.presentErrorAlert('sorry', 'Please Fill the data required!', 'ok');
    }
    this.app.dismissLoading();
  }

  async selectAppraiser(ev: any) {
    let emp = await this.selectEmployee(ev, {
      isCustomList: false,
      isGroupEmployees: false,
      exclude: this.newAppraisal.employee ? [this.newAppraisal.employee.id] : [],
    })

    if (emp) {
      this.newAppraisal.appraiser = emp;
      this.newAppraisal.appraiserID = emp.id;

    }
  }
  async selectAppraisee(ev: any) {
    let emp = await this.selectEmployee(ev, {
      isCustomList: false,
      isGroupEmployees: false,
      exclude: this.newAppraisal.appraiser ? [this.newAppraisal.appraiser.id] : [],
    })

    if (emp) {
      this.newAppraisal.employee = emp;
      this.newAppraisal.employeeID = emp.id;
    }
  }
  async getAllAppraisal() {
this.ngOnInit()

  }

  async selectEmployee(ev: any, props: any) {
    return new Promise<Employee>(async (resolve, reject) => {
      const popover = await this.modalController.create({
        component: EmployeePickerComponent,
        // event: ev,
        // cssClass: 'popover-width',
        // translucent: false,
        componentProps: props
      });

      await popover.present();
      popover.onWillDismiss().then(dt => {
        if (dt && dt.data && !dt.data.isCancel && dt.data.employee) {
          resolve(dt.data.employee)
        }
        resolve(null)
      });
    })
  }
  async pageEvent(ev: {
    length: number
    pageIndex: number
    pageSize: number
    previousPageIndex?: number
  }) {
    console.log(ev);

    await this.goToPage(ev.pageIndex);
  }
  async goToPage(pageNumber: number) {
    if (pageNumber >= 0) {
      this.currentPage = pageNumber;
      if (this.appraisals.findIndex(val => val.page == pageNumber) == -1) {
        this.paginate = {
          skip: (pageNumber * this.itemsPerPage),
          take: this.itemsPerPage <= 12 ? this.itemsPerPage : 12,
        }
        await this.getAppraisals()
      } else {
        this.pageData = this.appraisals.filter(val => val.page == pageNumber)[0].data;
      }
    }
  }

  filterData() {

  }

  trackByIdx(i) {
    return i;
  }

  floor(num: number) {
    return Math.floor(num);
  }
}
