import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

import { MatDialog } from '@angular/material/dialog';
import { FaqFormComponent } from '../faq-form/faq-form.component';
@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss'],
})
export class FaqListComponent implements OnInit {
  addUserDialogRef: any;
  displayedColumns: string[];
  dataSource: any ;
  activeApiCall: boolean = true;

  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private _snackBar: MatSnackBar
  ) {
    this.displayedColumns = ['id', 'question', 'action']
  }
  ngOnInit(): void {
      this.getFaqs();
  }

  openFaqForm(isViewOnly: boolean, faqData: any = {}): void {
    this.addUserDialogRef = this.dialog.open(FaqFormComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: { isViewOnly, ...faqData },
    });
    this.addUserDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.getFaqs();
        }
      },
    });
  }
  getFaqs() {
    this.activeApiCall = true;
    this.apiService.get(apiConstants.faq).subscribe({
      next: (data) => {
        this.activeApiCall = false;
        if (data.statusCode === 200) {
          this.dataSource = new MatTableDataSource<any>(data.response);
        } else {
          this.errorHandlingService.handle(data);
        }
      },
      error: (e) => {
        this.activeApiCall = false;
        this.errorHandlingService.handle(e);
      },
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
