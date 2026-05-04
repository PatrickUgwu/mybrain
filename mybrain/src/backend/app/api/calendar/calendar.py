from datetime import date
from fastapi import APIRouter
from backend.app.services.calendar import calendar_service
from backend.app.database import SessionDep


router = APIRouter()

@router.get("/possible_parents")
def get_possible_parents(type:str, session: SessionDep):
    return calendar_service.get_possible_parents(type, session)

@router.get("/calendar_parent")
def get_parent(item_type: str, item_id: int, session: SessionDep):
    return calendar_service.get_parent(item_type, item_id, session)

@router.get("/today_idx")
def get_today_idx():
    return calendar_service.get_today_idx()

@router.get("/weekday") 
def get_weekday(day:str):
    return calendar_service.get_weekday(day)

@router.get("/calendar_day_data")
def get_calendar_day_data(session: SessionDep, day: date = date.today()):
    return calendar_service.get_calendar_day_data(day, session)

@router.get("/week") 
def get_week(session: SessionDep):   
    return calendar_service.get_week(session)

@router.get("/calendar_week_data")
def get_calendar_week_data(session: SessionDep, today: date = date.today()):
    return calendar_service.get_calendar_week_data(today, session)

@router.get("/month")
def get_month(session: SessionDep):  
    return calendar_service.get_month(session)

@router.get("/calendar_month_data")
def get_calendar_month_data(session: SessionDep, year: int = date.today().year, month: int = date.today().month):
    return calendar_service.get_calendar_month_data(year, month, session)

@router.get("/quarter") 
def get_quarter():  
    return calendar_service.get_quarter()

@router.get("/calendar_quarter_data")
def get_calendar_quarter_data(session: SessionDep, year: int = date.today().year , quarter: int = 1):  
    return calendar_service.get_calendar_quarter_data(year, quarter, session)

@router.get("/year") 
def get_year():  
    return calendar_service.get_year()

@router.get("/calendar_year_data")
def get_calendar_year_data(session: SessionDep, year: int = date.today().year):  
    return calendar_service.get_calendar_year_data(year, session)