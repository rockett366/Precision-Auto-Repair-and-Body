import boto3
import os, uuid, mimetypes
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import APIRouter, Form, HTTPException, status, UploadFile


#Get images from online-estimates page and upload them to the S# bucket once they are ready
S3_BUCKET= os.getenv("S3_BUCKET_ONLINE_ESTIMATES")
S3_REGION= os.getenv("S3_REGION")

#only image types we will take into the s3 bucket
ALLOWED_FILES = {"image/jpeg", "image/png"}

s3 = boto3.client("s3", region_name=S3_REGION)

router = APIRouter(prefix="/s3", tags=["s3"])

#The image is not passing through but the image information so it can create a url to later save into the s3 bucket
#And this api call will get an unsigned image and upload it into the database after making a upload ready url
@router.put("/online-estimates-put")
async def online_estimates_put(file: UploadFile ):
    #if the file is not in allowed files exit : validation
    if file.content_type not in ALLOWED_FILES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported image type")
    if not S3_BUCKET:
        raise HTTPException(status_code=500, detail="S3 bucket env var is missing")
    #key to help prove its signed --s3 needs this
    try:
        key = f"online-estimates/{uuid.uuid4().hex}{mimetypes.guess_extension(file.content_type) or ''}"
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 key not working failed: {e}")

    try:
        # Upload the file object directly to S3
        s3.upload_fileobj(
            Fileobj=file.file,
            Bucket=S3_BUCKET,
            Key=key,
            #needed for s3
            ExtraArgs={
                "ContentType": file.content_type,
                "ACL": "private",
                "ServerSideEncryption": "AES256",
            },
        )
    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 upload failed: {e}")

    # Return metadata
    public_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{key}"
    return {"key": key, "public_url": public_url, "uploaded": True}