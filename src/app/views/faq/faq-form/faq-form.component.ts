import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { Validator } from 'src/app/providers/Validator';

@Component({
  selector: 'app-faq-form',
  templateUrl: './faq-form.component.html',
  styleUrls: ['./faq-form.component.scss'],
})
export class FaqFormComponent implements OnInit {
  isViewOnly: any;
  faqForm: FormGroup;
  apiCallActive: boolean = false;
  constructor(
    public matDialog: MatDialogRef<FaqFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.isViewOnly = data.isViewOnly;
    this.faqForm = this.fb.group({
      question: [data.question || ''],
      answer: [data.answer || ''],
    });
    if (!data.isViewOnly) {
      this.faqForm.controls['question'].setValidators(Validators.required);
      this.faqForm.controls['answer'].setValidators(Validators.required);
    }
  }

  ngOnInit(): void {}
  saveUser(): void {
    this.apiCallActive = true;
    if (this.faqForm.valid) {
      const payload = {
        ...this.faqForm.value,
      };
      this.apiService.post(apiConstants.createFaq, payload).subscribe({
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
