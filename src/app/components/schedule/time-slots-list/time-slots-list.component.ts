import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalController, PopoverController } from '@ionic/angular';
import { Employee, Permission, TimeSlot } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { EmployeePickerComponent } from '../../pickers/employee-picker/employee-picker.component';
import RRule, { Weekday } from 'rrule';
import { DateTime } from 'luxon';
import { LanguageService } from 'src/app/services/language.service';
import * as moment from 'moment';
@Component({
  selector: 'time-slots-list',
  templateUrl: './time-slots-list.component.html',
  styleUrls: ['./time-slots-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSlotsListComponent implements OnInit, OnChanges {
  @Input('timeSlots') timeSlots: TimeSlot[];
  @Input('isAdd') isAdd: boolean = false;
  @Input('permission') permission: Permission;
  selectedMonth = new Date().getMonth();
  selectedShowMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  selectedDate = new FormControl(new Date());
  expandedElement: TimeSlot
  columns: string[] = [];
  displayedLength = 0;
  list = new MatTableDataSource<TimeSlot>([]);
  @ViewChild('TablePaginator', { static: true }) tablePaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSearch = false;
  searchTerm = '';
  constructor(
    public appoService: AppointmentService,
    public modalController: ModalController,
    public app: AppService,
    public authz: AuthzService) { }

  async ngOnInit() {
    await this.appoService.getAllTimeSlots({
      range: {
        start: DateTime.local().startOf('month').toJSDate(),
        end: DateTime.local().endOf('month').toJSDate()
      }
    })
    this.columns = [...Object.keys(this.app.fields.TimeSlot), 'actions'];
    // console.log(this.timeSlots);
    this.getDisplayedColumns();
  }
  async activate(id, ev) {
    // console.log(id);
    // console.log(ev);
  }
  ngOnChanges() {
    this.list.data = this.timeSlots;
  }

  ngAfterViewInit() {
    this.list = new MatTableDataSource<TimeSlot>(this.timeSlots);
    this.list.paginator = this.tablePaginator;
    this.list.sort = this.sort;
    this.list.filterPredicate = (data, filter) => {
      let dataToString = `${data.employee.user.first_name} ${data.employee.user.last_name} ${data.date} ID${data.id}`;
      return dataToString.toLowerCase().includes(filter.toLowerCase())
    }
  }

  async add() {
    const modal = await this.modalController.create({ component: AddTimeSlotModal, cssClass: 'AddTimeSlotModal' });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }
  async edit(row: TimeSlot) {
    const modal = await this.modalController.create({
      component: AddTimeSlotModal,
      cssClass: 'AddTimeSlotModal',
      componentProps: {
        isEdit: true,
        timeSlot: row
      }
    });
    // modal.onWillDismiss().then(data => {
    //   console.log(data);
    // });
    return await modal.present();
  }
  async delete(row: TimeSlot) {

    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Schedule.TimeSlot.Errors.confirm_delete", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.appoService.deleteTimeSlot(row.id);
    }
  }

  async details(row: TimeSlot) {
    // const modal = await this.modalController.create({ component: UserDetailsModal, cssClass: 'responsiveModal', componentProps: { id: row.id } });
    // return await modal.present();
  }

  applyFilter() {
    this.list.filter = this.searchTerm.trim().toLowerCase();
  }

  getDisplayedColumns(): string[] {
    if (this.app.isSmallScreen) {
      let cols = this.columns.filter(dt => dt !== 'createdAt' && !dt.includes('ID'));
      this.displayedLength = cols.length;
      return cols
    } else {
      let cols = this.columns.filter(dt => {
        if (dt.includes('ID')) {
          return false;
        }

        if (this.permission) {
          return this.permission?.view_fields[dt] == true
        } else {
          return true
        }
      });
      this.displayedLength = cols.length;
      return cols
    }
  }

  chosenYearHandler(normalizedYear) {
    this.selectedYear = new Date(normalizedYear).getFullYear();;
  }
  async chosenMonthHandler(normalizedMonth, datepicker: MatDatepicker<Date>) {
    this.selectedShowMonth =new Date(normalizedMonth).getMonth() ;
    this.selectedMonth = new Date(normalizedMonth).getMonth() + 1 ;
    datepicker.select(new Date(this.selectedYear, this.selectedShowMonth, 1));
    // console.log(this.selectedYear, this.selectedMonth);
    let x = await this.appoService.getAllTimeSlots({
      range: {
        start: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth }).startOf('month').toJSDate(),
        end: DateTime.local().set({ year: this.selectedYear, month: this.selectedMonth }).endOf('month').toJSDate()
      }
    })
    datepicker.close();
  }

}

@Component({
  selector: 'add-timeSlot',
  templateUrl: 'add-timeSlot.html',
})
export class AddTimeSlotModal implements OnInit {
  addForm: FormGroup;
  @Input() isEdit: boolean = false;
  @Input() timeSlot: TimeSlot;
  @Input() selectedEmployee: Employee
  @Input() startTime: string;
  @Input() endTime: string;
  @Input() date: Date;
  @Input() fromCaledar: boolean
  isRecurrence = false;
  current_date = new Date().setHours(0, 0, 0, 0);
  days: { name: string, number: number, value: Weekday, isSelected: boolean }[] = [
    {
      name: 'Days.Sunday',
      value: RRule.SU,
      number: 0,
      isSelected: false,
    },
    {
      name: 'Days.Monday',
      value: RRule.MO,
      number: 1,
      isSelected: false,
    },
    {
      name: 'Days.Tuesday',
      value: RRule.TU,
      number: 2,
      isSelected: false,
    }, {
      name: 'Days.Wednesday',
      value: RRule.WE,
      number: 3,
      isSelected: false,
    }
    , {
      name: 'Days.Thursday',
      value: RRule.TH,
      number: 4,
      isSelected: false,
    }, {
      name: 'Days.Friday',
      value: RRule.FR,
      number: 5,
      isSelected: false,
    }, {
      name: 'Days.Saturday',
      value: RRule.SA,
      number: 6,
      isSelected: false,
    }
  ]
  hours = [];
  constructor(public modalCtrl: ModalController,
    private popoverController: PopoverController,
    public app: AppService,
    fb: FormBuilder,
    public authz: AuthzService,
    public user: UserService,
    public lang: LanguageService,
    private appointment: AppointmentService) {
    this.addForm = fb.group({
      startTime: ['', [Validators.required]],
      employeeID: ['', []],
      endTime: ['', [Validators.required]],
      date: ['', [Validators.required]],
      endDate: [''],
    });
  }


  async ngOnInit() {
    this.app.initializeHours();
    let date



    if (this.fromCaledar == true) {

      let start = new Date(this.startTime)
      let end = new Date(this.endTime)
      console.log("From calander ")
      //console.log(start)
      date = new Date(this.date);
      date.setHours(0, 0, 0, 0);
      //console.log(this.date)
      //console.log(date)
      this.addForm.setValue({
        startTime: DateTime.fromJSDate(start).toFormat('HH:mm a'),
        endTime: DateTime.fromJSDate(end).toFormat('HH:mm a'),
        date: date,
        employeeID: this.selectedEmployee.id,
        endDate: ''
      });
    }
    if (this.isEdit) {
      date = new Date(this.timeSlot.date);
      date.setHours(0, 0, 0, 0);
      let start = new Date(this.timeSlot.startTime)
      let end = new Date(this.timeSlot.endTime)
      this.selectedEmployee = this.timeSlot.employee;
      this.addForm.setValue({
        startTime: DateTime.fromJSDate(start).toFormat('HH:mm a'),
        endTime: DateTime.fromJSDate(end).toFormat('HH:mm a'),
        date: date,
        employeeID: this.selectedEmployee.id,
        endDate: ''
      });
    }


    if (this.selectedEmployee) {
      this.addForm.get('employeeID').setValue(this.selectedEmployee.id);
      console.log(this.selectedEmployee)
    }
    if (this.startTime) {
      let start = new Date(this.startTime)
      this.addForm.get('startTime').setValue(DateTime.fromJSDate(start).toFormat('HH:mm a'));
      //console.log(this.startTime)
    }
    if (this.endTime) {
      let end = new Date(this.endTime)
      this.addForm.get('endTime').setValue(DateTime.fromJSDate(end).toFormat('HH:mm a'));
      //console.log(this.endTime)
    }
    if (this.date) {
      let date = new Date(this.date);
      date.setHours(0, 0, 0, 0);
      this.addForm.get('date').setValue(date);
      //console.log(this.date)
    }

  }

  async add() {
    //console.log(this.isEdit)
    let data = this.addForm.value;
    console.log(data.date)
    await this.app.presentLoading();
    if ((this.addForm.valid && !this.isRecurrence) ||
      (this.isRecurrence && this.days.filter(dy => dy.isSelected == true).length > 0 && this.app.hours.length > 0)) {
      try {
        let res;
        if (this.isEdit) {

        } else {
          if (this.selectedEmployee?.id) {

            console.log(data.date)
            res = await this.appointment.createTimeSlot({
              date: data.date,
              endDate: this.isRecurrence ? DateTime.fromJSDate(data.endDate).plus({ hours: 3 }).toISO() : null,
              startTime: !this.isRecurrence ? moment(data.startTime, 'HH:mm a').toISOString() : null,
              endTime: !this.isRecurrence ? moment(data.endTime, 'HH:mm a').toISOString() : null,
              isRecurrence: this.isRecurrence,
              days: this.isRecurrence ? this.days.filter(dy => dy.isSelected).map(dt => dt.number) : [],
              hours: this.isRecurrence ? this.app.hours.filter(hr => hr.isSelected).map(dt => dt.number) : []
            }, this.selectedEmployee.id);

            await this.app.dismissLoading();
            console.log(res)
            this.dismiss(res);
          }
          else {

            await this.app.dismissLoading();
            if (this.lang.selectedLang == 'en') {
              await this.app.presentAlert('Alert', 'Please select the employee', 'errorAlert');
            }
            else {
              await this.app.presentAlert('تنبيه', 'الرجاء اختيار الموظف', 'errorAlert');
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
    }
  }

  dismiss(data?: any) {
    this.modalCtrl.dismiss({
      'dismissed': true,
      data
    });
  }
  removeEmployee() {
    this.selectedEmployee = null;
  }

  async selectEmployee(ev?: any) {
    const mdl = await this.modalCtrl.create({
      component: EmployeePickerComponent,
      cssClass: 'popover-width',
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      if (!dt.data?.isCancel) {
        if (dt.data.employee) {
          this.addForm.get('employeeID').setValue(dt.data.employee.id);
          this.selectedEmployee = dt.data.employee
        }
      }
    });
  }

  public timeDate(date: Date, time: string): Date {
    let splitted = time.split(':');
    let hour = splitted[0];
    let minute = splitted[1];
    return DateTime.fromJSDate(date).set({
      hour: Number(hour),
      minute: Number(minute)
    }).toJSDate();
  }
}