from fastapi import APIRouter
from backend.app.services.calendar import goal_service
from backend.app.database import SessionDep
from backend.app.models import Goal, GoalCreate, GoalUpdate

router = APIRouter()

@router.get("/goals")
def get_goals(session: SessionDep):
    return goal_service.get_goals(session)

@router.post("/goal")
def create_goal(goal_data: GoalCreate, session: SessionDep) -> Goal:
    return goal_service.create_goal(goal_data, session)

@router.patch("/goal/{goal_id}")
def update_goal(goal_id: int, goal: GoalUpdate, session: SessionDep):
    return goal_service.update_goal(goal_id, goal ,session)

@router.delete("/goal/{goal_id}")
def delete_goal(goal_id: int, session: SessionDep):
    return goal_service.delete_goal(goal_id, session)