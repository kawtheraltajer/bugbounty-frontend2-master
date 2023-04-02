import { Employee } from 'src/app/interfaces/types';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-employee-picker',
  templateUrl: './employee-picker.component.html',
  styleUrls: ['./employee-picker.component.scss'],
})
export class EmployeePickerComponent implements OnInit {
  items: any[] = [];
  @Input('isMulti') isMulti;
  @Input('isCustomList') isCustomList: boolean;
  @Input('isGroupEmployees') isGroupEmployees: boolean;
  @Input('employeeList') customEmployeeList: Employee[];
  @Input('exclude') exclude: number[] = [];
  @Input('selectedEmployees') selectedEmployees: Employee[];
  selectedEmployee: Employee
  employees: any[] = [];
  firstTime = true;
  constructor(private popoverController: PopoverController, private modalController: ModalController, public user: UserService, public groupService: GroupService) { }
  async ngOnInit() {
    try {
      if (this.isGroupEmployees && this.groupService.selectedGroup.value) {
        console.log(this.groupService.selectedGroup.value.members[0].Employee);
        this.employees = this.groupService.selectedGroup.value.members
      } else {
        if (this.isCustomList) {
          this.employees = this.customEmployeeList;
        } else {
          this.employees = (await this.user.getEmployees()).filter(em => !this.exclude.includes(em.id));
        }
      }

      if (this.isMulti && this.selectedEmployees) {
        this.selectedEmployees.forEach(emp => {
          let index = this.employees.findIndex(val => val.id == emp.id);
          if (index != -1) {
            this.employees[index].selected = true;
          }
        });
      }
      this.items = this.employees;
    } catch (err) {
      console.log(err);
    }
    console.log('this.items')
    console.log(this.items)
  }

  selectEmp(emp: Employee, itemIndex: number) {
    let index = this.employees.findIndex(val => val.id == emp.id);
    this.items[itemIndex].selected = !emp.selected
    this.employees[index].selected = !emp.selected;
    console.log(this.employees[index]);
  }

  getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.items = this.employees.filter((item) => {
        let name = item.user.first_name + " " + item.user.last_name;
        return (name.toLowerCase().includes(val.toLowerCase())
          || item.user.email.toLowerCase().includes(val.toLowerCase()));
      });
    }
  }

  async close(isCancel: boolean) {
    if (this.isMulti) {
      await this.modalController.dismiss({ isCancel, employees: this.employees.filter(val => val.selected == true) });
    } else {
      await this.modalController.dismiss({ isCancel, employee: this.selectedEmployee });
    }
  }

}
