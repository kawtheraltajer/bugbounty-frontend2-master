import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController, PopoverController } from '@ionic/angular';
import { AppointmentType, Permission } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';
import { RRule, RRuleSet, Weekday } from 'rrule';
import { WeekDay } from '@angular/common';

@Component({
  selector: 'appointment-types-list',
  templateUrl: './appointment-types-list.component.html',
  styleUrls: ['./appointment-types-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentTypesListComponent implements OnInit, OnChanges {

  @Input('appointmentTypes') appointmentTypes: AppointmentType[];
  @Input('isAdd') isAdd: boolean = false;
  @Input('permission') permission: Permission;

  expandedElement: AppointmentType
  columns: string[] = [];
  displayedLength = 0;
  list = new MatTableDataSource<AppointmentType>([]);
  @ViewChild('TablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  constructor(public appoService: AppointmentService,
    public modalController: ModalController,
    public app: AppService, public authz: AuthzService) { }

  async ngOnInit() {
    await this.appoService.getAllAppointmentTypes();
    this.list = new MatTableDataSource<AppointmentType>(this.appointmentTypes);
    this.columns = [...Object.keys(this.app.fields.AppointmentType), 'actions'];
    this.displayedLength = this.columns.length;
  }

  ngOnChanges() {
    this.list.data = this.appointmentTypes;
  }

  ngAfterViewInit() {
    this.list.paginator = this.tablePaginator;
    this.list.sort = this.sort;
    this.list.filterPredicate = (data, filter) => {
      let dataToString = `${data.title_ar} ${data.title_en}`;
      return dataToString.toLowerCase().includes(filter.toLowerCase())
    }

    console.log({
      delete: this.authz.canAccess('DELETE', 'AppointmentType'),
      update: this.authz.canAccess('UPDATE', 'AppointmentType')
    });

  }

  async add() {
    const modal = await this.modalController.create({ component: AddAppointmentTypeModal, cssClass: 'AddAppointmentTypeModal' });
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
    return await modal.present();
  }
  async edit(row: AppointmentType) {

    const modal = await this.modalController.create({
      component: AddAppointmentTypeModal,
      cssClass: 'AddAppointmentTypeModal',
      componentProps: {
        isEdit: true,
        appointmentType: row,
      }
    });
    modal.onWillDismiss().then(data => {
      console.log(data);
    });
    return await modal.present();


  }
  async delete(row: AppointmentType) {
    // await this.appoService.deleteTimeSlot(row.id);

    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete Type?", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);

    if (confirm) {
      await this.appoService.deleteAppointmentType(row.id);
    }
  }


  applyFilter() {
    this.list.filter = this.searchTerm.trim().toLowerCase();
  }

  getColums() {
    return this.columns.filter(col => {
      if (col == 'actions') {
        if (this.authz.canAccess('DELETE', 'AppointmentType').isAuth || this.authz.canAccess('UPDATE', 'AppointmentType').isAuth) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    })
  }
}


@Component({
  selector: 'add-appointmentType',
  templateUrl: 'add-appointmentType.html',
})
export class AddAppointmentTypeModal implements OnInit {
  addForm: FormGroup;
  @Input() isEdit: boolean = false;
  @Input() appointmentType: AppointmentType;

  constructor(
    public modalCtrl: ModalController,
    public app: AppService,
    fb: FormBuilder,
    private appo: AppointmentService,
    public popoverController: PopoverController,) {
    this.addForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['', [Validators.required]],
      color: ['#ff3535', [Validators.required]],
      isNotary: [false]
    });
  }

  async ngOnInit() {
    if (this.isEdit) {
      console.log("edit", this.appointmentType);

      this.addForm.setValue({
        title_ar: this.appointmentType.title_ar,
        title_en: this.appointmentType.title_en,
        color: this.appointmentType.color,
        isNotary:this.appointmentType.isNotary
      });
    }
  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      try {
        let res;
        if (this.isEdit) {
          res = await this.appo.updateAppointmentType({ id: this.appointmentType.id, ...data });
        } else {
          res = await this.appo.createAppointmentType(data);
        }
        await this.app.dismissLoading();
        this.dismiss(res);
      } catch (e) {
        await this.app.dismissLoading();
        console.log(e);
        await this.app.presentAlert('Sorry ~', 'Somthing Went Wrong, Please try again.', 'errorAlert');
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }
  dismiss(data?: AppointmentType) {
    this.modalCtrl.dismiss({
      dismissed: true,
      data
    });
  }
  async choseColor(ev) {
    let color = await this.app.selectColor(this.popoverController, ev);
    this.addForm.get('color').setValue(color)
  }
}


@Component({
  selector: 'update-appointmentType',
  templateUrl: 'update-appointmentType.html',
})
export class UpdateAppointmentTypeModal implements OnInit {
  addForm: FormGroup;
  @Input() isEdit: boolean = false;
  @Input() appointmentType: AppointmentType;

  constructor(
    public modalCtrl: ModalController,
    public app: AppService,
    fb: FormBuilder,
    private appo: AppointmentService,
    public popoverController: PopoverController,) {
    this.addForm = fb.group({
      title_en: ['', [Validators.required]],
      title_ar: ['', [Validators.required]],
      color: ['#ff3535', [Validators.required]],
      isNotary: [false]
    });
  }

  async ngOnInit() {
    if (this.isEdit) {
      console.log("edit", this.appointmentType);

      this.addForm.setValue({
        title_ar: this.appointmentType.title_ar,
        title_en: this.appointmentType.title_en,
        color: this.appointmentType.color,
        isNotary:this.appointmentType.isNotary
      });
    }
  }

  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      let data = this.addForm.value;
      try {
        let res;
        if (this.isEdit) {
          res = await this.appo.updateAppointmentType({ id: this.appointmentType.id, ...data });
        } else {
          res = await this.appo.createAppointmentType(data);
        }
        await this.app.dismissLoading();
        this.dismiss(res);
      } catch (e) {
        await this.app.dismissLoading();
        console.log(e);
        await this.app.presentAlert('Sorry ~', 'Somthing Went Wrong, Please try again.', 'errorAlert');
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }
  dismiss(data?: AppointmentType) {
    this.modalCtrl.dismiss({
      dismissed: true,
      data
    });
  }
  async choseColor(ev) {
    let color = await this.app.selectColor(this.popoverController, ev);
    this.addForm.get('color').setValue(color)
  }
}

