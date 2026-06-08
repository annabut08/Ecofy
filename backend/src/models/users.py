from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base


class Users(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    last_name = Column(String(100))
    first_name = Column(String(100), nullable=False)
    patronymic = Column(String(100))
    password_hash = Column(String(255), nullable=False)
    phone_number = Column(String(20))
    email = Column(String(150), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.city_id"), nullable=True)
    status = Column(Boolean, default=True)

    notifications = relationship("Notifications", back_populates="user")

    city = relationship("Cities", back_populates="users")
