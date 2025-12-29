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

@router.get("/today")
def get_today():
    return calendar_service.get_today()

@router.get("/weekday") # for tile
def get_weekday(day:str):
    return calendar_service.get_weekday(day)

@router.get("/week") # for week
def get_week(session: SessionDep):   
    return calendar_service.get_week(session)

@router.get("/month") # for month comp
def get_month(session: SessionDep):  
    return calendar_service.get_month(session)

@router.get("/quarter") # for quarter
def get_quarter():  
    return calendar_service.get_quarter()

@router.get("/year") # for year
def get_year():  
    return calendar_service.get_year()
