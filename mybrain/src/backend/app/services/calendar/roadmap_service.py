from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import  Roadmap, RoadmapUpdate

def get_roadmaps(session: SessionDep):
    roadmaps = session.exec(select(Roadmap)).all()
    all_roadmaps =[]
    for roadmap in roadmaps:
        deep_roadmap = roadmap.model_dump()
        deep_roadmap["milestones"] = []
        milestones = roadmap.milestones
        
        for milestone in milestones:
            deep_milestone = milestone.model_dump()
            deep_milestone["goals"] = []
            goals = milestone.goals
            
            for goal in goals:
                deep_goal = goal.model_dump()
                deep_goal["actions"] = []
                actions = goal.actions

                for action in actions:
                    deep_goal["actions"].append(action.model_dump())
                deep_milestone["goals"].append(deep_goal)
            deep_roadmap["milestones"].append(deep_milestone)
        all_roadmaps.append(deep_roadmap)

    return all_roadmaps

def create_roadmap(roadmap_data: Roadmap, session: SessionDep):
    roadmap: Roadmap = Roadmap.model_validate(roadmap_data)
    session.add(roadmap)
    session.commit()
    session.refresh(roadmap)
    return roadmap

def update_roadmap(roadmap_id: int, roadmap: RoadmapUpdate, session: SessionDep):
    db_roadmap = session.get(Roadmap, roadmap_id)
    if not db_roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")
    roadmap_data = roadmap.model_dump(exclude_unset=True)
    db_roadmap.sqlmodel_update(roadmap_data)
    session.add(db_roadmap)
    session.commit()
    session.refresh(db_roadmap)
    return db_roadmap

def delete_roadmap(roadmap_id: int, session: SessionDep):
    roadmap = session.get(Roadmap, roadmap_id)
    if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")
    session.delete(roadmap)
    session.commit()