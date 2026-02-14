import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Action } from "./action.interface";
import { RoadmapItem } from "./roadmap-item.interface";

export interface Goal extends RoadmapItem{
    type: string, // week, month, quarter
    deadline: string,
    actions: Action[]
}

export function createGoalForm(parentTitle?: string): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    parent_id: new FormControl(parentTitle, Validators.required),
    deadline: new FormControl(Validators.required),
    type: new FormControl("week", Validators.required)
  });
}