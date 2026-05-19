import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client.js";

const uploadFileToS3 = async (buffer: Buffer, filename: string) => {

    const key = `${filename}`;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: "image/*",
    }

    const command = new PutObjectCommand(params)
    await s3Client.send(command)
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
};

export default uploadFileToS3;