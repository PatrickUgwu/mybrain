import { Component } from '@angular/core';

@Component({
  selector: 'app-calender-day',
  standalone: true,
  imports: [],
  templateUrl: './calender-day.component.html',
  styleUrl: './calender-day.component.css'
})
export class CalenderDayComponent {
  actions = ["a1", "a2", "a3"]
  todos = ["td1", "td2"]

  getItems(depth:string){
    if (depth === "actions") {return this.actions;}
    else if (depth === "todos") {return this.todos;}
    else {return "no items found"}
  }

}
