
from fastapi import FastAPI, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
from starlette.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth # type: ignore
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import os
import time
import logging
from pydantic import BaseModel
from api.endpoints import (
    companies_router, branches_router, usertypes_router, modules_router, designations_router,
    users_router, demo_router, demovideos_router, subjects_router, lessons_router,
    standards_router, courses_router, admission_router, inquiry_router, payments_router, content_router,
    batches_router, fees_router, tests_router, questions_router,
    question_papers_router, parents_router, teachers_Data_router, installments_router, mail_router,
    announcement_router, teacher_course_router, course_active
)
from api.models.user import LmsUsers
from db.session import get_db
from db.base import Base
from db.session import engine

# Suppress specific Pydantic v2 warnings
import warnings
warnings.filterwarnings("ignore", message="Valid config keys have changed in V2:")

# Load environment variables from .env file
load_dotenv()

# Pydantic Model
class MyModel(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True  # Enable ORM mode for Pydantic models

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:password@db:3306/LMS_21_June"

while True:
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        session = SessionLocal()

        # Try a simple query to check the connection using text()
        session.execute(text('SELECT 1'))

        print("Database connection successful")
        break
    except Exception as e:
        print(f"Database connection failed. Retrying in 5 seconds... Error: {e}")
        time.sleep(5)

# Once connected, create all tables
# from models import Base  # Ensure models is the correct import path
# Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files configuration
app.mount("/static", StaticFiles(directory="static"), name="static")

# Exception handler for HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)

# Include your API routers
app.include_router(companies_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(branches_router, prefix="/api")
# Add more routers as needed

# Initialize OAuth configuration
SECRET_KEY = os.getenv("SECRET_KEY")
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# OAuth configuration for Google login
oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={'scope': 'openid profile email'}
)

# Google login endpoint
@app.get("/login11")
async def google_login(request: Request):
    redirect_uri = request.url_for('auth')
    logging.info(f"Redirect URI for Google login: {redirect_uri}")
    return await oauth.google.authorize_redirect(request, redirect_uri)

# Google callback endpoint
@app.get("/auth")
async def auth(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        logging.info(f"Token retrieved: {token}")
        
        if 'id_token' not in token:
            logging.error("ID token not found in the token response")
            raise HTTPException(status_code=400, detail="ID token not found in the token response")
        
        user_info = await oauth.google.parse_id_token(request, token)
        logging.info(f"User information: {user_info}")

        db_user = db.query(LmsUsers).filter(LmsUsers.user_email == user_info['email']).first()
        if not db_user:
            db_user = LmsUsers(
                email=user_info['email'],
                name=user_info['name'],
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            logging.info(f"New user created: {db_user}")

        return RedirectResponse(url="/")
    except Exception as e:
        logging.error(f"Authentication failed: {e}")
        raise HTTPException(status_code=400, detail="Google authentication failed")

# Run the FastAPI application using uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
