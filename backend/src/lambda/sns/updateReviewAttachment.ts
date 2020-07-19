import 'source-map-support/register'

import { SNSEvent, SNSHandler, S3Event } from 'aws-lambda';
import "source-map-support/register";

import { getReviewItem, updateReviewUrl } from '../../businessLogic/reviews';
import { createLogger } from '../../utils/logger';
import { S3Access } from '../../dataLayer/s3Access'

const logger = createLogger('updateReviewAttachment');

export const handler: SNSHandler = async (event: SNSEvent) => {
    logger.info('Processing SNS event ', JSON.stringify(event))
    for (const snsRecord of event.Records) {
      const s3EventStr = snsRecord.Sns.Message
      console.log('Processing S3 event', s3EventStr)
      const s3Event: S3Event = JSON.parse(s3EventStr)
  
      for (const record of s3Event.Records) {
        try {
            const reviewId = record.s3.object.key;
            const reviewItem = await getReviewItem(reviewId);

            if (!reviewItem) {
                logger.error("Review item does not exist ", reviewId);
                continue;
            }

            await updateReviewUrl(reviewId, reviewItem.userId, S3Access.getAttachmentUrl(reviewId));
        } catch (error) {
            logger.error("Processing event record", error);
        }
      }
    }
  }
  
