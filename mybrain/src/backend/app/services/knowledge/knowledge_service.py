from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import  Workspace, Collection, Page

def get_parent(item_type: str, item_id: int, session: SessionDep):
    if item_type == "collection": return session.get(Collection, item_id).parent
    elif item_type == "page": return session.get(Page, item_id).parent

def get_knowledge(session: SessionDep):
    all_workspaces = [] # includes all nested elements (Collections and Pages)
    workspaces = session.exec(select(Workspace)).all()
    for workspace in workspaces:
        deep_workspace = workspace.model_dump()
        deep_workspace["collections"] = []
        collections = workspace.collections
        
        for collection in collections:
            deep_collection = collection.model_dump()
            deep_collection["pages"] = []
            pages = collection.pages
            
            for page in pages:
                deep_page = page.model_dump()
                deep_collection["pages"].append(deep_page)
            deep_workspace["collections"].append(deep_collection)
        all_workspaces.append(deep_workspace)

    return all_workspaces