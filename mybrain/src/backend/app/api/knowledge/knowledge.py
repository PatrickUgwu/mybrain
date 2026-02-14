from fastapi import APIRouter
from backend.app.services.knowledge import knowledge_service
from backend.app.database import SessionDep

router = APIRouter()

@router.get("/knowledge_parent")
def get_parent(item_type: str, item_id: int, session: SessionDep):
    return knowledge_service.get_parent(item_type, item_id, session)

@router.get("/knowledge")
def get_knowledge(session: SessionDep):
    return knowledge_service.get_knowledge(session)