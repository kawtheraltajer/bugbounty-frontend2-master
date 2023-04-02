import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/interfaces/types';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input('task') task: Task;
  constructor(public user: UserService, public rt: Router, public act: ActivatedRoute) { }

  ngOnInit() {
  //  let prs = this.authz.userAuthz['User'].permissions.filter(dt =>   status.tasks.employee.id== this.filter.);
    //console.log('task', this.task)

   }

  taskDetails() {
    //console.log('-- open Task --');
    //console.log(this.task);
    this.rt.navigateByUrl(`/tasks/task-details/${this.task.id}`);
    //console.log('-- open Task --');
  }
}
