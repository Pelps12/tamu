from typing import List, Optional
from beanie import PydanticObjectId
from fastapi import APIRouter
from pydantic import BaseModel, Field
from models.profile import Profile
from models.flight import FlightData, FlightDataOut, CheckedItem

router = APIRouter()

class FlightInput(BaseModel):
    flight_number : int
    seat_number : int
    pass

class CheckedItemUpdateInput(BaseModel):
    item_id : str
    value : bool

class CheckedItemInput(BaseModel):
    item : str
    image_link : Optional[str] = Field(default=None)

    def to_checked_item(self)->CheckedItem:
        return CheckedItem(item=self.item, image_link=self.image_link)
        
    

@router.post("/add_flight")
async def add_flight(token : str, input : FlightInput) ->Optional[FlightDataOut]:
    profile = await Profile.find_one(Profile.token == token)
    if not profile:
        return None
    data= FlightData(profile=profile, flight_number=input.flight_number, seat_number=input.seat_number)
    await data.save()
    return FlightDataOut(**data.model_dump(), )

@router.post("/add_item")
async def add_item(token : str, flight_data_id : str, input : CheckedItemInput) -> FlightDataOut:
    data = await FlightData.find_one(FlightData.profile.token == token, FlightData.id == PydanticObjectId(flight_data_id), fetch_links=True)
    data.items.append(input.to_checked_item())
    await data.save()
    return data



@router.post("/update_item")
async def add_item(token : str, flight_data_id : str, input : CheckedItemUpdateInput) -> FlightDataOut:
    data = await FlightData.find_one(FlightData.profile.token == token, FlightData.id == PydanticObjectId(flight_data_id), fetch_links=True)
    chosenitem: CheckedItem = None
    for item in data.items:
        if item.item_id == input.item_id:
            chosenitem = item
            break
    chosenitem.checked_off = input.value

    await data.save()
    return data

@router.get("/flight_data")
async def get_flight_data(token : str, flight_data_id : str) ->FlightData:
    data = await FlightData.find_one(FlightData.profile.token == token, FlightData.id == PydanticObjectId(flight_data_id), fetch_links=True)
    return data 

@router.get("/flights")
async def flight_list() -> List[FlightData]:
    return await FlightData.find_all().to_list()
    