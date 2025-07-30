# order-service/main.py
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import time

# --- Cấu hình Database ---
# Chờ một chút để database khởi động
time.sleep(5)

DATABASE_URL = "postgresql://order_user:order_password@order-service-db/order_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Model cho Database (SQLAlchemy) ---
class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    total_amount = Column(Float)
    status = Column(String, default="pending")

# Tạo table trong database
Base.metadata.create_all(bind=engine)

# --- Model cho API (Pydantic) ---
class OrderCreate(BaseModel):
    user_id: str
    total_amount: float

class Order(OrderCreate):
    id: int
    status: str

    class Config:
        orm_mode = True

# --- Khởi tạo FastAPI app ---
app = FastAPI()

# Dependency để lấy session database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---
@app.post("/orders", response_model=Order)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    db_order = OrderDB(user_id=order.user_id, total_amount=order.total_amount)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders/user/{user_id}", response_model=list[Order])
def read_orders_for_user(user_id: str, db: Session = Depends(get_db)):
    orders = db.query(OrderDB).filter(OrderDB.user_id == user_id).all()
    return orders