from fastapi import APIRouter
from backend.app.services.knowledge import page_service
from backend.app.database import SessionDep
from backend.app.models import Page, PageCreate, PageUpdate

router = APIRouter()

@router.get("/pages")
def get_pages(session: SessionDep):
    return page_service.get_pages(session)

@router.get("/page/{page_id}")
def read_page(page_id: int, session: SessionDep) -> Page:
    return page_service.read_page(page_id, session)

@router.post("/page")
def create_page(page_data: PageCreate, session: SessionDep) -> Page:
    return page_service.create_page(page_data, session)

@router.patch("/page/{page_id}")
def update_page(page_id: int, page: PageUpdate, session: SessionDep):
    return page_service.update_page(page_id, page, session)

@router.delete("/page/{page_id}")
def delete_page(page_id: int, session: SessionDep):
    return page_service.delete_page(page_id, session)

@router.get("/recent_pages")
def get_recent_pages(session: SessionDep):
    return page_service.get_recent_pages(session)