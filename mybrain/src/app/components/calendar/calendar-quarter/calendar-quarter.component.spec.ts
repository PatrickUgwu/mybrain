import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarQuarterComponent } from './calendar-quarter.component';

describe('CalendarQuarterComponent', () => {
  let component: CalendarQuarterComponent;
  let fixture: ComponentFixture<CalendarQuarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarQuarterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarQuarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
