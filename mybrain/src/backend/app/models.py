from datetime import date, datetime
from pydantic import field_validator
from sqlmodel import Field, Relationship, SQLModel, Session, select

from .database import engine

"""
    Models for knowledge components: Workspace, Collection, Page
"""
# Workspace models
class WorkspaceBase(SQLModel):
    title: str
    description: str

class Workspace(WorkspaceBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    first_edit: datetime = Field(default=datetime.today(), index=True)
    last_edit: datetime = Field(default=datetime.today(), index=True)
    completed: bool = Field(default=False, index=True)
    collections: list["Collection"] = Relationship(back_populates="parent", cascade_delete=True)

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(WorkspaceBase):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None

# Collection models
class CollectionBase(SQLModel):
    title: str
    description: str

class Collection(CollectionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    first_edit: datetime = Field(default=datetime.today(), index=True)
    last_edit: datetime  = Field(default=datetime.today(), index=True)
    parent_id: int = Field(foreign_key="workspace.id", ondelete="CASCADE")
    parent: Workspace = Relationship(back_populates="collections")
    pages: list["Page"] = Relationship(back_populates="parent", cascade_delete=True)
    
class CollectionCreate(CollectionBase):
    parent_id: int
    @field_validator("parent_id", mode="before")
    def validate_parent(cls, v):
        with Session(engine) as session:
            par = select(Workspace).where(Workspace.title == v)
            parent = session.exec(par).first()
            return parent.id

class CollectionUpdate(CollectionBase):
    title: str | None = None
    description: str | None = None

# Page models
class PageBase(SQLModel):
    title: str
    content: str

class Page(PageBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    first_edit: datetime = Field(default=datetime.today(), index=True)
    last_edit: datetime = Field(default=datetime.today(), index=True)
    parent_id: int = Field(foreign_key="collection.id", ondelete="CASCADE")
    parent: Collection = Relationship(back_populates="pages")

class PageCreate(PageBase):
    parent_id: int
    @field_validator("parent_id", mode="before")
    def validate_parent(cls, v):
        with Session(engine) as session:
            par = select(Collection).where(Collection.title == v)
            parent = session.exec(par).first()
            return parent.id

class PageUpdate(PageBase):
    title: str | None = None
    content: str | None = None

"""
    Models for calendar components
"""
class Roadmap(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    completed: bool = Field(default=False, index=True)
    milestones: list["Milestone"] = Relationship(back_populates="parent", cascade_delete=True)
    todos: list["Todo"] = Relationship(back_populates="parent")

class RoadmapUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None

class MilestoneBase(SQLModel):
    title: str
    description: str
    parent_id: str
    deadline: str
    
class Milestone(MilestoneBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    completed: bool = Field(default=False, index=True)
    deadline: date
    parent_id: int = Field(foreign_key="roadmap.id", ondelete="CASCADE")
    parent: Roadmap = Relationship(back_populates="milestones")
    goals: list["Goal"] = Relationship(back_populates="parent", cascade_delete=True) 

class MilestoneCreate(MilestoneBase):
    deadline: date
    @field_validator("deadline", mode="before")
    def validate_deadline(cls, v):
        return date.fromisoformat(v)
    
    parent_id: int
    @field_validator("parent_id", mode="before")
    def validate_parent(cls, v):
        with Session(engine) as session:
            par = select(Roadmap).where(Roadmap.title == v)
            parent = session.exec(par).first()
            return parent.id
        
class MilestoneUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    deadline: date | None = None
    # @field_validator("deadline", mode="before")
    # def validate_deadline(cls, v):
    #     return date.fromisoformat(v)

class GoalBase(SQLModel):
    title: str
    description: str
    type: str
    deadline: str
    parent_id: str

class Goal(GoalBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    completed: bool = Field(default=False, index=True)
    deadline: date
    parent_id: int = Field(foreign_key="milestone.id", ondelete="CASCADE")
    parent: Milestone = Relationship(back_populates="goals")
    actions: list["Action"]= Relationship(back_populates="parent", cascade_delete=True) 

class GoalCreate(GoalBase):
    deadline: date
    @field_validator("deadline", mode="before")
    def validate_deadline(cls, v: str):
        return date.fromisoformat(v)
    
    parent_id: int
    @field_validator("parent_id", mode="before")
    def validate_parent(cls, v):
        with Session(engine) as session:
            par = select(Milestone).where(Milestone.title == v)
            parent = session.exec(par).first()
            return parent.id
        
class GoalUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    type: str | None = None
    deadline: date | None = None
    @field_validator("deadline", mode="before")
    def validate_deadline(cls, v):
        return date.fromisoformat(v)

class ActionBase(SQLModel):
    title: str
    description: str
    pattern: str | None
    parent_id: str

class Action(ActionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    completed: bool = Field(default=False, index=True)
    parent_id: int = Field(foreign_key="goal.id", ondelete="CASCADE")
    parent: Goal = Relationship(back_populates="actions")

class ActionCreate(ActionBase):
    parent_id: int
    @field_validator("parent_id", mode="before")
    def validate_parent(cls, v):
        with Session(engine) as session:
            par = select(Goal).where(Goal.title == v)
            parent = session.exec(par).first()
            return parent.id
        
class ActionUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    pattern: str | None = None

class TodoBase(SQLModel):
    title: str
    description: str
    parent_id: str | None
    deadline: str | None

class Todo(TodoBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    deadline: date | None
    completed: bool = Field(default=False, index=True)
    parent_id: int | None = Field(default=None, foreign_key="roadmap.id")
    parent: Roadmap | None = Relationship(back_populates="todos")

class TodoCreate(TodoBase):
    deadline: date | None
    @field_validator("deadline", mode="before")
    def validate_deadline(cls, v):
        if not v:
            return date.today()
        return date.fromisoformat(v)
    
    parent_id: int | None
    @field_validator("parent_id", mode="before")
    def validate_parent(cls, v):
        with Session(engine) as session:
            if not v: 
                return None
            par = select(Roadmap).where(Roadmap.title == v)
            parent = session.exec(par).first()
            return parent.id

class TodoUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    deadline: date | None = None
    @field_validator("deadline", mode="before")
    def validate_deadline(cls, v):
        return date.fromisoformat(v)
