import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { debounceTime, map } from "rxjs/operators";
import { Constants } from 'src/app/providers/constant';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-faq-category-form',
  templateUrl: './faq-category-form.component.html',
  styleUrls: ['./faq-category-form.component.scss']
})
export class FaqCategoryFormComponent implements OnInit {

  isViewOnly: any;
  faqForm: FormGroup;
  apiCallActive: boolean = false;
  nameMaxLength: number = 50;
  faqList: any = [];
  color: any = "#000"
  constructor(
    public matDialog: MatDialogRef<FaqCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService,
    private fb: FormBuilder,
    private alertService: AlertService, private http: HttpClient
  ) {
    this.isViewOnly = data.isViewOnly;
    this.faqForm = this.fb.group({
      name: [data.name || ''],
      color: [data.color || '', Validators.required],
      cover: [data.cover || '', Validators.required],
    });
    if (!data.isViewOnly) {
      this.faqForm['controls']['name'].setValidators(
        Validators.required
      );
    }
    this.faqForm['controls']['name'].valueChanges.pipe(debounceTime(500)).subscribe({
      next: (data) => {
        this.checkFaqCategoryUniqueness()
      }
    })

  }

  isUnique: boolean = true;
  checkFaqCategoryUniqueness() {

    let formControl = this.faqForm['controls']['name'];
    if (formControl.value) {
      this.apiCallActive = true;
      this.apiService.get(apiConstants.checkCategoryUniqueness + formControl.value.toLowerCase()).subscribe({
        next: (data) => {
          this.apiCallActive = false;
          if (data.isUnique === false) {
            formControl.setErrors({ 'not_unique': true });
          } else {
            if (this.faqForm.controls['name'].errors) {
              delete this.faqForm.controls['name'].errors['not_unique'];
            }
          }
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
    }
  }
  ngOnInit(): void { }
  saveFaqs(): void {
    if (this.faqForm.valid) {
      this.apiCallActive = true;
      const payload = {
        cover: this.faqForm.value.cover,
        name: this.faqForm.value?.name.toLowerCase(),
        fileName: this.attachment
      }
      console.log(payload)
      // this.apiService.post(apiConstants.createFaqCategory, payload).subscribe({
      //   next: (data: any) => {
      //     this.apiCallActive = false;
      //     if (data && (data.statusCode === 200 || data.statusCode === 201)) {
      //       this.alertService.notify(data.message);
      //       this.matDialog.close(data);
      //     } else {
      //       this.errorHandlingService.handle(data);
      //     }
      //   },
      //   error: (error) => {
      //     this.apiCallActive = false;
      //     this.errorHandlingService.handle(error);
      //   },
      // });
    }
  }
  fileObject: any = {};
  uploadFiles($event: any): void {
    if ($event.target.value) {
      const file = $event.target.files[0];
      this.fileObject.fileName = file.name;
      this.fileObject.fileExtension = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
      this.fileObject.fileSize = file.size;
      const allowedFileExtentions = Constants.allowedFileExtentions;
      if (!allowedFileExtentions.find((format) => format === this.fileObject.fileExtension)) {
        console.log("file if = ",file)
      } else if (this.fileObject.fileSize > Constants.maximumFileSize) {
        console.log("file else if = ",file)
      } else {
        console.log("file else = ",file)
        const formData = new FormData();
        formData.append('cover', file);
        this.uploadFile(formData);
      }
    }
  }
  uploadingInProgess: boolean = false;
  uploadingProgress: any;
  attachment: any;
  uploadFile(formData: any): any {
    this.attachment = null
    this.http
      .post(environment.baseUrl + apiConstants.upload, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.ResponseHeader:
              this.uploadingInProgess = false;
              break;
            case HttpEventType.UploadProgress:
              this.uploadingProgress = Math.round(
                (event.loaded / event.total) * 100
              );
              console.log(" this.uploadingProgress = ", this.uploadingProgress)
              break;
            case HttpEventType.Response:
              if (event.body.statusCode === 200) {
                const file = event.body.response[0];
                this.attachment = {
                  url: file.value,
                  tempUrl: file.key,
                  size: file.size,
                  name: file.name,
                };
                console.log("  this.attachment = ", this.attachment)

                this.faqForm.controls['cover'].setValue(this.attachment.file.value)
              } else {
                this.errorHandlingService.handle(event.body);
              }
              setTimeout(() => {
                this.uploadingProgress = 0;
              }, 500);
          }
        })
      )
      .subscribe();
  }
  formatBytes(bytes: any, decimals = 2): any {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return '(' + parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i] + ')';
  }
  removeAttachment(): void {

  }

//   function readURL(input) {
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             $('#imagePreview').css('background-image', 'url('+e.target.result +')');
//             $('#imagePreview').hide();
//             $('#imagePreview').fadeIn(650);
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// }
// $("#imageUpload").change(function() {
//     readURL(this);
// });
}
