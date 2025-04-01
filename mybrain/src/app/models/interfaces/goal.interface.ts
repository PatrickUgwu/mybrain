import { Action } from "./action.interface";
import { RoadmapItem } from "./roadmap-item.interface";

export interface Goal extends RoadmapItem{
    type: string, // week, month, quarter
    deadline: string,
    actions: Action[]
}