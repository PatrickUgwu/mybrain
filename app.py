import copy
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
                        "type": "month",
                        "deadline": date(2025, 2, 28).__str__(),
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
                        "title": "Create 5 digital artworks fefefefe efefefef",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "month",
                        "deadline": date(2025, 3, 29).__str__(),
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
                    {
                        "id": "g3",
                        "title": "Create 5 digital artworks fefefefe efefefef",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "quarter",
                        "deadline": date(2025, 4, 30).__str__(),
                        "actions": [
                            {
                                "id": "a5",
                                "title": "Skefefefecepts",
                                "description": "Develop initial sketches for digital pieces",
                                "parent": "g2",
                                "completed": False,
                            }
                        ],
                    },
                    {
                        "id": "g4",
                        "title": "Create 5 digital artworksfefefefe efefefef",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "quarter",
                        "deadline": date(2025, 8, 28).__str__(),
                        "actions": [
                            {
                                "id": "a6",
                                "title": "effefef cefefefts",
                                "description": "Develop initial sketches for digital pieces",
                                "parent": "g2",
                                "completed": False,
                            }
                        ],
                    },
                    {
                        "id": "g7",
                        "title": "gggggg efefefef",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "quarter",
                        "deadline": date(2025, 1, 30).__str__(),
                        "actions": [
                            {
                                "id": "a5",
                                "title": "Skefefefecepts",
                                "description": "Develop initial sketches for digital pieces",
                                "parent": "g2",
                                "completed": False,
                            }
                        ],
                    },
                    {
                        "id": "g8",
                        "title": "Cre efefefef",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "quarter",
                        "deadline": date(2025, 2, 28).__str__(),
                        "actions": [
                            {
                                "id": "a6",
                                "title": "effefef cefefefts",
                                "description": "Develop initial sketches for digital pieces",
                                "parent": "g2",
                                "completed": False,
                            }
                        ],
                    },
                    {
                        "id": "g17",
                        "title": "bbbbb",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "week",
                        "deadline": date(2025, 1, 13).__str__(),
                        "actions": [
                            
                        ],
                    },
                    {
                        "id": "g18",
                        "title": "aaaaaa",
                        "description": "Produce 5 high-quality digital pieces for portfolio",
                        "completed": False,
                        "parent": "m1",
                        "type": "week",
                        "deadline": date(2025, 2, 28).__str__(),
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
        "deadline": date(2025,3,27),
    },
    {
        "id": "t2",
        "title": "concepts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,3,28),
    },
    {
        "id": "t3",
        "title": "Sketch concepts",
        "description": "Develop initial sketches for digital pieces",
        "completed": False,
        "deadline": date(2025,3,30),
    },
]

SAMPLE_WORKSPACES = [{
    "title" : "sample workspace 1",
    "collections" : [{
        "title" : "collection 1",
        "pages" : [{
            "title" : "Col1 Page1",
            "content" : """
            # page content
            ## info 
            ### text
            here
            """,
            "lastEdit" : datetime(2025,3,12)
        },
        {
            "title" : "Col1 Page2",
            "content" : "content of page",
            "lastEdit" : datetime(2025,3,13)
        }
            ],
        "lastEdit" : datetime(2025,3,13)
    },
    {
        "title" : "collection 2",
        "pages" : [{
            "title" : "Col2 Page1",
            "content" : "the content" ,
            "lastEdit" : datetime(2025,3,18)
        }
        ],
        "lastEdit" : datetime(2025,3,18)
    }],
    "lastEdit" : datetime(2025,3,18)
},
{
    "title" : "sample workspace 2",
    "collections" : [{
        "title" : "collection 1",
        "pages" : [{
            "title" : "Col1 Page1",
            "content" : """
            # page content
            ## info 
            ### text
            here
            """,
            "lastEdit" : datetime(2025,3,12)
        },
        {
            "title" : "Col1 Page2",
            "content" : "content of page",
            "lastEdit" : datetime(2025,3,13)
        }
            ],
        "lastEdit" : datetime(2025,3,12)
    },
    {
        "title" : "collection 2",
        "pages" : [{
            "title" : "Col2 Page1",
            "content" : "the content" ,
            "lastEdit" : datetime(2025,3,18)
        }
        ],
        "lastEdit" : datetime(2025,3,18)
    }],
    "lastEdit" : datetime(2025,3,18)
}]

@app.get("/knowledge")
def get_knowledge():
    return SAMPLE_WORKSPACES

@app.get("/recent_pages")
def get_recent_pages():
    all_pages = []
    for ws in SAMPLE_WORKSPACES:
        for collection in ws["collections"]:
            for page in collection["pages"]:
                all_pages.append(page)
    
    all_pages.sort(key=lambda page: page["lastEdit"], reverse=True)

    # deepcopy to change datetime into string
    length = min(len(all_pages), 5)
    most_recent_pages = copy.deepcopy(all_pages[:length])
    for page in most_recent_pages:
        page["lastEdit"] = page["lastEdit"].strftime("%a - %d / %m / %y - %H : %M : %S")

    return (most_recent_pages)

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
    month_calendar = calendar.monthcalendar(today.year, today.month)
    month = []
    for week in month_calendar:
        for day in week:
            if day == 0:
                month.append(None)
            else:
                month.append(date(today.year, today.month, day))
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