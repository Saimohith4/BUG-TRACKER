from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Ticket
from app.schemas import TicketCreate
from app.schemas import TicketStatusUpdate
from fastapi import HTTPException


router = APIRouter(prefix="/tickets")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        project_id=ticket.project_id,
        assignee_id=ticket.assignee_id
    )
    db.add(new_ticket)
    db.commit()
    return {"message": "Ticket created"}

@router.get("/")
def list_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()
@router.put("/{ticket_id}/status")
def update_ticket_status(ticket_id: int, data: TicketStatusUpdate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = data.status
    db.commit()

    return {"message": "Status updated"}

