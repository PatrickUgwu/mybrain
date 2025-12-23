from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime, timedelta
import calendar
from pydantic import field_validator
from sqlmodel import Field, Relationship, SQLModel, Session, create_engine, select


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

# Define the lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    # Workspace.__table__.drop(engine) - how u drop(=delete) a table
    SQLModel.metadata.create_all(engine)  
    yield


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
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

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

"""
    Methods for knowladge components
"""
@app.get("/workspaces")
def get_workspaces(session: SessionDep):
    workspaces = session.exec(select(Workspace)).all()
    return workspaces

@app.get("/workspace/{workspace_id}")
def read_workspace(workspace_id: int, session: SessionDep) -> Workspace:
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

@app.post("/workspace")
def create_workspace(workspace_data: WorkspaceCreate, session: SessionDep) -> Workspace:
    workspace: Workspace = Workspace.model_validate(workspace_data)
    session.add(workspace)
    session.commit()
    session.refresh(workspace)
    return workspace

@app.patch("/workspace/{workspace_id}")
def update_workspace(workspace_id: int, workspace: WorkspaceUpdate, session: SessionDep):
    db_workspace = session.get(Page, workspace_id)
    if not db_workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
    workspace_data = workspace.model_dump(exclude_unset=True)
    db_workspace.sqlmodel_update(workspace_data)
    db_workspace.last_edit = datetime.today()

    session.add(db_workspace)
    session.commit()
    session.refresh(db_workspace)
    return db_workspace

@app.delete("/workspace/{workspacee_id}")
def delete_workspace(workspace_id: int, session: SessionDep):
    workspace = session.get(Workspace, workspace_id)
    if not workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
    session.delete(workspace)
    session.commit()

@app.get("/collections")
def get_collections(session: SessionDep):
    collections = session.exec(select(Collection)).all()
    return collections

@app.get("/collection/{collection_id}")
def read_collection(collection_id: int, session: SessionDep) -> Collection:
    collection = session.get(Collection, collection_id)
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection

@app.post("/collection")
def create_collection(collection_data: CollectionCreate, session: SessionDep) -> Collection:
    print("coll-test ", collection_data.model_dump())
    collection: Collection = Collection.model_validate(collection_data)
    session.add(collection)
    session.commit()
    session.refresh(collection)
    return collection

@app.patch("/collection/{collection_id}")
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

@app.delete("/collection/{collection_id}")
def delete_collection(collection_id: int, session: SessionDep):
    collection = session.get(Collection, collection_id)
    if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
    session.delete(collection)
    session.commit()

@app.get("/pages")
def get_pages(session: SessionDep):
    pages = session.exec(select(Page)).all()
    return pages

@app.get("/page/{page_id}")
def read_page(page_id: int, session: SessionDep) -> Page:
    page = session.get(Page, page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@app.post("/page")
def create_page(page_data: PageCreate, session: SessionDep) -> Page:
    page: Page = Page.model_validate(page_data)
    session.add(page)
    session.commit()
    session.refresh(page)
    return page

@app.patch("/page/{page_id}")
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

@app.delete("/page/{page_id}")
def delete_page(page_id: int, session: SessionDep):
    page = session.get(Page, page_id)
    if not page:
            raise HTTPException(status_code=404, detail="Page not found")
    session.delete(page)
    session.commit()

"""
    Methods for calendar components
"""

@app.post("/roadmap")
def create_roadmap(roadmap_data: Roadmap, session: SessionDep):
    roadmap: Roadmap = Roadmap.model_validate(roadmap_data)
    session.add(roadmap)
    session.commit()
    session.refresh(roadmap)
    return roadmap

@app.patch("/roadmap/{roadmap_id}")
def update_roadmap(roadmap_id: int, roadmap: RoadmapUpdate, session: SessionDep):
    db_roadmap = session.get(Roadmap, roadmap_id)
    if not db_roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")
    roadmap_data = roadmap.model_dump(exclude_unset=True)
    db_roadmap.sqlmodel_update(roadmap_data)
    session.add(db_roadmap)
    session.commit()
    session.refresh(db_roadmap)
    return db_roadmap

@app.delete("/roadmap/{roadmap_id}")
def delete_roadmap(roadmap_id: int, session: SessionDep):
    roadmap = session.get(Roadmap, roadmap_id)
    if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")
    session.delete(roadmap)
    session.commit()

@app.post("/milestone")
def create_milestone(milestone_data: MilestoneCreate, session: SessionDep) -> Milestone:
    milestone: Milestone = Milestone.model_validate(milestone_data)
    session.add(milestone)
    session.commit()
    session.refresh(milestone)
    return milestone

@app.patch("/milestone/{milestone_id}")
def update_milestone(milestone_id: int, milestone: MilestoneUpdate, session: SessionDep):
    db_milestone = session.get(Milestone, milestone_id)
    if not db_milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")
    milestone_data = milestone.model_dump(exclude_unset=True)
    db_milestone.sqlmodel_update(milestone_data)
    session.add(db_milestone)
    session.commit()
    session.refresh(db_milestone)
    return db_milestone

@app.delete("/milestone/{milestone_id}")
def delete_milestone(milestone_id: int, session: SessionDep):
    milestone = session.get(Milestone, milestone_id)
    if not milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")
    session.delete(milestone)
    session.commit()

@app.post("/goal")
def create_goal(goal_data: GoalCreate, session: SessionDep) -> Goal:
    goal: Goal = Goal.model_validate(goal_data)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal

@app.patch("/goal/{goal_id}")
def update_goal(goal_id: int, goal: GoalUpdate, session: SessionDep):
    db_goal = session.get(Goal, goal_id)
    if not db_goal:
            raise HTTPException(status_code=404, detail="Goal not found")
    goal_data = goal.model_dump(exclude_unset=True)
    db_goal.sqlmodel_update(goal_data)
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal

@app.delete("/goal/{goal_id}")
def delete_goal(goal_id: int, session: SessionDep):
    goal = session.get(Goal, goal_id)
    if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
    session.delete(goal)
    session.commit()

@app.post("/todo")
def create_todo(todo_data: TodoCreate, session: SessionDep):
    todo: Todo = Todo.model_validate(todo_data)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

@app.patch("/todo/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate, session: SessionDep):
    db_todo = session.get(Todo, todo_id)
    if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
    todo_data = todo.model_dump(exclude_unset=True)
    db_todo.sqlmodel_update(todo_data)
    session.add(db_todo)
    session.commit()
    session.refresh(db_todo)
    return db_todo

@app.delete("/todo/{todo_id}")
def delete_todo(todo_id: int, session: SessionDep):
    todo = session.get(Todo, todo_id)
    if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
    session.delete(todo)
    session.commit()
    
@app.get("/action/{action_id}")
def read_action(action_id: int, session: SessionDep) -> Action:
    action = session.get(Action, action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    return action

@app.post("/action")
def create_action(action_data: ActionCreate, session: SessionDep) -> Action:
    action: Action = Action.model_validate(action_data)
    session.add(action)
    session.commit()
    session.refresh(action)
    return action

@app.patch("/action/{action_id}")
def update_action(action_id: int, action: ActionUpdate, session: SessionDep):
    db_action = session.get(Action, action_id)
    if not db_action:
            raise HTTPException(status_code=404, detail="Action not found")
    action_data = action.model_dump(exclude_unset=True)
    db_action.sqlmodel_update(action_data)
    session.add(db_action)
    session.commit()
    session.refresh(db_action)
    return db_action

@app.delete("/action/{action_id}")
def delete_action(action_id: int, session: SessionDep):
    action = session.get(Action, action_id)
    if not action:
            raise HTTPException(status_code=404, detail="Action not found")
    session.delete(action)
    session.commit()

@app.get("/possible_parents")
def get_possible_parents(type:str, session: SessionDep):
    parents: list[str] = []
    if type == "todo" or type == "milestone":
        parents = session.exec(select(Roadmap)).all()
    elif type == "goal":
        parents = session.exec(select(Milestone)).all()
    elif type == "action":
        parents = session.exec(select(Goal)).all()
    return parents

@app.get("/parent")
def get_parent(item_type: str, item_id: int, session: SessionDep):
    if item_type == "todo": return session.get(Todo, item_id).parent
    elif item_type == "action": return session.get(Action, item_id).parent
    elif item_type == "goal": return session.get(Goal, item_id).parent
    elif item_type == "milestone": return session.get(Milestone, item_id).parent
    elif item_type == "collection": return session.get(Collection, item_id).parent
    elif item_type == "page": return session.get(Page, item_id).parent


@app.get("/roadmaps")
def get_roadmaps(session: SessionDep):
    roadmaps = session.exec(select(Roadmap)).all()
    all_roadmaps =[]
    for roadmap in roadmaps:
        deep_roadmap = roadmap.model_dump()
        deep_roadmap["milestones"] = []
        milestones = roadmap.milestones
        
        for milestone in milestones:
            deep_milestone = milestone.model_dump()
            deep_milestone["goals"] = []
            goals = milestone.goals
            
            for goal in goals:
                deep_goal = goal.model_dump()
                deep_goal["actions"] = []
                actions = goal.actions

                for action in actions:
                    deep_goal["actions"].append(action.model_dump())
                deep_milestone["goals"].append(deep_goal)
            deep_roadmap["milestones"].append(deep_milestone)
        all_roadmaps.append(deep_roadmap)

    return all_roadmaps

@app.get("/knowledge")
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

@app.get("/recent_pages")
def get_recent_pages(session: SessionDep):
    all_pages: list["Page"] = session.exec(select(Page)).all()
    all_pages.sort(key=lambda page: page.last_edit, reverse=True)

    # change datetime into string
    length = min(len(all_pages), 5)
    for page in all_pages[:length]:
        page.last_edit = page.last_edit.strftime("%a - %d / %m / %y - %H : %M : %S")

    return all_pages[:5]

@app.get("/milestones")
def get_milestones(session: SessionDep):
    milestones = session.exec(select(Milestone)).all()
    return milestones

@app.get("/goals")
def get_goals(session: SessionDep):
    goals = session.exec(select(Goal)).all()
    return goals

@app.get("/today")
def get_today():
    return date.today().__str__()

@app.get("/actions")
def get_actions(session: SessionDep):
    actions = session.exec(select(Action)).all()
    return actions

@app.get("/todos") # tile if week or day view
def get_todos(day: str, session: SessionDep):
    if day == "" or day == "today":
        day = date.today().__str__()
    elif day == "all": return session.exec(select(Todo)).all()

    todos = session.exec(select(Todo)).all()
    day_todos = []
    for todo in todos:
        if todo.deadline.__str__() == day:
            day_todos.append(todo) 
    return day_todos

@app.get("/weekday") # for tile
def get_weekday(day:str):
    if day == "":
        day = date.today().__str__()
    weekday = date.fromisoformat(day).strftime("%a")
    return weekday

@app.get("/week") # for week
def get_week(session: SessionDep):   
    today = date.today()
    monday = today.__sub__(timedelta(days = today.weekday()))  
    week = [[monday.__add__(timedelta(days=i)), get_todos(monday.__add__(timedelta(days=i)).__str__(), session=session)] for i in range(7)]
    return week

@app.get("/month") # for month comp
def get_month(session: SessionDep):  
    today = date.today()
    month_calendar = calendar.monthcalendar(today.year, today.month)
    month = []

    for week in month_calendar:
        for day in week:
            if day == 0:
                month.append([None, []])
            else:
                todos = get_todos(date(today.year, today.month, day).isoformat(), session=session)
                month.append([date(today.year, today.month, day).isoformat(), todos])
    return month

@app.get("/quarter") # for quarter
def get_quarter():  
    today = date.today()
    month = today.month
    if month%3 != 0:
        first_quarter_month = today.month - (month%3 - 1)
    else:
        first_quarter_month = today.month -2
    quarter_start = date(today.year, first_quarter_month, 1) 
    quarter = [[quarter_start.replace(month=quarter_start.month + i).strftime("%h"), quarter_start.replace(month=quarter_start.month + i).__str__()[5:7]] for i in range(3)]
    return quarter

@app.get("/year") # for year
def get_year():  
    today = date.today()
    january = date(today.year, 1, 1) 
    year = [[january.replace(month = 1 + i).strftime("%h"), january.replace(month = 1 + i).__str__()[5:7]] for i in range(12)]
    return year

@app.get("/")
def root():
    return "You found the backend."