import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Goal } from "./goal.interface";
import { RoadmapItem } from "./roadmap-item.interface";

export interface Milestone extends RoadmapItem{
    deadline: string,
    goals: Goal[],
}

export function createMilestoneForm(parentTitle?: string): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    parent_id: new FormControl(parentTitle, Validators.required),
    deadline: new FormControl(Validators.required)
  });
}