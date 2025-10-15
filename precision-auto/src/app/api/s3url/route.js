import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  console.log("AWS REGION:", process.env.AWS_REGION);
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${filename}.jpg`,
    ContentType: "image/jpeg",
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return Response.json({ url });
}