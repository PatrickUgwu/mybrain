from fastapi import APIRouter
from backend.app.services.calendar import action_service
from backend.app.database import SessionDep
from backend.app.models import Action, ActionCreate, ActionUpdate

router = APIRouter()

@router.get("/actions")
def get_actions(session: SessionDep):
    return action_service.get_actions(session)

@router.get("/action/{action_id}")
def read_action(action_id: int, session: SessionDep) -> Action:
    return action_service.read_action(action_id, session)

@router.post("/action")
def create_action(action_data: ActionCreate, session: SessionDep) -> Action:
    return action_service.create_action(action_data, session)

@router.patch("/action/{action_id}")
def update_action(action_id: int, action: ActionUpdate, session: SessionDep):
    return action_service.update_action(action_id, action, session)

@router.delete("/action/{action_id}")
def delete_action(action_id: int, session: SessionDep):
    return action_service.delete_action(action_id, session)