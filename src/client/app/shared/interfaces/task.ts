export interface Task {
  id?:number;
  text:string;
  dateAdded?:string;
  reminderDate?:string;
  completedDate?:string;
  completed?:boolean;
  category?:string;
  view?:any;
}