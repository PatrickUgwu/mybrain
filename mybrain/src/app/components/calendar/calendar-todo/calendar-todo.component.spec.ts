import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTodoComponent } from './calendar-todo.component';

describe('CalendarTodoComponent', () => {
  let component: CalendarTodoComponent;
  let fixture: ComponentFixture<CalendarTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
