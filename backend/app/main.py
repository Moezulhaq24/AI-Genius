from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.routes import auth, ai
from app.models.models import User
from app.core.security import get_password_hash
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.database import AsyncSessionLocal

app = FastAPI(title="AI-Genius API")

# CORS is required for Frontend to talk to Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True, # Crucial for cookies!
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed initial admin user if DB is empty
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        if not result.scalars().first():
            admin = User(email="admin@test.com", hashed_password=get_password_hash("admin123"), role="Admin")
            premium = User(email="premium@test.com", hashed_password=get_password_hash("premium123"), role="Premium_User")
            free = User(email="free@test.com", hashed_password=get_password_hash("free123"), role="Free_User")
            session.add_all([admin, premium, free])
            await session.commit()

app.include_router(auth.router)
app.include_router(ai.router)