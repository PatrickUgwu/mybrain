import calendar
from datetime import date, timedelta
from sqlmodel import extract, select
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

def get_calendar_week_data(today: date, session: SessionDep):
    week_days = ["Mon","Thu","Wed","Thu","Fri","Sat","Sun"]
    start_of_week = today.day - today.weekday()
    end_of_week = today.day + (6 - today.weekday())
    todos = session.exec(select(Todo).where(
        Todo.deadline >= today.replace(day = start_of_week),
        Todo.deadline <= today.replace(day = end_of_week)
    )).all()
    week_goals = session.exec(select(Goal).where(
        Goal.deadline >= today.replace(day = start_of_week),
        Goal.deadline <= today.replace(day = end_of_week),
        Goal.type == "week"
    )).all()

    week_todos = []
    for i in range(7):
        week_todos.append([])
        for todo in todos:
            
            if todo.deadline == today.replace(day = start_of_week + i):
                week_todos[i].append(todo)
    
    calendar_week = {
        "week_days": week_days, 
        "todos": week_todos, 
        "week_goals": week_goals
    }
    return calendar_week

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

def get_calendar_month_data(year: int, month: int, session: SessionDep):
    current_month = calendar.monthcalendar(year, month)
    month_todos = session.exec(select(Todo).where(
        Todo.deadline >= date(year, month, 1),
        Todo.deadline < date(year, month + 1, 1)
        )).all()
    weekly_goals = session.exec(select(Goal).where(
        Goal.deadline >= date(year, month, 1),
        Goal.deadline < date(year, month + 1, 1),
        Goal.type == "week"
    )).all()

    calendar_month = []
    for week in current_month:
        week_days = ["-" if day == 0 else day for day in week]
        todos = [todo for todo in month_todos if todo.deadline.day in week]
        week_goals = [goal for goal in weekly_goals if goal.deadline.day in week]
        calendar_month.append({
            "week_days": week_days, 
            "todos": todos, 
            "week_goals": week_goals
        })
    return calendar_month


def get_quarter():  # UNUSED
    today = date.today()
    month = today.month
    if month%3 != 0:
        first_quarter_month = today.month - (month%3 - 1)
    else:
        first_quarter_month = today.month -2
    quarter_start = date(today.year, first_quarter_month, 1) 
    quarter = [[quarter_start.replace(month=quarter_start.month + i).strftime("%h"), quarter_start.replace(month=quarter_start.month + i).__str__()[5:7]] for i in range(3)]
    return quarter

def get_calendar_quarter_data(year: int, quarter: int, session: SessionDep):  
    calendar_quarter = []
    first_quarter_month = quarter * 3 - 2
    for i in range(3):
        month = date(year, first_quarter_month + i, 1)
        month_str = month.strftime("%h")
        monthly_goals = session.exec(
            select(Goal).where(
                Goal.deadline >= month, 
                Goal.deadline < month.replace(month = month.month + 1),
                Goal.type == "month"
            )
        ).all()

        all_week_goals = session.exec(
            select(Goal).where(
                Goal.deadline >= month, 
                Goal.deadline < month.replace(month = month.month + 1),
                Goal.type == "week"
            )
        ).all()
        month_weekly_goals = []
        monthcalendar = calendar.monthcalendar(year, month.month)
        for week in monthcalendar:
            week_goals = [goal for goal in all_week_goals if goal.deadline.day in week]
            month_weekly_goals.append(week_goals)

        calendar_quarter.append({
            "month_str": month_str, 
            "month_goals": monthly_goals, 
            "week_goals": month_weekly_goals
        })
    return calendar_quarter

def get_year():  # UNUSED
    today = date.today()
    january = date(today.year, 1, 1) 
    year = [[january.replace(month = 1 + i).strftime("%h"), january.replace(month = 1 + i).__str__()[5:7]] for i in range(12)]
    return year

def get_calendar_year_data(year: int, session: SessionDep):  
    calendar_year = []  # year consisting of 4 quarters with 3 months each
    for i in range(4):
        quarter = []
        for j in range(3):
            current_month_num = (i*3) + j + 1  # calculate current month based on jth-month in ith-quarter 
            month = date(year, current_month_num, 1)
            month_str = month.strftime("%h")
            month_goals = session.exec(
                select(Goal).where(
                    extract("month", Goal.deadline) == month.month ,
                    extract("year", Goal.deadline) == month.year ,
                    Goal.type == "month"
                    )
                ).all()
            month_quarter_goals = session.exec(
                select(Goal).where(
                    extract("month", Goal.deadline) == month.month ,
                    extract("year", Goal.deadline) == month.year ,
                    Goal.type == "quarter"
                    )
                ).all()
            quarter.append({
                "month_str": month_str, 
                "month_goals": month_goals, 
                "month_quarter_goals": month_quarter_goals
            })
        calendar_year.append(quarter) 
    return calendar_year 

