import boto3
import os, uuid, mimetypes
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import APIRouter, Form, HTTPException, status, UploadFile

S3_BUCKET= os.getenv("S3_BUCKET")
S3_REGION= os.getenv("S3_REGION")
s3 = boto3.client("s3", region_name=S3_REGION)

router = APIRouter(prefix="/landing-page",tags=["landing_page"])


@router.get("/load-images/")
def landing_page_get_img():
    try:
        response = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix="landing_page/")
        if "Contents" not in response:
            return {"images": []}
        urls = []
        for obj in response["Contents"]:
            key = obj["Key"]
            if key.endswith((".png", ".jpg", ".jpeg")):
                url = s3.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={"Bucket": S3_BUCKET, "Key": key},
                    ExpiresIn=3600
                )
                urls.append(url)
        return {"images": urls}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
