import datetime
import profile
from typing import List, Optional
from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel, Field
from models.profile import Profile
from utils.random import generate_string

class CheckedItem(BaseModel):
    item : str
    image_link : Optional[str]
    checked_off:bool = False
    item_id : str = Field(default_factory=generate_string)
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

class FlightData(Document):
    items : List[CheckedItem] = []
    profile : Link[Profile]
    flight_number : int
    seat_number : int

class FlightDataOut(BaseModel):
    items : List[CheckedItem] = []
    profile : Profile
    flight_number : int
    seat_number : int
    id : PydanticObjectId