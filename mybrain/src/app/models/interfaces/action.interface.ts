import { RoadmapItem } from "./roadmap-item.interface";

export interface Action extends RoadmapItem{
    recurringPattern?: string, // default: "daily"
}