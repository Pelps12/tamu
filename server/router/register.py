from typing import Optional
from fastapi.routing import APIRouter
from pydantic import BaseModel
from models.profile import Profile
router = APIRouter()

class RegisterInput(BaseModel):
    name : str
    #seat : str

@router.post("/register")
async def register(input : RegisterInput)->Profile:
    profile = Profile(name= input.name, seat="Empty")
    await profile.save()
    return profile

@router.get("/")
async def get_user(token:str)->Optional[Profile]:
    profile = await Profile.find_one(Profile.token == token)
    return profile
