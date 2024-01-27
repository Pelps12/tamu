from fastapi.routing import APIRouter
from pydantic import BaseModel
from models.profile import Profile
router = APIRouter()

class RegisterInput(BaseModel):
    name : str
    seat : str

@router.post("/register")
async def register(input : RegisterInput)->Profile:
    profile = Profile(name= input.name, seat=input.seat)
    await profile.save()
    return profile
