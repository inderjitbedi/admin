import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqFormComponent } from './faq-form/faq-form.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { LoaderModule } from '../common/loader/loader.module';
import { ClipboardModule } from '@angular/cdk/clipboard';

const routes = [
  { path: 'list', component: FaqListComponent },
  { path: 'add', component: FaqFormComponent },
  { path: 'edit/:id', component: FaqFormComponent },
  { path: '**', redirectTo: 'list' },
];

@NgModule({
  declarations: [FaqListComponent, FaqFormComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MaterialModule, LoaderModule,ClipboardModule],
  providers:[Clipboard],
})
export class FaqModule {}
