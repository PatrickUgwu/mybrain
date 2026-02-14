import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Page } from "./page.interface";

export interface Collection {
    id?: number,
    title: string,
    description: string,
    parent_id: string,
    first_edit?: string,
    last_edit?: string,
    pages: Page[]
}

export function createCollectionForm(parentTitle?: string): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
    parent_id: new FormControl(parentTitle, Validators.required)
  });
}