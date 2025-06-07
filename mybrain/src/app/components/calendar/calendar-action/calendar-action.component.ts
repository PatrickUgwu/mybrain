import { Component, input } from '@angular/core';

@Component({
  selector: 'app-calendar-action',
  standalone: true,
  imports: [],
  templateUrl: './calendar-action.component.html',
  styleUrl: './calendar-action.component.css'
})
  self = input.required<Action>()
}
