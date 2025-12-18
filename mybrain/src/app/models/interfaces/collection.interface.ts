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