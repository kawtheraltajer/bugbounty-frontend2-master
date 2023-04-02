import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  tabs: {
    link: string,
    title: string,
    icon: string,
    selected: boolean,
    permission?: string
  }[] = [{
    title: 'Schedule.TimeSlot.Plural',
    icon: 'time-outline',
    selected: true,
    link: 'timeSlots',
   //permission: 'TimeSlot:READ'
  }, {
    title: 'Schedule.Calendar',
    icon: 'calendar-outline',
    selected: false,
    link: 'appointments',
   //permission: 'TimeSlot:READ'

  }, {
    title: 'Schedule.AppointmentType.Plural',
    icon: 'bookmark-outline',
    selected: false,
    link: 'appointmentTypes',
   //permission: 'AppointmentType:READ'
  }, {
    title: 'Schedule.AppointmentsTable.Plural',
    icon: 'list',
    selected: false,
    link: 'AppointmentsTable',
  }]
  constructor() { }
  ngOnInit() { }
}
