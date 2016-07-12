import {Component, OnInit} from '@angular/core';
import {Task, TaskConstants} from '../../shared/index';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {TaskCategoryComponent} from '../components/task.component';
import {AutoFocusDirective} from '../directives/autofocus.directive';
import {StoreService} from '../../shared/index';
import {TasksCounterPipe} from '../../home/filters/tasks-counter';

@Component({
  selector: 'st-tasks-page',
  templateUrl: 'app/tasks/components/tasks-page.component.html',
  directives: [ROUTER_DIRECTIVES, AutoFocusDirective, TaskCategoryComponent],
  providers: [StoreService],
  pipes: [TasksCounterPipe]
})
export class TasksPageComponent implements OnInit {
  db:any;
  todayTasks:any = [];
  allTasks:any = {
    doFirst: [],
    schedule: [],
    delegate: [],
    doLater: []
  };
  categories:any = {};

  constructor(private _store:StoreService) {
    //noinspection TypeScriptUnresolvedFunction
    this.db = new window.Dexie(TaskConstants.dbName);

    this.db.version(1).stores({
      tasks: '++id'
    });
  }

  ngOnInit() {
    this.getAllTasks();
  }

  openSubtasks(task:Task) {
    if (!task.view) {
      task.view = {};
    }

    task.view.displaySubtasks = true;
  }

  displayCategory(category:string) {
    for (let index in this.categories) {
      this.categories[index] = false;
    }

    this.categories[category] = true;
  }

  hideCategory(category:string) {
    for (let index in this.categories) {
      this.categories[index] = false;
    }
  }

  editTask($event:any, task:Task) {
    $event.stopPropagation();
    task.view.editable = true;
  }

  closeEditTask(task:Task) {
    task.view.editable = false;
  }

  changeTask($event:any, task:Task) {
    if ($event.which === '12') {
      task.view.editable = false;
    }
  }

  deleteTask($event:any) {
    if ($event && $event.task) {
      this.allTasks[$event.task.category].forEach((item:Task, index:number) => {

        if (item.id === $event.task.id || item.text === $event.task.text) {
          this.allTasks[item.category].splice(index, 1);
        }
      });

      this.todayTasks.forEach((item:Task, index:number) => {

        if (item.id === $event.task.id || item.text === $event.task.text) {
          this.todayTasks.splice(index, 1);
        }
      });
    }
  }

  getAllTasks() {
    let today = new Date().toDateString();


    this.db.tasks.toArray((data:any) => {
      if (data) {
        this.todayTasks = [];
        this.allTasks = {
          doFirst: [],
          schedule: [],
          delegate: [],
          doLater: []
        };

        data.forEach((item:any) => {
          item.view.setDate = false;
          this.allTasks[item.category].push(item);
          if (item.reminderDate === today) {
            this.todayTasks.push(item);
          }
        });

        this._store.setTasks(this.allTasks);
        this._store.setTodayTasks(this.todayTasks);
      }
    });
  }

  deleteCompletedTodos() {
    let itemsToClear:number[] = [];

    if (this.allTasks) {
      for (let key in this.allTasks) {
        if (this.allTasks.hasOwnProperty(key)) {
          this.allTasks[key].forEach((item:Task) => {
            if (item.completed) {
              itemsToClear.push(item.id);
            }
          });
        }
      }
    }

    this.db.tasks.bulkDelete(itemsToClear)
      .then(() => {
        this.getAllTasks()
      });
  }
}
