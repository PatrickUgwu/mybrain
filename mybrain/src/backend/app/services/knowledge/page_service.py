
from datetime import datetime
from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import Collection, Page, PageCreate, PageUpdate, Workspace

def get_pages(session: SessionDep):
    pages: list["Page"] = session.exec(select(Page)).all()
    # change datetime into string
    for page in pages:
        page.first_edit = page.first_edit.strftime("%a - %d / %m / %y - %H : %M : %S")
        page.last_edit = page.last_edit.strftime("%a - %d / %m / %y - %H : %M : %S")

    return pages

def read_page(page_id: int, session: SessionDep) -> Page:
    page = session.get(Page, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

def create_page(page_data: PageCreate, session: SessionDep) -> Page:
    page: Page = Page.model_validate(page_data)
    session.add(page)
    session.commit()
    session.refresh(page)
    return page

def update_page(page_id: int, page: PageUpdate, session: SessionDep):
    db_page = session.get(Page, page_id)
    if not db_page:
            raise HTTPException(status_code=404, detail="Page not found")
    page_data = page.model_dump(exclude_unset=True)
    db_page.sqlmodel_update(page_data)
    db_page.last_edit = datetime.today()

    # Update parents
    db_collection = session.get(Collection, db_page.parent_id)
    db_collection.last_edit = db_page.last_edit
    db_workspace = session.get(Workspace, db_collection.parent_id)
    db_workspace.last_edit = db_collection.last_edit

    session.add(db_page)
    session.commit()
    session.refresh(db_page)
    return db_page

def delete_page(page_id: int, session: SessionDep):
    page = session.get(Page, page_id)
    if not page:
            raise HTTPException(status_code=404, detail="Page not found")
    session.delete(page)
    session.commit()

def get_recent_pages(session: SessionDep):
    all_pages: list["Page"] = session.exec(select(Page)).all()
    all_pages.sort(key=lambda page: page.last_edit, reverse=True)

    # change datetime into string
    length = min(len(all_pages), 5)
    for page in all_pages[:length]:
        page.last_edit = page.last_edit.strftime("%a - %d / %m / %y - %H : %M : %S")

    return all_pages[:5]