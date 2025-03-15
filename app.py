from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

SAMPLE_ROADMAPS = [
    {
        "id": "1",
        "title": "Art Portfolio Development",
        "description": "Create a professional art portfolio with diverse pieces",
        "color": "#4285F4",
        "startDate": datetime(2025, 1, 1),  # Jan 1, 2025
        "endDate": datetime(2025, 12, 31),  # Dec 31, 2025
        "milestones": [
            {
                "id": "m1",
                "title": "Build professional portfolio of 15 artworks",
                "description": "Develop a cohesive collection of high-quality artworks",
                "color": "#5C6BC0",
                "roadmapId": "1",
                "startDate": datetime(2025, 1, 1),
                "endDate": datetime(2025, 3, 31),
                "goals": [
                    {
                        "id": "g1",
                        "title": "Take course on portfolio building",
                        "description": "Learn best practices for art portfolio creation",
                        "color": "#7986CB",
                        "milestoneId": "m1",
                        "startDate": datetime(2025, 1, 1),
                        "endDate": datetime(2025, 1, 31),
                        "timeframe": "month",
                        "actions": [
                            {
                                "id": "a1",
                                "title": "Take course 2h/day",
                                "description": "Dedicate 2 hours daily to portfolio building course",
                                "parent": "g1",

                                "recurringPattern": "DAILY",
                                "completed": False,
                            },
                            {
                                "id": "a2",
                                "title": "Submit course projects",
                                "description": "Complete and submit all course project assignments",
                                "parent": "g1",
                                "completed": False,
                            },
                        ],
                    },
                    {
                        "id": "g2",
                        "title": "Create 5 digital artworks",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "color": "#7986CB",
                        "milestoneId": "m1",
                        "startDate": datetime(2025, 2, 1),
                        "endDate": datetime(2025, 2, 28),
                        "timeframe": "month",
                        "actions": [
                            {
                                "id": "a3",
                                "title": "Sketch concepts",
                                "description": "Develop initial sketches for digital pieces",
                                "parent": "g2",
                                "completed": False,
                            }
                        ],
                    },
                ],
            }
        ],
    }
]

SAMPLE_TODOS = [
    {
        "id": "t1",
        "title": "Sketch",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,3,15),
    },
    {
        "id": "t2",
        "title": "concepts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,3,16),
    },
    {
        "id": "t3",
        "title": "Sketch concepts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,3,20),
    },
]


@app.get("/actions")
async def get_actions():
    actions = []
    for roadmap in SAMPLE_ROADMAPS:
        for milestone in roadmap["milestones"]:
            for goal in milestone["goals"]:
                for action in goal["actions"]:
                    actions.append(action)
    return actions


@app.get("/todos") # tile if week or day view
async def get_todos(day: str):    
    if day == "" or day == "today":
        day = date.today().__str__()

    todos = []
    for todo in SAMPLE_TODOS:
        if todo["deadline"].__str__() == day:
            todos.append(todo) 
    print(todos)
    return todos

@app.get("/weekdays") # for week
async def get_weekdays():
    print("get my days")    
    today = date.today()
    monday = today.__sub__(timedelta(days = today.weekday()))  
    week = [monday.__add__(timedelta(days=i)) for i in range(7)]
    print("week: ", week)
    return week


@app.get("/")
async def root():
    return "You found the backend."
