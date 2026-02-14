from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import  Action, ActionCreate, ActionUpdate

def get_actions(session: SessionDep):
    actions = session.exec(select(Action)).all()
    return actions

def read_action(action_id: int, session: SessionDep) -> Action:
    action = session.get(Action, action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return action

def create_action(action_data: ActionCreate, session: SessionDep) -> Action:
    action: Action = Action.model_validate(action_data)
    session.add(action)
    session.commit()
    session.refresh(action)
    return action

def update_action(action_id: int, action: ActionUpdate, session: SessionDep):
    db_action = session.get(Action, action_id)
    if not db_action:
            raise HTTPException(status_code=404, detail="Action not found")
    action_data = action.model_dump(exclude_unset=True)
    db_action.sqlmodel_update(action_data)
    session.add(db_action)
    session.commit()
    session.refresh(db_action)
    return db_action

def delete_action(action_id: int, session: SessionDep):
    action = session.get(Action, action_id)
    if not action:
            raise HTTPException(status_code=404, detail="Action not found")
    session.delete(action)
    session.commit()