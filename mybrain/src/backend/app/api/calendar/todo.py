from fastapi import APIRouter
from backend.app.services.calendar import todo_service
from backend.app.database import SessionDep
from backend.app.models import Todo, TodoCreate, TodoUpdate

router = APIRouter()

@router.get("/todos") # tile if week or day view
def get_todos(day: str, session: SessionDep):
    return todo_service.get_todos(day, session)

@router.post("/todo")
def create_todo(todo_data: TodoCreate, session: SessionDep):
    return todo_service.create_todo(todo_data, session)

@router.patch("/todo/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate, session: SessionDep):
    return todo_service.update_todo(todo_id, todo, session)

@router.delete("/todo/{todo_id}")
def delete_todo(todo_id: int, session: SessionDep):
    return todo_service.delete_todo(todo_id, session)