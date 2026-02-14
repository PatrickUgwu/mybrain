from fastapi import APIRouter
from backend.app.services.knowledge import workspace_service
from backend.app.database import SessionDep
from backend.app.models import Workspace, WorkspaceCreate, WorkspaceUpdate

router = APIRouter()

@router.get("/workspaces")
def get_workspaces(session: SessionDep):
    return workspace_service.get_workspaces(session)

@router.get("/workspace/{workspace_id}")
def read_workspace(workspace_id: int, session: SessionDep) -> Workspace:
    return workspace_service.read_workspace(workspace_id, session)

@router.post("/workspace")
def create_workspace(workspace_data: WorkspaceCreate, session: SessionDep) -> Workspace:
    return workspace_service.create_workspaces(workspace_data, session)

@router.patch("/workspace/{workspace_id}")
def update_workspace(workspace_id: int, workspace: WorkspaceUpdate, session: SessionDep):
    return workspace_service.update_workspaces(workspace_id, workspace, session)

@router.delete("/workspace/{workspacee_id}")
def delete_workspace(workspace_id: int, session: SessionDep):
    return workspace_service.delete_workspaces(workspace_id, session)