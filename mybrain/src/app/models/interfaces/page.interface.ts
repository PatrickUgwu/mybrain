import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface Page {
    id?: number,
    title: string,
    content: string,
    parent_id: string,
    first_edit?: string,
    last_edit?: string
}

export function createPageForm(parentTitle?: string): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    parent_id: new FormControl(parentTitle, Validators.required),
    content: new FormControl("")
  });
}