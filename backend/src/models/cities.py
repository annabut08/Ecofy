from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from src.database import Base


class Cities(Base):
    __tablename__ = "cities"

    city_id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False, unique=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    region = Column(String(100))

    users = relationship("Users", back_populates="city")
