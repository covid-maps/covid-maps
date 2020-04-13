from sqlalchemy import Column, ForeignKey
from sqlalchemy.types import Integer, Text, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Store(Base):
    __tablename__ = "StoreInfos"

    id = Column(Integer(), primary_key=True)
    name = Column(String(80), nullable=False)
    category = Column(String(80), nullable=False)
    latitude = Column(Float())
    longitude = Column(Float())
    placeId = Column(String(80))
    address = Column(String(120))
    city = Column(String(50))
    country = Column(String(50))
    locality = Column(String(80))
    createdAt = Column(DateTime(timezone=True))
    updatedAt = Column(DateTime(timezone=True))

    def __repr__(self):
        return '<Store %r>' % self.Name

class Update(Base):
    __tablename__ = "StoreUpdates"

    id = Column(Integer(), primary_key=True)
    storeId = Column(Integer(), ForeignKey(u'StoreInfos.id'))
    ip = Column(String(15))
    userId = Column(String(50))
    availabilityInfo = Column(Text())
    safetyInfo = Column(Text())
    openingTime = Column(DateTime)
    closingTime = Column(DateTime)
    createdAt = Column(DateTime(timezone=True))
    updatedAt = Column(DateTime(timezone=True))
    flag = Column(String(80), default=None)
    deleted = Column(Boolean(), default=False)
    reviewed = Column(Boolean(), default=False)

    Store = relationship('Store', foreign_keys=[storeId], lazy='joined')
