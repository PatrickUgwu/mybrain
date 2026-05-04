from fastapi import APIRouter
from backend.app.services.calendar import milestone_service
from backend.app.database import SessionDep
from backend.app.models import Milestone, MilestoneCreate, MilestoneUpdate

router = APIRouter()

@router.get("/milestones")
def get_milestones(session: SessionDep):
    return milestone_service.get_milestones(session)

@router.post("/milestone")
def create_milestone(milestone_data: MilestoneCreate, session: SessionDep) -> Milestone:
    return milestone_service.create_milestone(milestone_data, session)

@router.patch("/milestone/{milestone_id}")
def update_milestone(milestone_id: int, milestone: MilestoneUpdate, session: SessionDep):
    return milestone_service.update_milestone(milestone_id, milestone, session)

@router.delete("/milestone/{milestone_id}")
def delete_milestone(milestone_id: int, session: SessionDep):
    return milestone_service.delete_milestone(milestone_id, session)