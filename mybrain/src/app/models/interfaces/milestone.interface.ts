import { Goal } from "./goal.interface";
import { RoadmapItem } from "./roadmap-item.interface";

export interface Milestone extends RoadmapItem{
    deadline: string,
    goals: Goal[],
}