import { AfterViewInit, Component, ElementRef, OnInit, ViewChild,Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AppService } from 'src/app/services/app.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TaskService } from 'src/app/services/task.service';
import { AddTaskStatusComponent } from 'src/app/components/task/add-task-status/add-task-status.component';
import { Group, Task, TaskStatus } from 'src/app/interfaces/types';
import { AddTaskComponent } from 'src/app/components/task/add-task/add-task.component';
import { MenuService } from 'src/app/services/menu.service';
import { LanguageService } from 'src/app/services/language.service';
import { GroupService } from 'src/app/services/group.service';
import { UserService } from 'src/app/services/user.service';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from 'src/app/auth/auth.service';
@UntilDestroy()
@Component({
  selector: 'case-tasks-list',
  templateUrl: './case-tasks-list.component.html',
  styleUrls: ['./case-tasks-list.component.scss'],
})
export class CaseTasksListComponent implements OnInit {
  @Input('CaseID') CaseID: number;
  @ViewChild('taskContainer') taskContainer: ElementRef;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('statusContainer') statusContainer: ElementRef;
  scroll: boolean;
  statuses: TaskStatus[] = [];
  filteredTaskStatuses: TaskStatus[] = [];
  searchTerm = '';
  selectedGroup: Group
  CaseTaskStatuses: TaskStatus[] = [];
  constructor(
    public popoverController: PopoverController,
    public app: AppService,
    public taskService: TaskService,
    public modalController: ModalController,
    public menu: MenuService,
    public auth: AuthService,
    public groupService: GroupService,
    public userService: UserService,
    public lang: LanguageService) { }

  async ngOnInit() {
    this.menu.enableMainMenu();
    await this.groupService.getAllGroups();
    this.groupService.selectedGroup.subscribe(async dt => {
      this.selectedGroup = dt;
      this.CaseTaskStatuses = await this.taskService.getCaseTasks(this.CaseID);
    });
    this.scroll = false;
    this.taskService.taskStatuses.subscribe(dt => {
      this.searchTerm = '';
      this.statuses = dt;
      this.filteredTaskStatuses = dt;
    });
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
        taskStatus,
        CaseID: this.CaseID
      }
    });
    modal.onWillDismiss().then(data => {
      console.log(data);
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
        taskStatus,
        CaseID: this.CaseID

      }
    });
    modal.onWillDismiss().then(data => {
      this.ngOnInit() 
      console.log(data);
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
          return v
        });
        await this.taskService.updateTasks({ tasks: taskToUpdate });
      }
    } else {
      let taskToUpdate = [];
      let item = ev.previousContainer.data[ev.previousIndex];
      item.index = ev.currentIndex;
      item.statusID = id;
      let prev = ev.previousContainer.data.filter((dt, i) => i > ev.previousIndex).map((v, i) => {
        v.index = ev.previousIndex + i;
        return v
      });
      let nex = ev.container.data.filter((dt, i) => i >= ev.currentIndex).map((v, i) => {
        v.index = ev.currentIndex + i + 1;
        return v
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
      console.log(groupsToUpdate);

      await this.taskService.updateStatusesIndex({ groups: groupsToUpdate });
    } else if (ev.currentIndex > ev.previousIndex) {
      let groupsToUpdate = ev.container.data.filter((dt, i) => i >= ev.previousIndex).map((v, i) => {
        v.index = i + ev.previousIndex;
        return { id: v.id, index: v.index }
      });
      console.log(groupsToUpdate);

      await this.taskService.updateStatusesIndex({ groups: groupsToUpdate });
    }

  }

  async updateTask() {

  }

  search() {
    // console.log(this.searchTerm);
    if (this.searchTerm.trim() != '') {
      this.filteredTaskStatuses = this.statuses.map(dt => {
        let tasks = dt.tasks.filter(val => val.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
        return { ...dt, tasks };
      });
    } else {
      this.filteredTaskStatuses = this.statuses;
    }
  }

  async deleteTaskStatus(id: number) {
    let confirm = await  this.app.presentConfirmAlert("Confirm Delete", "Are you sure you want to delete Task Status?", "Operations.Cancel", "Operations.Confirm", true)
    console.log(confirm);
    
    if (confirm) {
      this.taskService.deleteTaskStatus(id)
     }
  }

  async getColor(ev) {
    let color = await this.app.selectColor(this.popoverController, ev);
    console.log(color);
  }

}

