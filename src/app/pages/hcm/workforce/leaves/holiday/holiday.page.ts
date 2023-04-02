import { LeaveType, Holiday } from './../../../../../interfaces/types';
import { AfterViewInit, ChangeDetectionStrategy, Input, OnChanges, OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { LanguageService } from 'src/app/services/language.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.page.html',
  styleUrls: ['./holiday.page.scss'],
})
export class HolidayPage implements OnInit {
  searchTerm = '';
  holiday: Holiday[];
  @Input('isAdd') isAdd: boolean = false;
  HolidayColumns: string[];
  @Input('selecteHoliday') selecteHoliday: Holiday[];
  HolidayList = new MatTableDataSource([]);
  @Input('showSelected') showSelected: boolean;
  selection = new SelectionModel<Holiday>(true, []);
  @ViewChild('HolidayPaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;

  constructor(public lang: LanguageService, public modalController: ModalController, public app: AppService, public authz: AuthzService, private router: Router, public user: UserService) {
    /*if (!(this.authz.canDo('READ', 'Holiday', []) || this.authz.canDo('MANAGE', 'Holiday', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }
  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Holiday', []) || this.authz.canDo('MANAGE', 'Holiday', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.holiday = await this.authz.getAllHoliday();

    this.HolidayColumns = ['id', 'name', 'from_date', 'Action'];
    this.getDisplayedColumns();
    this.HolidayList = new MatTableDataSource(this.holiday);
    this.HolidayList.paginator = this.tablePaginator;
    if (this.selecteHoliday && this.showSelected) {
      let selectedIds = this.selecteHoliday.map(dt => dt.id);

    }

  }


  getDisplayedColumns(): string[] {
    return this.HolidayColumns
  }
  async ngOnChanges() {
    this.holiday = await this.authz.getAllHoliday();

    this.HolidayList.data = this.holiday
  }
  async ngAfterViewInit() {
    this.holiday = await this.authz.getAllHoliday();

    this.HolidayList = new MatTableDataSource(this.holiday);
    this.HolidayList.paginator = this.tablePaginator;
    this.HolidayList.sort = this.sort;
  }
  async activate(id, ev) {
    console.log(id);
    console.log(ev);

  }

  async add() {
    const modal = await this.modalController.create({ component: AddHolidayPage, cssClass: 'responsiveModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
      console.log(data);
    });
    return await modal.present();
  }

  async update(row) {
    console.log("update row !!")
    console.log(row)
    const modal = await this.modalController.create({ component: UpdateHolidayPage, cssClass: 'responsiveModal', componentProps: { holiday: row } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()

      console.log(data);
    });
    return await modal.present();
  }



  async delete(row) {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "HCM.Workforce.leaves.holiday.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);

    if (confirm) {
      this.authz.deleteHoliday(row.id)
      this.ngOnInit()


    }

  }
  tURL(imgPath: string) {
    return this.user.getProfilePicURL(imgPath);
  }


  applyFilter() {
    this.HolidayList.filter = this.searchTerm.trim().toLowerCase();
  }



}

@Component({
  selector: 'add-holiday',
  templateUrl: './add-holiday.html',
})

export class AddHolidayPage implements OnInit {
  end_date: any;
  validation_messages: any;
  addForm: FormGroup;
  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.addForm = fb.group({
      id: ['',],
      name_ar: ['', [Validators.required]],
      name_en: ['',],
      from_date: ['', [Validators.required]],



    });

  }

  async ngOnInit() {

    this.validation_messages = {

      'name_ar': [
        { type: 'required', message: 'HCM.Workforce.leaves.holiday.massages.name_ar.required' },

      ],
      'name_en': [
        { type: 'required', message: 'HCM.Workforce.leaves.holiday.massages.name_en.required' },
      ],

      'from_date': [
        { type: 'required', message: 'HCM.Workforce.leaves.holiday.massages.from_date.required' },

      ]



    }


  }
  edn_date() {
    this.end_date = this.addForm.value.to_date.setDate(this.addForm.value.to_date.getDate() + this.addForm.value.number_of_days);
    console.log(this.end_date)
  }

  async add() {
    await this.app.presentLoading();
    console.log("this.addForm.value")

    console.log(this.addForm.value)
    if (this.addForm.valid) {
      let data = this.addForm.value;

      try {
        await this.authz.addHoliday(data);
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
  selector: 'update-holiday',
  templateUrl: './update-holiday.html',
})

export class UpdateHolidayPage implements OnInit {
  validation_messages: any;
  addForm: FormGroup;
  @Input('holiday') holiday: Holiday

  constructor(public modalCtrl: ModalController, private app: AppService, fb: FormBuilder, public authz: AuthzService) {
    this.addForm = fb.group({
      id: ['',],
      name_ar: ['', [Validators.required]],
      name_en: ['',],
      from_date: ['', [Validators.required]],




    });

  }

  async ngOnInit() {

    console.log(this.holiday)
    this.addForm.setValue({
      id: this.holiday.id,
      name_ar: this.holiday.name_ar,
      name_en: this.holiday.name_en,
      from_date: this.holiday.date,

    })
    this.validation_messages = {

      'name_ar': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.name_ar.required' },

      ],
      'name_en': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.name_en.required' },
      ],

      'allowed_per_year': [
        { type: 'required', message: 'HCM.Workforce.leaves.leave_Types.massages.allowed_per_year.required' },
        { type: 'pattern', message: 'HCM.Workforce.leaves.leave_Types.massages.allowed_per_year.pattern' },

      ]



    }


  }


  async add() {
    await this.app.presentLoading();
    if (this.addForm.valid) {
      let data = this.addForm.value;

      try {
        await this.authz.updateHoliday(data);
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
