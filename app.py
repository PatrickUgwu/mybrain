from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, datetime, timedelta
import calendar

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
def get_actions():
    actions = []
    for roadmap in SAMPLE_ROADMAPS:
        for milestone in roadmap["milestones"]:
            for goal in milestone["goals"]:
                for action in goal["actions"]:
                    actions.append(action)
    return actions


@app.get("/todos") # tile if week or day view
def get_todos(day: str):    
    if day == "" or day == "today":
        day = date.today().__str__()

    todos = []
    for todo in SAMPLE_TODOS:
        if todo["deadline"].__str__() == day:
            todos.append(todo) 
    return todos

@app.get("/weekday") # for tile
def get_weekday(day:str):
    if day == "":
        day = date.today().__str__()
    weekday = date.fromisoformat(day).strftime("%a")
    return weekday

@app.get("/weekdays") # for week
def get_weekdays():   
    today = date.today()
    monday = today.__sub__(timedelta(days = today.weekday()))  
    week = [monday.__add__(timedelta(days=i)) for i in range(7)]
    print("week: ", week)
    return week

@app.get("/monthdays") # for month comp
def get_monthdays():  
    today = date.today()
    first_day_of_month = today - timedelta(days = today.day -1)
    number_of_days = calendar.monthrange(today.year, today.month)[1]
    month = [first_day_of_month.__add__(timedelta(days=i)) for i in range(number_of_days)]
    return month

@app.get("/quarter") # for quarter
def quarter():  
    today = date.today()
    first_quarter_month = 1 - (today.month//4) * 3
    quarter_start = date(today.year, first_quarter_month, 1) 
    quarter = [quarter_start.replace(month=quarter_start.month + i).strftime("%h") for i in range(3)]
    return quarter

@app.get("/")
def root():
    return "You found the backend."

