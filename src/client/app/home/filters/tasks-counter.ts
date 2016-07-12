import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'counter',
  pure: false
})
export class TasksCounterPipe implements PipeTransform {
  transform(items:any[], args:any[]):any {
    let count = 0;

    items.forEach((elem) => {
      if (!elem.completed) {
        count++;
      }
    });

    return count;
  }
}