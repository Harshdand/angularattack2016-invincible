import {Component, OnInit} from '@angular/core';
import {Task} from '../../shared/index';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {TasksCounterPipe} from '../filters/tasks-counter';
import {TaskCategoryComponent} from '../../tasks/components/task.component';
import {StoreService, TaskConstants} from '../../shared/index';

@Component({
  selector: 'sd-home',
  templateUrl: 'app/home/components/home.component.html',
  directives: [ROUTER_DIRECTIVES, TaskCategoryComponent],
  providers: [StoreService],
  pipes: [TasksCounterPipe]
})
export class HomeComponent implements OnInit {
  today = new Date();
  todayTasks:any = [];
  userName:string = '';
  greetingMessage:string;
  displayUserNameField:boolean;
  db:any;

  constructor(private _store:StoreService) {
    //noinspection TypeScriptUnresolvedFunction
    this.db = new window.Dexie(TaskConstants.dbName);

    this.db.version(1).stores({
      tasks: '++id'
    });

    this.db.open().catch(function (event:any) {
      alert("Open failed: " + event);
    });

    this.userName = localStorage.getItem('userName');
    if (!this.userName) {
      this.displayUserNameField = true;
    }
    
    this.setGreetingMessage();
    this.updateGreetingMessage();
  }

  ngOnInit() {
    if(!localStorage.getItem('firstTimeUse')){
      this.db.tasks.bulkPut([
      {id:100004, text: 'Judge Smart Todo App', reminderDate: new Date().toDateString(), category:'doFirst',view:{}},
      {id:100005, text: 'Take Angular 2 Course', reminderDate: new Date().toDateString(), category:'doFirst',view:{}},      
      {id:100006, text: 'Washing Clothes', reminderDate: new Date().toDateString(), category:'delegate',view:{}},
      {id:100007,text: 'Meeting with Angular Team', category:'schedule',view:{}},
      {id:100008,text: 'Play Football', category:'doLater',view:{}},
      {id:100009,text: 'Get a coffee machine', category:'doLater',view:{}},
      {id:100010,text: 'Learn Painting', reminderDate: new Date().toDateString(), category:'schedule',view:{}},
    ])
    .then(()=>{
      localStorage.setItem('firstTimeUse','nope');
      this.getAllTasks();
    });
    }
    else{
      this.getAllTasks();      
    }
  }

  setUserName() {
    if (this.userName) {
      localStorage.setItem('userName', this.userName);
      this.displayUserNameField = false;
    }
  }

  getAllTasks() {
    let today = new Date().toDateString();
    let allTasks:any = {
      doFirst: [],
      schedule: [],
      delegate: [],
      doLater: []
    };

    this.db.tasks.toArray((data:any) => {
      if (data) {
        data.forEach((item:any) => {
          item.view.setDate = false;
          allTasks[item.category].push(item);
          if (item.reminderDate === today) {
            this.todayTasks.push(item);
          }
        });

        this._store.setTasks(allTasks);
        this._store.setTodayTasks(this.todayTasks);
      }
    });
  }
  
   updateGreetingMessage(){
    let halfHour = 1800000;
    setInterval(()=>{
      this.setGreetingMessage();
    }, halfHour);
  }
  
  setGreetingMessage(){
     let hours = new Date().getHours();

     if(hours >=12 && hours <=3){
        this.greetingMessage = 'Good Afternoon';
      }
      else if(hours >=0 && hours <12){
        this.greetingMessage = 'Good Morning';        
      }
      else{
        this.greetingMessage = 'Good Evening';                
      }
  }
}
