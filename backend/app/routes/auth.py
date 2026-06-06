from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.database import get_db
from app.models.models import User
from app.schemas.schemas import UserLogin, TokenResponse
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.core.config import settings
from jose import jwt, JWTError
from fastapi import Request
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.email})

    # Set Refresh Token in Secure HttpOnly Cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False, # Set to True in production with HTTPS
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh")
async def refresh_token(request: Request, db: AsyncSession = Depends(get_db)):
    # 1. Read the refresh token from the secure httpOnly cookie
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing in cookies")

    # 2. Verify the refresh token signature and type
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # 3. Check if user still exists in the database
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # 4. Generate a NEW Access Token
    new_access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    return {"access_token": new_access_token, "token_type": "bearer"}
@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "role": current_user.role}