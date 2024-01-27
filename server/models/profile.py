from beanie import Document
from pydantic import Field
from utils.random import generate_string

class Profile(Document):
    name : str
    token : str = Field(default_factory=generate_string)
    # seat : str

