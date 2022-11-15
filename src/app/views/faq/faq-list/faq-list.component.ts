import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FaqFormComponent } from '../faq-form/faq-form.component';
@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss'],
})
export class FaqListComponent implements OnInit {
    addUserDialogRef: any;

  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private _snackBar: MatSnackBar
  ) {
    this.getFaqs();
  }
  displayedColumns: string[] = ['id', 'question', 'action'];
  dataSource: any = [];

  ngOnInit(): void {}

  openCreateFaqDialog() {}

  openFaqForm(isViewOnly: boolean,faqData:any = {}): void {
    this.addUserDialogRef = this.dialog.open(FaqFormComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: { isViewOnly ,...faqData},
    });
    this.addUserDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        console.log('data in close response', data);
        if (data) {
          this.getFaqs();
        }
      },
    });
  }
  getFaqs() {
    this.apiService.get(apiConstants.faq).subscribe({
      next: (data) => {
        console.log("getFaqs:next:data",data);
        
        if (data.statusCode === 200) {
          this.dataSource = new MatTableDataSource<any>(data.response);
          console.log(  this.dataSource);
          
        } else {
          this.errorHandlingService.handle(data);
        }
      },
      error: (e) => {
        console.log("getFaqs:error:e",e);
        this.errorHandlingService.handle(e)}
    });
  }
  deleteFaq(index: number, faq: any) {
    if (window.confirm('Are you sure you want to delete this?')) {
      this.apiService.put(apiConstants.deleteFaq, { id: faq._id }).subscribe({
        next: (data) => {
          if (data.statusCode === 201 || data.statusCode === 200) {
            const srcData = this.dataSource.data;
            srcData.splice(index, 1);
            this.dataSource.data = srcData;
            this._snackBar.open(data.message, 'Close', { duration: 3000 });
          } else {
            this.errorHandlingService.handle(data);
          }
        },
        error: (e) => this.errorHandlingService.handle(e),
        // complete: () => console.info('complete'),
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
