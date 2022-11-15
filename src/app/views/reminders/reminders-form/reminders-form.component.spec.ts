import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindersFormComponent } from './reminders-form.component';

describe('RemindersFormComponent', () => {
  let component: RemindersFormComponent;
  let fixture: ComponentFixture<RemindersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemindersFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemindersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
