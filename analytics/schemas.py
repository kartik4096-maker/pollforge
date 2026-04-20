from pydantic import BaseModel
from typing import List

class PollOption(BaseModel):
    text: str
    votes: int

class PollAnalyticsRequest(BaseModel):
    poll_id: str
    title: str
    options: List[PollOption]