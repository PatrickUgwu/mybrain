from datetime import datetime
from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import Collection, CollectionCreate, CollectionUpdate, Workspace

def get_collections(session: SessionDep):
    collections = session.exec(select(Collection)).all()
    return collections

def read_collection(collection_id: int, session: SessionDep) -> Collection:
    collection = session.get(Collection, collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection

def create_collection(collection_data: CollectionCreate, session: SessionDep) -> Collection:
    collection: Collection = Collection.model_validate(collection_data)
    session.add(collection)
    session.commit()
    session.refresh(collection)
    return collection

def update_collection(collection_id: int, collection: CollectionUpdate, session: SessionDep):
    db_collection = session.get(Collection, collection_id)
    if not db_collection:
            raise HTTPException(status_code=404, detail="Collection not found")
    collection_data = collection.model_dump(exclude_unset=True)
    db_collection.sqlmodel_update(collection_data)
    db_collection.last_edit = datetime.today()

    # Update parents
    db_workspace = session.get(Workspace, db_collection.workspace_id)
    db_workspace.last_edit = db_collection.last_edit

    session.add(db_collection)
    session.commit()
    session.refresh(db_collection)
    return db_collection

def delete_collection(collection_id: int, session: SessionDep):
    collection = session.get(Collection, collection_id)
    if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
    session.delete(collection)
    session.commit()