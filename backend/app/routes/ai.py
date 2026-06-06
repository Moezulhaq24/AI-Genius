from fastapi import APIRouter, Depends
from app.dependencies import require_role
from app.models.models import User

router = APIRouter(prefix="/api/ai", tags=["AI Models"])

@router.get("/free-model")
async def free_model(current_user: User = Depends(require_role(["Free_User", "Premium_User", "Admin"]))):
    return {"message": "Accessing Free AI Model", "user": current_user.email}

@router.post("/premium-model")
async def premium_model(current_user: User = Depends(require_role(["Premium_User", "Admin"]))):
    return {"message": "Accessing Premium AI Model (High Compute)", "user": current_user.email}

@router.delete("/purge-cache")
async def purge_cache(current_user: User = Depends(require_role(["Admin"]))):
    return {"message": "System Cache Purged Successfully", "user": current_user.email}