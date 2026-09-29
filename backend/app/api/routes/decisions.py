from fastapi import APIRouter, HTTPException
from app.schemas.decision import DecisionRequest, DecisionResponse
from app.services.decision_service import DecisionService
from app.core.errors import GuardSheetException

router = APIRouter(prefix="/flags", tags=["decisions"])

@router.post("/{flag_id}/decision", response_model=DecisionResponse)
async def post_flag_decision(flag_id: str, request: DecisionRequest):
    try:
        result = DecisionService.record_decision(
            flag_id=flag_id,
            decision=request.decision,
            comment=request.comment
        )
        return DecisionResponse(**result)
    except GuardSheetException as gse:
        raise HTTPException(status_code=gse.status_code, detail=gse.message)
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Failed to record decision: {str(err)}")
