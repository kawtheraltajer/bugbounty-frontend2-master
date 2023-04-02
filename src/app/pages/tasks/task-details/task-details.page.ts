import { MatDrawer } from '@angular/material/sidenav';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EmployeePickerComponent } from 'src/app/components/pickers/employee-picker/employee-picker.component';
import { Client, Employee, Task, TaskStatus } from 'src/app/interfaces/types';
import { AppService } from 'src/app/services/app.service';
import { GroupService } from 'src/app/services/group.service';
import { LanguageService } from 'src/app/services/language.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { AuthzService } from 'src/app/services/authz.service';
import { CourtService } from 'src/app/services/court.service';
import { Case } from './../../../interfaces/types';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {
  taskID = '';
  task: Task;
  isEditMode = false;
  isHidden = true;
  newComment = '';
  editorData;
  previewData = ``;
  showComments = false;
  showCommentsHandle = true;
  sideHasBackdrop = true;
  NoOfTasks = 0
  client: Client;
  TaskNotifications: any;

  sideMode: 'over' | 'push' | 'side' = 'over';
  onSave = () => {
    console.log('save');
    console.log(this.editorData);
  }
  @ViewChild('editorcomp') editorcomp: EditorComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('previewComp') previewComp: EditorComponent;
  @ViewChild('#editorDiv') editorDiv: ElementRef;
  @ViewChild('#headerDiv') headerDiv: ElementRef;
  editorConfig = {
    height: '100%',
    menubar: false,
    readonly: true,
    language: 'en',
    directionality: 'rtl',
    resize: false,
    branding: false,
    save_enablewhendirty: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    save_onsavecallback: this.onSave,
    toolbar:
      'undo redo | formatselect | bold italic forecolor backcolor   | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help'
  };
  previewConfig = {
    readonly: true,
    mode: "readonly",
    menubar: false,
    toolbar: false,
    plugins: ['autoresize'],
    statusbar: false,
    branding: false,
    autoresize_bottom_margin: 20,
    directionality: 'rtl',
  }
  constructor(
    public groupService: GroupService,
    public popoverController: PopoverController,
    private modalController: ModalController,
    public user: UserService,
    public act: ActivatedRoute,
    public taskService: TaskService,
    public lang: LanguageService,
    public app: AppService,
    public router: Router,
    public court: CourtService,
    public authz: AuthzService) {
    /*if (!(this.authz.canDo('READ', 'Task', []) || this.authz.canDo('MANAGE', 'Task', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
  }

  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Task', []) || this.authz.canDo('MANAGE', 'Task', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.taskID = this.act.snapshot.params.id;
    await this.getTask();
    if (this.task.caseID)
      this.NoOfTasks = await this.taskService.getTasksNumber(Number(this.task.caseID));
    //console.log('this.task', this.task);

    if (!this.groupService.selectedGroup.value) {
      await this.groupService.getAllGroups();
      this.groupService.selectedGroup.next(this.groupService.groups.value.find(dt => dt.id == this.task?.status?.groupID));

    }
    this.TaskNotifications=null;
    let temp_TaskNotifications = await this.taskService.getTaskEmployeeNotifications(Number(this.task.id));
    temp_TaskNotifications.forEach(element => {
      this.TaskNotifications = [{
        first_name: element.Employee?.user.first_name,
        last_name: element.Employee?.user.last_name,
        employeeID: element.Employee?.user.employeeID,
        TaskID: element.TaskID,
        email: element.Employee?.user.email,
        pictureURL: element.Employee?.user.pictureURL,
      }]

    });

    //console.log(this.task.comments);
    /*if (this.task.details?.details) {
      this.previewData = this.task.details.details;
    }*/
  }
  AddEmployee() {

  }

  async saveDetails() {
    //console.log(this.previewData);
    /*if (this.previewData != this.task?.details?.details || !this.task?.details?.details) {
      await this.app.presentLoading();
      await this.taskService.updateTask(this.task.id, { details: { details: this.previewData } });
      if (this.task.details?.details) {
        this.task.details.details = this.previewData
      } else {
        this.task.details = { details: this.previewData };
      }
      await this.app.dismissLoading();
      if (this.isEditMode) {
        this.editModeToggle();
      }
    }*/
  }

  async addComment() {
    if (this.newComment.trim() != '') {
      let com = await this.taskService.addComment(Number(this.task.id), this.newComment);
      this.task.comments.comments.push(com);
      this.newComment = ''
    }
  }

  async getTask() {
    this.task = await this.taskService.getTask(Number(this.taskID));
  }

  async deleteComment(i: number) {
    await this.taskService.deleteComment(this.task.id, i);
    this.task.comments.comments.splice(i, 1);
  }

  editModeToggle() {
    this.isEditMode = !this.isEditMode;
    this.showCommentsHandle = !this.showCommentsHandle;
  }


  async removeEmp() {
    this.task.employee = null;
    await this.taskService.assignTaskToEmployee(this.task.id, false, this.task.employeeID);
  }

  async selectEmp(ev: any) {
    const mdl = await this.modalController.create({
      component: EmployeePickerComponent,
      componentProps: {
        isCustomList: true,
        isGroupEmployees: true
      }
    });

    await mdl.present();
    mdl.onWillDismiss().then(async dt => {
      //console.log(dt.data);
      if (!dt.data?.isCancel) {
        if (dt.data?.employee?.id != this.task.employeeID) {
          this.task = (await this.taskService.assignTaskToEmployee(this.task.id, true, dt.data?.employee?.id));
        }
      }
    });
  }

  async deleteTask() {
    let confirm = await this.app.presentConfirmAlert("Operations.Confirm", "Tasks.Delete_Message", "Operations.Cancel", "Operations.Confirm", true)
    if (confirm) {
      this.taskService.deleteTask(this.task.id).then((val) => {
        this.router.navigate([`../tasks`])
      })
    }
  }

  async update() {
    const modal = await this.modalController.create({ component: UpdateTaskModal, cssClass: 'responsiveModal', componentProps: { Task: this.task } });
    modal.onWillDismiss().then(data => {
      this.ngOnInit()
    });
    return await modal.present();
  }

  goToCase() {
    this.router.navigate(['CaseDetails/', this.task.caseID])
  }
}

@Component({
  selector: 'update-task',
  templateUrl: './update-task.html',
})
export class UpdateTaskModal implements OnInit {
  @Input('CaseID') CaseID: number;
  @Input() isEdit: boolean = false;
  @Input('Task') Task: any;
  @Input() taskStatus: TaskStatus;
  @Input() index: number = 0
  selectedEmployee: Employee
  employeeList: any;
  updateForm: FormGroup;
  TaskStatus:any;
  public CasesFilterCtrl: FormControl = new FormControl();
  public filteredCases: Case[]
  Cases: Case[]
  TaskNotifications: any;
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
    this.updateForm = fb.group({
      id: [, []],
      title: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      statusID: [0],
      employeeID: [0, []],
      Employee_notification: [null, []],
      caseID: [0, []],
      details: [, []]
    });
  }

  async ngOnInit() {
    this.TaskStatus= await this.taskService.getTaskStatus()
    this.employeeList = await this.authz.getEmployees()
   // this.employeeList.filter(dt => dt.id != this.Task.employeeID);
    this.TaskNotifications = []
    this.Cases = await this.Court.getAllCases()
    this.filteredCases = this.Cases
    if (this.CaseID) {
      this.updateForm.get('caseID').setValue(Number(this.CaseID))
    }
    this.selectedEmployee = this.Task.employee
    let temp_TaskNotifications = await this.taskService.getTaskEmployeeNotifications(Number(this.Task.id));
    temp_TaskNotifications.forEach(element => {
      this.TaskNotifications = [{
        first_name: element.Employee?.user.first_name,
        last_name: element.Employee?.user.last_name,
        employeeID: element.Employee?.user.employeeID,
        TaskID: element.TaskID,
        email: element.Employee?.user.email,
        pictureURL: element.Employee?.user.pictureURL,
      }]

    });
    this.updateForm.setValue({
      id: this.Task.id,
      title: this.Task.title,
      dueDate: this.Task.dueDate,
      statusID: this.Task.statusID,
      employeeID: this.Task.employeeID,
      caseID: this.Task.caseID,
      details: this.Task.details,
      Employee_notification: null
    })
    this.employeeList.filter(dt => dt.id != this.Task.employeeID);

  }

  addFollowUp() {
    let employee = this.updateForm.value.Employee_notification
    this.TaskNotifications.push({
      first_name: employee.user.first_name,
      last_name: employee.user.last_name,
      employeeID: employee.id,
      TaskID: this.Task.id,
      email: employee.user.email,
      pictureURL: employee.user.pictureURL,

    })
  }
  removetaskNotifications(index) {
    this.TaskNotifications.splice(index, 1);

  }

  public filterEmployeelist(value) {
    return this.filteredCases = this.Cases.filter((val) => {
      let c = val?.CaseNo + "-" + val.client?.full_name;
      return c.toLowerCase().includes(this.CasesFilterCtrl.value);
    })
  }

  clearSelectionCases() {
    this.filteredCases = this.Cases
  }

  async update() {
    if (this.updateForm.valid) {
      await this.app.presentLoading();
      try {
        await this.app.dismissLoading();
        let data = this.updateForm.value
        this.updateForm.value.Employee_notification = null
        this.updateForm.value.Employee_notification = this.TaskNotifications
        data.employeeID == 0 ? delete this.selectedEmployee.id : null;
        //data.caseID == 0 ? delete data.caseID : null;
        console.log(data)
        await this.taskService.updateTask(this.Task.id, data);
        this.dismiss();
      } catch (e) {
        console.log(e);
        this.dismiss({ isAdded: false, data: null });
      }
    } else {
      this.updateForm.markAllAsTouched();
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
  async delete(index) {

    this.TaskNotifications.splice(index, 1);

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
      //console.log(dt.data);
      if (!dt.data?.isCancel) {
        if (dt.data.employee) {
          this.updateForm.get('employeeID').setValue(dt.data.employee.id);
          this.selectedEmployee = dt.data.employee
        }
      }
    });
  }
}
