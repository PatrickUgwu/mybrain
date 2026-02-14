from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from backend.app.database import engine
from backend.app.api.knowledge import knowledge, workspace, collection, page
from backend.app.api.calendar import calendar, roadmap, milestone, goal, action, todo

# Define the lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # on startup
    # Workspace.__table__.drop(engine) - how u drop(=delete) a table
    SQLModel.metadata.create_all(engine)  

    yield
    
    # on shutdown
    print("App shutting down")
    
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)
# router for knowledge components
app.include_router(knowledge.router)
app.include_router(workspace.router)
app.include_router(collection.router)
app.include_router(page.router)

# router for calendar components
app.include_router(calendar.router)
app.include_router(roadmap.router)
app.include_router(milestone.router)
app.include_router(goal.router)
app.include_router(action.router)
app.include_router(todo.router)

@app.get("/")
def root():
    return "You found the backend."
