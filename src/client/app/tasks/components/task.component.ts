import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Task, TaskConstants} from '../../shared/index';
import {AutoFocusDirective} from '../directives/autofocus.directive';
import {TasksCounterPipe} from '../../home/filters/tasks-counter';

@Component({
  selector: 'st-task-category',
  templateUrl: 'app/tasks/components/task.component.html',
  directives: [AutoFocusDirective],
  pipes: [TasksCounterPipe]
})
export class TaskCategoryComponent {
  db:any;
  newTask:any = {};
  todayDate:string;

  @Input() tasks:Task[];
  @Input() category:string;
  @Input() title:string;
  @Input() description:string;
  @Input() displayAt:string;

  @Output() onTaskDelete = new EventEmitter();
  @Output() onTaskComplete = new EventEmitter();

  hovered:boolean = false;

  constructor() {
    //noinspection TypeScriptUnresolvedFunction
    this.db = new window.Dexie(TaskConstants.dbName);

    this.db.version(1).stores({
      tasks: '++id'
    });
    
    this.todayDate = new Date().toDateString();
    this.updateCurrentDate();
  }

  heighlight(task:Task) {
    if (!task.view) {
      task.view = {};
    }

    if (task.view.heighlight) {
      task.view.heighlight = false;
    }
    else {
      task.view.heighlight = true;
    }
  }

  editTask($event:any, task:Task) {
    $event.stopPropagation();

    task.view.editable = true;
  }

  closeEditTask(task:Task) {
    task.view.editable = false;
  }

  addTask($event:any, category:string) {
    var task:Task;

    if ($event.which == '13' && this.newTask[category]) {
      //noinspection TypeScriptValidateTypes
      task = {
        text: this.newTask[category] as string,
        category: category,
        view: {}
      };

      this.saveTask(task, 'add');
    }
  }

  changeTask($event:any, task:Task) {
    if ($event.which == '13') {
      task.view.editable = false;

      this.saveTask(task, 'update');
    }
  }

  // database actions
  openConnection() {
    this.db.open().catch(function (event:any) {
      alert("Open failed: " + event);
    });
  }

  deleteTask($event:any, task:Task) {
    $event.stopPropagation();
    this.openConnection();
    this.onTaskDelete.emit({task: task});

    this.db.tasks.delete(task.id)
      .then(() => {

      });
  }


  saveTask(task:Task, reqType:string) {
    this.openConnection();

    this.db.tasks.put(task)
      .then(() => {
        if (reqType === 'add') {
          this.newTask = {};
          this.tasks.push(task);
        }
      })
      .then(function () {
      }).catch(function (error:any) {
      alert("Ooops: " + error);
    });
  }

  changeTaskStatus($event:any, task:Task) {
    setTimeout(() => {
      if (task.completed) {
        task.completedDate = new Date().toDateString();
      }
      else {
        task.completedDate = '';
      }
      this.saveTask(task, 'update');
    }, 100);
  }
  
  updateDate($event:any, task:Task){
    let date = new Date(task.view.date).toDateString();
    
     if ($event.which == '13' ) {
      if(task.view.date &&  date){
        task.reminderDate = date;
        this.saveTask(task, 'update');
        task.view.setDate = false;
      }
    }
  }
  
  closeEditDate(task:Task){
     task.view.setDate = false;    
  }
  
  updateCurrentDate(){
    let fiveMinutes = 300000;
    setInterval(()=>this.todayDate = new Date().toDateString(), fiveMinutes);
  }
}
