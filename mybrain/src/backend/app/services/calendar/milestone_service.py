from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import Milestone, MilestoneCreate, MilestoneUpdate

def get_milestones(session: SessionDep):
    milestones = session.exec(select(Milestone)).all()
    return milestones

def create_milestone(milestone_data: MilestoneCreate, session: SessionDep) -> Milestone:
    milestone: Milestone = Milestone.model_validate(milestone_data)
    session.add(milestone)
    session.commit()
    session.refresh(milestone)
    return milestone

def update_milestone(milestone_id: int, milestone: MilestoneUpdate, session: SessionDep):
    db_milestone = session.get(Milestone, milestone_id)
    if not db_milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")
    milestone_data = milestone.model_dump(exclude_unset=True)
    db_milestone.sqlmodel_update(milestone_data)
    session.add(db_milestone)
    session.commit()
    session.refresh(db_milestone)
    return db_milestone

def delete_milestone(milestone_id: int, session: SessionDep):
    milestone = session.get(Milestone, milestone_id)
    if not milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")
    session.delete(milestone)
    session.commit()