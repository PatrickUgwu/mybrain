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
    SQLModel.metadata.create_all(engine)  
    yield


def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

class Roadmap(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    completed: bool = Field(default=False, index=True)
    milestones: list["Milestone"] = Relationship(back_populates="parent")
    todos: list["Todo"] = Relationship(back_populates="parent")

class MilestoneBase(SQLModel):
    title: str
    description: str
    parent_id: str
    deadline: str
    
class Milestone(MilestoneBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    completed: bool = Field(default=False, index=True)
    deadline: date
    parent_id: int = Field(foreign_key="roadmap.id")
    parent: Roadmap = Relationship(back_populates="milestones")
    goals: list["Goal"] = Relationship(back_populates="parent") 

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
    parent_id: int = Field(foreign_key="milestone.id")
    parent: Milestone = Relationship(back_populates="goals")
    actions: list["Action"]= Relationship(back_populates="parent") 

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

class ActionBase(SQLModel):
    title: str
    description: str
    pattern: str | None
    parent_id: str

class Action(ActionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    completed: bool = Field(default=False, index=True)
    parent_id: int = Field(foreign_key="goal.id")
    parent: Goal = Relationship(back_populates="actions")

class ActionCreate(ActionBase):
    parent_id: int
    @field_validator("parent_id", mode="before")
    def validate_parent(cls, v):
        with Session(engine) as session:
            par = select(Goal).where(Goal.title == v)
            parent = session.exec(par).first()
            return parent.id
        
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

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

@app.post("/roadmap")
def create_roadmap(roadmap_data: Roadmap, session: SessionDep):
    roadmap: Roadmap = Roadmap.model_validate(roadmap_data)
    session.add(roadmap)
    session.commit()
    session.refresh(roadmap)
    return roadmap

@app.post("/milestone")
def create_milestone(milestone_data: MilestoneCreate, session: SessionDep) -> Milestone:
    milestone: Milestone = Milestone.model_validate(milestone_data)
    session.add(milestone)
    session.commit()
    session.refresh(milestone)
    return milestone

@app.post("/goal")
def create_goal(goal_data: GoalCreate, session: SessionDep) -> Goal:
    goal: Goal = Goal.model_validate(goal_data)
    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal

@app.post("/action")
def create_action(action_data: ActionCreate, session: SessionDep) -> Action:
    action: Action = Action.model_validate(action_data)
    session.add(action)
    session.commit()
    session.refresh(action)
    return action

@app.post("/todo")
def create_action(todo_data: TodoCreate, session: SessionDep):
    todo: Todo = Todo.model_validate(todo_data)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
    
@app.get("/action/{action_id}")
def read_action(action_id: int, session: SessionDep) -> Action:
    action = session.get(Action, action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Hero not found")
    return action

@app.post("/action")
def create_action(action_data: ActionCreate, session: SessionDep) -> Action:
    action: Action = Action.model_validate(action_data)
    session.add(action)
    session.commit()
    session.refresh(action)
    return action

@app.delete("/action/{action_id}")
def delete_action(action_id: int, session: SessionDep):
    action = session.get(Action, action_id)
    if not action:
            raise HTTPException(status_code=404, detail="Action not found")
    session.delete(action)
    session.commit()


SAMPLE_WORKSPACES = [{
    "title" : "sample workspace",
    "collections" : [{
        "title" : "collection 1",
        "pages" : [{
            "title" : "Col1 Page1",
            "content" : """
            # page content
            ## info 
            ### text
            here
            """
        },
        {
            "title" : "Col1 Page2",
            "content" : "content of page" 
        }
            ]
    },
    {
        "title" : "collection 2",
        "pages" : [{
            "title" : "Col2 Page1",
            "content" : "the content" 
        }
        ]
    }]
}]



@app.get("/possible_parents")
def get_possible_parents(type:str, session: SessionDep):
    parents: list[str] = []
    if type == "todo" or type == "milestone":
        roadmaps = session.exec(select(Roadmap)).all()
        parents = [roadmap.title for roadmap in roadmaps]
    elif type == "goal":
        milestones = session.exec(select(Milestone)).all()
        parents = [milestone.title for milestone in milestones]
    elif type == "action":
        goals = session.exec(select(Goal)).all()
        parents = [goal.title for goal in goals]
    return parents

@app.get("/parent")
def get_parent(item_type: str, item_id: int, session: SessionDep):
    if item_type == "todo": return session.get(Todo, item_id).parent
    elif item_type == "action": return session.get(Action, item_id).parent
    elif item_type == "goal": return session.get(Goal, item_id).parent
    elif item_type == "milestone": return session.get(Milestone, item_id).parent


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
def get_knowledge():
    return SAMPLE_WORKSPACES

@app.get("/milestones")
def get_milestones(session: SessionDep):
    milestones = []
    roadmaps = session.exec(select(Roadmap)).all()
    for roadmap in roadmaps:
        for milestone in roadmap.milestones:
            milestones.append(milestone)
    return milestones

@app.get("/goals")
def get_goals(session: SessionDep):
    goals = []
    roadmaps = session.exec(select(Roadmap)).all()
    for roadmap in roadmaps:
        for milestone in roadmap.milestones:
            for goal in milestone.goals:
                goals.append(goal)
    return goals

@app.get("/today")
def get_today():
    return date.today().__str__()

@app.get("/actions")
def get_actions(session: SessionDep):
    actions = []
    roadmaps = session.exec(select(Roadmap)).all()
    for roadmap in roadmaps:
        for milestone in roadmap.milestones:
            for goal in milestone.goals:
                for action in goal.actions:
                    actions.append(action)
    return actions


@app.get("/todos") # tile if week or day view
def get_todos(day: str, session: SessionDep):
    if day == "" or day == "today":
        day = date.today().__str__()

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
    if x:=today.month%3 != 0:
        first_quarter_month = today.month - (x - 1)
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

