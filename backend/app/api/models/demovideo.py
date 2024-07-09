from sqlalchemy import Column, Integer, String, ForeignKey
from db.base import Base
from sqlalchemy.orm import relationship


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    url = Column(String(255), index=True)

    course_id = Column(Integer, ForeignKey("courses.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    standard_id = Column(Integer, ForeignKey("standards.id"))


    course = relationship("Course", back_populates="videos")
    subject = relationship("Subject", back_populates="videos")
    standard = relationship("Standard", back_populates="videos")

# class DemoVideo(Base):
#     __tablename__ = "demo_videos"
#
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String(255), index=True)
#     url = Column(String(255), index=True)
#     course = Column(String(255))
#     subject = Column(String(255))
#     standard = Column(String(255))
#