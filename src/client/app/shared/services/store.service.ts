import {Injectable} from '@angular/core';

@Injectable()
export class StoreService {
  _tasks:any;
  _todaysTasks:any;

  constructor() {
  }

  getTasks() {
    return this._tasks;
  }

  setTasks(tasks:any) {
    this._tasks = tasks;
  }

  setTodayTasks(todaysTasks:any) {
    this._todaysTasks = todaysTasks;
  }

  getTodayTasks() {
    return this._todaysTasks;
  }
}