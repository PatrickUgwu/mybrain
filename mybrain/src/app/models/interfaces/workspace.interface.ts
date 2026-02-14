import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Collection } from "./collection.interface";

export interface Workspace {
    id?: number,
    title: string,
    description: string,
    first_edit?: string,
    last_edit?: string,
    collections: Collection[]
}

export function createWorkspaceForm(): FormGroup {
  return new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
}