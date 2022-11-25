import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

import { MatDialog } from '@angular/material/dialog';
import { FaqFormComponent } from '../faq-form/faq-form.component';
import { AlertService } from 'src/app/providers/alert.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { HttpClient, HttpEventType } from '@angular/common/http';
// import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { Constants } from 'src/app/providers/constant';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss'],
})
export class FaqListComponent implements OnInit {
  addUserDialogRef: any;
  displayedColumns: string[];
  dataSource: any;
  activeApiCall: boolean = true;

  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private clipboard: Clipboard,
    private http: HttpClient
  ) {
    this.displayedColumns = ['id', 'question', 'action'];
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
          console.log(this.dataSource);
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
            this.alertService.notify(data.message);
          } else {
            this.errorHandlingService.handle(data);
          }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
    }
  }
  copyText() {
    this.clipboard.copy(
      `<iframe width="100%" height="1000px" src="${environment.baseUrl}faq-snippet.html"></iframe>`
    );
    this.alertService.notify('IFrame snippet copied!');
  }

  // uploadFiles($event: any): void {
  //   if ($event.target.value) {
  //     const file = $event.target.files[0];

  //     const fileName = file.name;
  //     const fileExtension = fileName
  //       .split('.')
  //       [fileName.split('.').length - 1].toLowerCase();
  //     const fileSize = file.size;
  //     const allowedFileExtentions = Constants.allowedFileExtentions;
  //     if (!allowedFileExtentions.find((format) => format === fileExtension)) {
  //     } else if (fileSize > Constants.maximumFileSize) {
  //     } else {
  //       const formData = new FormData();
  //       formData.append('files', file);

  //       this.uploadFile(formData);
  //     }
  //   }
  // }
  // uploadingInProgess: boolean = false;
  // uploadingProgress: any;
  // uploadFile(formData: any): any {
  //   this.http
  //     .post(environment.baseUrl + apiConstants.upload, formData, {
  //       reportProgress: true,
  //       observe: 'events',
  //     })
  //     .pipe(
  //       map((event: any) => {
  //         switch (event.type) {
  //           case HttpEventType.Sent:
  //             break;
  //           case HttpEventType.ResponseHeader:
  //             this.uploadingInProgess = false;
  //             break;
  //           case HttpEventType.UploadProgress:
  //             this.uploadingProgress = Math.round(
  //               (event.loaded / event.total) * 100
  //             );
  //             break;
  //           case HttpEventType.Response:
  //             if (event.body.statusCode === 200) {
  //               const file = event.body.response[0];
  //               const fileObject: any = {
  //                 url: file.value,
  //                 tempUrl: file.key,
  //                 size: file.size,
  //                 name: file.name,
  //               };
  //             } else {
  //               this.errorHandlingService.handle(event.body);
  //             }
  //             setTimeout(() => {
  //               this.uploadingProgress = 0;
  //             }, 500);
  //         }
  //       })
  //     )
  //     .subscribe();
  // }
}
