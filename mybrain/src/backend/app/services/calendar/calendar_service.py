import calendar
from datetime import date, timedelta
from sqlmodel import select
from backend.app.database import SessionDep
from backend.app.models import Roadmap, Milestone, Goal, Action, Todo
from backend.app.api.calendar.todo import get_todos

def get_possible_parents(type:str, session: SessionDep):
    parents: list[str] = []
    if type == "todo" or type == "milestone":
        parents = session.exec(select(Roadmap)).all()
    elif type == "goal":
        parents = session.exec(select(Milestone)).all()
    elif type == "action":
        parents = session.exec(select(Goal)).all()
    return parents

    
def get_parent(item_type: str, item_id: int, session: SessionDep):
    if item_type == "todo": return session.get(Todo, item_id).parent
    elif item_type == "action": return session.get(Action, item_id).parent
    elif item_type == "goal": return session.get(Goal, item_id).parent
    elif item_type == "milestone": return session.get(Milestone, item_id).parent

def get_today():
    return date.today().__str__()

def get_weekday(day:str):
    if day == "":
        day = date.today().__str__()
    weekday = date.fromisoformat(day).strftime("%a")
    return weekday

def get_week(session: SessionDep):   
    today = date.today()
    monday = today.__sub__(timedelta(days = today.weekday()))  
    week = [[monday.__add__(timedelta(days=i)), get_todos(monday.__add__(timedelta(days=i)).__str__(), session=session)] for i in range(7)]
    return week

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

def get_year():  
    today = date.today()
    january = date(today.year, 1, 1) 
    year = [[january.replace(month = 1 + i).strftime("%h"), january.replace(month = 1 + i).__str__()[5:7]] for i in range(12)]
    return year
