export interface Page {
    id?: number,
    title: string,
    content: string,
    parent_id: string,
    first_edit?: string,
    last_edit?: string
}