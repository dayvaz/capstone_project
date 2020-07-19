import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateReviewRequest } from '../../requests/UpdateReviewRequest'
import { updateReview } from '../../businessLogic/reviews';
import { createLogger } from '../../utils/logger';
import { getUserId } from "../utils";
import * as middy from "middy";
import { cors } from "middy/middlewares";

const logger = createLogger('updateReview');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logger.info('Processing event:', event);

    const reviewId = event.pathParameters.reviewId
    const updatedReview: UpdateReviewRequest = JSON.parse(event.body)

    const userId = getUserId(event)
    await updateReview(reviewId, userId, updatedReview)

    return {
      statusCode: 200,
      body: ""
    }
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