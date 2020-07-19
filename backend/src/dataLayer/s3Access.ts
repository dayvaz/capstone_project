import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from "../utils/logger"

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('s3Access');


export class S3Access {

    constructor(
      private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
      private readonly bucketName = process.env.REVIEWS_S3_BUCKET,
      private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }


    getUploadUrl(reviewId: string) {

        logger.info(`Creating upload url for reviewId: ${reviewId}`)
        if (!reviewId) {
            return "";
        }

        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: reviewId,
            Expires: this.urlExpiration
        })
    }

    static getAttachmentUrl(reviewId: string): string {
        return `https://${process.env.REVIEWS_S3_BUCKET}.s3.amazonaws.com/${reviewId}`;
    }
}
