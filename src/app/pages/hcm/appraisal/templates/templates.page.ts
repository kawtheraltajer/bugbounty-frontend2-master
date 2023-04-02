import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { EmployeePickerComponent } from 'src/app/components/pickers/employee-picker/employee-picker.component';
import { Pagination } from 'src/app/interfaces/commen-interfaces';
import { Appraisal, AppraisalTemplate, AppraisalType, Employee } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppraisalService } from 'src/app/services/appraisal.service';
import { LanguageService } from 'src/app/services/language.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthzService } from 'src/app/services/authz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.page.html',
  styleUrls: ['./templates.page.scss'],
})
export class TemplatesPage implements OnInit {
  templates: { page: number, data: AppraisalTemplate[] }[] = [];
  pageData: AppraisalTemplate[] = []

  filter = {
    // year: DateTime.local().year,
    // month: DateTime.local().month,
  }
  types: AppraisalType[] = [];
  newAppraisal: AppraisalTemplate = {}
  newAppraisalForm: FormGroup;
  isAddBlock = false;
  paginate: Pagination = {
    take: 8,
    skip: 0
  }
  dataCount = 0;
  itemsPerPage = 8;
  currentPage = 0;
  isEnd = false;
  validation_messages: any;
  isLoading = false;
  years: number[] = [];
  months: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  pages: number[] = []
  today = new Date();
  constructor(public fb: FormBuilder,
    public appraisalService: AppraisalService,
    public app: AppService,
    private modalController: ModalController,
    public lang: LanguageService,
    public popoverController: PopoverController,
    public authz: AuthzService,
    private router: Router) {
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/

    // for (let index = 0; index < 100; index++) {
    //   this.appraisals.push(this.appraisal)
    // }

    this.newAppraisalForm = this.fb.group({
      title_ar: ['', [Validators.required]],
      title_en: ['', [Validators.required]],
      typeID: ['', Validators.required],


    });

    this.validation_messages = {
      'title_ar': [
        { type: 'required', message: 'HCM.Appraisal.type.messages.title_ar.required' },
      ],
      'title_en': [
        { type: 'required', message: 'HCM.Appraisal.type.messages.title_en.required' },
      ],
      'typeID': [
        { type: 'required', message: 'HCM.Appraisal.type.messages.typeID.required' },
      ]
    }
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Appraisal', []) || this.authz.canDo('MANAGE', 'Appraisal', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.isLoading = true;

    Promise.all([
      this.getAppraisalTemplates(),
      this.appraisalService.getAllAppraisalTypes()
    ]).then(dt => {
      this.types = dt[1];
      this.isLoading = false;
    })
    let currentYear = DateTime.local().year;
    for (let index = -1; index <= 1; index++) {
      this.years.push(currentYear + index)
    }
  }

  async getAppraisalTemplates() {
    this.isLoading = true;
    let result = await this.appraisalService.getAppraisalTemplates({
      filter: this.filter,
      paginate: this.paginate
    });
    if (result.count) {
      this.dataCount = result.count;
    }
    if ((this.templates.length * this.itemsPerPage) == this.dataCount) {
      this.isEnd = true
    } else {
      this.isEnd = false;
    }

    this.templates.push({
      page: this.currentPage,
      data: result.result
    });
    this.pageData = result.result;
    this.isLoading = false;
  }
  async createAppraisalTemplate() {
    await this.app.presentLoading();
    if (this.newAppraisalForm.valid) {
      let data = this.newAppraisalForm.value;

      try {
        await this.appraisalService.createAppraisalTemplate(data);
        await this.app.dismissLoading();
        this.isAddBlock = false
        this.ngOnInit()
      } catch (e) {
        console.log(e);
      }
    } else {
      this.newAppraisalForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
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
      if (this.templates.findIndex(val => val.page == pageNumber) == -1) {
        this.paginate = {
          skip: (pageNumber * this.itemsPerPage),
          take: this.itemsPerPage <= 8 ? this.itemsPerPage : 8,
        }
        await this.getAppraisalTemplates()
      } else {
        this.pageData = this.templates.filter(val => val.page == pageNumber)[0].data;
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
