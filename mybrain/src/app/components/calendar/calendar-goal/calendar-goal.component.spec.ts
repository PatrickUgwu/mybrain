import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarGoalComponent } from './calendar-goal.component';

describe('CalendarGoalComponent', () => {
  let component: CalendarGoalComponent;
  let fixture: ComponentFixture<CalendarGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarGoalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
