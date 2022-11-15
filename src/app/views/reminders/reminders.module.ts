import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemindersListComponent } from './reminders-list/reminders-list.component';
import { RemindersFormComponent } from './reminders-form/reminders-form.component';
import { RouterModule } from '@angular/router';


const routes = [
  { path: 'list', component: RemindersListComponent },
  { path: 'add', component: RemindersFormComponent },
  { path: 'edit/:id', component: RemindersFormComponent },
  { path: '**', redirectTo: 'list' },
];


@NgModule({
  declarations: [RemindersListComponent, RemindersFormComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class RemindersModule { }
