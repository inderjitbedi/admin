import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { merge } from 'rxjs';
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
  encapsulation: ViewEncapsulation.Emulated,
})
export class FaqFormComponent implements OnInit {
  isViewOnly: any;
  faqForm: FormGroup;
  apiCallActive: boolean = false;
  questionMaxLength: number = 1000;
  answerMaxLength: number = 2500;
  faqList: any = [];
  selectedFaqCategory:any;
  constructor(
    public matDialog: MatDialogRef<FaqFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    console.log(data)
    this.isViewOnly = data.isViewOnly;
    this.selectedFaqCategory = data.selectedFaqCategory;
    this.faqForm = this.fb.group({
      faqs: this.fb.array([]),
    });
    this.faqs.push(
      this.fb.group({
        categoryId:[this.selectedFaqCategory],
        question: [data.question || ''],
        answer: [data.answer || ''],
      })
    );
    this.faqList.push({ id: 'faq' + this.faqList.length + 1 });
    if (!data.isViewOnly) {
      this.faqs['controls'][0]['controls']['question'].setValidators(
        Validators.required
      );
      this.faqs['controls'][0]['controls']['answer'].setValidators(
        Validators.required
      );
    } 
   
  }
  get faqs(): any {
    return this.faqForm.get('faqs') as FormArray;
  }
  addFaq(): void {
    this.faqList.push({ id: 'faq' + this.faqList.length + 1 });
    this.faqs.push(
      this.fb.group({
        categoryId:[this.selectedFaqCategory],
        question: ['', [Validators.required]],
        answer: ['', Validators.required],
      })
    );
  }
  removeFaq(index: number): void {
    this.faqs.removeAt(index);
    this.faqList.splice(index, 1);
  }

  ngOnInit(): void {}
  saveFaqs(): void {
    this.apiCallActive = true;
    if (this.faqForm.valid) {
      const payload = [
        ...this.faqForm.value.faqs,
      ];
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
