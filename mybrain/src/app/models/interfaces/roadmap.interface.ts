import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Milestone } from "./milestone.interface";
import { ToDo } from "./todo.interface";

export interface Roadmap {
    id?: number,
    title: string,
    description: string,
    completed?: boolean,
    milestones: Milestone[],
    todos: ToDo[]
}

export function createRoadmapForm(): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
}