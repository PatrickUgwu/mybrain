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