import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AppService } from 'src/app/services/app.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TaskService } from 'src/app/services/task.service';
import { AddTaskStatusComponent } from 'src/app/components/task/add-task-status/add-task-status.component';
import { Group, Task, TaskStatus, Employee } from 'src/app/interfaces/types';
import { AddTaskComponent } from 'src/app/components/task/add-task/add-task.component';
import { MenuService } from 'src/app/services/menu.service';
import { LanguageService } from 'src/app/services/language.service';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from 'src/app/auth/auth.service';
import { ConstantPool } from '@angular/compiler';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthzService } from 'src/app/services/authz.service';
import { FormControl } from '@angular/forms';
import { PrintTasksListComponent } from 'src/app/components/lists/print-tasks-list/print-tasks-list.component';

@UntilDestroy()
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit, AfterViewInit {
  @ViewChild('taskContainer') taskContainer: ElementRef;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('statusContainer') statusContainer: ElementRef;
  @ViewChild(PrintTasksListComponent) child: PrintTasksListComponent;
  public EmployeeFilterCtrl: FormControl = new FormControl();
  Employees: Employee[]
  public filteredEmployee: Employee[]
  filter: {
    createdByID: number,
    from_date: any,
    to_date: any,
    employeeID: any,
    Report_Basis: any
    statusID: number

  }
  currant_date = new Date()

  scroll: boolean;
  statuses: TaskStatus[] = [];
  filteredTaskStatuses: TaskStatus[] = [];
  searchTerm = '';
  selectedGroup: any
  bottomIndexToDo: number;
  bottomIndexInProgress: number;
  bottomIndexCompleted: number;

  constructor(
    public act: ActivatedRoute,
    public Router: Router,

    public popoverController: PopoverController,
    public app: AppService,
    public taskService: TaskService,
    public modalController: ModalController,
    public menu: MenuService,
    public auth: AuthService,
    public groupService: GroupService,
    public userService: UserService,
    public lang: LanguageService,
    public router: Router,
    public authz: AuthzService) {
    /*if (!(this.authz.canDo('READ', 'Task', []) || this.authz.canDo('MANAGE', 'Task', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    var next_month = new Date(this.currant_date.getFullYear(), this.currant_date.getMonth(), this.currant_date.getDate() + 30);
    this.filter = {
      createdByID: 0,
      from_date: this.currant_date,
      to_date: this.currant_date,
      employeeID: 0,
      Report_Basis: "Today",
      statusID: 0
    }
    this.filter
    this.currant_date.setHours(0, 0, 0, 0);
  }

  Reset_Filter() {
    this.filter = {
      createdByID: 0,
      from_date: this.currant_date,
      to_date: this.currant_date,
      employeeID: 0,
      Report_Basis: "Today",
      statusID: 0
    }
    this.child.filter = this.filter
    this.child.ngOnInit()
    this.ngOnInit()
  }

  SelectedReportType() {
    if (this.filter.Report_Basis == "Today") {

      this.filter.from_date = this.currant_date
      this.filter.to_date = this.currant_date

    } else if (this.filter.Report_Basis == "ThisMonth") {
      this.filter.from_date = new Date(this.currant_date.getFullYear(), this.currant_date.getMonth(), 1);
      this.filter.to_date = new Date(this.currant_date.getFullYear(), this.currant_date.getMonth() + 1, 0);

    }
    else if (this.filter.Report_Basis == "ThisYear") {

      this.filter.from_date = new Date(this.currant_date.getFullYear(), 0, 1);
      this.filter.to_date = new Date(this.currant_date.getFullYear(), 12, 0);

    }
    this.child.ngOnInit()
    this.ngOnInit()
  }
  async ngOnInit() {
    /*if (!(this.authz.canDo('READ', 'Task', []) || this.authz.canDo('MANAGE', 'Task', []))) {
      this.router.navigateByUrl(`/login`)
    }*/
    this.Employees = await this.authz.getEmployees()
    this.filteredEmployee = this.Employees
    this.filter.createdByID = Number(this.act.snapshot.paramMap.get("id"));

    this.menu.enableMainMenu();
    await this.groupService.getAllGroups();
    this.groupService.selectedGroup.subscribe(async dt => {
      this.selectedGroup = dt;
      await this.taskService.getData();
    });

    this.scroll = false;
    this.taskService.filter = this.filter
    this.taskService.getData();
    this.taskService.taskStatuses.subscribe(dt => {
      this.searchTerm = '';
      this.statuses = dt;
      this.filteredTaskStatuses = dt;
    });
    console.log(this.taskService.taskStatuses)
  }

  changeTodate() {
    this.child.ngOnInit()
    this.ngOnInit()
  }

  changeFromdate() {
    this.child.ngOnInit()
    this.ngOnInit()
  }

  async filteredTask() {
    this.groupService.selectedGroup.subscribe(async dt => {
      this.selectedGroup = dt;
      await this.taskService.getData();
    });

    this.scroll = false;
    this.taskService.taskStatuses.subscribe(dt => {
      this.searchTerm = '';
      this.statuses = dt;
      this.filteredTaskStatuses = dt;
    });

  }
  public filterEmployeelist(value) {
    return this.filteredEmployee = this.Employees.filter((val) => {
      let c = val.user?.first_name + " " + val.user?.last_name
      return c.toLowerCase().includes(this.EmployeeFilterCtrl.value);
    })

  }

  clearSelectionEmployee() {
    this.filteredEmployee = this.Employees
  }

  groupChanged(ev) {
    this.groupService.selectedGroup.next(this.selectedGroup);
  }

  async addTaskStatus(isEdit: boolean, taskStatus?: TaskStatus) {
    const modal = await this.modalController.create({
      component: AddTaskStatusComponent,
      cssClass: 'taskStatusModal',
      componentProps: {
        isEdit,
        groupID: this.selectedGroup.id,
        taskStatus
      }
    });
    modal.onWillDismiss().then(data => {
      //console.log(data);
    });
    return await modal.present();
  }
  async addTask(isEdit: boolean, taskStatus: TaskStatus, task?: Task) {
    const modal = await this.modalController.create({
      component: AddTaskComponent,
      cssClass: 'taskStatusModal',
      componentProps: {
        isEdit,
        task,
        taskStatus
      }
    });
    modal.onWillDismiss().then(data => {
      this.child.ngOnInit()
      this.ngOnInit()
      //console.log(data);
    });
    return await modal.present();
  }

  ngAfterViewInit() {
    // fromEvent(this.taskContainer.nativeElement, 'mousewheel')
    //   .pipe(first(), bufferCount(10), throttleTime(300), repeat(), untilDestroyed(this))
    //   .subscribe(($event: WheelEvent) => {

    //     this.taskContainer.nativeElement.scrollLeft += ($event.deltaY * 2);
    //     console.log('move');

    //     // $event.stopImmediatePropagation();
    //     // $event.stopPropagation();
    //     $event.preventDefault();
    //   });
  }

  /*async drop(ev: CdkDragDrop<any[]>, id: number) {
    // console.log(ev);

    if (ev.previousContainer === ev.container) {
      moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
      if (ev.currentIndex != ev.previousIndex) {
        let taskToUpdate = ev.container.data.map((v, i) => {
          v.index = i;
          return  {
            id: v.id,
            index: v.index,
            statusID: v.statusID,
          }
        });
  
        await this.taskService.updateTasks({ tasks: taskToUpdate });
      }
    } else {
      let taskToUpdate = [];

      let item= {
        id: ev.previousContainer.data[ev.previousIndex].id,
        index: ev.previousContainer.data[ev.previousIndex].index,
        statusID: ev.previousContainer.data[ev.previousIndex].statusID,
      }
      item.index = ev.currentIndex;
      item.statusID = id;
      let prev = ev.previousContainer.data.filter((dt, i) => i > ev.previousIndex).map((v, i) => {
        v.index = ev.previousIndex + i;
        return {
          id: v.id,
          index: v.index,
          statusID: v.statusID,
        }
      });
      let nex = ev.container.data.filter((dt, i) => i >= ev.currentIndex).map((v, i) => {
        v.index = ev.currentIndex + i + 1;
        return {
          id: v.id,
          index: v.index,
          statusID: v.statusID,
        }
      })



      taskToUpdate = [item, ...prev, ...nex];




      transferArrayItem(ev.previousContainer.data,
        ev.container.data,
        ev.previousIndex,
        ev.currentIndex);

      await this.taskService.updateTasks({ tasks: taskToUpdate });
    }
  }*/


  async drop(ev: CdkDragDrop<any[]>, id: number) {
    if (ev.previousContainer !== ev.container) {
      ev.currentIndex = 0;
      let taskToUpdate = [];

      let item= {
        id: ev.previousContainer.data[ev.previousIndex].id,
        index: ev.previousContainer.data[ev.previousIndex].index,
        statusID: ev.previousContainer.data[ev.previousIndex].statusID,
      }
      item.index = ev.currentIndex;
      item.statusID = id;
      let prev = ev.previousContainer.data.filter((dt, i) => i > ev.previousIndex).map((v, i) => {
        v.index = ev.previousIndex + i;
        return {
          id: v.id,
          index: v.index,
          statusID: v.statusID,
        }
      });
      let nex = ev.container.data.filter((dt, i) => i >= ev.currentIndex).map((v, i) => {
        v.index = ev.currentIndex + i + 1;
        return {
          id: v.id,
          index: v.index,
          statusID: v.statusID,
        }
      })

      taskToUpdate = [item, ...prev, ...nex];

      transferArrayItem(ev.previousContainer.data,
        ev.container.data,
        ev.previousIndex,
        ev.currentIndex);

      await this.taskService.updateCurrentTaskStatus({ id: item.id, status: item.statusID });
    }
  }

  async dropGroup(ev: CdkDragDrop<any[]>) {
    moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
    if (ev.currentIndex < ev.previousIndex) {
      let groupsToUpdate = ev.container.data.filter((dt, i) => i >= ev.currentIndex).map((v, i) => {
        v.index = i + ev.currentIndex;
        return { id: v.id, index: v.index }
      });

      await this.taskService.updateStatusesIndex({ groups: groupsToUpdate });
    } else if (ev.currentIndex > ev.previousIndex) {
      let groupsToUpdate = ev.container.data.filter((dt, i) => i >= ev.previousIndex).map((v, i) => {
        v.index = i + ev.previousIndex;
        return { id: v.id, index: v.index }
      });

      await this.taskService.updateStatusesIndex({ groups: groupsToUpdate });
    }

  }

  async updateTask() {

  }

  search() {
    // console.log(this.searchTerm);
    if (this.searchTerm.trim() != '') {
      this.filteredTaskStatuses = this.statuses.map(dt => {
        let tasks = dt.tasks.filter(val => val.title.toLowerCase().includes(this.searchTerm.toLowerCase())||
        val.id.toString().includes(this.searchTerm)
        );
        return { ...dt, tasks };
      });
    } else {
      this.filteredTaskStatuses = this.statuses;
    }
  }

  async deleteTaskStatus(id: number) {
    let confirm = await this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete Task Status?", "Operations.Cancel", "Operations.Confirm", true)

    if (confirm) {
      this.taskService.deleteTaskStatus(id)
    }
  }

  async getColor(ev) {
    let color = await this.app.selectColor(this.popoverController, ev);

  }

  public printDiv() {
    let content = '', notLawful = '', popupWin, alignment, dir, sessionsTitle = '';
    content = document.getElementById('print').innerHTML;

    if (this.lang.selectedLang == 'en') {
      sessionsTitle = "Tasks"
      alignment = "left"
      dir = "ltr"
    }
    else {
      sessionsTitle = "المهام"
      alignment = "right"
      dir = "rtl"
    }
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <style>
          @media print {
            td {
              font-size: 16px;
              min-height: 30px !important;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              font-size: 14px;
              background-color: #f2f2f2 !important;
              -webkit-print-color-adjust: exact;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
          @media screen
          {
            td {
              min-height: 30px !important;
            }
            th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: ${alignment};
            }
            th {
              text-align: center;
              background-color: #f2f2f2 !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              position: relative;
            }
            img {
              float: right;
              position: relative;
              padding-bottom: 1em;
            }
          }
        </style>
        <head>
          <title>Sessions</title>
        </head>
        <body>
          <button id="printbutton" type="button" onclick="document.getElementById('printbutton').style.display='none'; window.print(); window.close();">
              Print PDF
          </button>
          <img _ngcontent-hup-c585="" src="../../../../assets/fillers/logo.png" height="100" alt="">
          <div style="padding-top:5rem;">
          <h1 align="center">${sessionsTitle}</h1>
          <table class="table table-bordered"  dir= ${dir}>
            ${content}
          </table>
          </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }

  valueChange() {
    this.child.ngOnInit()
  }

}

