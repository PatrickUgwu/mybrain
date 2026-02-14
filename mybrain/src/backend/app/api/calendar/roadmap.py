from fastapi import APIRouter
from backend.app.services.calendar import roadmap_service
from backend.app.database import SessionDep
from backend.app.models import Roadmap, RoadmapUpdate

router = APIRouter()

@router.get("/roadmaps")
def get_roadmaps(session: SessionDep):
    return roadmap_service.get_roadmaps(session)

@router.post("/roadmap")
def create_roadmap(roadmap_data: Roadmap, session: SessionDep):
    return roadmap_service.create_roadmap(roadmap_data, session)

@router.patch("/roadmap/{roadmap_id}")
def update_roadmap(roadmap_id: int, roadmap: RoadmapUpdate, session: SessionDep):
    return roadmap_service.update_roadmap(roadmap_id, roadmap, session)

@router.delete("/roadmap/{roadmap_id}")
def delete_roadmap(roadmap_id: int, session: SessionDep):
    return roadmap_service.delete_roadmap(roadmap_id, session)