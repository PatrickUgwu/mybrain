from datetime import date
from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import  Todo, TodoCreate, TodoUpdate

def get_todos(day: str, session: SessionDep):
    if day == "" or day == "today":
        day = date.today().__str__()
    elif day == "all": return session.exec(select(Todo)).all()

    todos = session.exec(select(Todo)).all()
    day_todos = []
    for todo in todos:
        if todo.deadline.__str__() == day:
            day_todos.append(todo) 
    return day_todos

def create_todo(todo_data: TodoCreate, session: SessionDep):
    todo: Todo = Todo.model_validate(todo_data)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

def update_todo(todo_id: int, todo: TodoUpdate, session: SessionDep):
    db_todo = session.get(Todo, todo_id)
    if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
    todo_data = todo.model_dump(exclude_unset=True)
    db_todo.sqlmodel_update(todo_data)
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

def delete_todo(todo_id: int, session: SessionDep):
    todo = session.get(Todo, todo_id)
    if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
    session.delete(todo)
    session.commit()