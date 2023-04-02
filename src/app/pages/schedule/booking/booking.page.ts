import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Employee, TimeSlot } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AppointmentService } from 'src/app/services/appointment.service';
import { AuthzService } from 'src/app/services/authz.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
  employeesTimeSlots: Employee[] = [];
  selectedEmployee: Employee;
  selectedTimeSlot: TimeSlot;
  bookForm: FormGroup;
  constructor(private http: HttpClient, public appointmentService: AppointmentService, public app: AppService, fb: FormBuilder, private authz: AuthzService) {

    this.bookForm = fb.group({
      name: ['', [Validators.required]],
      lawyer: ['', [Validators.required]],
      employee: ['', []],
      timeSlot: ['', [Validators.required]],
      client_name: ['', [Validators.required]],
      client_type: ['Individual', [Validators.required]],
      isRepresentative: [false, [Validators.required]],
      isNewClient: [false, [Validators.required]],
      isExtended: [false, [Validators.required]],
      client_cpr: [null, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      client_email: ['', Validators.required, Validators.email],
      client_phone: [null, [Validators.required]],
      case_description: ['', [Validators.required]],
    });

  }

  async ngOnInit() {
    this.employeesTimeSlots = await this.http.get<Employee[]>(`${environment.apiUrl}/appointment/getAvailableTimeSlots`, { withCredentials: true }).toPromise();
    await this.appointmentService.getAllAppointmentTypes();
    // this.bookForm.valueChanges.subscribe(val => { console.log(this.bookForm.value); return val });

  }
  selectEmp(ev) {
    console.log(ev);
  }
}
