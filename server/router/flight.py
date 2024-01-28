from datetime import datetime
from itertools import count
from typing import List, Optional
from unittest import skip
from beanie import PydanticObjectId
from fastapi import APIRouter
from pydantic import BaseModel, Field
from models.profile import Profile
from models.flight import FlightData, FlightDataOut, CheckedItem
from beanie.operators import Exists, Where, Nor, Size, Not

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
        
class OpenCVData(BaseModel):
    zone : int
    items : List[str]
    # timestamp : datetime = Field(default_factory=datetime.utcnow)

class OpenCVDataInput(BaseModel):
    data : List[OpenCVData]
# class OpenCVInput(BaseModel):
#     zone : int
#     items: List[str]
#     def to_data(self) -> OpenCVData:
#         return OpenCVData(zone=self.zone, items=self.items, )

@router.post("/add_flight")
async def add_flight(token : str, input : FlightInput) ->Optional[FlightDataOut]:
    profile = await Profile.find_one(Profile.token == token)
    if not profile:
        return None
    data = await FlightData.find_one(FlightData.flight_number == input.flight_number, FlightData.profile.token == token, fetch_links=True)
    if not data:
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
@router.get("/flight_data_by_number")
async def get_flight_data(token : str, flight_number : int) ->FlightData:
    data = await FlightData.find_one(FlightData.profile.token == token, FlightData.flight_number == PydanticObjectId(flight_number), fetch_links=True)
    return data 

@router.get("/flights")
async def flight_list() -> List[FlightData]:
    return await FlightData.find_all().to_list()

@router.post("/items")
async def process_items(input : OpenCVDataInput) -> List[FlightData]:
    flight_number = 1
    res = []
    print(input)
    for data in input.data:
        cache: dict[str, i] = {}
        if len(data.items) == 0:
            cache["other"] = 1
        for item in data.items:
            cache[item] = 1 if not cache.get(item) else cache[item] +1
        from_mongo = await FlightData.find_one(FlightData.flight_number == flight_number, FlightData.seat_number == data.zone , fetch_links=True)
        if not from_mongo:
            raise Exception("hello")
        mongo_cache = {}
        if from_mongo:
            for item in from_mongo.items:
                mongo_cache[item.item] = 1 if not mongo_cache.get(item.item) else mongo_cache[item.item] +1
        
        for i, item  in enumerate(cache):
            if item == "person":
                continue
            if cache.get(item) and mongo_cache.get(item):
                if cache.get(item)  > mongo_cache[item]:
                    # add extra data
                    count = mongo_cache[item] - cache[item]
                    for i in range(count):
                        from_mongo.items.append(CheckedItem(item=item))
            if cache.get(item) and not mongo_cache.get(item):
                for i in range(cache.get(item)):
                    from_mongo.items.append(CheckedItem(item=item))
        await from_mongo.save()
        res.append(from_mongo)
    return res

@router.get("/lost_items")
async def get_lost_items()->list[FlightData]:
    data = await FlightData.find(Not(Size(FlightData.items, 0)), FlightData.flight_number == 1, fetch_links=True).to_list()
    
    return data
