import { CourtService } from 'src/app/services/court.service';
import { Case } from './../../../interfaces/types';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { Employee, Task, TaskStatus } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { AuthzService } from 'src/app/services/authz.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { EmployeePickerComponent } from '../../pickers/employee-picker/employee-picker.component';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @Input('CaseID') CaseID: number;
  @Input() isEdit: boolean = false;
  @Input() task: Task;
  @Input() taskStatus: TaskStatus;
  @Input() index: number = 0
  selectedEmployee: Employee
  addForm: FormGroup;
  public CasesFilterCtrl: FormControl = new FormControl();
  public filteredCases: Case[]
  Cases:Case[]
  today = new Date();
  constructor(
     public Court: CourtService,
     public lang: LanguageService,
    public modalCtrl: ModalController,
    public user: UserService,
    public app: AppService,
    private popoverController: PopoverController,
    fb: FormBuilder,
    public authz: AuthzService,
    private taskService: TaskService) {
    this.addForm = fb.group({
      title: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      statusID: [0],
      employeeID: [0, []],
      caseID: [0, []],
      details: ['',[]]
    });
  }


  async ngOnInit() { 
    console.log("this.CaseID")
 
    console.log(this.CaseID)
    
    this.Cases= await this.Court.getAllCases()
    this.filteredCases = this.Cases
if(this.CaseID){
  this.addForm.get('caseID').setValue(Number(this.CaseID))

}


  }
  public filterEmployeelist(value) {

    return this.filteredCases = this.Cases.filter((val) => {
      let c = val?.CaseNo+"-"+val.client?.full_name;

    return  c.toLowerCase().includes(this.CasesFilterCtrl.value);
    })



  }

  clearSelectionCases() {
    this.filteredCases = this.Cases
  }
  async add() {
    if (this.addForm.valid) {
      await this.app.presentLoading();
      try {
        await this.app.dismissLoading();
        let data = this.addForm.value
      //  data.employeeID == 0 ? delete this.selectedEmployee.id : null;
        //data.caseID == 0 ? delete data.caseID : null;
        let status = await this.taskService.createTask({
          ...data,
          index: this.index,
          statusID: this.taskStatus.id,
        });
        this.dismiss({ isAdded: true, data: status });
      } catch (e) {
        console.log("we are here ");

        console.log(e);
        this.dismiss({ isAdded: false, data: null });
      }
    } else {
      this.addForm.markAllAsTouched();
      await this.app.dismissLoading();
      await this.app.presentAlert('Sorry ~', 'Please Fill the required fields with valid values.', 'errorAlert');
    }
  }

  dismiss(data?: { isAdded: boolean, data: TaskStatus }) {
    this.modalCtrl.dismiss({
      data
    });
  }

  removeEmp() {
    this.selectedEmployee = null;
  }

  async selectEmp(ev: any) {
    const mdl = await this.modalCtrl.create({
      component: EmployeePickerComponent,
      componentProps: {
        isCustomList: true,
        isGroupEmployees: true
      }
    });

    await mdl.present();
    mdl.onWillDismiss().then(dt => {
      console.log(dt.data);
      if (!dt.data?.isCancel) {
        if (dt.data.employee) {
          this.addForm.get('employeeID').setValue(dt.data.employee.id);
          this.selectedEmployee = dt.data.employee
        }
      }
    });
  }
}
