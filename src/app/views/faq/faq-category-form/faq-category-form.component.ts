import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { debounceTime } from "rxjs/operators";

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
  constructor(
    public matDialog: MatDialogRef<FaqCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.isViewOnly = data.isViewOnly;
    this.faqForm = this.fb.group({
      name: [data.name || ''],

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
    if (this.faqForm['controls']['name'].value)
      this.apiService.get(apiConstants.checkCategoryUniqueness + this.faqForm['controls']['name'].value).subscribe({
        next: (data) => {
          if (data.isUnique === false) {
            this.faqForm.controls['name'].setErrors({ 'not_unique': true });
          } else {
            if (this.faqForm.controls['name'].errors) {
              delete this.faqForm.controls['name'].errors['not_unique'];
            }
          }
        },
        error: (e) => {
          this.errorHandlingService.handle(e);
        },
      });
  }
  ngOnInit(): void { }
  saveFaqs(): void {
    this.apiCallActive = true;
    if (this.faqForm.valid) {
      const payload = {
        ...this.faqForm.value,
      }
      this.apiService.post(apiConstants.createFaqCategory, payload).subscribe({
        next: (data: any) => {
          this.apiCallActive = false;
          if (data && (data.statusCode === 200 || data.statusCode === 201)) {
            this.alertService.notify(data.message);
            this.matDialog.close(data);
          } else {
            this.errorHandlingService.handle(data);
          }
        },
        error: (error) => {
          this.errorHandlingService.handle(error);
        },
      });
    }
  }
}
