
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
class ProjectCreate(BaseModel):
    name: str
    owner_id: int
class TicketCreate(BaseModel):
    title: str
    description: str
    project_id: int
    assignee_id: int
class TicketStatusUpdate(BaseModel):
    status: str
class CommentCreate(BaseModel):
    text: str
    ticket_id: int
    user_id: int


