from contextlib import asynccontextmanager
from beanie import init_beanie
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from models.profile import Profile
from router.register import router as register_router
from router.flight import router as flight_router, FlightData

@asynccontextmanager
async def lifespan(app : FastAPI):
    # before server starts
    print("Hello")
    await init(app)
    yield

    # before server ends
    print("World")
    pass

async def init(app):
    
    # connect to mongo
    client = AsyncIOMotorClient("mongodb+srv://Michael:fAfuImgO0Wlz66A3@cluster0.flnp4ku.mongodb.net/?retryWrites=true&w=majority")
    db = client.db
    await init_beanie(database=db, document_models = [Profile, FlightData], allow_index_dropping=True)
    try:
        info = await client.server_info()
        print(f"success, connected to {info}")
    except Exception as e:
        print(f"Failed with exception {e}")
    pass



app = FastAPI(lifespan=lifespan)

@app.get("/")
async def hello():
    return "Hello world"

app.include_router(router=register_router, prefix="/user")
app.include_router(router=flight_router, prefix="/flight")