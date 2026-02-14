import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RoadmapItem } from "./roadmap-item.interface";

export interface Action extends RoadmapItem{
    recurringPattern?: string, // default: "daily"
}

export function createActionForm(parentTitle?: string): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    parent_id: new FormControl(parentTitle, [Validators.required]),
    pattern: new FormControl("daily", [Validators.required])
  });
}