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
                        "title": "Create works",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "quarter",
                        "deadline": date(2025, 4, 26).__str__(),
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
                        "title": "month gaul",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "month",
                        "deadline": date(2025, 4, 23).__str__(),
                        "actions": [
                            
                        ],
                    },
                    {
                        "id": "g3",
                        "title": "week gaul",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "week",
                        "deadline": date(2025, 4, 28).__str__(),
                        "actions": [
                            
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
        "deadline": date(2025,4,27),
    },
    {
        "id": "t2",
        "title": "concepts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,4,28),
    },
    {
        "id": "t3",
        "title": "Sketch concepts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,4,30),
    },
    {
        "id": "t4",
        "title": "efefefepts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,4,30),
    },
    {
        "id": "t5",
        "title": "pts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,4,30),
    },
]

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
def get_possible_parents(type:str):
    parents: list[str] = []
    if type == "todo":
        parents = [roadmap["id"] for roadmap in get_roadmaps()]
    elif type == "goal":
        parents = [milestone["id"] for milestone in get_milestones()]
    elif type == "action":
        parents = [goal["id"] for goal in get_goals()]
    return parents

@app.get("/roadmaps")
def get_roadmaps():
    return SAMPLE_ROADMAPS

@app.get("/knowledge")
def get_knowledge():
    return SAMPLE_WORKSPACES

@app.get("/milestones")
def get_milestones():
    milestones = []
    for roadmap in SAMPLE_ROADMAPS:
        for milestone in roadmap["milestones"]:
            milestones.append(milestone)
    return milestones

@app.get("/goals")
def get_goals():
    goals = []
    for roadmap in SAMPLE_ROADMAPS:
        for milestone in roadmap["milestones"]:
            for goal in milestone["goals"]:
                goals.append(goal)
    return goals

@app.get("/today")
def get_today():
    return date.today().__str__()

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

@app.get("/week") # for week
def get_week():   
    today = date.today()
    monday = today.__sub__(timedelta(days = today.weekday()))  
    week = [[monday.__add__(timedelta(days=i)), get_todos(monday.__add__(timedelta(days=i)).__str__())] for i in range(7)]
    return week

@app.get("/month") # for month comp
def get_month():  
    today = date.today()
    month_calendar = calendar.monthcalendar(today.year, today.month)
    month = []

    for week in month_calendar:
        for day in week:
            if day == 0:
                month.append([None, []])
            else:
                todos = get_todos(date(today.year, today.month, day).isoformat())
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

