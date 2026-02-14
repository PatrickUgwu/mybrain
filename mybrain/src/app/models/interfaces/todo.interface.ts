import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface ToDo {
    id?: number,
    title: string,
    description: string,
    completed?: boolean,
    parent?: string,
    deadline?: string
}

export function createToDoForm(): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    parent_id: new FormControl(),
    deadline: new FormControl(),
  });
}