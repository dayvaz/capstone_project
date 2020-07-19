import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { reviewExists, getUploadUrl } from '../../businessLogic/reviews';
import { createLogger } from '../../utils/logger';
import * as middy from "middy";
import { cors } from "middy/middlewares";

const logger = createLogger('generateUploadUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info("Processing event", event);
    const reviewId = event.pathParameters.reviewId

    const isReviewExists = await reviewExists(reviewId);

    if (!isReviewExists) {
      const message = "Review does not exist!";
      logger.warning("generateUploadUrl", message);
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: message
        })
      };
    }


    const uploadUrl = getUploadUrl(reviewId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    };
  } catch (error) {
    logger.error("getAllReviewsByUserId call error ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    };
  }
});

handler.use(
  cors({
    origin: "*",
    credentials: true
  })
);