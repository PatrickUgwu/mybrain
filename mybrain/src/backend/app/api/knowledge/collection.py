from fastapi import APIRouter
from backend.app.services.knowledge import collection_service
from backend.app.database import SessionDep
from backend.app.models import Collection, CollectionCreate, CollectionUpdate

router = APIRouter()

@router.get("/collections")
def get_collections(session: SessionDep):
    return collection_service.get_collections(session)

@router.get("/collection/{collection_id}")
def read_collection(collection_id: int, session: SessionDep) -> Collection:
    return collection_service.read_collection(collection_id, session)

@router.post("/collection")
def create_collection(collection_data: CollectionCreate, session: SessionDep) -> Collection:
    return collection_service.create_collection(collection_data, session)

@router.patch("/collection/{collection_id}")
def update_collection(collection_id: int, collection: CollectionUpdate, session: SessionDep):
    return collection_service.update_collection(collection_id, collection, session)

@router.delete("/collection/{collection_id}")
def delete_collection(collection_id: int, session: SessionDep):
    return collection_service.delete_collection(collection_id, session)