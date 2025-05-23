import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMilestoneComponent } from './calendar-milestone.component';

describe('CalendarMilestoneComponent', () => {
  let component: CalendarMilestoneComponent;
  let fixture: ComponentFixture<CalendarMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarMilestoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
