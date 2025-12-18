import { Collection } from "./collection.interface";

export interface Workspace {
    id?: number,
    title: string,
    description: string,
    first_edit?: string,
    last_edit?: string,
    collections: Collection[]
}