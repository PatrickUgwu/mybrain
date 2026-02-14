from datetime import datetime
from fastapi import HTTPException
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import Workspace, WorkspaceCreate, WorkspaceUpdate

def get_workspaces(session : SessionDep):
    workspaces = session.exec(select(Workspace)).all()
    return workspaces

def read_workspace(workspace_id: int, session : SessionDep) -> Workspace:
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

def create_workspace(workspace_data: WorkspaceCreate, session : SessionDep) -> Workspace:
    workspace: Workspace = Workspace.model_validate(workspace_data)
    session.add(workspace)
    session.commit()
    session.refresh(workspace)
    return workspace

def update_workspace(workspace_id: int, workspace: WorkspaceUpdate, session : SessionDep):
    db_workspace = session.get(Workspace, workspace_id)
    if not db_workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
    workspace_data = workspace.model_dump(exclude_unset=True)
    db_workspace.sqlmodel_update(workspace_data)
    db_workspace.last_edit = datetime.today()

    session.add(db_workspace)
    session.commit()
    session.refresh(db_workspace)
    return db_workspace

def delete_workspace(workspace_id: int, session : SessionDep):
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
    session.delete(workspace)
    session.commit()