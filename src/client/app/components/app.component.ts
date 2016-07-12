import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Routes} from '@angular/router';
import {NavbarComponent} from './navbar.component';
import {HomeComponent} from '../home/index';
import {TasksPageComponent} from '../tasks/index';
import {StoreService} from '../shared/index';

@Component({
  selector: 'st-app',
  templateUrl: 'app/components/app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent],
  providers: [StoreService]
})
@Routes([
  {
    path: '/',
    component: HomeComponent,
  },
  {
    path: '/tasks',
    component: TasksPageComponent,
  }
])
export class AppComponent {

  constructor() {
  }
}
