import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteReview } from '../../businessLogic/reviews';
import { createLogger } from '../../utils/logger';
import { getUserId } from "../utils";
import * as middy from "middy";
import { cors } from "middy/middlewares";

const logger = createLogger('deleteReview');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info("Processing event: ", event)
  try {
    const reviewId = event.pathParameters.reviewId

    const userId = getUserId(event)

    await deleteReview(reviewId,userId)

    return {
      statusCode: 200,
      body: ""
    }
  } catch (error) {
    logger.error("deleteReview call error ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }
  }
});

handler.use(
  cors({
    origin: "*",
    credentials: true
  })
);

