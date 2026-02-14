from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import  Goal, GoalCreate, GoalUpdate

def get_goals(session: SessionDep):
    goals = session.exec(select(Goal)).all()
    return goals

def create_goal(goal_data: GoalCreate, session: SessionDep) -> Goal:
    goal: Goal = Goal.model_validate(goal_data)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal

def update_goal(goal_id: int, goal: GoalUpdate, session: SessionDep):
    db_goal = session.get(Goal, goal_id)
    if not db_goal:
            raise HTTPException(status_code=404, detail="Goal not found")
    goal_data = goal.model_dump(exclude_unset=True)
    db_goal.sqlmodel_update(goal_data)
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal

def delete_goal(goal_id: int, session: SessionDep):
    goal = session.get(Goal, goal_id)
    if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
    session.delete(goal)
    session.commit()